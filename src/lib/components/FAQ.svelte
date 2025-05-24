<script>
	const general_faqs = [
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
			question: 'What Makes This Different from Traditional Credit Scores?',
			answer:
				'Our system is specifically designed for the Bodo community, considering factors like traditional skills, seasonal income patterns, and community references. We understand that traditional credit scores might not reflect the true creditworthiness of Bodo individuals.'
		}
	];
	const technical_faqs = [
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
		}
	];
	const billing_faqs = [
		{
			id: '6',
			question: 'How Often Can I Check?',
			answer:
				'You can check your score unlimited times for free. Our AI models are refreshed monthly with new data to ensure accuracy and fairness. Each check provides updated recommendations for improving your creditworthiness.'
		}
	];
</script>

<div class="mx-auto max-w-screen-lg py-4">
	<div class="mb-16 text-center">
		<p class="font-regular mt-4 text-sm leading-7 text-gray-500">F.A.Q</p>
		<h3 class="text-3xl font-extrabold leading-normal tracking-tight text-gray-900 sm:text-4xl">
			Frequently Asked <span class="text-indigo-600">Questions</span>
		</h3>
	</div>

	<div class="mb-10 items-start px-10 sm:flex sm:px-16">
		<h3 class="w-3/12 py-3 text-lg font-bold text-gray-900">General</h3>
		<div class="w-9/12">
			{#each general_faqs as faq}
				<div class="mb-8 flex items-start">
					<div
						class="mr-3 hidden min-w-14 items-center justify-center rounded-full border-4 border-white bg-indigo-500 p-3 text-xl font-semibold text-white sm:flex"
					>
						{faq.id}
					</div>
					<div class="text-md">
						<h1 class="mb-2 font-semibold text-gray-900">{faq.question}</h1>
						<p class="text-sm text-gray-500">
							{faq.answer}
						</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
	<div class="mb-10 items-start px-10 sm:flex sm:px-16">
		<h3 class="w-3/12 py-3 text-lg font-bold text-gray-900">Technical</h3>
		<div class="w-9/12">
			{#each technical_faqs as faq}
				<div class="mb-8 flex items-start">
					<div
						class="mr-3 hidden min-w-14 items-center justify-center rounded-full border-4 border-white bg-indigo-500 p-3 text-xl font-semibold text-white sm:flex"
					>
						{faq.id}
					</div>
					<div class="text-md">
						<h1 class="mb-2 font-semibold text-gray-900">{faq.question}</h1>
						<p class="text-sm text-gray-500">
							{faq.answer}
						</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
	<div class="mb-10 items-start px-10 sm:flex sm:px-16">
		<h3 class="w-3/12 py-3 text-lg font-bold text-gray-900">Billing</h3>
		<div class="w-9/12">
			{#each billing_faqs as faq}
				<div class="mb-8 flex items-start">
					<div
						class="mr-3 hidden min-w-14 items-center justify-center rounded-full border-4 border-white bg-indigo-500 p-3 text-xl font-semibold text-white sm:flex"
					>
						{faq.id}
					</div>
					<div class="text-md">
						<h1 class="mb-2 font-semibold text-gray-900">{faq.question}</h1>
						<p class="text-sm text-gray-500">
							{faq.answer}
						</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
