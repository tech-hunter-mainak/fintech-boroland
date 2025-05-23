<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { userSession } from '$lib/stores/userStore';
	
	let isMenuOpen = false;
	let isDashboardRoute = false;
	let isSmallScreen = false;
	
	// Dashboard sidebar items
	const dashboardSidebarItems = [
		{
			id: 'credit-report',
			href: '#credit-report',
			text: 'Credit Report',
			icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
		},
		{
			id: 'offers',
			href: '#offers',
			text: 'Offers',
			icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
			badge: '4'
		},
		{
			id: 'products',
			href: '#products',
			text: 'Products',
			icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z'
		},
		{
			id: 'profile',
			href: '#profile',
			text: 'My Profile',
			icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
		},
		{
			id: 'improve',
			href: '#improve',
			text: 'Improve Score',
			icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
		},
		{
			id: 'faqs',
			href: '#faqs',
			text: 'FAQs',
			icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
		},
		{
			id: 'contact',
			href: '#contact',
			text: 'Contact Us',
			icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
		}
	];
	
	const toggleMenu = () => {
		isMenuOpen = !isMenuOpen;
	};
	
	// Check screen size and route
	const checkScreenSizeAndRoute = () => {
		isSmallScreen = window.innerWidth < 1024;
		isDashboardRoute = $page.url.pathname === '/dashboard';
	};
	
	// Handle logout
	const handleLogout = async () => {
		try {
			// Call the logout API endpoint to clear server-side cookies
			await fetch('/api/auth', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					action: 'logout'
				})
			});
			
			// Clear client-side storage
			userSession.logout();
			
			// Navigate to home page with a reload to ensure fresh state
			window.location.href = '/';
		} catch (error) {
			console.error('Error during logout:', error);
		}
	};
	
	onMount(() => {
		checkScreenSizeAndRoute();
		window.addEventListener('resize', checkScreenSizeAndRoute);
		
		// Cleanup
		return () => {
			window.removeEventListener('resize', checkScreenSizeAndRoute);
		};
	});
	
	// Page store subscription to detect route changes
	$: isDashboardRoute = $page.url.pathname === '/dashboard';
</script>

