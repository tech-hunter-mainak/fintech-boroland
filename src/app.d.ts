// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Error {}
		interface Locals {
			user: User | null;
			isTemporarySession: boolean;
		}
		interface PageData {}
		interface PageState {}
		interface Platform {}
		interface User {
			id: string;            // Auth user ID
			email: string;
			mobile: string;
			fullName: string;
			gender: string;
			whatsappUpdates: boolean;
			isVerified: boolean;
			createdAt: string;
			hasDetailedInfo?: boolean;   // Flag to indicate if detailed info is submitted
			// Additional fields from user_details may be included
			age?: number;
			maritalStatus?: string;
			familyMembers?: number;
			isPrimaryEarner?: string;
			education?: string;
			monthlyFamilyIncome?: number;
			monthlyFamilyExpenditure?: number;
			isSelected?: boolean;
		}
	}
}

export {};
