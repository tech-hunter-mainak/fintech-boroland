<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { userSession } from '$lib/stores/userStore';

	let formData: {
		age: string;
		gender: string;
		maritalStatus: string;
		familyMembers: string;
		isPrimaryEarner: string;
		relationWithPrimaryEarner: string;
		education: string;
		skills: { skill: string; rating: string; years: string }[];
		hasCertification: string;
		ownership: string[];
		monthlyFamilyIncome: string;
		monthlyFamilyExpenditure: string;
	} = {
		age: '',
		gender: '',
		maritalStatus: '',
		familyMembers: '',
		isPrimaryEarner: '',
		relationWithPrimaryEarner: '',
		education: '',
		skills: [
			{ skill: '', rating: '', years: '' },
			{ skill: '', rating: '', years: '' },
			{ skill: '', rating: '', years: '' }
		],
		hasCertification: '',
		ownership: [],
		monthlyFamilyIncome: '',
		monthlyFamilyExpenditure: ''
	};

	const educationOptions = ['Below HSLC', 'HSLC', 'HS', 'HSLC', 'Others'];

	const skillOptions = [
		'Agriculture',
		'Business',
		'Weaving',
		'Handicrafts',
		'Animal Husbandry',
		'Food Processing',
		'Others'
	];

	const ownershipOptions = ['Land', 'Machine', 'Vehicle', 'None'];

	onMount(async () => {
		// Check if user data exists in session storage
		const userData = sessionStorage.getItem('userData');
		if (!userData) {
			goto('/');
			return;
		}

		// Pre-fill some fields from existing user data
		const parsedData = JSON.parse(userData);
		formData.gender = parsedData.gender.toUpperCase().charAt(0);
	});

	const handleSubmit = async () => {
		try {
			const userData = sessionStorage.getItem('userData');
			if (!userData) {
				goto('/');
				return;
			}

			const basicInfo = JSON.parse(userData);

			// Combine basic info with detailed info
			const completeUserData = {
				...basicInfo,
				...formData,
				// Ensure proper data types
				age: parseInt(formData.age),
				familyMembers: parseInt(formData.familyMembers),
				monthlyFamilyIncome: parseFloat(formData.monthlyFamilyIncome),
				monthlyFamilyExpenditure: parseFloat(formData.monthlyFamilyExpenditure),
				skills: formData.skills.map((skill) => ({
					...skill,
					rating: parseInt(skill.rating),
					years: parseInt(skill.years)
				}))
			};

			// Store in database
			const saveResponse = await fetch('/api/users', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(completeUserData)
			});

			if (!saveResponse.ok) {
				const errorData = await saveResponse.json();
				throw new Error(errorData.message || 'Failed to save user data');
			}

			const savedUser = await saveResponse.json();

			try {
				// Format data according to ML API requirements
				const mlData = {
					data: [
						{
							Age: parseInt(formData.age),
							GENDER: formData.gender,
							'MARITAL STATUS': formData.maritalStatus,
							'NO. OF MEMBERS IN YOUR FAMILY ?': parseInt(formData.familyMembers),
							'ARE YOU THE PRIMARY EARNER OF YOUR FAMILY ?': formData.isPrimaryEarner,
							'Relation with primary earner ?': formData.relationWithPrimaryEarner || 'None',
							'WHAT IS YOUR HIGHEST EDUCATIONAL QUALIFICATION?':
								formData.education === 'Graduate' || formData.education === 'Post Graduate'
									? 'HSLC'
									: formData.education,
							'SKILL 1': formData.skills[0]?.skill || 'None',
							'RATING OF SKILL SET 1 (out of  10)': parseFloat(formData.skills[0]?.rating) || 0,
							'HOW MANY YEARS HAVE YOU BEEN ASSOCIATED WITH SKILL 1 ?':
								parseFloat(formData.skills[0]?.years) || 0,
							'SKILL 2': formData.skills[1]?.skill || 'None',
							'RATING OF SKILL SET 2 (out of  10)': parseFloat(formData.skills[1]?.rating) || 0,
							'HOW MANY YEARS HAVE YOU BEEN ASSOCIATED WITH SKILL 2 ?':
								parseFloat(formData.skills[1]?.years) || 0,
							'SKILL 3': formData.skills[2]?.skill || 'None',
							'RATING OF SKILL SET 3 (out of  10)': parseFloat(formData.skills[2]?.rating) || 0,
							'HOW MANY YEARS HAVE YOU BEEN ASSOCIATED WITH SKILL 3 ?':
								parseFloat(formData.skills[2]?.years) || 0,
							'DO YOU HAVE ANY CERTIFICATION OF THE ABOVE-MENTIONED SKILL SET?':
								formData.hasCertification,
							'OWNERSHIP ( includes Land,machine)': formData.ownership.length
								? formData.ownership.join(',')
								: 'None',
							'MONTHLY FAMILY INCOME': parseFloat(formData.monthlyFamilyIncome),
							'MONTHLY FAMILY EXPENDITURE': parseFloat(formData.monthlyFamilyExpenditure)
						}
					]
				};

				console.log('Sending data to ML API:', JSON.stringify(mlData, null, 2));

				// Make API call for credit assessment
				const mlResponse = await fetch('https://bodoland-api.onrender.com/predict', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(mlData)
				});

				if (!mlResponse.ok) {
					const errorText = await mlResponse.text();
					console.error('ML API Error:', errorText);
					throw new Error('Failed to get credit assessment');
				}

				const mlResult = await mlResponse.json();
				console.log('ML API Response:', mlResult);

				if (mlResult.status !== 'success' || !mlResult.results || !mlResult.results[0]) {
					throw new Error('Invalid response from credit assessment');
				}

				const creditResult = {
					isSelected: mlResult.results[0].prediction === 1,
					score: Math.round(mlResult.results[0].probability * 100),
					reason: `Based on our AI assessment, you have a ${Math.round(mlResult.results[0].probability * 100)}% match with successful credit profiles.`
				};

				// Update user selection status
				if (savedUser.id) {
					const updateResponse = await fetch('/api/users', {
						method: 'PATCH',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							userId: savedUser.id,
							isSelected: creditResult.isSelected
						})
					});

					if (!updateResponse.ok) {
						console.error('Failed to update user selection status');
					}
				}

				// Set user session with complete data
				userSession.login(savedUser, creditResult);

				// Redirect to dashboard
				goto('/dashboard');
			} catch (creditError) {
				console.error('Credit assessment error:', creditError);
				alert('There was an issue with the credit assessment. Please try again.');
			}
		} catch (error) {
			console.error('Error:', error);
			if (error instanceof Error) {
				alert(error.message || 'Failed to submit data. Please try again.');
			} else {
				alert('Failed to submit data. Please try again.');
			}
		}
	};