<nav class="fixed top-0 left-0 w-full bg-white py-4 shadow-md dark:bg-gray-900 z-50">
	<div class="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between px-4">
		<a href="/" class="flex items-center">
			<span class="self-center whitespace-nowrap text-xl font-semibold text-blue-700 dark:text-white"
				>Boroland</span
			>
		</a>
		<div class="flex items-center lg:order-2">
			{#if isDashboardRoute}
				<button
					on:click={toggleMenu}
					type="button"
					class="ml-1 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 lg:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
					aria-controls="mobile-menu-2"
					aria-expanded={isMenuOpen}
				>
					<span class="sr-only">Open main menu</span>
					<svg
						class={isMenuOpen ? "hidden h-6 w-6" : "h-6 w-6"}
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
							clip-rule="evenodd"
						></path>
					</svg>
					<svg
						class={isMenuOpen ? "h-6 w-6" : "hidden h-6 w-6"}
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clip-rule="evenodd"
						></path>
					</svg>
				</button>
			{:else}
				<div class="mr-4 mt-2 hidden sm:inline-block">
					<span></span>
				</div>

				<a
					href="/"
					class="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:mr-2 lg:mr-0 lg:px-5 lg:py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
					>Get Started</a
				>
				<button
					on:click={toggleMenu}
					type="button"
					class="ml-1 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 lg:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
					aria-controls="mobile-menu-2"
					aria-expanded={isMenuOpen}
				>
					<span class="sr-only">Open main menu</span>
					<svg
						class={isMenuOpen ? "hidden h-6 w-6" : "h-6 w-6"}
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
							clip-rule="evenodd"
						></path>
					</svg>
					<svg
						class={isMenuOpen ? "h-6 w-6" : "hidden h-6 w-6"}
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clip-rule="evenodd"
						></path>
					</svg>
				</button>
			{/if}
		</div>
		<div
			class={`w-full items-center justify-between lg:order-1 lg:flex lg:w-auto ${isMenuOpen ? 'block' : 'hidden lg:block'}`}
			id="mobile-menu-2"
		>
			<!-- Show different menu items based on route and screen size -->
			{#if isDashboardRoute && isSmallScreen}
				<!-- Dashboard Sidebar Items -->
				<ul class="mt-4 flex flex-col font-medium lg:mt-0 lg:hidden">
					{#each dashboardSidebarItems as item}
						<li>
							<button 
								on:click={() => {
									// Close menu after clicking
									isMenuOpen = false;
									
									// Navigate to the section by ID
									const sectionElement = document.getElementById(item.id);
									if (sectionElement) {
										sectionElement.scrollIntoView({ behavior: 'smooth' });
									}
									
									// Dispatch event for Dashboard component to handle
									window.dispatchEvent(new CustomEvent('dashboard-menu-item-click', { 
										detail: { itemId: item.id }
									}));
								}}
								class="flex w-full items-center border-b border-gray-100 py-3 pl-3 pr-4 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
							>
								<svg
									class="mr-2 h-5 w-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d={item.icon}
									></path>
								</svg>
								<span>{item.text}</span>
								{#if item.badge}
									<span class="ml-2 rounded-full bg-red-100 px-2 py-1 text-xs text-red-600">{item.badge}</span>
								{/if}
							</button>
						</li>
					{/each}
					
					<!-- Logout Button -->
					<li>
						<button
							on:click={handleLogout}
							class="flex w-full items-center border-b border-gray-100 py-3 pl-3 pr-4 text-red-500 hover:bg-gray-50 dark:border-gray-700 dark:text-red-400 dark:hover:bg-gray-700"
						>
							<svg
								class="mr-2 h-5 w-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
								></path>
							</svg>
							<span>Logout</span>
						</button>
					</li>
				</ul>
			{:else}
				<!-- Regular Website Navigation -->
				<ul class="mt-4 flex flex-col font-medium lg:mt-0 lg:flex-row lg:space-x-8">
					<li>
						<a
							href="/"
							class="block rounded bg-blue-700 py-2 pl-3 pr-4 text-white lg:bg-transparent lg:p-0 lg:text-blue-700 dark:text-white"
							aria-current="page">Home</a
						>
					</li>
					<li>
						<a
							href="/"
							class="block border-b border-gray-100 py-2 pl-3 pr-4 text-gray-700 hover:bg-gray-50 lg:border-0 lg:p-0 lg:hover:bg-transparent lg:hover:text-blue-700 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent lg:dark:hover:text-white"
							>Company</a
						>
					</li>
					<li>
						<a
							href="/"
							class="block border-b border-gray-100 py-2 pl-3 pr-4 text-gray-700 hover:bg-gray-50 lg:border-0 lg:p-0 lg:hover:bg-transparent lg:hover:text-blue-700 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent lg:dark:hover:text-white"
							>Marketplace</a
						>
					</li>
					<li>
						<a
							href="/"
							class="block border-b border-gray-100 py-2 pl-3 pr-4 text-gray-700 hover:bg-gray-50 lg:border-0 lg:p-0 lg:hover:bg-transparent lg:hover:text-blue-700 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent lg:dark:hover:text-white"
							>Features</a
						>
					</li>
					<li>
						<a
							href="/"
							class="block border-b border-gray-100 py-2 pl-3 pr-4 text-gray-700 hover:bg-gray-50 lg:border-0 lg:p-0 lg:hover:bg-transparent lg:hover:text-blue-700 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent lg:dark:hover:text-white"
							>Team</a
						>
					</li>
					<li>
						<a
							href="/"
							class="block border-b border-gray-100 py-2 pl-3 pr-4 text-gray-700 hover:bg-gray-50 lg:border-0 lg:p-0 lg:hover:bg-transparent lg:hover:text-blue-700 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent lg:dark:hover:text-white"
							>Contact</a
						>
					</li>
				</ul>
			{/if}
		</div>
	</div>
</nav>
