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

		// Validate request data
		if (!data || !data.action) {
			return json({ success: false, error: 'Invalid request data' }, { status: 400 });
		}

		// Different logic based on action
		if (data.action === 'register') {
			// Handle user registration
			const userData = data.userData;

			// Validate required fields
			if (!userData || !userData.email || !userData.mobile || !userData.password || !userData.fullName || !userData.gender) {
				return json(
					{
						success: false,
						error: 'Missing required fields'
					},
					{ status: 400 }
				);
			}

			try {
				// First check if user already exists
				const existingUser = await getUserByEmailOrMobile(userData.email, userData.mobile);
				
				// If user exists, return error
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

				console.log('[Server] Auth user created:', authUser);

				// Create initial user profile with basic details
				const userDetails = await upsertUserDetails(authUser.id, {
					gender: userData.gender,
					full_name: userData.fullName,
					whatsapp_updates: userData.whatsappUpdates || false,
					is_otp_validated: true
				});

				// Set session cookie with proper configuration
				const sessionData = {
					userId: authUser.id,
					email: authUser.email,
					mobile: authUser.mobile,
					fullName: userData.fullName,
					gender: userData.gender
				};

				cookies.set('session', JSON.stringify(sessionData), {
					path: '/',
					httpOnly: true,
					sameSite: 'lax', // Changed from 'strict' to 'lax' for better compatibility
					secure: process.env.NODE_ENV === 'production',
					maxAge: 60 * 60 * 24 * 30 // 30 days
				});

				// Get full user data to return to client
				const fullUserData = {
					...authUser,
					...userDetails,
					hasSubmittedDetails: false
				};

				return json({ success: true, user: fullUserData });
			} catch (error: any) {
				console.error('[Server] Registration error:', error);
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

			if (!identifier || !password) {
				return json(
					{
						success: false,
						error: 'Missing credentials'
					},
					{ status: 400 }
				);
			}

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
			const sessionData = {
				userId: user.auth.id,
				email: user.auth.email,
				mobile: user.auth.mobile,
				fullName: user.details?.fullName || '',
				gender: user.details?.gender || ''
			};

			cookies.set('session', JSON.stringify(sessionData), {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: process.env.NODE_ENV === 'production',
				maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 // 30 days if remember me, else 1 day
			});

			// Get full user data to return to client
			const fullUserData = {
				...user.auth,
				...(user.details || {}),
				hasSubmittedDetails
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
		} else {
			return json({ success: false, error: 'Invalid action' }, { status: 400 });
		}
	} catch (error) {
		console.error('[Server] Error in auth API:', error);
		return json({ success: false, error: 'Authentication failed' }, { status: 500 });
	}
}
