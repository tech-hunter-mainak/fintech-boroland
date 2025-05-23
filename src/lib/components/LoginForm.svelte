<script lang="ts">
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';

	const dispatch = createEventDispatcher();

	let identifier: string = ''; // Email or mobile
	let password: string = '';
	let rememberMe: boolean = false;
	let forgotPassword: boolean = false;
	let resetEmail: string = '';
	let showValidationError: boolean = false;
	let validationMessage: string = '';
	let isLoggingIn: boolean = false;

	// Handle login errors from parent component
	const handleLoginError = (event: Event) => {
		isLoggingIn = false;
		const customEvent = event as CustomEvent;
		validationMessage = customEvent.detail?.message || 'Login failed';
		showValidationError = true;
	};

	onMount(() => {
		// Listen for login errors from parent component
		document.addEventListener('login-error', handleLoginError as EventListener);
	});

	onDestroy(() => {
		// Clean up event listener
		document.removeEventListener('login-error', handleLoginError as EventListener);
	});

	// Determine if the identifier is an email or mobile
	$: isEmail = identifier.includes('@');
	$: isMobile = /^[6-9]\d{9}$/.test(identifier);
	$: isValidIdentifier = isEmail || isMobile;

	// Format the mobile number while typing
	const handleIdentifierInput = () => {
		// If it starts with numbers and doesn't have @ symbol, assume it's a mobile number
		if (!identifier.includes('@') && /^\d+$/.test(identifier)) {
			// Ensure the mobile number follows Indian format
			if (identifier.length > 0 && !['6', '7', '8', '9'].includes(identifier[0])) {
				validationMessage = 'Mobile number must start with 6, 7, 8, or 9';
				showValidationError = true;
			} else if (identifier.length > 10) {
				// Truncate to 10 digits if longer
				identifier = identifier.slice(0, 10);
			} else {
				showValidationError = false;
			}
		} else if (identifier.includes('@')) {
			// Basic email validation
			if (!/\S+@\S+\.\S+/.test(identifier)) {
				validationMessage = 'Please enter a valid email address';
				showValidationError = true;
			} else {
				showValidationError = false;
			}
		} else {
			showValidationError = false;
		}
	};

	const handleLogin = async () => {
		if (!isValidIdentifier) {
			validationMessage = 'Please enter a valid email address or mobile number';
			showValidationError = true;
			return;
		}

		if (!password) {
			validationMessage = 'Please enter your password';
			showValidationError = true;
			return;
		}

		showValidationError = false;
		isLoggingIn = true;

		try {
			// Dispatch login event with credentials
			dispatch('login', { identifier, password, rememberMe });
		} catch (error) {
			alert('Login failed. Please try again.');
			isLoggingIn = false;
		}
	};

	const handleResetPassword = async () => {
		if (!resetEmail.includes('@')) {
			alert('Please enter a valid email address');
			return;
		}

		// In a real app, make API call to send password reset email
		alert(`Password reset link sent to ${resetEmail}`);
		forgotPassword = false;
	};

	const switchToRegister = () => {
		dispatch('switchForm', { action: 'register' });
	};
</script>

<div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
	<div class="mb-6 text-center">
		<h2 class="text-2xl font-bold text-gray-800">Welcome Back</h2>
		<p class="text-gray-600">Login to view your credit report</p>
	</div>

	{#if !forgotPassword}
		<form class="space-y-4" on:submit|preventDefault={handleLogin}>
			<!-- Email/Mobile -->
			<div>
				<input
					type="text"
					bind:value={identifier}
					on:input={handleIdentifierInput}
					placeholder="Email Address or Mobile Number"
					class="w-full rounded-md border {showValidationError
						? 'border-red-500'
						: 'border-gray-300'} px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
					required
				/>
				{#if showValidationError}
					<p class="mt-1 text-xs text-red-500">{validationMessage}</p>
				{:else if identifier}
					<p class="mt-1 text-xs text-gray-500">
						{#if isEmail}
							Using email address for login
						{:else if isMobile}
							Using mobile number for login
						{:else}
							Enter your registered email or mobile number
						{/if}
					</p>
				{/if}
			</div>

			<!-- Password -->
			<div>
				<input
					type="password"
					bind:value={password}
					placeholder="Password"
					class="w-full rounded-md border {!password && showValidationError
						? 'border-red-500'
						: 'border-gray-300'} px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
					required
				/>
				<div class="mt-1 flex justify-between text-xs">
					<label class="inline-flex cursor-pointer items-center">
						<input type="checkbox" bind:checked={rememberMe} class="form-checkbox text-blue-600" />
						<span class="ml-1 text-gray-600">Remember me</span>
					</label>
					<button
						type="button"
						on:click={() => (forgotPassword = true)}
						class="text-blue-600 hover:underline"
					>
						Forgot password?
					</button>
				</div>
			</div>

			<button
				type="submit"
				class="w-full rounded-md bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
				disabled={isLoggingIn || !isValidIdentifier || !password}
			>
				{isLoggingIn ? 'Logging in...' : 'Login'}
			</button>
		</form>
	{:else}
		<!-- Password Reset Form -->
		<form class="space-y-4" on:submit|preventDefault={handleResetPassword}>
			<h3 class="text-lg font-medium text-gray-700">Reset Password</h3>
			<p class="text-sm text-gray-600">
				Enter your email address below to receive a password reset link.
			</p>

			<div>
				<input
					type="email"
					bind:value={resetEmail}
					placeholder="Email Address"
					class="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
					required
				/>
			</div>

			<div class="flex space-x-2">
				<button
					type="submit"
					class="flex-1 rounded-md bg-blue-600 py-2 font-medium text-white transition-colors hover:bg-blue-700"
				>
					Send Reset Link
				</button>
				<button
					type="button"
					on:click={() => (forgotPassword = false)}
					class="flex-1 rounded-md border border-gray-300 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
				>
					Cancel
				</button>
			</div>
		</form>
	{/if}

	<div class="mt-4 text-center">
		<p class="text-sm text-gray-600">
			New user?
			<button type="button" on:click={switchToRegister} class="text-blue-600 hover:underline">
				Register here
			</button>
		</p>
	</div>

	<div class="mt-4 flex items-center justify-center text-xs text-gray-500">
		<svg class="mr-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
			<path
				fill-rule="evenodd"
				d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
				clip-rule="evenodd"
			></path>
		</svg>
		Your information is 100% secure with us
	</div>
</div>
