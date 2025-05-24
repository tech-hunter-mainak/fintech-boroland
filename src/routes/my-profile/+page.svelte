<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { userSession } from '$lib/stores/userStore';

	let userData: any = null;

	onMount(() => {
		const unsubscribe = userSession.subscribe((session) => {
			if (!session.isLoggedIn) {
				goto('/');
				return;
			}
			userData = session.user;
		});

		return () => {
			unsubscribe();
		};
	});

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return {
			day: date.getDate().toString().padStart(2, '0'),
			month: (date.getMonth() + 1).toString().padStart(2, '0'),
			year: date.getFullYear()
		};
	};
</script>

<div class="min-h-screen bg-gray-100">
	<!-- Main Content -->
	<main class="container mx-auto px-4 py-8">
		{#if 1}
			<div class="overflow-hidden rounded-lg bg-white shadow-md">
				<!-- Header -->
				<div class="bg-gray-600 p-4 text-white">
					<h1 class="text-xl font-semibold">My Profile</h1>
				</div>

				<!-- Personal Details Section -->
				<div class="p-6">
					<div class="mb-8">
						<div class="mb-6 flex items-center">
							<svg
								class="mr-2 h-6 w-6 text-gray-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
								/>
							</svg>
							<h2 class="text-lg font-semibold">Personal Details</h2>
						</div>

						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div>
								<label class="mb-1 block text-sm text-gray-600">YOUR NAME</label>
								<div class="flex gap-2">
									<span class="text-gray-800">Mr</span>
									<span class="text-gray-800">{userData.name || userData.fullName}</span>
								</div>
							</div>

							<div>
								<label class="mb-1 block text-sm text-gray-600">BIRTHDAY</label>
								<div class="flex gap-2">
									<span class="text-gray-800"
										>{formatDate(userData.dateOfBirth || userData.dob).day}</span
									>
									<span class="text-gray-400">/</span>
									<span class="text-gray-800"
										>{formatDate(userData.dateOfBirth || userData.dob).month}</span
									>
									<span class="text-gray-400">/</span>
									<span class="text-gray-800"
										>{formatDate(userData.dateOfBirth || userData.dob).year}</span
									>
								</div>
							</div>

							<div>
								<label class="mb-1 block text-sm text-gray-600">EMAIL ADDRESS</label>
								<span class="text-gray-800">{userData.email}</span>
							</div>

							<div>
								<label class="mb-1 block text-sm text-gray-600">MOBILE NO</label>
								<span class="text-gray-800">{userData.mobile}</span>
							</div>

							<div>
								<label class="mb-1 block text-sm text-gray-600">ADDRESS</label>
								<span class="text-gray-800">{userData.address || 'Not provided'}</span>
							</div>

							<div>
								<label class="mb-1 block text-sm text-gray-600">PINCODE</label>
								<span class="text-gray-800">{userData.pincode || 'Not provided'}</span>
							</div>

							<div>
								<label class="mb-1 block text-sm text-gray-600">CITY</label>
								<span class="text-gray-800">{userData.city || 'Not provided'}</span>
							</div>

							<div>
								<label class="mb-1 block text-sm text-gray-600">PAN CARD</label>
								<span class="text-gray-800">{userData.panCard || 'Not provided'}</span>
							</div>
						</div>
					</div>

					<!-- Employer Details Section -->
					<div>
						<div class="mb-6 flex items-center">
							<svg
								class="mr-2 h-6 w-6 text-gray-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
								/>
							</svg>
							<h2 class="text-lg font-semibold">Employer Details</h2>
						</div>

						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div>
								<label class="mb-1 block text-sm text-gray-600">EMPLOYMENT TYPE</label>
								<span class="text-gray-800"
									>{userData.employmentType || 'Self Employed Professional'}</span
								>
							</div>

							<div>
								<label class="mb-1 block text-sm text-gray-600">PROFESSION TYPE</label>
								<span class="text-gray-800">{userData.professionType || 'Other'}</span>
							</div>

							<div>
								<label class="mb-1 block text-sm text-gray-600">ANNUAL TURNOVER</label>
								<span class="text-gray-800"
									>₹{userData.monthlyFamilyIncome * 12 || 'Not provided'}</span
								>
							</div>
						</div>
					</div>

					<!-- Save Button -->
					<div class="mt-8">
						<button
							class="w-full rounded-lg bg-blue-600 py-3 text-white transition-colors hover:bg-blue-700"
						>
							Save
						</button>
					</div>
				</div>
			</div>
		{:else}
			<div class="py-12 text-center">
				<div
					class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"
				></div>
				<p class="text-gray-600">Loading your profile...</p>
			</div>
		{/if}
	</main>
</div>
