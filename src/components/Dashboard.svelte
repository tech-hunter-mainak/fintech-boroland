<script lang="ts">
  import { userSession } from '$lib/stores/userStore';
  import { goto } from '$app/navigation';
  import MyProfile from './MyProfile.svelte';

  export let userName: string = '';
  export let creditData: {
    isSelected: boolean;
    score: number;
    reason: string;
  } | null = null;
  export let userData: any = null;
  
  let isLoading = true;
  let currentView = 'dashboard';

  const sidebarItems = [
    { id: 'credit-report', href: '#credit-report', text: 'Credit Report', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'offers', href: '#offers', text: 'Offers', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z', badge: '4' },
    { id: 'products', href: '#products', text: 'Products', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
    { id: 'profile', href: '#profile', text: 'My Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'improve', href: '#improve', text: 'Improve Score', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { id: 'faqs', href: '#faqs', text: 'FAQs', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'contact', href: '#contact', text: 'Contact Us', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' }
  ];

  const handleLogout = () => {
    userSession.logout();
    goto('/');
  };

  const handleNavigation = (itemId: string) => {
    currentView = itemId;
  };

  // Simulate loading
  setTimeout(() => {
    isLoading = false;
  }, 1000);
</script>

<div class="min-h-screen bg-gray-100">
  <!-- Navigation -->
  <nav class="bg-white shadow-lg sticky top-0 z-50">
    <div class="container mx-auto px-6 py-4">
      <div class="flex justify-between items-center">
        <div class="text-2xl font-bold text-blue-600 transform transition-transform duration-300 ease-in-out hover:scale-105">Boroland</div>
        <div class="flex items-center space-x-6">
          <button class="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300 ease-in-out transform hover:scale-105">
            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
            </svg>
            Download App
          </button>
          <div class="flex items-center space-x-2">
            <span class="text-gray-600 hover:text-blue-600 cursor-pointer transition-colors duration-300 ease-in-out">English</span>
            <span class="text-gray-400">|</span>
            <span class="text-gray-600 hover:text-blue-600 cursor-pointer transition-colors duration-300 ease-in-out">বড়ো</span>
          </div>
          <button 
            on:click={handleLogout}
            class="bg-gray-200 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-300 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-md"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>

  <!-- Sidebar and Main Content -->
  <div class="container mx-auto px-6 py-8">
    <div class="flex flex-wrap -mx-4">
      <!-- Sidebar -->
      <div class="w-full md:w-1/4 px-4">
        <div class="sticky top-24 bg-white rounded-lg shadow-md p-6 max-h-[calc(100vh-8rem)] overflow-y-auto transition-all duration-200">
          <ul class="space-y-4">
            {#each sidebarItems as item}
            <li>
              <button 
                on:click={() => handleNavigation(item.id)}
                class="w-full flex items-center text-gray-600 hover:text-blue-600 transform transition-all duration-300 ease-in-out hover:translate-x-2 {currentView === item.id ? 'text-blue-600' : ''}"
              >
                <svg class="w-5 h-5 mr-3 transition-transform duration-300 ease-in-out transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon}></path>
                </svg>
                <span class="transition-all duration-300 ease-in-out">{item.text}</span>
                {#if item.badge}
                  <span class="ml-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110">{item.badge}</span>
                {/if}
              </button>
            </li>
            {/each}
          </ul>
        </div>
      </div>

      <!-- Main Content -->
      <div class="w-full md:w-3/4 px-4 mt-8 md:mt-0">
        {#if isLoading}
          <div class="bg-white rounded-lg shadow-md p-8 text-center transition-all duration-300 ease-in-out">
            <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p class="mt-4 text-gray-600">Please wait while we process your information...</p>
          </div>
        {:else}
          {#if currentView === 'profile'}
            <MyProfile {userData} />
          {:else}
            <!-- Credit Score Status -->
            <div class="bg-white rounded-lg shadow-md p-8 mb-8 transition-all duration-300 ease-in-out hover:shadow-lg transform hover:-translate-y-1">
              <div class="text-center mb-8">
                <h2 class="text-2xl font-bold mb-2">Hey {userName}!</h2>
                {#if creditData}
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
                    <!-- Credit Score Circle -->
                    <div class="text-center">
                      <div class="w-40 h-40 mx-auto relative mb-4">
                        <svg viewBox="0 0 36 36" class="w-full h-full">
                          <path
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#E5E7EB"
                            stroke-width="3"
                          />
                          <path
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke={creditData.score >= 70 ? "#10B981" : creditData.score >= 50 ? "#F59E0B" : "#EF4444"}
                            stroke-width="3"
                            stroke-dasharray={`${creditData.score}, 100`}
                          />
                          <text x="18" y="16" class="text-4xl font-bold" text-anchor="middle" dominant-baseline="middle" fill="currentColor">
                            {creditData.score}
                          </text>
                          <text x="18" y="24" class="text-[8px]" text-anchor="middle" dominant-baseline="middle" fill="currentColor">
                            %
                          </text>
                        </svg>
                      </div>
                      <p class="text-gray-600">Credit Score</p>
                    </div>

                    <!-- Status -->
                    <div class="space-y-4">
                      <div>
                        <h3 class="text-sm text-gray-500 mb-1">Status</h3>
                        <p class="font-semibold text-lg {creditData.isSelected ? 'text-green-600' : 'text-red-600'}">
                          {creditData.isSelected ? 'Approved' : 'Not Approved'}
                        </p>
                      </div>
                      <div>
                        <h3 class="text-sm text-gray-500 mb-1">Last Updated</h3>
                        <p class="font-semibold">{new Date().toLocaleDateString()}</p>
                      </div>
                    </div>

                    <!-- Actions -->
                    <div class="space-y-4">
                      <button class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                        Build Your Credit Score
                      </button>
                      <button class="w-full border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
                        View Detailed Report
                      </button>
                    </div>
                  </div>
                  <p class="text-gray-600 mt-4">{creditData.reason}</p>
                {:else}
                  <p class="text-gray-600">We are unable to locate your information in Credit Bureau(s) records based on the information you have provided during enrollment</p>
                  <button class="mt-6 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                    Build your Credit Score
                  </button>
                {/if}
              </div>

              <!-- Credit Factors -->
              {#if userData}
                <div class="border-t pt-8">
                  <h3 class="text-lg font-semibold mb-6">Credit Score Factors</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-4">
                      <div class="flex items-center justify-between">
                        <span class="text-gray-600">Monthly Income</span>
                        <span class="font-semibold">₹{userData.monthlyFamilyIncome}</span>
                      </div>
                      <div class="flex items-center justify-between">
                        <span class="text-gray-600">Education</span>
                        <span class="font-semibold">{userData.education || 'N/A'}</span>
                      </div>
                      <div class="flex items-center justify-between">
                        <span class="text-gray-600">Skills</span>
                        <span class="font-semibold">{userData.skills?.[0]?.skill || 'N/A'}</span>
                      </div>
                    </div>
                    <div class="space-y-4">
                      <div class="flex items-center justify-between">
                        <span class="text-gray-600">Monthly Expenses</span>
                        <span class="font-semibold">₹{userData.monthlyFamilyExpenditure}</span>
                      </div>
                      <div class="flex items-center justify-between">
                        <span class="text-gray-600">Certifications</span>
                        <span class="font-semibold">{userData.hasCertification || 'No'}</span>
                      </div>
                      <div class="flex items-center justify-between">
                        <span class="text-gray-600">Assets</span>
                        <span class="font-semibold">{userData.ownership?.join(', ') || 'None'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              {/if}
            </div>

            <!-- Pre Approved Offers -->
            <div class="bg-white rounded-lg shadow-md p-8 transition-all duration-300 ease-in-out hover:shadow-lg transform hover:-translate-y-1">
              <div class="flex items-center mb-6">
                <svg class="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                </svg>
                <h2 class="text-2xl font-bold">Pre Approved & Pre Qualified Offers</h2>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                {#if creditData?.isSelected}
                  <div class="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <h3 class="text-lg font-semibold mb-2">Personal Loan</h3>
                    <p class="text-gray-600 mb-4">Get instant approval on personal loans tailored for the Bodo community</p>
                    <p class="text-lg font-bold text-green-600 mb-4">Up to ₹5,00,000</p>
                    <button class="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                      Apply Now
                    </button>
                  </div>
                  <div class="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <h3 class="text-lg font-semibold mb-2">Business Loan</h3>
                    <p class="text-gray-600 mb-4">Special loans for traditional businesses and artisans</p>
                    <p class="text-lg font-bold text-green-600 mb-4">Up to ₹10,00,000</p>
                    <button class="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                      Apply Now
                    </button>
                  </div>
                {:else}
                  <div class="col-span-2 border rounded-lg p-6 bg-gray-50">
                    <div class="text-center text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <p class="text-lg mb-2">Improve your credit score to unlock offers</p>
                      <p>Complete your profile and build your credit score to access exclusive loan offers</p>
                    </div>
                  </div>
                {/if}
              </div>
            </div>
          {/if}
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  /* Smooth scrolling for the entire page */
  :global(html) {
    scroll-behavior: smooth;
  }

  /* Custom scrollbar for sidebar */
  .overflow-y-auto {
    scrollbar-width: thin;
    scrollbar-color: #2563eb #f3f4f6;
  }

  .overflow-y-auto::-webkit-scrollbar {
    width: 6px;
  }

  .overflow-y-auto::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 3px;
  }

  .overflow-y-auto::-webkit-scrollbar-thumb {
    background-color: #2563eb;
    border-radius: 3px;
    transition: background-color 0.3s ease-in-out;
  }

  .overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background-color: #1d4ed8;
  }
</style> 