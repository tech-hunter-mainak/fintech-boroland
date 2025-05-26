<script lang="ts">
	import { page } from '$app/stores';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { onMount } from 'svelte';
	import { userSession } from '$lib/stores/userStore';

	// Get data from server load function
	export let data;

	$: isNotDashboard =
		$page.url.pathname === '/dashboard/score' || $page.url.pathname === '/dashboard/profile';

	onMount(() => {
		if (data?.user) {
			// Initialize the user session with the UUID from server data
			userSession.login(data.user.id);
		}
	});
</script>

{#if isNotDashboard}
	<Sidebar />
	<div class="ml-40">
		<slot />
	</div>
{:else}
	<slot />
{/if}

<!-- You can add common dashboard layout elements here -->
<style>
	/* Add any layout styles here */
</style>
