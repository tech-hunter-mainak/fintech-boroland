// import { goto } from '$app/navigation';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

// First hook: handle auth and set locals.user
const handleAuth: Handle = async ({ event, resolve }) => {
	// Get the session cookie
	const sessionCookie = event.cookies.get('session');
	const tempSessionCookie = event.cookies.get('temp_session');
	const path = event.url.pathname;
	
	console.log(`[hooks] Processing request for path: ${path}`);

	if (sessionCookie) {
		try {
			// Parse the session cookie
			const userData = JSON.parse(sessionCookie);
			console.log(`[hooks] Found valid session cookie for user: ${userData.email}`);
			
			// Set the user in the locals object for access in endpoints and server load functions
			event.locals.user = userData;
			event.locals.isTemporarySession = false;
		} catch (error) {
			// If there's an error parsing the cookie, clear it
			console.log('[hooks] Error parsing session cookie, clearing it');
			event.cookies.delete('session', { path: '/' });
			event.locals.user = null;
			event.locals.isTemporarySession = false;
		}
	} else if (tempSessionCookie && event.url.pathname === '/detailed-info') {
		// For the /detailed-info route, allow temporary session
		try {
			const userData = JSON.parse(tempSessionCookie);
			console.log(`[hooks] Using temporary session for user: ${userData.email} on detailed-info page`);
			event.locals.user = userData;
			event.locals.isTemporarySession = true;
		} catch (error) {
			console.log('[hooks] Error parsing temp session cookie, clearing it');
			event.cookies.delete('temp_session', { path: '/' });
			event.locals.user = null;
			event.locals.isTemporarySession = false;
		}
	} else {
		// No valid session cookie
		console.log('[hooks] No valid session cookie found');
		event.locals.user = null;
		event.locals.isTemporarySession = false;
	}

	// Protected routes that require authentication
	const protectedRoutes = [
		'/dashboard',
		'/profile',
		'/detailed-info',
		'/settings'
	];
	
	// Routes that can be accessed only if detailed info is already submitted
	const requiresDetailedInfo = [
		'/dashboard',
		'/profile',
		'/settings'
	];
	
	// Check if current route is protected
	const isProtectedRoute = protectedRoutes.some(route => 
		event.url.pathname === route || event.url.pathname.startsWith(`${route}/`)
	);
	
	// Check if route requires detailed info
	const routeRequiresDetailedInfo = requiresDetailedInfo.some(route => 
		event.url.pathname === route || event.url.pathname.startsWith(`${route}/`)
	);
	
	// For diagnostic purposes
	if (isProtectedRoute) {
		console.log(`[hooks] Accessing protected route: ${path}`);
	}
	
	if (routeRequiresDetailedInfo) {
		console.log(`[hooks] Route requires detailed info: ${path}`);
	}
	
	// Handle auth redirects
	if (isProtectedRoute && !event.locals.user) {
		console.log('[hooks] No user session, redirecting to home');
		return redirect(307, '/');
	}
	
	// For routes requiring detailed info, check if user has completed it
	// AND if they have a full session (not temporary)
	if (routeRequiresDetailedInfo) {
		if (event.locals.isTemporarySession) {
			console.log('[hooks] User has temporary session, redirecting to detailed-info');
			return redirect(307, '/detailed-info');
		}
		
		if (event.locals.user && event.locals.user.hasDetailedInfo === false) {
			console.log('[hooks] User has not completed detailed info, redirecting to detailed-info');
			return redirect(307, '/detailed-info');
		}
	}

	console.log(`[hooks] Proceeding with request for ${path}`);
	// Resolve the request
	return resolve(event);
};

export const handle = sequence(handleAuth);
