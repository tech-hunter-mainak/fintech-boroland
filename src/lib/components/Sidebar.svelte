<script lang="ts">
	import { page } from '$app/stores';
	import { userSession } from '$lib/stores/userStore';

	const handleLogout = async () => {
		try {
			await fetch('/api/auth', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'logout' })
			});
			userSession.logout();
			window.location.href = '/';
		} catch (error) {
			console.error('Error during logout:', error);
		}
	};

	const navItems = [
		{ label: 'Dashboard', href: '/dashboard', icon: 'mdi:view-dashboard' },
		{ label: 'Score', href: '/dashboard/score', icon: 'mdi:chart-bar' },
		{ label: 'Profile', href: '/dashboard/profile', icon: 'mdi:account-circle' }
	];
</script>

<div class="fixed top-0 left-0 z-40 h-screen w-20 bg-white lg:w-52">
	<div class="flex h-full flex-col border-r border-gray-200 bg-white p-2 pt-16">
		<div class="flex flex-grow flex-col justify-between overflow-y-auto pt-2 pb-4">
			<!-- Menu -->
			<div class="mx-1 flex flex-col space-y-1">
				<div class="hidden px-5 pt-4 lg:block">
					<div class="text-xl pb-4 font-bold tracking-wide text-gray-600">Menu</div>
				</div>

				{#each navItems as item}
					{@const active = $page.url.pathname === item.href}

					<a
						href={item.href}
						class={`group flex h-12 cursor-pointer flex-row items-center justify-center rounded-md pr-3.5 font-semibold focus:outline-none lg:justify-start lg:pr-6 transition-all duration-200 ease-out
							${active
								? 'text-primary-500 border-l-4 bg-primary-200 border-blue-700 shadow-md'
								: 'text-gray-500 hover:text-primary-500 hover:bg-gray-50 hover:border-l-4 hover:border-primary-200'
							}`}
					>
						<span class="ml-3.5 inline-flex items-center justify-center">
							<!-- Example icons using Material Design Icons CDN -->
							<i class={`mdi ${item.icon} text-lg transition-colors ${active
	? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500 shadow-inner'
	: 'text-gray-500 hover:text-blue-500 hover:bg-gray-50 hover:border-l-4 hover:border-blue-500'
}`}></i>
						</span>
						<span class="ml-0 hidden truncate text-sm capitalize tracking-wide lg:ml-2 lg:block">
							{item.label}
						</span>
					</a>
				{/each}
			</div>

			<!-- Logout -->
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
				><span class="ml-2 hidden truncate text-sm capitalize tracking-wide lg:block">Logout</span>
			</button>
			</div>
		</div>
	</div>
</div>
