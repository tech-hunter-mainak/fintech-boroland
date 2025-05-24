<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import {
		CreditScoreForm,
		LoginForm,
		WhatIsCredit,
		WhyChooseUs,
		Reviews,
		FAQ,
		Hero
	} from '$lib/components';

	// Get page data from server
	export let data;

	let submitted = false;
	let formType: 'login' | 'register' = 'register';

	onMount(() => {
		// Check if user has a session cookie
		const hasCookie = document.cookie.includes('session=');

		// If there's session data, show login form
		if (hasCookie && !data.user) {
			formType = 'login';
		}

		// If user is fully authenticated, redirect to dashboard
		if (data.user) {
			goto('/dashboard');
		}
	});

	const handleSubmit = async (event: CustomEvent) => {
		const { gender, fullName, email, mobile, password, whatsappUpdates } = event.detail;

		try {
			// Register user with the authentication system
			const response = await fetch('/api/auth', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					action: 'register',
					userData: {
						gender,
						fullName,
						email,
						mobile,
						password,
						whatsappUpdates
					}
				})
			});

			const result = await response.json();

			if (result.success) {
				// Store basic user data for the next step
				sessionStorage.setItem(
					'userData',
					JSON.stringify({
						authUserId: result.user.id,
						gender,
						fullName,
						email,
						mobile,
						whatsappUpdates
					})
				);

				// Redirect to more detailed info
				goto('/detailed-info');
			} else {
				alert(result.error || 'Registration failed. Please try again.');
			}
		} catch (error) {
			console.error('Error handling form submission:', error);
			alert('Registration failed. Please try again.');
		}
	};

	const handleLogin = async (event: CustomEvent) => {
		const { identifier, password, rememberMe } = event.detail;

		try {
			// Call auth API to handle login
			console.log('Sending login request with identifier:', identifier);

			const response = await fetch('/api/auth', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					action: 'login',
					credentials: {
						identifier,
						password
					},
					rememberMe
				})
			});

			const result = await response.json();

			if (result.success) {
				// Check if user has submitted detailed info
				if (result.hasDetailedInfo) {
					console.log('User has submitted detailed info, redirecting to dashboard');
					// Redirect to dashboard if detailed info is submitted
					goto('/dashboard');
				} else {
					console.log('User has not submitted detailed info, redirecting to detailed-info page');
					// Redirect to detailed-info form if not submitted

					// Save basic info to session storage for the detailed-info page
					sessionStorage.setItem(
						'userData',
						JSON.stringify({
							authUserId: result.user.id,
							gender: result.user.gender,
							fullName: result.user.fullName,
							email: result.user.email,
							mobile: result.user.mobile,
							whatsappUpdates: result.user.whatsappUpdates
						})
					);

					goto('/detailed-info');
				}
			} else {
				// If the login component is using a reactive variable to show login status,
				// you need to dispatch an event back to the component
				document.dispatchEvent(
					new CustomEvent('login-error', {
						detail: { message: result.error || 'Login failed. Please check your credentials.' }
					})
				);

				alert(result.error || 'Login failed. Please check your credentials.');
			}
		} catch (error) {
			console.error('Error during login:', error);

			// Reset login status in the component
			document.dispatchEvent(
				new CustomEvent('login-error', {
					detail: { message: 'Login failed. Please try again.' }
				})
			);

			alert('Login failed. Please try again.');
		}
	};

	const switchForm = (event: CustomEvent) => {
		const { action } = event.detail;
		formType = action;
	};
</script>

{#if !submitted}
	<section class="-mt-20 min-h-[80vh] bg-gradient-to-r from-blue-600 to-indigo-800 pb-10 pt-20">
		<div class="container mx-auto flex items-center gap-10 px-6 py-12">
			<div class="w-1/2 text-white">
				<h1 class="mb-6 text-5xl font-bold">AI‑Powered Credit Assessment for the Bodo Community</h1>
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
				{#if formType === 'register'}
					<CreditScoreForm on:submit={handleSubmit} on:switchForm={switchForm} />
				{:else}
					<LoginForm on:login={handleLogin} on:switchForm={switchForm} />
				{/if}
			</div>
		</div>
	</section>
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
