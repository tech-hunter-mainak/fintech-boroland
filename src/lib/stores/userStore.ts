import { writable, get } from 'svelte/store';
import { fetchUserById } from '../../supabase';
import type { AuthUser, UserDetails } from '../../supabase';

interface UserSession {
	isLoggedIn: boolean;
	userId: string | null;
	userData: (AuthUser & Partial<UserDetails> & { hasSubmittedDetails: boolean }) | null;
}

function createUserSessionStore() {
	const { subscribe, set, update } = writable<UserSession>({
		isLoggedIn: false,
		userId: null,
		userData: null
	});

	return {
		subscribe,
		login: async (userId: string) => {
			try {
				const userData = await fetchUserById(userId);
				
				set({
					isLoggedIn: true,
					userId,
					userData
				});
			} catch (error) {
				console.error('Error in login:', error);
				// Keep session but mark data as null
				set({
					isLoggedIn: true,
					userId,
					userData: null
				});
			}
		},
		logout: () => {
			set({
				isLoggedIn: false,
				userId: null,
				userData: null
			});
		},
		refreshUserData: async () => {
			const currentSession = get(userSession);
			if (!currentSession.userId) return;

			try {
				const userData = await fetchUserById(currentSession.userId);
				
				set({
					isLoggedIn: true,
					userId: currentSession.userId,
					userData
				});
			} catch (error) {
				console.error('Error refreshing user data:', error);
				// Keep session but mark data as null
				set({
					isLoggedIn: true,
					userId: currentSession.userId,
					userData: null
				});
			}
		}
	};
}

export const userSession = createUserSessionStore();
