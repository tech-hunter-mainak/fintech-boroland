// import { goto } from '$app/navigation';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    // Check for a cookie named 'user' (adjust name as needed)
    const user = event.cookies.get('user');

    if (event.url.pathname === '/auth/login' && user) {
        // If user is logged in, redirect from login to dashboard
        throw redirect(307, '/dashboard');
    }
    if (event.url.pathname === '/dashboard' && !user) {
        // If user is not logged in, redirect from dashboard to login
        throw redirect(307, '/auth/login');
    }
    // add more redirection logic here
    return resolve(event);
};
