<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import CreditScoreForm from '../components/CreditScoreForm.svelte';
  import WhatIsCredit from '../components/WhatIsCredit.svelte';
  import WhyChooseUs from '../components/WhyChooseUs.svelte';
  import Reviews from '../components/Reviews.svelte';
  import FAQ from '../components/FAQ.svelte';
  
  let submitted = false;

  onMount(() => {
    // Check if user has credit data
    const creditData = sessionStorage.getItem('creditData');
    if (creditData) {
      // User already has data, redirect to dashboard
      goto('/dashboard');
    }
  });

  const handleSubmit = async (event: CustomEvent) => {
    const { email, mobile } = event.detail;
    
    // Check if user exists using the API endpoint
    const response = await fetch(`/api/users?email=${encodeURIComponent(email)}&mobile=${encodeURIComponent(mobile)}`);
    const userData = await response.json();
    
    // Store basic user data
    sessionStorage.setItem('userData', JSON.stringify(event.detail));

    if (userData?.age) {
      // User has already completed detailed info, go to dashboard
      goto('/dashboard');
    } else {
      // User needs to complete detailed info
      goto('/detailed-info');
    }
  };
</script>

{#if !submitted}
<main class="bg-gray-100">
  <!-- Hero Section -->
  <section class="min-h-[80vh] bg-gradient-to-r from-blue-600 to-indigo-800">
    <div class="container mx-auto px-6 py-12 flex items-center">
      <div class="w-1/2 text-white">
        <h1 class="text-5xl font-bold mb-6">AI‑Powered Credit Assessment for the Bodo Community</h1>
        <p class="text-xl mb-8">Customized, Culturally‑Sensitive Credit Scores & Financial Literacy</p>
        <div class="flex flex-col gap-6 mb-8">
          <div class="flex items-center">
            <svg class="w-8 h-8 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path>
            </svg>
            <span>Predict credit eligibility using local socio‑economic factors</span>
          </div>
          <div class="flex items-center">
            <svg class="w-8 h-8 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path>
            </svg>
            <span>Real‑time results with no impact on traditional scores</span>
          </div>
          <div class="flex items-center">
            <svg class="w-8 h-8 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path>
            </svg>
            <span>Personalized financial‑literacy modules in native language</span>
          </div>
        </div>
      </div>
      <div class="w-1/2">
        <CreditScoreForm on:submit={handleSubmit} />
      </div>
    </div>
  </section>

  <!-- What is Credit Score Section -->
  <WhatIsCredit />

  <!-- Why Choose Us Section -->
  <WhyChooseUs />

  <!-- Reviews Section -->
  <Reviews />

  <!-- FAQ Section -->
  <FAQ />

  <!-- Footer -->
  <footer class="bg-gray-900 text-white py-12">
    <div class="container mx-auto px-6">
      <div class="grid grid-cols-4 gap-8">
        <div>
          <h3 class="text-xl font-bold mb-4">About Us</h3>
          <p>Your trusted partner in AI-powered credit assessment for the Bodo community.</p>
        </div>
        <div>
          <h3 class="text-xl font-bold mb-4">Quick Links</h3>
          <ul>
            <li class="mb-2"><a href="/" class="hover:text-blue-400">Home</a></li>
            <li class="mb-2"><a href="/credit-score" class="hover:text-blue-400">Check Credit Score</a></li>
            <li class="mb-2"><a href="/financial-literacy" class="hover:text-blue-400">Financial Literacy</a></li>
          </ul>
        </div>
        <div>
          <h3 class="text-xl font-bold mb-4">Contact</h3>
          <ul>
            <li class="mb-2">Email: support@boroland.com</li>
            <li class="mb-2">Phone: 1800-XXX-XXXX</li>
            <li class="mb-2">WhatsApp: +91 XXXXX-XXXXX</li>
          </ul>
        </div>
        <div>
          <h3 class="text-xl font-bold mb-4">Community</h3>
          <div class="flex gap-4">
            <a href="https://facebook.com" class="hover:text-blue-400" aria-label="Facebook">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://whatsapp.com" class="hover:text-blue-400" aria-label="WhatsApp">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            </a>
            <a href="https://youtube.com" class="hover:text-blue-400" aria-label="YouTube">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </div>
      </div>
      <div class="mt-12 text-center">
        <p>&copy; 2024 Boroland. All rights reserved.</p>
      </div>
    </div>
  </footer>
</main>
{:else}
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-800">
    <div class="bg-white p-8 rounded-lg shadow-xl text-center">
      <h2 class="text-3xl font-bold mb-4">Thank You!</h2>
      <p class="text-xl mb-6">We've received your information and will process your AI-powered credit assessment.</p>
      <button 
        class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        on:click={() => submitted = false}
      >
        Check Another Score
      </button>
    </div>
  </div>
{/if}
