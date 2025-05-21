<script lang="ts">
	let openQuestion = '';

	const faqs = [
		{
			id: '1',
			question: 'Who Can Use This?',
			answer:
				'This platform is specifically designed for Bodo individuals & MSMEs in BTR (Bodoland Territorial Region). If you are a member of the Bodo community and need credit assessment, you can use this service.'
		},
		{
			id: '2',
			question: 'Does It Affect My CIBIL Score?',
			answer:
				'No—this is a separate, complementary assessment. Our AI-powered system uses different parameters that are more relevant to the Bodo community, such as vocational skills and local economic factors. Your traditional credit score remains unaffected.'
		},
		{
			id: '3',
			question: 'How Often Can I Check?',
			answer:
				'You can check your score unlimited times for free. Our AI models are refreshed monthly with new data to ensure accuracy and fairness. Each check provides updated recommendations for improving your creditworthiness.'
		},
		{
			id: '4',
			question: 'Is My Data Secure?',
			answer:
				'Yes, your data is fully protected with SSL encryption. We only use anonymized data for model improvements. Your personal information is never shared without your explicit consent.'
		},
		{
			id: '5',
			question: 'How Do I Dispute an Error?',
			answer:
				'You can contact our local liaison officer or raise a ticket via the portal. We have community representatives who speak Bodo and can help resolve any issues. All disputes are reviewed within 48 hours.'
		},
		{
			id: '6',
			question: 'What Makes This Different from Traditional Credit Scores?',
			answer:
				'Our system is specifically designed for the Bodo community, considering factors like traditional skills, seasonal income patterns, and community references. We understand that traditional credit scores might not reflect the true creditworthiness of Bodo individuals.'
		}
	];

	const toggleQuestion = (id: string) => {
		openQuestion = openQuestion === id ? '' : id;
	};
</script>

<div class="bg-gray-50 py-16">
	<div class="container mx-auto px-6">
		<h2 class="mb-12 text-center text-3xl font-bold">Frequently Asked Questions</h2>

		<div class="mx-auto max-w-3xl space-y-4">
			{#each faqs as faq}
				<div class="overflow-hidden rounded-lg bg-white shadow-md">
					<button
						class="flex w-full items-center justify-between px-6 py-4 text-left focus:outline-none"
						on:click={() => toggleQuestion(faq.id)}
					>
						<span class="font-medium">{faq.question}</span>
						<svg
							class="h-5 w-5 transform transition-transform duration-200 {openQuestion === faq.id
								? 'rotate-180'
								: ''}"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</button>
					{#if openQuestion === faq.id}
						<div class="px-6 pb-4">
							<p class="text-gray-600">{faq.answer}</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>
