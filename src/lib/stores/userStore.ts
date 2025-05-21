import { writable } from 'svelte/store';

interface UserSession {
	isLoggedIn: boolean;
	user: any;
	creditData: any;
}

const createUserSessionStore = () => {
	const { subscribe, set, update } = writable<UserSession>({
		isLoggedIn: false,
		user: null,
		creditData: null
	});

	return {
		subscribe,
		login: (userData: any, creditData: any) => {
			// Store in session storage
			sessionStorage.setItem('userData', JSON.stringify(userData));
			if (creditData) {
				sessionStorage.setItem('creditData', JSON.stringify(creditData));
			}

			set({
				isLoggedIn: true,
				user: userData,
				creditData
			});
		},
		logout: () => {
			// Clear session storage
			sessionStorage.removeItem('userData');
			sessionStorage.removeItem('creditData');

			set({
				isLoggedIn: false,
				user: null,
				creditData: null
			});
		},
		updateCreditData: (creditData: any) => {
			update((session) => ({
				...session,
				creditData
			}));
			sessionStorage.setItem('creditData', JSON.stringify(creditData));
		}
	};
};

export const userSession = createUserSessionStore();
