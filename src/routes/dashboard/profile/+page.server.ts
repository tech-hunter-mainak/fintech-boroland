import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getUserByEmailOrMobile } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
	// Check if user exists in session
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	try {
		// Get complete user data from database
		const userData = await getUserByEmailOrMobile(locals.user.email, '');

		if (!userData) {
			throw error(404, 'User not found');
		}

		// Return the user data to the page
		return {
			user: userData,
			email: locals.user.email,
			id: locals.user.id
		};
	} catch (err) {
		console.error('Error loading user data:', err);
		throw error(500, 'Error loading user data');
	}
};
