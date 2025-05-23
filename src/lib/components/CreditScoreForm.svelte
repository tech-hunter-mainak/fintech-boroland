<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let gender: string = '';
	let fullName: string = '';
	let email: string = '';
	let mobile: string = '';
	let password: string = '';
	let confirmPassword: string = '';
	let acceptTerms: boolean = false;
	let whatsappUpdates: boolean = false;
	let mobileDigits: number = 0;
	let otpSent: boolean = false;
	let otp: string = '';
	let isVerified: boolean = false;
	let showPasswordFields: boolean = false;

	const handleMobileInput = (event: Event) => {
		const input = event.target as HTMLInputElement;
		let digits = input.value.replace(/\D/g, '');

		// Ensure the number starts with valid Indian prefixes
		if (digits.length > 0) {
			if (!['6', '7', '8', '9'].includes(digits[0])) {
				digits = '';
			}
		}

		// Limit to 10 digits
		digits = digits.slice(0, 10);

		mobileDigits = digits.length;
		mobile = digits;
	};

	const isValidMobile = (number: string) => {
		return /^[6-9]\d{9}$/.test(number);
	};

	const isValidEmail = (email: string) => {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	};

	const sendOTP = async () => {
		// Validate email before sending OTP
		if (!isValidEmail(email)) {
			alert('Please enter a valid email address');
			return;
		}

		try {
			// In a real app, make API call to send OTP to email
			otpSent = true;
			alert(`OTP sent to your email address: ${email}`);
		} catch (error) {
			alert('Failed to send OTP. Please try again.');
		}
	};

	const verifyOTP = async () => {
		// Simulate OTP verification
		try {
			// In real implementation, make API call to verify OTP
			if (otp.length === 6) {
				isVerified = true;
				showPasswordFields = true; // Show password fields after verification
			} else {
				alert('Please enter a valid 6-digit OTP');
			}
		} catch (error) {
			alert('Invalid OTP. Please try again.');
		}
	};

	// Password validation
	$: passwordsMatch = password === confirmPassword;
	$: passwordStrong = password.length >= 8;

	const handleSubmit = async () => {
		if (!gender || !fullName || !email || !acceptTerms || !isVerified) {
			return;
		}

		// Additional validation for the password stage
		if (showPasswordFields && (!password || !passwordStrong || !passwordsMatch)) {
			alert('Please ensure password is at least 8 characters and both passwords match');
			return;
		}

		try {
			// Dispatch the form data to the parent component
			dispatch('submit', {
				gender,
				fullName,
				email,
				mobile,
				password,
				whatsappUpdates
			});
		} catch (error) {
			console.error('Error submitting form:', error);
			alert('Failed to submit your information. Please try again.');
		}
	};

	const switchToLogin = () => {
		dispatch('switchForm', { action: 'login' });
	};
</script>

