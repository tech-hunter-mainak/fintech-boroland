<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import CreditScoreForm from '$lib/components/CreditScoreForm.svelte';
	import WhatIsCredit from '$lib/components/WhatIsCredit.svelte';
	import WhyChooseUs from '$lib/components/WhyChooseUs.svelte';
	import Reviews from '$lib/components/Reviews.svelte';
	import FAQ from '$lib/components/FAQ.svelte';
	import Hero from '$lib/components/Hero.svelte';

	let submitted = false;

	onMount(() => {
		// Check if user has credit data
		const creditData = sessionStorage.getItem('creditData');
		if (creditData) {
			// User already has data, redirect to dashboard
			goto('/dashboard');
		}
	});

	const handleSubmit = async (event: CustomEvent) => {
		const { email, mobile } = event.detail;

		// Check if user exists using the API endpoint
		const response = await fetch(
			`/api/users?email=${encodeURIComponent(email)}&mobile=${encodeURIComponent(mobile)}`
		);
		const userData = await response.json();

		// Store basic user data
		sessionStorage.setItem('userData', JSON.stringify(event.detail));

		if (userData?.age) {
			// User has already completed detailed info, go to dashboard
			goto('/dashboard');
		} else {
			// User needs to complete detailed info
			goto('/detailed-info');
		}
	};
</script>

<Hero />

{#if !submitted}
	<main class="bg-gray-100">
		<!-- Hero Section -->
		<section class="min-h-[80vh] bg-gradient-to-r from-blue-600 to-indigo-800">
			<div class="container mx-auto flex items-center px-6 py-12">
				<div class="w-1/2 text-white">
					<h1 class="mb-6 text-5xl font-bold">
						AI‑Powered Credit Assessment for the Bodo Community
					</h1>
					<p class="mb-8 text-xl">
						Customized, Culturally‑Sensitive Credit Scores & Financial Literacy
					</p>
					<div class="mb-8 flex flex-col gap-6">
						<div class="flex items-center">
							<svg class="mr-2 h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
								<path
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								></path>
							</svg>
							<span>Predict credit eligibility using local socio‑economic factors</span>
						</div>
						<div class="flex items-center">
							<svg class="mr-2 h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
								<path
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								></path>
							</svg>
							<span>Real‑time results with no impact on traditional scores</span>
						</div>
						<div class="flex items-center">
							<svg class="mr-2 h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
								<path
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								></path>
							</svg>
							<span>Personalized financial‑literacy modules in native language</span>
						</div>
					</div>
				</div>
				<div class="w-1/2">
					<CreditScoreForm on:submit={handleSubmit} />
				</div>
			</div>
		</section>

		<!-- What is Credit Score Section -->
		<WhatIsCredit />

		<!-- Why Choose Us Section -->
		<WhyChooseUs />

		<!-- Reviews Section -->
		<Reviews />

		<!-- FAQ Section -->
		<FAQ />

		<!-- Footer -->
	</main>
{:else}
	<div
		class="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-800"
	>
		<div class="rounded-lg bg-white p-8 text-center shadow-xl">
			<h2 class="mb-4 text-3xl font-bold">Thank You!</h2>
			<p class="mb-6 text-xl">
				We've received your information and will process your AI-powered credit assessment.
			</p>
			<button
				class="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
				on:click={() => (submitted = false)}
			>
				Check Another Score
			</button>
		</div>
	</div>
{/if}
