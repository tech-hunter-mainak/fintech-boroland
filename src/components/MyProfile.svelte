<script lang="ts">
  export let userData: any = null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate().toString().padStart(2, '0'),
      month: (date.getMonth() + 1).toString().padStart(2, '0'),
      year: date.getFullYear()
    };
  };
</script>

<div class="bg-white rounded-lg shadow-md overflow-hidden">
  <!-- Header -->
  <div class="bg-gray-600 text-white p-4">
    <h1 class="text-xl font-semibold">My Profile</h1>
  </div>

  <!-- Personal Details Section -->
  <div class="p-6">
    <div class="mb-8">
      <div class="flex items-center mb-6">
        <svg class="w-6 h-6 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <h2 class="text-lg font-semibold">Personal Details</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm text-gray-600 mb-1">YOUR NAME</label>
          <div class="flex gap-2">
            <span class="text-gray-800">Mr</span>
            <span class="text-gray-800">{userData.name || userData.fullName}</span>
          </div>
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">BIRTHDAY</label>
          <div class="flex gap-2">
            <span class="text-gray-800">{formatDate(userData.dateOfBirth || userData.dob).day}</span>
            <span class="text-gray-400">/</span>
            <span class="text-gray-800">{formatDate(userData.dateOfBirth || userData.dob).month}</span>
            <span class="text-gray-400">/</span>
            <span class="text-gray-800">{formatDate(userData.dateOfBirth || userData.dob).year}</span>
          </div>
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">EMAIL ADDRESS</label>
          <span class="text-gray-800">{userData.email}</span>
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">MOBILE NO</label>
          <span class="text-gray-800">{userData.mobile}</span>
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">ADDRESS</label>
          <span class="text-gray-800">{userData.address || 'Not provided'}</span>
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">PINCODE</label>
          <span class="text-gray-800">{userData.pincode || 'Not provided'}</span>
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">CITY</label>
          <span class="text-gray-800">{userData.city || 'Not provided'}</span>
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">PAN CARD</label>
          <span class="text-gray-800">{userData.panCard || 'Not provided'}</span>
        </div>
      </div>
    </div>

    <!-- Employer Details Section -->
    <div>
      <div class="flex items-center mb-6">
        <svg class="w-6 h-6 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <h2 class="text-lg font-semibold">Employer Details</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm text-gray-600 mb-1">EMPLOYMENT TYPE</label>
          <span class="text-gray-800">{userData.employmentType || 'Self Employed Professional'}</span>
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">PROFESSION TYPE</label>
          <span class="text-gray-800">{userData.professionType || 'Other'}</span>
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">ANNUAL TURNOVER</label>
          <span class="text-gray-800">₹{userData.monthlyFamilyIncome * 12 || 'Not provided'}</span>
        </div>
      </div>
    </div>

    <!-- Save Button -->
    <div class="mt-8">
      <button class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
        Save
      </button>
    </div>
  </div>
</div> 