<div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
	<div class="mb-6 text-center">
		<h2 class="text-2xl font-bold text-gray-800">Check FREE CIBIL Score</h2>
		<p class="text-gray-600">Instant Access to Credit Report</p>
	</div>

	<div class="mb-6 flex items-center justify-between text-sm">
		<div class="flex items-center">
			<svg class="mr-2 h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
				<path
					d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
				></path>
			</svg>
			<span>Free monthly updates</span>
		</div>
		<div class="flex items-center">
			<svg class="mr-2 h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
				<path
					d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
				></path>
			</svg>
			<span>No impact on score</span>
		</div>
	</div>

	<form class="space-y-4" on:submit|preventDefault={handleSubmit}>
		{#if !showPasswordFields}
			<!-- Registration form - first stage -->
			<!-- Gender -->
			<div class="mb-4 flex gap-4">
				<label class="flex flex-1 items-center">
					<input
						type="radio"
						bind:group={gender}
						value="M"
						class="form-radio h-4 w-4 text-blue-600"
					/>
					<span class="ml-2">Male</span>
				</label>
				<label class="flex flex-1 items-center">
					<input
						type="radio"
						bind:group={gender}
						value="F"
						class="form-radio h-4 w-4 text-blue-600"
					/>
					<span class="ml-2">Female</span>
				</label>
			</div>

			<!-- Full Name -->
			<div>
				<input
					type="text"
					bind:value={fullName}
					placeholder="Full Name (as per bank records)"
					class="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
					required
				/>
			</div>

			<!-- Email -->
			<div>
				<input
					type="email"
					bind:value={email}
					placeholder="Email Address"
					class="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 {!isValidEmail(
						email
					) && email
						? 'border-red-500'
						: ''}"
					required
				/>
				{#if email && !isValidEmail(email)}
					<p class="mt-1 text-xs text-red-500">Please enter a valid email address</p>
				{:else}
					<p class="mt-1 text-xs text-gray-500">We'll send an OTP to verify this email</p>
				{/if}
			</div>

			<!-- Mobile -->
			<div>
				<div class="relative">
					<input
						type="tel"
						bind:value={mobile}
						on:input={handleMobileInput}
						placeholder="Mobile Number"
						maxlength="10"
						class="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 {!isValidMobile(
							mobile
						) && mobile
							? 'border-red-500'
							: ''}"
						required
					/>
					<span
						class="absolute right-3 top-1/2 -translate-y-1/2 text-xs {mobileDigits === 10 &&
						isValidMobile(mobile)
							? 'text-green-500'
							: 'text-gray-400'}"
					>
						{mobileDigits}/10
					</span>
				</div>
				<p class="mt-1 text-xs text-gray-500">Required for account security</p>
			</div>

			<!-- OTP Section -->
			{#if !isVerified}
				<div class="space-y-3">
					{#if !otpSent}
						<button
							type="button"
							on:click={sendOTP}
							disabled={!isValidEmail(email)}
							class="w-full rounded-md bg-blue-600 py-2 text-sm text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
						>
							Send OTP to Email
						</button>
					{:else}
						<div class="space-y-2">
							<input
								type="text"
								bind:value={otp}
								placeholder="Enter 6-digit OTP"
								maxlength="6"
								class="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
							/>
							<div class="flex justify-between text-xs">
								<button type="button" on:click={sendOTP} class="text-blue-600 hover:underline">
									Resend OTP
								</button>
								<button type="button" on:click={verifyOTP} class="text-blue-600 hover:underline">
									Verify OTP
								</button>
							</div>
						</div>
					{/if}
				</div>
			{/if}
		{:else}
			<!-- Password stage - after email verification -->
			<!-- Password -->
			<div>
				<input
					type="password"
					bind:value={password}
					placeholder="Create Password (min. 8 characters)"
					class="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 {password &&
					!passwordStrong
						? 'border-red-500'
						: ''}"
					required
				/>
				{#if password && !passwordStrong}
					<p class="mt-1 text-xs text-red-500">Password must be at least 8 characters</p>
				{/if}
			</div>

			<!-- Confirm Password -->
			<div>
				<input
					type="password"
					bind:value={confirmPassword}
					placeholder="Confirm Password"
					class="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 {confirmPassword &&
					!passwordsMatch
						? 'border-red-500'
						: ''}"
					required
				/>
				{#if confirmPassword && !passwordsMatch}
					<p class="mt-1 text-xs text-red-500">Passwords do not match</p>
				{/if}
			</div>
		{/if}

		<!-- Terms -->
		<div class="space-y-3">
			<label class="flex items-start gap-2">
				<input
					type="checkbox"
					bind:checked={acceptTerms}
					class="form-checkbox mt-1 h-4 w-4 text-blue-600"
					required
				/>
				<span class="text-xs text-gray-600">
					By proceeding, I agree to provide personal details and authorize Boroland to obtain my
					Credit Score/Profile from Cibil / Equifax / Experian / CRIF Highmark/bureau(s).
				</span>
			</label>

			<label class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<img src="/whatsapp-icon.svg" alt="WhatsApp" class="h-5 w-5" />
					<span class="text-sm text-gray-700">Get updates on WhatsApp</span>
				</div>
				<div class="relative inline-flex cursor-pointer items-center">
					<input type="checkbox" bind:checked={whatsappUpdates} class="peer sr-only" />
					<div
						class="peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300"
					></div>
				</div>
			</label>
		</div>

		<button
			type="submit"
			disabled={showPasswordFields
				? !gender ||
					!fullName ||
					!email ||
					!acceptTerms ||
					!isVerified ||
					!password ||
					!passwordStrong ||
					!passwordsMatch
				: !gender || !fullName || !email || !acceptTerms || !isVerified}
			class="w-full rounded-md bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
		>
			Get Free Credit Report
		</button>
	</form>

	<div class="mt-4 text-center">
		<p class="text-sm text-gray-600">
			Already registered?
			<button type="button" on:click={switchToLogin} class="text-blue-600 hover:underline">
				Login here
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
