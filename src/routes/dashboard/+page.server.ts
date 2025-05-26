import type { PageServerLoad } from './$types';

// No need to fetch user data again, it's available from the parent layout
export const load: PageServerLoad = async ({ parent }) => {
	// Get the parent data which includes user info
	const parentData = await parent();
	
	return {
		// Add any additional page-specific data here if needed
	};
};
