<script lang="ts">
	export let userData: any = null;

	const formatDate = (dateString?: string) => {
		if (!dateString) {
			// Return current date if no date provided
			const today = new Date();
			return {
				day: today.getDate().toString().padStart(2, '0'),
				month: (today.getMonth() + 1).toString().padStart(2, '0'),
				year: today.getFullYear()
			};
		}

		const date = new Date(dateString);
		return {
			day: date.getDate().toString().padStart(2, '0'),
			month: (date.getMonth() + 1).toString().padStart(2, '0'),
			year: date.getFullYear()
		};
	};

	function getFullName(): string {
		// Use database field name first, then fallbacks
		return userData?.full_name || userData?.name || userData?.fullName || 'Not provided';
	}

	function getAnnualIncome(): string {
		// Calculate annual income from monthly income, with proper field names
		const monthlyIncome = userData?.monthly_family_income || userData?.monthlyFamilyIncome || 0;
		if (monthlyIncome) {
			return '₹' + (monthlyIncome * 12).toLocaleString('en-IN');
		}
		return 'Not provided';
	}
</script>

<div class="overflow-hidden rounded-lg bg-white shadow-md">
	<!-- Header -->
	<div class="bg-gray-600 p-4 text-white">
		<h1 class="text-xl font-semibold">My Profile</h1>
	</div>

	<!-- Personal Details Section -->
	<div class="p-6">
		<div class="mb-8">
			<div class="mb-6 flex items-center">
				<svg
					class="mr-2 h-6 w-6 text-gray-600"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
					/>
				</svg>
				<h2 class="text-lg font-semibold">Personal Details</h2>
			</div>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div>
					<label class="mb-1 block text-sm text-gray-600">YOUR NAME</label>
					<div class="flex gap-2">
						<span class="text-gray-800"
							>{userData?.gender === 'M' || userData?.gender === 'Male' ? 'Mr' : 'Ms'}</span
						>
						<span class="text-gray-800">{getFullName()}</span>
					</div>
				</div>

				<div>
					<label class="mb-1 block text-sm text-gray-600">AGE</label>
					<div class="text-gray-800">{userData?.age || 'Not provided'}</div>
				</div>

				<div>
					<label class="mb-1 block text-sm text-gray-600">EMAIL ADDRESS</label>
					<span class="text-gray-800">{userData?.email || 'Not provided'}</span>
				</div>

				<div>
					<label class="mb-1 block text-sm text-gray-600">MOBILE NO</label>
					<span class="text-gray-800">{userData?.mobile || 'Not provided'}</span>
				</div>

				<div>
					<label class="mb-1 block text-sm text-gray-600">EDUCATION</label>
					<span class="text-gray-800">{userData?.education || 'Not provided'}</span>
				</div>

				<div>
					<label class="mb-1 block text-sm text-gray-600">MARITAL STATUS</label>
					<span class="text-gray-800">
						{userData?.marital_status === 'Y' || userData?.maritalStatus === 'Y'
							? 'Married'
							: userData?.marital_status === 'N' || userData?.maritalStatus === 'N'
								? 'Single'
								: 'Not provided'}
					</span>
				</div>

				<div>
					<label class="mb-1 block text-sm text-gray-600">FAMILY MEMBERS</label>
					<span class="text-gray-800"
						>{userData?.family_members || userData?.familyMembers || 'Not provided'}</span
					>
				</div>
			</div>
		</div>

		<!-- Skills & Income -->
		<div>
			<div class="mb-6 flex items-center">
				<svg
					class="mr-2 h-6 w-6 text-gray-600"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
					/>
				</svg>
				<h2 class="text-lg font-semibold">Skills & Income</h2>
			</div>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div>
					<label class="mb-1 block text-sm text-gray-600">PRIMARY SKILL</label>
					<span class="text-gray-800">
						{userData?.skill_1 || userData?.skills?.[0]?.skill || 'Not provided'}
					</span>
				</div>

				<div>
					<label class="mb-1 block text-sm text-gray-600">PRIMARY EARNER</label>
					<span class="text-gray-800">
						{userData?.is_primary_earner === 'Y' || userData?.isPrimaryEarner === 'Y'
							? 'Yes'
							: userData?.is_primary_earner === 'N' || userData?.isPrimaryEarner === 'N'
								? 'No'
								: 'Not provided'}
					</span>
				</div>

				<div>
					<label class="mb-1 block text-sm text-gray-600">MONTHLY INCOME</label>
					<span class="text-gray-800">
						₹{userData?.monthly_family_income?.toLocaleString('en-IN') ||
							userData?.monthlyFamilyIncome?.toLocaleString('en-IN') ||
							'Not provided'}
					</span>
				</div>

				<div>
					<label class="mb-1 block text-sm text-gray-600">ANNUAL INCOME</label>
					<span class="text-gray-800">{getAnnualIncome()}</span>
				</div>
			</div>
		</div>

		<!-- Credit Status -->
		<div class="mt-8 border-t border-gray-200 pt-8">
			<div class="mb-6 flex items-center">
				<svg
					class="mr-2 h-6 w-6 text-gray-600"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
					/>
				</svg>
				<h2 class="text-lg font-semibold">Credit Status</h2>
			</div>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div>
					<label class="mb-1 block text-sm text-gray-600">CREDIT SCORE</label>
					<span class="text-gray-800">{userData?.prediction_percentage || '0'}%</span>
				</div>

				<div>
					<label class="mb-1 block text-sm text-gray-600">STATUS</label>
					<span class="{userData?.is_selected ? 'text-green-600' : 'text-red-600'} font-semibold">
						{userData?.is_selected ? 'Approved' : 'Not Approved'}
					</span>
				</div>

				<div>
					<label class="mb-1 block text-sm text-gray-600">LAST UPDATED</label>
					<span class="text-gray-800">
						{userData?.updated_at ? new Date(userData.updated_at).toLocaleDateString() : 'N/A'}
					</span>
				</div>
			</div>
		</div>
	</div>
</div>
