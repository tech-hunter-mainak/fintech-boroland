<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  let gender: string = '';
  let fullName: string = '';
  let email: string = '';
  let mobile: string = '';
  let acceptTerms: boolean = false;
  let whatsappUpdates: boolean = false;
  let mobileDigits: number = 0;
  let otpSent: boolean = false;
  let otp: string = '';
  let verificationMethod: 'email' | 'mobile' = 'mobile';
  let isVerified: boolean = false;

  const handleMobileInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    let digits = input.value.replace(/\D/g, '');
    
    // Ensure the number starts with valid Indian prefixes
    if (digits.length > 0) {
      if (!['6', '7', '8', '9'].includes(digits[0])) {
        digits = '';
      }
    }
    
    // Limit to 10 digits
    digits = digits.slice(0, 10);
    
    mobileDigits = digits.length;
    mobile = digits;
  };

  const isValidMobile = (number: string) => {
    return /^[6-9]\d{9}$/.test(number);
  };

  const toggleVerificationMethod = () => {
    verificationMethod = verificationMethod === 'mobile' ? 'email' : 'mobile';
    otpSent = false;
    otp = '';
  };
  
  const sendOTP = async () => {
    // Validate mobile number before sending OTP
    if (verificationMethod === 'mobile' && !isValidMobile(mobile)) {
      alert('Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9');
      return;
    }

    try {
      otpSent = true;
      alert(`OTP sent to your ${verificationMethod}!`);
    } catch (error) {
      alert('Failed to send OTP. Please try again.');
    }
  };

  const verifyOTP = async () => {
    // Simulate OTP verification
    try {
      // In real implementation, make API call to verify OTP
      if (otp.length === 6) {
        isVerified = true;
        handleSubmit();
      } else {
        alert('Please enter a valid 6-digit OTP');
      }
    } catch (error) {
      alert('Invalid OTP. Please try again.');
    }
  };
  
  const handleSubmit = async () => {
    if (!gender || !fullName || !email || !mobile || !acceptTerms || !isVerified) {
      return;
    }

    try {
      // Dispatch the form data to the parent component
      dispatch('submit', {
        gender,
        fullName,
        email,
        mobile,
        whatsappUpdates
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit your information. Please try again.');
    }
  };
</script>

<div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
  <div class="text-center mb-6">
    <h2 class="text-2xl font-bold text-gray-800">Check FREE CIBIL Score</h2>
    <p class="text-gray-600">Instant Access to Credit Report</p>
  </div>

  <div class="flex items-center justify-between mb-6 text-sm">
    <div class="flex items-center">
      <svg class="w-5 h-5 text-blue-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path>
      </svg>
      <span>Free monthly updates</span>
    </div>
    <div class="flex items-center">
      <svg class="w-5 h-5 text-blue-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path>
      </svg>
      <span>No impact on score</span>
    </div>
  </div>

  <form class="space-y-4">
    <!-- Gender -->
    <div class="flex gap-4 mb-4">
      <label class="flex items-center flex-1">
        <input
          type="radio"
          bind:group={gender}
          value="male"
          class="form-radio w-4 h-4 text-blue-600"
        />
        <span class="ml-2">Male</span>
      </label>
      <label class="flex items-center flex-1">
        <input
          type="radio"
          bind:group={gender}
          value="female"
          class="form-radio w-4 h-4 text-blue-600"
        />
        <span class="ml-2">Female</span>
      </label>
    </div>

    <!-- Full Name -->
    <div>
      <input
        type="text"
        bind:value={fullName}
        placeholder="Full Name (as per bank records)"
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        required
      />
    </div>

    <!-- Email -->
    <div>
      <input
        type="email"
        bind:value={email}
        placeholder="Email Address"
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        required
      />
    </div>

    <!-- Mobile -->
    <div>
      <div class="relative">
        <input
          type="tel"
          bind:value={mobile}
          on:input={handleMobileInput}
          placeholder="Mobile Number"
          pattern="[6-9][0-9]{9}"
          maxlength="10"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm {!isValidMobile(mobile) && mobile.length > 0 ? 'border-red-500' : ''}"
          required
        />
        <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs {mobileDigits === 10 && isValidMobile(mobile) ? 'text-green-500' : 'text-gray-400'}">
          {mobileDigits}/10
        </span>
      </div>
      {#if mobile.length > 0 && !isValidMobile(mobile)}
        <p class="mt-1 text-xs text-red-500">Please enter a valid Indian mobile number</p>
      {:else}
        <p class="mt-1 text-xs text-gray-500">Bank will contact you on this number</p>
      {/if}
    </div>

    <!-- Verification Method Toggle -->
    <div class="flex justify-between items-center text-sm">
      <span>Verify using:</span>
      <button
        type="button"
        on:click={toggleVerificationMethod}
        class="text-blue-600 hover:underline"
      >
        Switch to {verificationMethod === 'mobile' ? 'Email' : 'Mobile'} OTP
      </button>
    </div>

    <!-- OTP Section -->
    {#if !isVerified}
      <div class="space-y-3">
        {#if !otpSent}
          <button
            type="button"
            on:click={sendOTP}
            disabled={verificationMethod === 'mobile' ? mobile.length !== 10 : !email.includes('@')}
            class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Send OTP to {verificationMethod === 'mobile' ? 'Mobile' : 'Email'}
          </button>
        {:else}
          <div class="space-y-2">
            <input
              type="text"
              bind:value={otp}
              placeholder="Enter 6-digit OTP"
              maxlength="6"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <div class="flex justify-between text-xs">
              <button
                type="button"
                on:click={sendOTP}
                class="text-blue-600 hover:underline"
              >
                Resend OTP
              </button>
              <button
                type="button"
                on:click={verifyOTP}
                class="text-blue-600 hover:underline"
              >
                Verify OTP
              </button>
            </div>
          </div>
        {/if}
      </div>
    {/if}

    <!-- Terms -->
    <div class="space-y-3">
      <label class="flex items-start gap-2">
        <input
          type="checkbox"
          bind:checked={acceptTerms}
          class="mt-1 form-checkbox w-4 h-4 text-blue-600"
          required
        />
        <span class="text-xs text-gray-600">
          By proceeding, I agree to provide personal details and authorize Boroland to obtain my Credit Score/Profile from Cibil / Equifax / Experian / CRIF Highmark/bureau(s).
        </span>
      </label>

      <label class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <img src="/whatsapp-icon.svg" alt="WhatsApp" class="w-5 h-5" />
          <span class="text-sm text-gray-700">Get updates on WhatsApp</span>
        </div>
        <div class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" bind:checked={whatsappUpdates} class="sr-only peer">
          <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
        </div>
      </label>
    </div>

    <button
      type="submit"
      disabled={!gender || !fullName || !email || !mobile || !acceptTerms || !isVerified}
      class="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
    >
      Get Free Credit Report
    </button>
  </form>

  <div class="mt-4 flex items-center justify-center text-xs text-gray-500">
    <svg class="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
    </svg>
    Your information is 100% secure with us
  </div>
</div> 