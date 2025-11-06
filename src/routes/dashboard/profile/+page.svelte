<script>
	import { onMount } from 'svelte';
	// export let data;
	let { data } = $props();
	let { user, email, id } = $derived(data);
    console.log(user);
</script>

<div class="flex min-h-[90vh] items-center justify-center">
	<!-- Card Container -->
	<div class="mx-4 w-full max-w-md overflow-hidden rounded-xl bg-white shadow-lg md:max-w-2xl">
		<!-- Card Header with Gradient Background -->
		<div class="h-2 bg-gradient-to-r from-violet-500 to-violet-400"></div>

		<!-- Card Content -->
		<div class="p-8">
			<!-- Profile Section -->
			<div class="flex items-center">
				<!-- Avatar -->
				<div class="flex-shrink-0">
					<div class="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100">
						<span class="text-2xl font-bold text-violet-600">MD</span>
					</div>
				</div>

				<!-- Name and Title -->
				<div class="ml-4">
					<p class="text-gray-600">User Name</p>
					<h2 class="text-xl font-bold text-gray-800">{user.full_name}</h2>
				</div>
			</div>

			<!-- Divider -->
			<div class="my-6 border-t border-gray-200"></div>

			<!-- Contact Information -->
			<div class="space-y-4">
				<!-- Phone -->
				<div class="flex items-center">
					<div class="flex h-10 w-10 items-center justify-center rounded-full bg-violet-50">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 text-violet-500"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
							/>
						</svg>
					</div>
					<div class="ml-3">
						<p class="text-sm font-medium text-gray-500">Phone</p>
						<p class="text-gray-700">+91 {user.mobile}</p>
					</div>
				</div>

				<!-- Email -->
				<div class="flex items-center">
					<div class="flex h-10 w-10 items-center justify-center rounded-full bg-violet-50">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 text-violet-500"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							/>
						</svg>
					</div>
					<div class="ml-3">
						<p class="text-sm font-medium text-gray-500">Email</p>
						<p class="text-gray-700">{user.email}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
