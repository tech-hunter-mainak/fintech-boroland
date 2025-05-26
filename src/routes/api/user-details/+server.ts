import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { upsertUserDetails, getUserById } from '$lib/server/db';

// Create or update user details
export async function POST({ request, locals }: RequestEvent) {
	try {
		const userData = await request.json();

		// Use the authenticated user's ID from session
		const authUserId = locals.userId;
		if (!authUserId) {
			return json({ error: 'Not authenticated' }, { status: 401 });
		}

		// Verify user exists in auth_users table
		const user = await getUserById(authUserId);
		if (!user) {
			return json({ error: 'User not found' }, { status: 404 });
		}

		// Save user details with the verified auth user ID
		const result = await upsertUserDetails(authUserId, userData);

		// Get updated user data
		const updatedUser = await getUserById(authUserId);

		return json(updatedUser);
	} catch (error) {
		console.error('Error in POST /api/user-details:', error);
		return json({ error: 'Failed to save user details' }, { status: 500 });
	}
}

// Update user selection status
export async function PATCH({ request, locals }: RequestEvent) {
	try {
		const { isSelected, predictionPercentage } = await request.json();

		// Use the authenticated user's ID from session
		const authUserId = locals.userId;
		if (!authUserId) {
			return json({ error: 'Not authenticated' }, { status: 401 });
		}

		// Verify user exists
		const user = await getUserById(authUserId);
		if (!user) {
			return json({ error: 'User not found' }, { status: 404 });
		}

		// Update user details with selection status
		const result = await upsertUserDetails(authUserId, {
			is_selected: isSelected,
			prediction_percentage: predictionPercentage
		});

		// Get updated user data
		const updatedUser = await getUserById(authUserId);

		return json(updatedUser);
	} catch (error) {
		console.error('Error in PATCH /api/user-details:', error);
		return json({ error: 'Failed to update user selection' }, { status: 500 });
	}
}
