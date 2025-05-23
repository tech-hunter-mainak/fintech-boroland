import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { upsertUserDetails, updateUserSelection } from '$lib/server/db';

// Create or update user details
export async function POST({ request }: RequestEvent) {
	try {
		const userData = await request.json();
		
		// Make sure we have the auth user ID
		if (!userData.authUserId) {
			return json({ error: 'Auth user ID is required' }, { status: 400 });
		}
		
		// Save user details
		const result = await upsertUserDetails(userData.authUserId, userData);
		return json(result);
	} catch (error) {
		console.error('Error in POST /api/user-details:', error);
		return json({ error: 'Failed to save user details' }, { status: 500 });
	}
}

// Update user selection status
export async function PATCH({ request }: RequestEvent) {
	try {
		const { userId, isSelected, predictionPercentage } = await request.json();
		
		if (!userId) {
			return json({ error: 'User ID is required' }, { status: 400 });
		}
		
		const result = await updateUserSelection(userId, isSelected, predictionPercentage);
		return json(result);
	} catch (error) {
		console.error('Error in PATCH /api/user-details:', error);
		return json({ error: 'Failed to update user selection' }, { status: 500 });
	}
} 