<script lang="ts">
	import { onMount } from 'svelte';
	import Dashboard from '$lib/components/Dashboard.svelte';
	import { userSession } from '$lib/stores/userStore';
	import { browser } from '$app/environment';

	// Get data from server load function
	export let data;

	// Define the credit data type
	interface CreditData {
		isSelected: boolean;
		score: number;
		reason: string;
	}

	// Dashboard data from server and store
	let userData = data?.user || null;
	let creditData: CreditData | null = null;

	onMount(() => {
		console.log('Dashboard component mounted');
		console.log('Server data:', data);
		
		if (browser) {
			// Check for credit data in session storage
			try {
				const storedCreditData = sessionStorage.getItem('creditData');
				if (storedCreditData) {
					creditData = JSON.parse(storedCreditData) as CreditData;
				}
			} catch (e) {
				console.error('Error reading credit data from session storage:', e);
			}
			
			// If we have user data from the server, update the store
			if (userData) {
				console.log('Updating user session with server data');
				userSession.login(userData, creditData);
			}
		}
	});
</script>

{#if userData}
	<Dashboard 
		userName={userData.full_name || userData.email || 'User'} 
		creditData={creditData} 
		userData={userData} 
	/>
{:else}
	<div class="py-12 text-center">
		<div class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
		<p class="text-gray-600">Loading your dashboard...</p>
	</div>
{/if}
