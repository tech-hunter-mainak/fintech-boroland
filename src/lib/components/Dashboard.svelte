<script lang="ts">
	import { userSession } from '$lib/stores/userStore';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import MyProfile from './MyProfile.svelte';

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

<div class="min-h-screen bg-gray-100">
	<!-- Sidebar and Main Content -->
	<div class="container mx-auto mt-[1.5rem] px-6 py-8 lg:mt-0">
		<div class="-mx-4 flex flex-wrap">
			<!-- Sidebar - hide on small screens -->
			{#if !isSmallScreen}
				<div class="w-full px-4 lg:w-1/4">
					<div
						class="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-lg bg-white p-6 shadow-md transition-all duration-200"
					>
						<!-- Add application logo on top -->
						<div class="mb-6 text-center">
							<h1 class="text-2xl font-bold text-blue-600">Boroland</h1>
						</div>

						<ul class="space-y-4">
							{#each sidebarItems as item}
								<li>
									<button
										on:click={() => handleNavigation(item.id)}
										class="flex w-full transform items-center text-gray-600 transition-all duration-300 ease-in-out hover:translate-x-2 hover:text-blue-600 {currentView ===
										item.id
											? 'text-blue-600'
											: ''}"
									>
										<svg
											class="mr-3 h-5 w-5 transform transition-transform duration-300 ease-in-out group-hover:rotate-12"
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
										<span class="transition-all duration-300 ease-in-out">{item.text}</span>
										{#if item.badge}
											<span
												class="ml-2 transform rounded-full bg-red-100 px-2 py-1 text-xs text-red-600 transition-all duration-300 ease-in-out hover:scale-110"
												>{item.badge}</span
											>
										{/if}
									</button>
								</li>
							{/each}

							<!-- Add logout button at the bottom of sidebar -->
							<li class="mt-8 border-t pt-4">
								<button
									on:click={handleLogout}
									class="flex w-full transform items-center text-red-500 transition-all duration-300 ease-in-out hover:translate-x-2 hover:text-red-600"
								>
									<svg class="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
					</div>
				</div>
			{/if}

			<!-- Main Content - adjust width based on screen size -->
			<div class="mt-8 w-full px-4 lg:mt-0 {isSmallScreen ? 'w-full' : 'lg:w-3/4'}">
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
