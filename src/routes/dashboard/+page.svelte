<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Dashboard from '../../components/Dashboard.svelte';
  import { userSession } from '$lib/stores/userStore';

  let userData: any = null;
  let creditData: any = null;

  onMount(() => {
    // Check session storage first
    const storedUserData = sessionStorage.getItem('userData');
    const storedCreditData = sessionStorage.getItem('creditData');
    
    if (!storedUserData) {
      goto('/');
      return;
    }

    // Initialize session if data exists in storage
    if (storedUserData && storedCreditData) {
      const parsedUserData = JSON.parse(storedUserData);
      const parsedCreditData = JSON.parse(storedCreditData);
      userSession.login(parsedUserData, parsedCreditData);
    }

    // Subscribe to the store
    const unsubscribe = userSession.subscribe(session => {
      if (!session.isLoggedIn) {
        goto('/');
        return;
      }
      userData = session.user;
      creditData = session.creditData;
    });

    return () => {
      unsubscribe();
    };
  });
</script>

{#if userData}
  <Dashboard 
    userName={userData.name || userData.fullName || 'User'} 
    {creditData}
    {userData}
  />
{:else}
  <div class="text-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
    <p class="text-gray-600">Loading your dashboard...</p>
  </div>
{/if} 