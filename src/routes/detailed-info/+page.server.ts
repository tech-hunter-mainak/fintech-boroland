import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	// This action will be called when the form is submitted
	submitDetails: async ({ request, cookies, locals }) => {
		// If the user has a temporary session, we need to convert it to a full session now
		if (locals.isTemporarySession && locals.user) {
			console.log('Converting temporary session to full session');
			
			// Update the user data to reflect that detailed info is submitted
			const updatedUserData = {
				...locals.user,
				hasDetailedInfo: true
			};
			
			// Set the full session cookie with the updated data
			cookies.set('session', JSON.stringify(updatedUserData), {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 // 1 day default
			});
			
			// Delete the temporary session cookie
			cookies.delete('temp_session', { path: '/' });
			
			return { success: true };
		}
		
		return { success: false, error: 'Invalid session' };
	}
}; 