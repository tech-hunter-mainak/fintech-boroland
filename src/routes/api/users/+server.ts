import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { upsertUser, getUserByEmailOrMobile, updateUserSelection } from '$lib/server/db';

export async function POST({ request }: RequestEvent) {
  try {
    const userData = await request.json();
    const result = await upsertUser(userData);
    return json(result);
  } catch (error) {
    console.error('Error in POST /api/users:', error);
    return json({ error: 'Failed to save user data' }, { status: 500 });
  }
}

export async function GET({ url }: RequestEvent) {
  try {
    const email = url.searchParams.get('email');
    const mobile = url.searchParams.get('mobile');

    if (!email && !mobile) {
      return json({ error: 'Email or mobile is required' }, { status: 400 });
    }

    const user = await getUserByEmailOrMobile(email || '', mobile || '');
    return json(user);
  } catch (error) {
    console.error('Error in GET /api/users:', error);
    return json({ error: 'Failed to get user data' }, { status: 500 });
  }
}

export async function PATCH({ request }: RequestEvent) {
  try {
    const { userId, isSelected } = await request.json();
    const result = await updateUserSelection(userId, isSelected);
    return json(result);
  } catch (error) {
    console.error('Error in PATCH /api/users:', error);
    return json({ error: 'Failed to update user selection' }, { status: 500 });
  }
} 