</script>

<div class="min-h-screen bg-gray-100 py-12">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="rounded-lg bg-white p-6 shadow-xl md:p-8">
			<h2 class="mb-6 text-2xl font-bold text-gray-800">Complete Your Profile</h2>

			<form on:submit|preventDefault={handleSubmit} class="space-y-6">
				<!-- Basic Information -->
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div>
						<label class="block text-sm font-medium text-gray-700">Age</label>
						<input
							type="number"
							bind:value={formData.age}
							min="18"
							max="100"
							required
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
						/>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700">Gender</label>
						<select
							bind:value={formData.gender}
							required
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
						>
							<option value="">Select Gender</option>
							<option value="M">Male</option>
							<option value="F">Female</option>
						</select>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700">Marital Status</label>
						<select
							bind:value={formData.maritalStatus}
							required
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
						>
							<option value="">Select Status</option>
							<option value="Y">Married</option>
							<option value="N">Single</option>
						</select>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700">Number of Family Members</label>
						<input
							type="number"
							bind:value={formData.familyMembers}
							min="1"
							required
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
						/>
					</div>
				</div>

				<!-- Family Income Status -->
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div>
						<label class="block text-sm font-medium text-gray-700"
							>Are you the Primary Earner?</label
						>
						<select
							bind:value={formData.isPrimaryEarner}
							required
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
						>
							<option value="">Select Option</option>
							<option value="Y">Yes</option>
							<option value="N">No</option>
						</select>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700"
							>Relation with Primary Earner</label
						>
						<input
							type="text"
							bind:value={formData.relationWithPrimaryEarner}
							placeholder="If not primary earner"
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
						/>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700">Education</label>
						<select
							bind:value={formData.education}
							required
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
						>
							<option value="">Select Education</option>
							{#each educationOptions as option}
								<option value={option}>{option}</option>
							{/each}
						</select>
					</div>
				</div>

				<!-- Skills Section -->
				<div class="space-y-6">
					<h3 class="text-lg font-medium text-gray-900">Skills Information</h3>
					{#each [0, 1, 2] as index}
						<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
							<div>
								<label class="block text-sm font-medium text-gray-700">Skill {index + 1}</label>
								<select
									bind:value={formData.skills[index].skill}
									required={index === 0}
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
								>
									<option value="">Select Skill</option>
									{#each skillOptions as option}
										<option value={option}>{option}</option>
									{/each}
								</select>
							</div>

							<div>
								<label class="block text-sm font-medium text-gray-700">Rating (out of 10)</label>
								<input
									type="number"
									bind:value={formData.skills[index].rating}
									min="1"
									max="10"
									required={formData.skills[index].skill !== ''}
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label class="block text-sm font-medium text-gray-700">Years of Experience</label>
								<input
									type="number"
									bind:value={formData.skills[index].years}
									min="0"
									required={formData.skills[index].skill !== ''}
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
								/>
							</div>
						</div>
					{/each}
				</div>

				<!-- Certification and Ownership -->
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div>
						<label class="block text-sm font-medium text-gray-700"
							>Do you have any certification?</label
						>
						<select
							bind:value={formData.hasCertification}
							required
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
						>
							<option value="">Select Option</option>
							<option value="Yes">Yes</option>
							<option value="No">No</option>
						</select>
					</div>

					<div>
						<fieldset>
							<legend class="block text-sm font-medium text-gray-700">Ownership</legend>
							<div class="mt-2 space-y-2">
								{#each ownershipOptions as option}
									<label class="mr-4 inline-flex items-center">
										<input
											type="checkbox"
											value={option}
											checked={formData.ownership.includes(option)}
											on:change={(e) => {
												const target = e.target as HTMLInputElement;
												if (target?.checked) {
													formData.ownership = [...formData.ownership, option];
												} else {
													formData.ownership = formData.ownership.filter((item) => item !== option);
												}
											}}
											class="form-checkbox h-4 w-4 text-blue-600"
										/>
										<span class="ml-2">{option}</span>
									</label>
								{/each}
							</div>
						</fieldset>
					</div>
				</div>

				<!-- Financial Information -->
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div>
						<label for="monthlyFamilyIncome" class="block text-sm font-medium text-gray-700"
							>Monthly Family Income (₹)</label
						>
						<input
							id="monthlyFamilyIncome"
							type="number"
							bind:value={formData.monthlyFamilyIncome}
							min="0"
							required
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
						/>
					</div>

					<div>
						<label for="monthlyFamilyExpenditure" class="block text-sm font-medium text-gray-700"
							>Monthly Family Expenditure (₹)</label
						>
						<input
							id="monthlyFamilyExpenditure"
							type="number"
							bind:value={formData.monthlyFamilyExpenditure}
							min="0"
							required
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
						/>
					</div>
				</div>

				<div class="flex justify-end">
					<button
						type="submit"
						class="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
					>
						Submit and Continue
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
