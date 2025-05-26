import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { getUserById } from '$lib/server/db';

export async function GET({ locals }: RequestEvent) {
    try {
        const authUserId = locals.userId;
        if (!authUserId) {
            return json({ error: 'Not authenticated' }, { status: 401 });
        }

        const user = await getUserById(authUserId);
        if (!user) {
            return json({ error: 'User not found' }, { status: 404 });
        }

        return json(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
        return json({ error: 'Failed to fetch user data' }, { status: 500 });
    }
} 