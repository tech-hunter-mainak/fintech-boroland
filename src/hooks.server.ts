// import { goto } from '$app/navigation';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { getUserById } from '$lib/server/db';

// First hook: handle auth and set locals.userId
const handleAuth: Handle = async ({ event, resolve }) => {
	// Get the session cookie
	const sessionCookie = event.cookies.get('session');
	const path = event.url.pathname;

	console.log(`[hooks] Processing request for path: ${path}`);

	// Protected routes that require authentication
	const protectedRoutes = ['/dashboard', '/profile', '/dashboard/score', '/settings'];

	// Check if current route is protected
	const isProtectedRoute = protectedRoutes.some(
		(route) => event.url.pathname === route || event.url.pathname.startsWith(`${route}/`)
	);

	// Handle root path redirect for authenticated users
	if (path === '/' && sessionCookie) {
		try {
			const { userId } = JSON.parse(sessionCookie);
			if (userId) {
				console.log('[hooks] Authenticated user at root, redirecting to dashboard');
				return redirect(307, '/dashboard');
			}
		} catch (error) {
			console.error('[hooks] Error parsing session cookie at root:', error);
		}
	}

	if (sessionCookie) {
		try {
			// Parse the session cookie to get userId
			const { userId } = JSON.parse(sessionCookie);
			console.log(`[hooks] Found valid session cookie for user ID: ${userId}`);

			// Set the userId in locals
			event.locals.userId = userId;

			// For all routes except root, verify user exists in database
			if (path !== '/') {
				try {
					const userData = await getUserById(userId);
					if (!userData) {
						console.log('[hooks] User not found in database, clearing session');
						event.cookies.delete('session', { path: '/' });
						event.locals.userId = null;
						return redirect(307, '/auth');
					}
				} catch (error) {
					console.error('[hooks] Error fetching user data:', error);
					// Don't redirect on error, just log it and continue
				}
			}

			// If we get here and it's a protected route, allow access
			if (isProtectedRoute) {
				console.log(`[hooks] Allowing access to protected route: ${path}`);
				return resolve(event);
			}

		} catch (error) {
			// If there's an error parsing the cookie, clear it
			console.log('[hooks] Error parsing session cookie, clearing it');
			event.cookies.delete('session', { path: '/' });
			event.locals.userId = null;
		}
	} else {
		// No valid session cookie
		console.log('[hooks] No valid session cookie found');
		event.locals.userId = null;
	}

	// Handle auth redirects
	if (isProtectedRoute && !event.locals.userId) {
		console.log('[hooks] No user session, redirecting to auth');
		return redirect(307, '/auth');
	}

	// Prevent authenticated users from accessing auth page
	if (event.url.pathname === '/auth' && event.locals.userId) {
		return redirect(307, '/dashboard');
	}

	console.log(`[hooks] Proceeding with request for ${path}`);
	// Resolve the request
	return resolve(event);
};

export const handle = sequence(handleAuth);
