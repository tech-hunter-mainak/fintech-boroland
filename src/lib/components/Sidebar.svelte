<script>
	function handleLogout() {
		// Add your logout logic here, e.g., clearing tokens, redirecting, etc.
		console.log('Logout clicked');
	}
</script>

<div class="fixed col-span-1 h-full bg-white">
	<div class="flex h-full w-full flex-col border-r border-r-gray-200 bg-white p-2">
		<div class="mt-16 flex h-full flex-grow flex-col justify-between overflow-x-hidden pb-4 pt-2">
			<div class="mx-1 flex flex-col space-y-1 lg:mt-1">
				<div class="hidden px-5 pt-4 lg:block">
					<div class="flex flex-row items-center">
						<div class="text-xs font-bold tracking-wide text-gray-600">Menu</div>
					</div>
				</div>
				<a
					class="hover:text-primary-400 flex h-12 cursor-pointer flex-row items-center justify-center rounded-md pr-3.5 font-semibold text-gray-500 focus:outline-none lg:justify-start lg:pr-6"
					href="/dashboard"
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
					><span class="ml-0 hidden truncate text-sm capitalize tracking-wide lg:ml-2 lg:block"
						>Dashboard</span
					></a
				><a
					class="hover:text-primary-400 flex h-12 cursor-pointer flex-row items-center justify-center rounded-md pr-3.5 font-semibold text-gray-500 focus:outline-none lg:justify-start lg:pr-6"
					href="/dashboard/score"
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
					><span class="ml-0 hidden truncate text-sm capitalize tracking-wide lg:ml-2 lg:block"
						>Score</span
					></a
				><a
					class="hover:text-primary-400 flex h-12 cursor-pointer flex-row items-center justify-center rounded-md pr-3.5 font-semibold text-gray-500 focus:outline-none lg:justify-start lg:pr-6"
					href="/dashboard/profile"
					><span class="ml-3.5 inline-flex items-center justify-center"
						><svg
							class="h-6 w-4 text-neutral-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							></path>
						</svg></span
					><span class="ml-0 hidden truncate text-sm capitalize tracking-wide lg:ml-2 lg:block"
						>Profile</span
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
				><span class="ml-2 hidden truncate text-sm capitalize tracking-wide lg:block">Logout</span>
			</button>
		</div>
	</div>
</div>
