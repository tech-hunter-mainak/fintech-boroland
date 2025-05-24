<script lang="ts">
	const reviews = [
		{
			name: 'Bishnu Basumatary',
			rating: 5,
			comment: 'Helped me get a loan for my weaving business',
			longComment:
				'The AI system understood my traditional weaving skills and seasonal income pattern. Thanks to this assessment, I got a loan to expand my handloom business. The financial literacy modules in Bodo language were very helpful.',
			date: 'March 15, 2024'
		},
		{
			name: 'Ranjita Narzary',
			rating: 5,
			comment: 'Finally, a credit system that understands our community',
			longComment:
				"Traditional banks never understood our way of life, but this platform considers our skills and cultural practices. I received a fair credit assessment and valuable financial advice in our language. Now I can plan better for my family's future.",
			date: 'March 14, 2024'
		},
		{
			name: 'Dwimalu Brahma',
			rating: 5,
			comment: 'Great support from local representatives',
			longComment:
				'The local liaison officers speak our language and understand our needs. They helped me complete the assessment and explained everything clearly. The WhatsApp updates in Bodo language keep me informed about my credit progress.',
			date: 'March 13, 2024'
		}
	];
</script>

<div class="bg-white py-16">
	<div class="container mx-auto px-6">
		<div class="mb-12 flex flex-col items-center justify-between">
			<h2 class="text-3xl font-bold">Community Success Stories</h2>
			<div class="flex items-center">
				<div class="flex">
					{#each Array(5) as _, i}
						<svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
							<path
								d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
							></path>
						</svg>
					{/each}
				</div>
				<span class="ml-2 text-gray-600">4.9/5 stars from our community members</span>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
			{#each reviews as review}
				<div class="rounded-lg bg-white p-6 shadow-lg">
					<div class="mb-4 flex items-center">
						<div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
							<svg
								class="h-6 w-6 text-blue-600"
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
							</svg>
						</div>
						<div class="ml-4">
							<h3 class="font-semibold">{review.name}</h3>
							<div class="flex">
								{#each Array(review.rating) as _}
									<svg class="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
										<path
											d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
										></path>
									</svg>
								{/each}
							</div>
						</div>
					</div>
					<h4 class="mb-2 font-medium">{review.comment}</h4>
					<p class="mb-4 text-sm text-gray-600">"{review.longComment}"</p>
					<p class="text-sm text-gray-400">{review.date}</p>
				</div>
			{/each}
		</div>

		<div class="mt-8 text-center">
			<button
				class="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
			>
				Share Your Story
			</button>
		</div>
	</div>
</div>
