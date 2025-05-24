<script>
	import { page } from '$app/stores';
	import Sidebar from '$lib/components/Sidebar.svelte';
	$: isNotDashboard =
		$page.url.pathname === '/dashboard/score' || $page.url.pathname === '/dashboard/profile';
</script>

{#if isNotDashboard}
	<Sidebar />
	<div class="ml-40">
		<slot />
	</div>
{:else}
	<slot />
{/if}
