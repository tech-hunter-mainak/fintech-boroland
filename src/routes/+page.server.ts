import { getUserByEmailOrMobile } from '$lib/server/db';
import type { PageServerLoad } from './$types';
import type { Actions } from '@sveltejs/kit';
import { upsertUser } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals, cookies }) => {
	// Check if user is logged in from locals
	const user = locals.user;
	
	return {
		user
	};
};

// Handle user registration or login from the home page
export const actions: Actions = {
	register: async ({ request, cookies }) => {
		const formData = await request.formData();
		
		const userData = {
			gender: formData.get('gender'),
			fullName: formData.get('fullName'),
			email: formData.get('email'),
			mobile: formData.get('mobile'),
			whatsappUpdates: formData.get('whatsappUpdates') === 'on'
		};
		
		try {
			// Save user to database
			const user = await upsertUser(userData);
			
			if (user) {
				// Create session data
				const sessionData = {
					id: user.id,
					fullName: user.full_name,
					email: user.email,
					mobile: user.mobile,
					gender: user.gender,
					whatsappUpdates: user.whatsapp_updates,
					isVerified: true,
					createdAt: user.created_at
				};
				
				// Set session cookie
				cookies.set('session', JSON.stringify(sessionData), {
					path: '/',
					httpOnly: true,
					sameSite: 'strict',
					secure: process.env.NODE_ENV === 'production',
					maxAge: 60 * 60 * 24 * 30 // 30 days
				});
				
				return { success: true, user: sessionData };
			}
			
			return { success: false, error: 'Failed to create user' };
		} catch (error) {
			console.error('Error in register action:', error);
			return { success: false, error: 'Registration failed' };
		}
	},
	
	login: async ({ request, cookies }) => {
		const formData = await request.formData();
		const identifier = formData.get('identifier')?.toString() || '';
		
		try {
			// Check if it's email or mobile
			const isEmail = identifier.includes('@');
			
			// Get user from database
			const user = await getUserByEmailOrMobile(
				isEmail ? identifier : '',
				!isEmail ? identifier : ''
			);
			
			if (!user) {
				return { success: false, error: 'User not found' };
			}
			
			// Create session data
			const sessionData = {
				id: user.id,
				fullName: user.full_name,
				email: user.email,
				mobile: user.mobile,
				gender: user.gender,
				whatsappUpdates: user.whatsapp_updates,
				isVerified: true,
				createdAt: user.created_at
			};
			
			// Set session cookie
			cookies.set('session', JSON.stringify(sessionData), {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 30 // 30 days
			});
			
			return { success: true, user: sessionData };
		} catch (error) {
			console.error('Error in login action:', error);
			return { success: false, error: 'Login failed' };
		}
	},
	
	logout: async ({ cookies }) => {
		cookies.delete('session', { path: '/' });
		return { success: true };
	}
};
