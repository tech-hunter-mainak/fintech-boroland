<script lang="ts">
	import { userSession } from '$lib/stores/userStore';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { Sidebar, MyProfile } from '$lib/components';

	export let userName: string = '';
	export let creditData: {
		isSelected: boolean;
		score: number;
		reason: string;
	} | null = null;
	export let userData: any = null;

	let isLoading = true;
	let currentView = 'dashboard';
	let isSmallScreen = false;

	// Helper functions for accessing user data consistently
	function getScoreValue(): number {
		// First check session credit data, then database value, default to 0
		return creditData?.score || userData?.prediction_percentage || 0;
	}

	function getScoreColor(): string {
		const score = getScoreValue();
		if (score >= 70) return '#10B981'; // Green for high scores
		if (score >= 50) return '#F59E0B'; // Yellow/amber for medium scores
		return '#EF4444'; // Red for low scores
	}

	function isUserSelected(): boolean {
		// Check both session data and database value
		return creditData?.isSelected || userData?.is_selected;
	}

	function getLastUpdatedDate(): string {
		// Use the database updated_at timestamp if available, otherwise current date
		if (userData?.updated_at) {
			return new Date(userData.updated_at).toLocaleDateString();
		}
		return new Date().toLocaleDateString();
	}

	const sidebarItems = [
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

	const handleNavigation = (itemId: string) => {
		currentView = itemId;
	};

	// Handle menu item clicks from the navbar
	const handleNavbarMenuClick = (event: Event) => {
		// Cast to CustomEvent with the right type
		const customEvent = event as CustomEvent<{ itemId: string }>;
		const { itemId } = customEvent.detail;
		handleNavigation(itemId);
	};

	// Check screen size
	const checkScreenSize = () => {
		if (browser) {
			isSmallScreen = window.innerWidth < 1024;
		}
	};

	onMount(() => {
		// Listen for events from navbar
		window.addEventListener('dashboard-menu-item-click', handleNavbarMenuClick as EventListener);

		// Add resize listener to detect screen size changes
		checkScreenSize();
		window.addEventListener('resize', checkScreenSize);

		// Simulate loading
		setTimeout(() => {
			isLoading = false;
		}, 1000);
	});

	onDestroy(() => {
		// Clean up event listeners
		if (browser) {
			window.removeEventListener(
				'dashboard-menu-item-click',
				handleNavbarMenuClick as EventListener
			);
			window.removeEventListener('resize', checkScreenSize);
		}
	});
</script>

<div class="-mt-20">
	<div class="flex flex-wrap">
		<!-- Sidebar - hide on small screens -->
		<div class="grid grid-cols-7">
			<!-- SideBar -->
			<div class="fixed col-span-1 h-full bg-white">
				<div class="flex h-full w-full flex-col border-r border-r-gray-200 bg-white p-2">
					<!-- Logo -->
					<!-- <a href="/" aria-label="Home">
						<div
							class="flex cursor-pointer items-center justify-center gap-2 px-0 py-2 md:px-2 lg:justify-start lg:px-4"
						>
							<svg
								width="36"
								height="36"
								viewBox="0 0 903 1000"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M814.39 736.55L751.05 699.74L750.81 617.11L814.15 653.92L814.39 736.55Z"
									fill="#00717E"
								></path>
								<path
									d="M520.46 997.94L457.12 961.13L456.86 869.58L520.2 906.39L520.46 997.94Z"
									fill="#00717E"
								></path>
								<path
									d="M520.2 906.39L456.86 869.58L751.05 699.74L814.39 736.55L520.2 906.39Z"
									fill="#00B6CA"
								></path>
								<path
									d="M608.06 681.21L544.72 644.4L838.91 474.55L902.25 511.36L608.06 681.21Z"
									fill="#00B6CA"
								></path>
								<path
									d="M519.97 823.77L456.63 786.96L455.87 521.56L519.22 558.37L519.97 823.77Z"
									fill="#00717E"
								></path>
								<path
									d="M519.22 558.37L455.87 521.56L838.41 300.7L901.75 337.51L519.22 558.37Z"
									fill="#00B6CA"
								></path>
								<path
									d="M901.75 337.51L902.01 429.05L607.83 598.9L608.06 681.21L902.25 511.36L903 777.08L520.46 997.94L520.2 906.39L814.39 736.55L814.15 653.92L519.97 823.77L519.22 558.37L901.75 337.51Z"
									fill="#00A3B6"
								></path>
								<path
									d="M75.75 554.2L139.09 517.4L138.34 784.69L75 821.5L75.75 554.2Z"
									fill="#1D49C5"
								></path>
								<path
									d="M1.25 338.65L64.59 301.84L149.22 350.7L85.88 387.51L1.25 338.65Z"
									fill="#2152DC"
								></path>
								<path
									d="M85.88 387.51L149.22 350.7L255.26 668.51L191.92 705.32L85.88 387.51Z"
									fill="#2459EF"
								></path>
								<path
									d="M308.29 688.46L371.63 651.65L254.74 851.89L191.4 888.7L308.29 688.46Z"
									fill="#1D49C5"
								></path>
								<path
									d="M383.77 559.5L447.11 522.69L445.87 962.24L382.53 999.05L383.77 559.5Z"
									fill="#1D49C5"
								></path>
								<path
									d="M299.15 510.64L362.49 473.83L447.11 522.69L383.77 559.5L299.15 510.64Z"
									fill="#2152DC"
								></path>
								<path
									d="M383.77 559.5L382.53 999.05L307.53 955.76L308.29 688.46L191.4 888.7L75.75 554.2L75 821.5L0 778.2L1.25 338.65L85.88 387.51L191.92 705.32L299.15 510.64L383.77 559.5Z"
									fill="#143389"
								></path>
								<path
									d="M832.32 218.54L832.12 291.8L752.97 337.8L753.18 264.54L832.32 218.54Z"
									fill="#007DC5"
								></path>
								<path
									d="M753.18 264.54L752.97 337.8L370.44 116.94L370.65 43.68L753.18 264.54Z"
									fill="#005789"
								></path>
								<path
									d="M449.8 -2.31L832.32 218.54L753.18 264.54L370.65 43.68L449.8 -2.31Z"
									fill="#008CDC"
								></path>
								<path
									d="M387.82 136.05L387.62 209.31L237.03 296.82L237.23 223.56L387.82 136.05Z"
									fill="#007DC5"
								></path>
								<path
									d="M514.52 300.89L514.31 374.15L421.06 320.31L421.27 247.05L514.52 300.89Z"
									fill="#005789"
								></path>
								<path
									d="M452.27 439.4L452.06 512.66L69.54 291.81L69.74 218.55L452.27 439.4Z"
									fill="#005789"
								></path>
								<path
									d="M602.86 351.89L531.42 393.41L452.27 439.4L452.06 512.66L531.21 466.67L602.65 425.15L681.8 379.15L682.01 305.89L602.86 351.89Z"
									fill="#007DC5"
								></path>
								<path
									d="M421.27 247.05L500.41 201.05L682.01 305.89L602.86 351.89L531.42 393.41L452.27 439.4L69.74 218.55L299.48 85.04L387.82 136.05L237.23 223.56L443.08 342.4L514.52 300.89L421.27 247.05Z"
									fill="#008CDC"
								></path>
							</svg>
						</div>
					</a> -->

					<div
						class="mt-16 flex h-full flex-grow flex-col justify-between overflow-y-auto overflow-x-hidden pt-2"
					>
						<div class="mx-1 flex flex-col space-y-1 lg:mt-1">
							<div class="hidden px-5 pt-4 lg:block">
								<div class="flex flex-row items-center">
									<div class="text-xs font-bold tracking-wide text-gray-600">Menu</div>
								</div>
							</div>
							<a
								class="hover:text-primary-400 flex h-12 cursor-pointer flex-row items-center justify-center rounded-md pr-3.5 font-semibold text-gray-500 focus:outline-none lg:justify-start lg:pr-6"
								href="/app"
								><span class="ml-3.5 inline-flex items-center justify-center"
									><svg
										xmlns="http://www.w3.org/2000/svg"
										width="1.25rem"
										height="1.25rem"
										viewBox="0 0 24 24"
										><path
											fill="currentColor"
											d="M10.894 22h2.212c3.447 0 5.17 0 6.345-1.012s1.419-2.705 1.906-6.093l.279-1.937c.38-2.637.57-3.956.029-5.083s-1.691-1.813-3.992-3.183l-1.385-.825C14.2 2.622 13.154 2 12 2s-2.199.622-4.288 1.867l-1.385.825c-2.3 1.37-3.451 2.056-3.992 3.183s-.35 2.446.03 5.083l.278 1.937c.487 3.388.731 5.081 1.906 6.093S7.447 22 10.894 22"
											opacity=".5"
										></path><path
											fill="currentColor"
											d="M9.447 15.397a.75.75 0 0 0-.894 1.205A5.77 5.77 0 0 0 12 17.75a5.77 5.77 0 0 0 3.447-1.148a.75.75 0 0 0-.894-1.205A4.27 4.27 0 0 1 12 16.25a4.27 4.27 0 0 1-2.553-.853"
										></path></svg
									></span
								><span
									class="ml-0 hidden truncate text-sm capitalize tracking-wide lg:ml-2 lg:block"
									>App</span
								></a
							><a
								class="hover:text-primary-400 flex h-12 cursor-pointer flex-row items-center justify-center rounded-md pr-3.5 font-semibold text-gray-500 focus:outline-none lg:justify-start lg:pr-6"
								href="/app/blogs"
								><span class="ml-3.5 inline-flex items-center justify-center"
									><svg
										xmlns="http://www.w3.org/2000/svg"
										width="1.25rem"
										height="1.25rem"
										viewBox="0 0 24 24"
										fill="none"
										><g opacity="0.50"
											><path
												d="M21 8H13C12.7348 8 12.4804 7.89464 12.2929 7.70711C12.1054 7.51957 12 7.26522 12 7C12 6.73478 12.1054 6.48043 12.2929 6.29289C12.4804 6.10536 12.7348 6 13 6H21C21.2652 6 21.5196 6.10536 21.7071 6.29289C21.8946 6.48043 22 6.73478 22 7C22 7.26522 21.8946 7.51957 21.7071 7.70711C21.5196 7.89464 21.2652 8 21 8ZM21 12H13C12.7348 12 12.4804 11.8946 12.2929 11.7071C12.1054 11.5196 12 11.2652 12 11C12 10.7348 12.1054 10.4804 12.2929 10.2929C12.4804 10.1054 12.7348 10 13 10H21C21.2652 10 21.5196 10.1054 21.7071 10.2929C21.8946 10.4804 22 10.7348 22 11C22 11.2652 21.8946 11.5196 21.7071 11.7071C21.5196 11.8946 21.2652 12 21 12Z"
												fill="currentColor"
											></path><path
												d="M21 16H3C2.73478 16 2.48043 15.8946 2.29289 15.7071C2.10536 15.5196 2 15.2652 2 15C2 14.7348 2.10536 14.4804 2.29289 14.2929C2.48043 14.1054 2.73478 14 3 14H21C21.2652 14 21.5196 14.1054 21.7071 14.2929C21.8946 14.4804 22 14.7348 22 15C22 15.2652 21.8946 15.5196 21.7071 15.7071C21.5196 15.8946 21.2652 16 21 16ZM13 20H3C2.73478 20 2.48043 19.8946 2.29289 19.7071C2.10536 19.5196 2 19.2652 2 19C2 18.7348 2.10536 18.4804 2.29289 18.2929C2.48043 18.1054 2.73478 18 3 18H13C13.2652 18 13.5196 18.1054 13.7071 18.2929C13.8946 18.4804 14 18.7348 14 19C14 19.2652 13.8946 19.5196 13.7071 19.7071C13.5196 19.8946 13.2652 20 13 20Z"
												fill="currentColor"
											></path></g
										><rect x="2" y="4" width="8" height="8" rx="2" fill="currentColor"></rect></svg
									></span
								><span
									class="ml-0 hidden truncate text-sm capitalize tracking-wide lg:ml-2 lg:block"
									>Blogs</span
								></a
							><a
								class="hover:text-primary-400 flex h-12 cursor-pointer flex-row items-center justify-center rounded-md pr-3.5 font-semibold text-gray-500 focus:outline-none lg:justify-start lg:pr-6"
								href="/app/clients"
								><span class="ml-3.5 inline-flex items-center justify-center"
									><svg
										xmlns="http://www.w3.org/2000/svg"
										width="1.25rem"
										height="1.25rem"
										viewBox="0 0 24 24"
										><path
											fill="currentColor"
											d="M24 5a3 3 0 1 1-6 0a3 3 0 0 1 6 0m-6.766 2.464l-1.537 1.28c-1.026.856-1.738 1.447-2.34 1.834c-.582.375-.977.5-1.357.5s-.774-.125-1.357-.5c-.601-.386-1.314-.978-2.34-1.834L5.928 6.765a.825.825 0 0 0-1.056 1.268l2.416 2.014c.975.812 1.765 1.47 2.463 1.92c.726.466 1.434.762 2.25.762c.814 0 1.522-.296 2.249-.763c.697-.448 1.487-1.107 2.462-1.92l1.666-1.388a4.5 4.5 0 0 1-1.144-1.194"
										></path><path
											fill="currentColor"
											d="M18.454 6.587a.825.825 0 0 1 .958.959a3 3 0 0 1-.958-.959"
										></path><path
											fill="currentColor"
											d="M16.958 3.021C16.156 3 15.244 3 14.2 3H9.8C5.652 3 3.577 3 2.289 4.318S1 7.758 1 12s0 6.364 1.289 7.682S5.652 21 9.8 21h4.4c4.148 0 6.223 0 7.511-1.318S23 16.242 23 12c0-1.067 0-2-.02-2.82a4.4 4.4 0 0 1-1.98.468c-2.485 0-4.5-2.06-4.5-4.603c0-.726.165-1.413.458-2.024"
											opacity=".5"
										></path></svg
									></span
								><span
									class="ml-0 hidden truncate text-sm capitalize tracking-wide lg:ml-2 lg:block"
									>Mail</span
								></a
							><a
								class="bg-primary-50 text-primary-400 flex h-12 flex-row items-center justify-center rounded-md pr-3.5 font-bold font-semibold shadow-sm focus:outline-none lg:justify-start lg:pr-6"
								href="/app/projects"
								><span class="ml-3.5 inline-flex items-center justify-center"
									><svg
										xmlns="http://www.w3.org/2000/svg"
										width="1.25rem"
										height="1.25rem"
										viewBox="0 0 24 24"
										><path
											fill="currentColor"
											d="M2 12c0 5.523 4.477 10 10 10h9.25a.75.75 0 0 0 0-1.5h-3.98A9.99 9.99 0 0 0 22 12c0-5.523-4.477-10-10-10S2 6.477 2 12"
											opacity=".5"
										></path><path
											fill="currentColor"
											fill-rule="evenodd"
											d="M12 15.75a3.75 3.75 0 1 1 0-7.5a3.75 3.75 0 0 1 0 7.5"
											clip-rule="evenodd"
										></path><path
											fill="currentColor"
											d="M5.5 13a1 1 0 1 0 0-2a1 1 0 0 0 0 2M12 4.5a1 1 0 1 1 0 2a1 1 0 0 1 0-2m1 14a1 1 0 1 0-2 0a1 1 0 0 0 2 0m5.5-5.5a1 1 0 1 0 0-2a1 1 0 0 0 0 2"
										></path></svg
									></span
								><span
									class="ml-0 hidden truncate text-sm capitalize tracking-wide lg:ml-2 lg:block"
									>projects</span
								></a
							>
						</div>
						<div class="mx-1 flex flex-col space-y-1 lg:mt-1">
							<a
								class="hover:text-primary-400 flex h-12 cursor-pointer flex-row items-center justify-center rounded-md pr-3.5 font-semibold text-gray-500 focus:outline-none lg:justify-start lg:pr-6"
								href="/app/settings"
								><span class="ml-3.5 inline-flex items-center justify-center"
									><svg
										xmlns="http://www.w3.org/2000/svg"
										width="1.25rem"
										height="1.25rem"
										viewBox="0 0 24 24"
										><path
											fill="currentColor"
											fill-rule="evenodd"
											d="M14.279 2.152C13.909 2 13.439 2 12.5 2s-1.408 0-1.779.152a2 2 0 0 0-1.09 1.083c-.094.223-.13.484-.145.863a1.62 1.62 0 0 1-.796 1.353a1.64 1.64 0 0 1-1.579.008c-.338-.178-.583-.276-.825-.308a2.03 2.03 0 0 0-1.49.396c-.318.242-.553.646-1.022 1.453c-.47.807-.704 1.21-.757 1.605c-.07.526.074 1.058.4 1.479c.148.192.357.353.68.555c.477.297.783.803.783 1.361s-.306 1.064-.782 1.36c-.324.203-.533.364-.682.556a2 2 0 0 0-.399 1.479c.053.394.287.798.757 1.605s.704 1.21 1.022 1.453c.424.323.96.465 1.49.396c.242-.032.487-.13.825-.308a1.64 1.64 0 0 1 1.58.008c.486.28.774.795.795 1.353c.015.38.051.64.145.863c.204.49.596.88 1.09 1.083c.37.152.84.152 1.779.152s1.409 0 1.779-.152a2 2 0 0 0 1.09-1.083c.094-.223.13-.483.145-.863c.02-.558.309-1.074.796-1.353a1.64 1.64 0 0 1 1.579-.008c.338.178.583.276.825.308c.53.07 1.066-.073 1.49-.396c.318-.242.553-.646 1.022-1.453c.47-.807.704-1.21.757-1.605a2 2 0 0 0-.4-1.479c-.148-.192-.357-.353-.68-.555c-.477-.297-.783-.803-.783-1.361s.306-1.064.782-1.36c.324-.203.533-.364.682-.556a2 2 0 0 0 .399-1.479c-.053-.394-.287-.798-.757-1.605s-.704-1.21-1.022-1.453a2.03 2.03 0 0 0-1.49-.396c-.242.032-.487.13-.825.308a1.64 1.64 0 0 1-1.58-.008a1.62 1.62 0 0 1-.795-1.353c-.015-.38-.051-.64-.145-.863a2 2 0 0 0-1.09-1.083"
											clip-rule="evenodd"
											opacity=".5"
										></path><path
											fill="currentColor"
											d="M15.523 12c0 1.657-1.354 3-3.023 3s-3.023-1.343-3.023-3S10.83 9 12.5 9s3.023 1.343 3.023 3"
										></path></svg
									></span
								><span
									class="ml-0 hidden truncate text-sm capitalize tracking-wide lg:ml-2 lg:block"
									>Settings</span
								></a
							>
						</div>
					</div>
					<div class="px-1">
						<button
							class="hover:text-primary-400 flex h-12 cursor-pointer flex-row items-center justify-center rounded-md pr-3.5 font-semibold text-gray-500 text-red-400 hover:text-red-600 focus:outline-none lg:justify-start lg:pr-6"
							type="button"
							aria-label="Logout"
							on:click={handleLogout}
						>
							<span class="ml-3.5 inline-flex items-center justify-center"
								><svg
									xmlns="http://www.w3.org/2000/svg"
									width="1.25rem"
									height="1.25rem"
									viewBox="0 0 24 24"
									><path
										fill="currentColor"
										d="M15 2h-1c-2.828 0-4.243 0-5.121.879C8 3.757 8 5.172 8 8v8c0 2.828 0 4.243.879 5.121C9.757 22 11.172 22 14 22h1c2.828 0 4.243 0 5.121-.879C21 20.243 21 18.828 21 16V8c0-2.828 0-4.243-.879-5.121C19.243 2 17.828 2 15 2"
										opacity=".6"
									></path><path
										fill="currentColor"
										d="M8 8c0-1.538 0-2.657.141-3.5H8c-2.357 0-3.536 0-4.268.732S3 7.143 3 9.5v5c0 2.357 0 3.535.732 4.268S5.643 19.5 8 19.5h.141C8 18.657 8 17.538 8 16z"
										opacity=".4"
									></path><path
										fill="currentColor"
										fill-rule="evenodd"
										d="M4.47 11.47a.75.75 0 0 0 0 1.06l2 2a.75.75 0 0 0 1.06-1.06l-.72-.72H14a.75.75 0 0 0 0-1.5H6.81l.72-.72a.75.75 0 1 0-1.06-1.06z"
										clip-rule="evenodd"
									></path></svg
								></span
							><span class="ml-2 hidden truncate text-sm capitalize tracking-wide lg:block"
								>Logout</span
							>
						</button>
					</div>
				</div>
			</div>
			<!-- View Content -->
			<div class="col-span-6 ml-20 mt-20 w-[900px] overflow-scroll bg-white lg:ml-52">
				{#if isLoading}
					<div
						class="rounded-lg bg-white p-8 text-center shadow-md transition-all duration-300 ease-in-out"
					>
						<div
							class="mx-auto h-16 w-16 animate-spin rounded-full border-b-2 border-blue-600"
						></div>
						<p class="mt-4 text-gray-600">Please wait while we process your information...</p>
					</div>
				{:else if currentView === 'profile'}
					<MyProfile {userData} />
				{:else}
					<!-- Credit Score Status -->
					<div
						class="mb-8 transform rounded-lg bg-white p-8 shadow-md transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
					>
						<div class="mb-8">
							<h2 class="mb-4 text-center text-2xl font-bold">Hey {userName}!</h2>
							<div class="mt-6 grid grid-cols-1 gap-8 md:grid-cols-3">
								<!-- Replace Credit Score Circle with better display -->
								<div class="text-center">
									<div class="relative mx-auto mb-4 rounded-lg bg-gray-50 p-4 shadow-inner">
										<div class="flex flex-col items-center justify-center" style="height: 150px;">
											<div
												class="text-5xl font-bold tracking-tight"
												style="color: {getScoreColor()}"
											>
												{getScoreValue()}%
											</div>
											<div class="mt-2 text-sm text-gray-500">Credit Score</div>
											<div class="mt-4 h-2 w-full rounded-full bg-gray-200">
												<div
													class="h-2 rounded-full"
													style="width: {getScoreValue()}%; background-color: {getScoreColor()}"
												></div>
											</div>
										</div>
									</div>
								</div>

								<!-- Status -->
								<div class="space-y-4">
									<div>
										<h3 class="mb-1 text-sm text-gray-500">Status</h3>
										<p
											class="text-lg font-semibold {isUserSelected()
												? 'text-green-600'
												: 'text-red-600'}"
										>
											{isUserSelected() ? 'Approved' : 'Not Approved'}
										</p>
									</div>
									<div>
										<h3 class="mb-1 text-sm text-gray-500">Last Updated</h3>
										<p class="font-semibold">{getLastUpdatedDate()}</p>
									</div>
								</div>

								<!-- Actions -->
								<div class="space-y-4">
									<button
										class="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
									>
										Build Your Credit Score
									</button>
									<button
										class="w-full rounded-lg border border-blue-600 px-4 py-2 text-blue-600 transition-colors hover:bg-blue-50"
									>
										View Detailed Report
									</button>
								</div>
							</div>
							{#if creditData?.reason}
								<p class="mt-4 text-gray-600">{creditData.reason}</p>
							{:else if getScoreValue() > 0}
								<p class="mt-4 text-gray-600">
									Based on our AI assessment, you have a {getScoreValue()}% match with successful
									credit profiles.
								</p>
							{:else}
								<p class="text-gray-600">
									We are unable to locate your information in Credit Bureau(s) records based on the
									information you have provided during enrollment
								</p>
								<button
									class="mx-auto mt-6 flex items-center rounded-lg bg-blue-600 px-8 py-3 text-white transition-colors hover:bg-blue-700"
								>
									<svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
										></path>
									</svg>
									Build your Credit Score
								</button>
							{/if}
						</div>

						<!-- Credit Factors -->
						{#if userData}
							<div class="border-t pt-8">
								<h3 class="mb-6 text-lg font-semibold">Credit Score Factors</h3>
								<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
									<div class="space-y-4">
										<div class="flex items-center justify-between">
											<span class="text-gray-600">Monthly Income</span>
											<span class="font-semibold"
												>₹{userData.monthly_family_income ||
													userData.monthlyFamilyIncome ||
													0}</span
											>
										</div>
										<div class="flex items-center justify-between">
											<span class="text-gray-600">Education</span>
											<span class="font-semibold">{userData.education || 'N/A'}</span>
										</div>
										<div class="flex items-center justify-between">
											<span class="text-gray-600">Skills</span>
											<span class="font-semibold"
												>{userData.skill_1 || userData.skills?.[0]?.skill || 'N/A'}</span
											>
										</div>
									</div>
									<div class="space-y-4">
										<div class="flex items-center justify-between">
											<span class="text-gray-600">Monthly Expenses</span>
											<span class="font-semibold"
												>₹{userData.monthly_family_expenditure ||
													userData.monthlyFamilyExpenditure ||
													0}</span
											>
										</div>
										<div class="flex items-center justify-between">
											<span class="text-gray-600">Certifications</span>
											<span class="font-semibold"
												>{userData.has_certification || userData.hasCertification || 'No'}</span
											>
										</div>
										<div class="flex items-center justify-between">
											<span class="text-gray-600">Assets</span>
											<span class="font-semibold">
												{(() => {
													if (userData.ownership && Array.isArray(userData.ownership)) {
														return userData.ownership.join(', ');
													} else if (typeof userData.ownership === 'string') {
														return userData.ownership;
													} else {
														return 'None';
													}
												})()}
											</span>
										</div>
									</div>
								</div>
							</div>
						{/if}
					</div>

					<!-- Pre Approved Offers -->
					<div
						class="transform rounded-lg bg-white p-8 shadow-md transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
					>
						<div class="mb-6 flex items-center">
							<svg
								class="mr-3 h-8 w-8 text-blue-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
								></path>
							</svg>
							<h2 class="text-2xl font-bold">Pre Approved & Pre Qualified Offers</h2>
						</div>
						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							{#if isUserSelected()}
								<div class="rounded-lg border p-6 transition-shadow hover:shadow-md">
									<h3 class="mb-2 text-lg font-semibold">Personal Loan</h3>
									<p class="mb-4 text-gray-600">
										Get instant approval on personal loans tailored for the Bodo community
									</p>
									<p class="mb-4 text-lg font-bold text-green-600">Up to ₹5,00,000</p>
									<button
										class="w-full rounded-lg bg-green-600 py-2 text-white transition-colors hover:bg-green-700"
									>
										Apply Now
									</button>
								</div>
								<div class="rounded-lg border p-6 transition-shadow hover:shadow-md">
									<h3 class="mb-2 text-lg font-semibold">Business Loan</h3>
									<p class="mb-4 text-gray-600">
										Special loans for traditional businesses and artisans
									</p>
									<p class="mb-4 text-lg font-bold text-green-600">Up to ₹10,00,000</p>
									<button
										class="w-full rounded-lg bg-green-600 py-2 text-white transition-colors hover:bg-green-700"
									>
										Apply Now
									</button>
								</div>
							{:else}
								<div class="col-span-2 rounded-lg border bg-gray-50 p-6">
									<div class="text-center text-gray-500">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="mx-auto mb-2 h-12 w-12"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
											/>
										</svg>
										<p class="mb-2 text-lg">Improve your credit score to unlock offers</p>
										<p>
											Complete your profile and build your credit score to access exclusive loan
											offers
										</p>
									</div>
								</div>
							{/if}
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- Main Content - adjust width based on screen size -->
	</div>
</div>

<style>
	/* Smooth scrolling for the entire page */
	:global(html) {
		scroll-behavior: smooth;
	}

	/* Custom scrollbar for sidebar */
	.overflow-y-auto {
		scrollbar-width: thin;
		scrollbar-color: #2563eb #f3f4f6;
	}

	.overflow-y-auto::-webkit-scrollbar {
		width: 6px;
	}

	.overflow-y-auto::-webkit-scrollbar-track {
		background: #f3f4f6;
		border-radius: 3px;
	}

	.overflow-y-auto::-webkit-scrollbar-thumb {
		background-color: #2563eb;
		border-radius: 3px;
		transition: background-color 0.3s ease-in-out;
	}

	.overflow-y-auto::-webkit-scrollbar-thumb:hover {
		background-color: #1d4ed8;
	}
</style>
