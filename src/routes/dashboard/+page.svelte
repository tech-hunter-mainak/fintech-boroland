<script lang="ts">
	import { onMount } from 'svelte';
	import { Dashboard } from '$lib/components';
	import { userSession } from '$lib/stores/userStore';
	import { browser } from '$app/environment';

	// Get data from server load function
	export let data;

	// Dashboard data from server and store
	let userData = data?.user || null;

	// Log only during development and only on client-side
	$: if (browser && import.meta.env.DEV) {
		console.log('[Client] Dashboard data:', userData);
	}

	onMount(() => {
		console.log('Dashboard component mounted');
		console.log('Server data:', data);

		if (browser && userData) {
			// Initialize the user session with the UUID from server data
			userSession.login(userData.id);
		}
	});
</script>

{#if userData}
	<Dashboard userName={userData.full_name || userData.email || 'User'} userData={userData} />
{:else}
	<div class="py-12 text-center">
		<div class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
		<p class="text-gray-600">Loading your dashboard...</p>
	</div>
{/if}
