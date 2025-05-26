import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import {
	getUserByEmailOrMobile,
	createAuthUser,
	verifyUserCredentials,
	upsertUserDetails,
	hasSubmittedDetailedInfo,
	getUserById
} from '$lib/server/db';

// Auth API endpoint for login, register, and logout
export async function POST({ request, cookies }: RequestEvent) {
	try {
		const data = await request.json();

		// Different logic based on action
		if (data.action === 'register') {
			// Handle user registration
			const userData = data.userData;

			try {
				// First check if user already exists
				const existingUser = await getUserByEmailOrMobile(userData.email, userData.mobile);
				if (existingUser) {
					return json(
						{
							success: false,
							error: 'User with this email or mobile already exists'
						},
						{ status: 400 }
					);
				}

				// Create new auth user first
				const authUser = await createAuthUser({
					email: userData.email,
					mobile: userData.mobile,
					password: userData.password
				});

				console.log('Auth user created:', authUser);

				// Create initial user profile with basic details
				const userDetails = await upsertUserDetails(authUser.id, {
					gender: userData.gender,
					fullName: userData.fullName,
					whatsappUpdates: userData.whatsappUpdates || false,
					isOtpValidated: true
				});

				// Set session cookie
				cookies.set('session', JSON.stringify({ userId: authUser.id }), {
					path: '/',
					httpOnly: true,
					sameSite: 'strict',
					secure: process.env.NODE_ENV === 'production',
					maxAge: 60 * 60 * 24 * 30 // 30 days
				});

				// Get full user data to return to client
				const fullUserData = {
					...authUser,
					...userDetails
				};

				return json({ success: true, user: fullUserData });
			} catch (error: any) {
				console.error('Registration error:', error);
				return json(
					{
						success: false,
						error: error.message || 'Registration failed'
					},
					{ status: 400 }
				);
			}
		} else if (data.action === 'login') {
			// Handle login with password verification
			const { identifier, password } = data.credentials;
			const rememberMe = data.rememberMe || false;

			// Verify credentials
			const user = await verifyUserCredentials({
				identifier,
				password
			});

			if (!user) {
				return json({ success: false, error: 'Invalid credentials' }, { status: 401 });
			}

			// Check if user has submitted detailed info
			const hasSubmittedDetails = await hasSubmittedDetailedInfo(user.auth.id);

			// Set session cookie
			cookies.set('session', JSON.stringify({ userId: user.auth.id }), {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 // 30 days if remember me, else 1 day
			});

			// Get full user data to return to client
			const fullUserData = {
				...user.auth,
				...(user.details || {}),
				hasSubmittedDetails // Add this flag to the response
			};

			return json({
				success: true,
				user: fullUserData
			});
		} else if (data.action === 'logout') {
			// Clear session cookie
			cookies.delete('session', { path: '/' });
			return json({ success: true });
		} else if (data.action === 'validateOtp') {
			const { email, mobile, otp } = data;
			
			// In a real app, verify the OTP
			// For now, just check if user exists
			const existingUser = await getUserByEmailOrMobile(email, mobile);
			
			if (existingUser && !existingUser.isOtpValidated) {
				// Mark OTP as validated
				await upsertUserDetails(existingUser.id, {
					isOtpValidated: true
				});
				return json({ success: true });
			}
			
			return json({ success: true });
		} else if (data.action === 'resetPassword') {
			// Handle password reset request
			const { email } = data;

			// In a real app, generate a token and send an email
			// For now, just verify the email exists
			const user = await getUserByEmailOrMobile(email, '');

			if (!user) {
				// Don't reveal if email exists or not for security
				return json({
					success: true,
					message: 'If your email is registered, you will receive a reset link'
				});
			}

			// In a real app, send an email with a reset link

			return json({
				success: true,
				message: 'If your email is registered, you will receive a reset link'
			});
		} else if (data.action === 'convertToFullSession') {
			const { userId } = data;
			
			// Verify user has completed detailed info
			const hasDetailedInfo = await hasSubmittedDetailedInfo(userId);
			
			if (!hasDetailedInfo) {
				return json({ success: false, error: 'Detailed info not completed' }, { status: 400 });
			}

			// Set full session cookie
			cookies.set('session', JSON.stringify({ userId }), {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 30 // 30 days
			});

			// Remove temporary session if it exists
			cookies.delete('temp_session', { path: '/' });

			return json({ success: true });
		}

		return json({ success: false, error: 'Invalid action' }, { status: 400 });
	} catch (error) {
		console.error('Error in auth API:', error);
		return json({ success: false, error: 'Authentication failed' }, { status: 500 });
	}
}
