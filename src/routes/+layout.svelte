<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { Footer, Navbar } from '$lib/components';
	import '../app.css';

	// Track if we're on dashboard page
	$: isDashboard = $page.url.pathname === '/dashboard';
	let isLargeScreen = true;

	onMount(() => {
		// Check screen size on mount and update
		const checkScreenSize = () => {
			isLargeScreen = window.innerWidth >= 1024;
		};

		checkScreenSize();
		window.addEventListener('resize', checkScreenSize);

		return () => {
			window.removeEventListener('resize', checkScreenSize);
		};
	});
</script>

<!-- Conditional navbar display -->
<Navbar />

<!-- Add top padding for non-dashboard pages or large screens on dashboard -->
<main class={isDashboard && !isLargeScreen ? '' : 'pt-20'}>
	<slot />
</main>

<!-- Show footer only on non-dashboard pages -->
{#if !isDashboard}
	<Footer />
{/if}
