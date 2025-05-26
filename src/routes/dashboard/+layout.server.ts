import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getUserById } from '$lib/server/db';
import { dev } from '$app/environment';

// Simple in-memory cache with 5-second TTL
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5000; // 5 seconds

function getCachedData(key: string) {
    const cached = cache.get(key);
    if (!cached) return null;
    
    const now = Date.now();
    if (now - cached.timestamp > CACHE_TTL) {
        cache.delete(key);
        return null;
    }
    
    return cached.data;
}

export const load: LayoutServerLoad = async ({ locals, depends }) => {
    // Add a dependency on user data
    depends('user:data');

    // Check if user exists in session
    if (!locals.userId) {
        throw error(401, 'Unauthorized');
    }

    try {
        // Check cache first
        const cachedData = getCachedData(locals.userId);
        if (cachedData) {
            if (dev) console.log('[Server] Returning cached user data');
            return { user: cachedData };
        }

        // Get complete user data from database using UUID
        const userData = await getUserById(locals.userId);

        if (!userData) {
            throw error(404, 'User not found');
        }

        // Cache the result
        cache.set(locals.userId, { 
            data: userData, 
            timestamp: Date.now() 
        });

        if (dev) console.log('[Server] Fetched fresh user data from database');

        // Return the user data to be available for all child routes
        return {
            user: userData
        };
    } catch (err) {
        console.error('[Server] Error loading user data:', err);
        throw error(500, 'Error loading user data');
    }
}; 