import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import {
	getUserByEmailOrMobile,
	createAuthUser,
	verifyUserCredentials,
	upsertUserDetails,
	hasSubmittedDetailedInfo
} from '$lib/server/db';

// Auth API endpoint for login, register, and logout
export async function POST({ request, cookies }: RequestEvent) {
	try {
		const data = await request.json();

		// Different logic based on action
		if (data.action === 'register') {
			// Handle user registration
			const userData = data.userData;

			// Log the data being sent to the function for debugging
			console.log('Register request payload:', userData);

			try {
				// Create auth user with email, mobile, and password
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
					whatsappUpdates: userData.whatsappUpdates || false
				});

				console.log('User details created:', userDetails);

				// Set session cookie
				const sessionData = {
					id: authUser.id,
					email: authUser.email,
					mobile: authUser.mobile,
					fullName: userData.fullName,
					gender: userData.gender,
					whatsappUpdates: userData.whatsappUpdates || false,
					isVerified: true,
					createdAt: authUser.created_at
				};

				// Set session cookie (30 days expiry)
				cookies.set('session', JSON.stringify(sessionData), {
					path: '/',
					httpOnly: true,
					sameSite: 'strict',
					secure: process.env.NODE_ENV === 'production',
					maxAge: 60 * 60 * 24 * 30
				});

				return json({ success: true, user: sessionData });
			} catch (error: any) {
				console.error('Registration error:', error);
				console.error('Stack trace:', error.stack);
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

			console.log('Login attempt with identifier:', identifier);

			// Verify credentials
			const user = await verifyUserCredentials({
				identifier,
				password
			});

			if (!user) {
				console.log('Login failed: Invalid credentials');
				return json({ success: false, error: 'Invalid credentials' }, { status: 401 });
			}

			console.log('Login successful for user:', user.auth.id);

			// Check if the user has submitted detailed info
			const hasDetailedInfo = await hasSubmittedDetailedInfo(user.auth.id);
			console.log(`User has ${hasDetailedInfo ? 'completed' : 'not completed'} detailed info`);

			// Create session data from auth user and details
			const sessionData = {
				id: user.auth.id,
				email: user.auth.email,
				mobile: user.auth.mobile,
				fullName: user.details?.full_name || '',
				gender: user.details?.gender || '',
				whatsappUpdates: user.details?.whatsapp_updates || false,
				isVerified: true,
				createdAt: user.auth.created_at,
				hasDetailedInfo: hasDetailedInfo
			};

			// Set cookie expiry based on "remember me" option
			const maxAge = rememberMe
				? 60 * 60 * 24 * 30 // 30 days
				: 60 * 60 * 24; // 1 day

			// If user has not completed detailed info, set a temporary session cookie
			// that will be used only to authenticate the detailed-info page
			if (!hasDetailedInfo) {
				console.log('Setting temporary session cookie for detailed-info');
				cookies.set('temp_session', JSON.stringify(sessionData), {
					path: '/',
					httpOnly: true,
					sameSite: 'strict',
					secure: process.env.NODE_ENV === 'production',
					maxAge: 3600 // 1 hour expiry for temp session
				});
			} else {
				// Only set the full session cookie if detailed info is completed
				console.log('Setting full session cookie with expiry:', maxAge);
				cookies.set('session', JSON.stringify(sessionData), {
					path: '/',
					httpOnly: true,
					sameSite: 'strict',
					secure: process.env.NODE_ENV === 'production',
					maxAge
				});
			}

			return json({
				success: true,
				user: sessionData,
				hasDetailedInfo
			});
		} else if (data.action === 'logout') {
			// Clear all session cookies
			cookies.delete('session', { path: '/' });
			cookies.delete('temp_session', { path: '/' });
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
		}

		return json({ success: false, error: 'Invalid action' }, { status: 400 });
	} catch (error) {
		console.error('Error in auth API:', error);
		return json({ success: false, error: 'Authentication failed' }, { status: 500 });
	}
}
