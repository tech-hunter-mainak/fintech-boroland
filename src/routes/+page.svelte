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
		Hero,
		Features,
		About,
		WhyUs
	} from '$lib/components';
</script>

<Hero />

<About />

<!-- What is Credit Score Section -->
<!-- <WhatIsCredit /> -->
<Features />

<!-- Why Choose Us Section -->
<WhyUs />

<!-- Reviews Section -->
<Reviews />

<!-- FAQ Section -->
<FAQ />
