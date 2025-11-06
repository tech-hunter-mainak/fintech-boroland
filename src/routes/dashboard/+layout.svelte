<script lang="ts">
	// import { page } from '$app/stores';
	// Import the one true Sidebar component
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { onMount } from 'svelte';
	import { userSession } from '$lib/stores/userStore';

	// Get data from server load function
	export let data;

	onMount(() => {
		// Initialize the store when the layout loads
		if (data?.user?.id) {
			userSession.login(data.user.id);
		}
	});

	// No conditional logic needed
</script>

<!-- 
  This div wraps your entire dashboard.
  The <Sidebar /> component is fixed to the side.
  The <main> tag holds the page content.
-->
<div class="flex">
	<!-- 
    Part 1: The Sidebar. 
    It is now rendered UNCONDITIONALLY for /dashboard, /dashboard/score, etc.
  -->
	<Sidebar />

	<!-- 
    Part 2: The Page Content.
    The <slot /> renders the specific page (e.g., +page.svelte, profile/+page.svelte).

    We add margin-left to prevent the content from hiding behind the fixed sidebar.
    - ml-20 (5rem) on small screens.
    - lg:ml-52 (13rem) on large screens. (These values are from your Dashboard.svelte)
    
    We also add padding-top to account for the fixed Navbar (which is 4rem/64px + padding).
  -->
	<main class="w-full flex-1 ml-20 lg:ml-52">
		<slot />
	</main>
</div>