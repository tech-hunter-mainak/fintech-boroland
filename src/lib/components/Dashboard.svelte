<script lang="ts">
	import { userSession } from '$lib/stores/userStore';
	import { goto } from '$app/navigation';
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

	const handleLogout = () => {
		userSession.logout();
		goto('/');
	};

	const handleNavigation = (itemId: string) => {
		currentView = itemId;
	};

	// Simulate loading
	setTimeout(() => {
		isLoading = false;
	}, 1000);
</script>

<div class="min-h-screen bg-gray-100">
	<!-- Navigation -->
	<nav class="sticky top-0 z-50 bg-white shadow-lg">
		<div class="container mx-auto px-6 py-4">
			<div class="flex items-center justify-between">
				<div
					class="transform text-2xl font-bold text-blue-600 transition-transform duration-300 ease-in-out hover:scale-105"
				>
					Boroland
				</div>
				<div class="flex items-center space-x-6">
					<button
						class="flex transform items-center text-gray-600 transition-colors duration-300 ease-in-out hover:scale-105 hover:text-blue-600"
					>
						<svg class="mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
							></path>
						</svg>
						Download App
					</button>
					<div class="flex items-center space-x-2">
						<span
							class="cursor-pointer text-gray-600 transition-colors duration-300 ease-in-out hover:text-blue-600"
							>English</span
						>
						<span class="text-gray-400">|</span>
						<span
							class="cursor-pointer text-gray-600 transition-colors duration-300 ease-in-out hover:text-blue-600"
							>বড়ো</span
						>
					</div>
					<button
						on:click={handleLogout}
						class="transform rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-gray-300 hover:shadow-md"
					>
						Logout
					</button>
				</div>
			</div>
		</div>
	</nav>

	<!-- Sidebar and Main Content -->
	<div class="container mx-auto px-6 py-8">
		<div class="-mx-4 flex flex-wrap">
			<!-- Sidebar -->
			<div class="w-full px-4 md:w-1/4">
				<div
					class="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-lg bg-white p-6 shadow-md transition-all duration-200"
				>
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
					</ul>
				</div>
			</div>

			<!-- Main Content -->
			<div class="mt-8 w-full px-4 md:mt-0 md:w-3/4">
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
						<div class="mb-8 text-center">
							<h2 class="mb-2 text-2xl font-bold">Hey {userName}!</h2>
							{#if creditData}
								<div class="mt-6 grid grid-cols-1 gap-8 md:grid-cols-3">
									<!-- Credit Score Circle -->
									<div class="text-center">
										<div class="relative mx-auto mb-4 h-40 w-40">
											<svg viewBox="0 0 36 36" class="h-full w-full">
												<path
													d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
													fill="none"
													stroke="#E5E7EB"
													stroke-width="3"
												/>
												<path
													d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
													fill="none"
													stroke={creditData.score >= 70
														? '#10B981'
														: creditData.score >= 50
															? '#F59E0B'
															: '#EF4444'}
													stroke-width="3"
													stroke-dasharray={`${creditData.score}, 100`}
												/>
												<text
													x="18"
													y="16"
													class="text-4xl font-bold"
													text-anchor="middle"
													dominant-baseline="middle"
													fill="currentColor"
												>
													{creditData.score}
												</text>
												<text
													x="18"
													y="24"
													class="text-[8px]"
													text-anchor="middle"
													dominant-baseline="middle"
													fill="currentColor"
												>
													%
												</text>
											</svg>
										</div>
										<p class="text-gray-600">Credit Score</p>
									</div>

									<!-- Status -->
									<div class="space-y-4">
										<div>
											<h3 class="mb-1 text-sm text-gray-500">Status</h3>
											<p
												class="text-lg font-semibold {creditData.isSelected
													? 'text-green-600'
													: 'text-red-600'}"
											>
												{creditData.isSelected ? 'Approved' : 'Not Approved'}
											</p>
										</div>
										<div>
											<h3 class="mb-1 text-sm text-gray-500">Last Updated</h3>
											<p class="font-semibold">{new Date().toLocaleDateString()}</p>
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
								<p class="mt-4 text-gray-600">{creditData.reason}</p>
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
											<span class="font-semibold">₹{userData.monthlyFamilyIncome}</span>
										</div>
										<div class="flex items-center justify-between">
											<span class="text-gray-600">Education</span>
											<span class="font-semibold">{userData.education || 'N/A'}</span>
										</div>
										<div class="flex items-center justify-between">
											<span class="text-gray-600">Skills</span>
											<span class="font-semibold">{userData.skills?.[0]?.skill || 'N/A'}</span>
										</div>
									</div>
									<div class="space-y-4">
										<div class="flex items-center justify-between">
											<span class="text-gray-600">Monthly Expenses</span>
											<span class="font-semibold">₹{userData.monthlyFamilyExpenditure}</span>
										</div>
										<div class="flex items-center justify-between">
											<span class="text-gray-600">Certifications</span>
											<span class="font-semibold">{userData.hasCertification || 'No'}</span>
										</div>
										<div class="flex items-center justify-between">
											<span class="text-gray-600">Assets</span>
											<span class="font-semibold">{userData.ownership?.join(', ') || 'None'}</span>
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
							{#if creditData?.isSelected}
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
