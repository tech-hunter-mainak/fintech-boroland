<script lang="ts">
	import { onMount } from 'svelte';
	import { goto, invalidate } from '$app/navigation';
	import { userSession } from '$lib/stores/userStore';
	import { updateUserDetails, updatePrediction } from '../../../supabase';
	import type { UserDetails } from '../../../supabase';
	import { browser } from '$app/environment';

	// Get data from server load function
	export let data;

	// Log only during development and only on client-side
	$: if (browser && import.meta.env.DEV) {
		console.log('[Client] Score page user data:', data?.user);
	}

	// Form validation interface
	interface ValidationError {
		field: string;
		message: string;
	}

	// Form data interface
	interface FormData {
		gender: string;
		fullName: string;
		age: string;
		maritalStatus: string;
		familyMembers: string;
		isPrimaryEarner: string;
		relationWithPrimaryEarner: string;
		education: string;
		skills: Array<{
			skill: string;
			rating: string;
			years: string;
		}>;
		hasCertification: string;
		ownership: string[];
		monthlyFamilyIncome: string;
		monthlyFamilyExpenditure: string;
	}

	// Initialize form data
	let formData: FormData = {
		gender: '',
		fullName: '',
		age: '',
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

	// Validation errors
	let validationErrors: ValidationError[] = [];

	// Validate form data
	function validateForm(): boolean {
		validationErrors = [];

		// Age validation (18-100)
		const age = parseInt(formData.age);
		if (isNaN(age) || age < 18 || age > 100) {
			validationErrors.push({
				field: 'age',
				message: 'Age must be between 18 and 100 years'
			});
		}

		// Skills validation
		formData.skills.forEach((skill, index) => {
			if (skill.skill && skill.years) {
				const yearsExp = parseInt(skill.years);
				if (yearsExp >= age) {
					validationErrors.push({
						field: `skill_${index + 1}_years`,
						message: `Years of experience cannot be greater than or equal to age`
					});
				}
			}
		});

		// Family members validation
		const familyMembers = parseInt(formData.familyMembers);
		if (isNaN(familyMembers) || familyMembers < 1) {
			validationErrors.push({
				field: 'familyMembers',
				message: 'Number of family members must be at least 1'
			});
		}

		// Income validation
		const income = parseFloat(formData.monthlyFamilyIncome);
		if (isNaN(income) || income <= 0) {
			validationErrors.push({
				field: 'monthlyFamilyIncome',
				message: 'Monthly family income must be greater than 0'
			});
		}

		// Expenditure validation
		const expenditure = parseFloat(formData.monthlyFamilyExpenditure);
		if (isNaN(expenditure) || expenditure <= 0) {
			validationErrors.push({
				field: 'monthlyFamilyExpenditure',
				message: 'Monthly family expenditure must be greater than 0'
			});
		}

		if (expenditure >= income) {
			validationErrors.push({
				field: 'monthlyFamilyExpenditure',
				message: 'Monthly expenditure cannot be greater than or equal to income'
			});
		}

		// Required field validation
		if (!formData.gender) {
			validationErrors.push({ field: 'gender', message: 'Gender is required' });
		}
		if (!formData.maritalStatus) {
			validationErrors.push({ field: 'maritalStatus', message: 'Marital status is required' });
		}
		if (!formData.isPrimaryEarner) {
			validationErrors.push({ field: 'isPrimaryEarner', message: 'Primary earner status is required' });
		}
		if (!formData.education) {
			validationErrors.push({ field: 'education', message: 'Education is required' });
		}
		if (!formData.hasCertification) {
			validationErrors.push({ field: 'hasCertification', message: 'Certification status is required' });
		}
		if (formData.ownership.length === 0) {
			validationErrors.push({ field: 'ownership', message: 'Please select at least one ownership option' });
		}

		// At least one skill is required
		if (!formData.skills[0].skill) {
			validationErrors.push({ field: 'skill_1', message: 'At least one skill is required' });
		}

		return validationErrors.length === 0;
	}

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

	onMount(() => {
		// Pre-fill form data from server data if available
		if (data?.user) {
			const userData = data.user;
			
			// Pre-fill the form with existing user data
			formData = {
				...formData,
				gender: userData.gender || '',
				fullName: userData.full_name || '',
				age: userData.age?.toString() || '',
				maritalStatus: userData.marital_status || '',
				familyMembers: userData.family_members?.toString() || '',
				isPrimaryEarner: userData.is_primary_earner || '',
				relationWithPrimaryEarner: userData.relation_with_primary_earner || '',
				education: userData.education || '',
				skills: [
					{
						skill: userData.skill_1 || '',
						rating: userData.skill_1_rating?.toString() || '',
						years: userData.skill_1_years?.toString() || ''
					},
					{
						skill: userData.skill_2 || '',
						rating: userData.skill_2_rating?.toString() || '',
						years: userData.skill_2_years?.toString() || ''
					},
					{
						skill: userData.skill_3 || '',
						rating: userData.skill_3_rating?.toString() || '',
						years: userData.skill_3_years?.toString() || ''
					}
				],
				hasCertification: userData.has_certification || 'No',
				ownership: userData.ownership || [],
				monthlyFamilyIncome: userData.monthly_family_income?.toString() || '',
				monthlyFamilyExpenditure: userData.monthly_family_expenditure?.toString() || ''
			};
		}
	});

	const handleSubmit = async () => {
		try {
			// Validate form
			if (!validateForm()) {
				// Show validation errors
				const errorMessages = validationErrors.map(err => `${err.message}`).join('\n');
				alert('Please fix the following errors:\n' + errorMessages);
				return;
			}

			// Get the correct auth_user_id
			const authUserId = data.user.auth_user_id || data.user.id;
			if (!authUserId) {
				throw new Error('User ID not found');
			}

			// Transform form data for database
			const userDetails: Partial<UserDetails> = {
				full_name: formData.fullName || null,
				gender: formData.gender || null,
				age: parseInt(formData.age),
				marital_status: formData.maritalStatus,
				family_members: parseInt(formData.familyMembers),
				is_primary_earner: formData.isPrimaryEarner,
				relation_with_primary_earner: formData.relationWithPrimaryEarner || null,
				education: formData.education,
				skill_1: formData.skills[0]?.skill || null,
				skill_1_rating: formData.skills[0]?.rating ? parseInt(formData.skills[0].rating) : null,
				skill_1_years: formData.skills[0]?.years ? parseInt(formData.skills[0].years) : null,
				skill_2: formData.skills[1]?.skill || null,
				skill_2_rating: formData.skills[1]?.rating ? parseInt(formData.skills[1].rating) : null,
				skill_2_years: formData.skills[1]?.years ? parseInt(formData.skills[1].years) : null,
				skill_3: formData.skills[2]?.skill || null,
				skill_3_rating: formData.skills[2]?.rating ? parseInt(formData.skills[2].rating) : null,
				skill_3_years: formData.skills[2]?.years ? parseInt(formData.skills[2].years) : null,
				has_certification: formData.hasCertification || 'No',
				ownership: formData.ownership.length > 0 ? formData.ownership : ['None'],
				monthly_family_income: parseFloat(formData.monthlyFamilyIncome),
				monthly_family_expenditure: parseFloat(formData.monthlyFamilyExpenditure)
			};

			// Store in database using helper function with correct ID
			const savedUser = await updateUserDetails(authUserId, userDetails);
			if (!savedUser) {
				throw new Error('Failed to save user details');
			}

			// Format data for ML API
			const mlData = {
				data: [{
					Age: parseInt(formData.age),
					GENDER: formData.gender,
					'MARITAL STATUS': formData.maritalStatus,
					'NO. OF MEMBERS IN YOUR FAMILY ?': parseInt(formData.familyMembers),
					'ARE YOU THE PRIMARY EARNER OF YOUR FAMILY ?': formData.isPrimaryEarner,
					'Relation with primary earner ?': formData.relationWithPrimaryEarner || 'None',
					'WHAT IS YOUR HIGHEST EDUCATIONAL QUALIFICATION?': formData.education,
					'SKILL 1': formData.skills[0]?.skill || 'None',
					'RATING OF SKILL SET 1 (out of  10)': parseFloat(formData.skills[0]?.rating) || 0,
					'HOW MANY YEARS HAVE YOU BEEN ASSOCIATED WITH SKILL 1 ?': parseFloat(formData.skills[0]?.years) || 0,
					'SKILL 2': formData.skills[1]?.skill || 'None',
					'RATING OF SKILL SET 2 (out of  10)': parseFloat(formData.skills[1]?.rating) || 0,
					'HOW MANY YEARS HAVE YOU BEEN ASSOCIATED WITH SKILL 2 ?': parseFloat(formData.skills[1]?.years) || 0,
					'SKILL 3': formData.skills[2]?.skill || 'None',
					'RATING OF SKILL SET 3 (out of  10)': parseFloat(formData.skills[2]?.rating) || 0,
					'HOW MANY YEARS HAVE YOU BEEN ASSOCIATED WITH SKILL 3 ?': parseFloat(formData.skills[2]?.years) || 0,
					'DO YOU HAVE ANY CERTIFICATION OF THE ABOVE-MENTIONED SKILL SET?': formData.hasCertification,
					'OWNERSHIP ( includes Land,machine)': formData.ownership.length ? formData.ownership.join(',') : 'None',
					'MONTHLY FAMILY INCOME': parseFloat(formData.monthlyFamilyIncome),
					'MONTHLY FAMILY EXPENDITURE': parseFloat(formData.monthlyFamilyExpenditure)
				}]
			};

			if (browser && import.meta.env.DEV) {
				console.log('[Client] ML API request data:', mlData);
			}

			// Call ML API
			const mlResponse = await fetch('https://bodoland-api.onrender.com/predict', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: JSON.stringify(mlData)
			});

			if (!mlResponse.ok) {
				const errorText = await mlResponse.text();
				console.error('ML API Error:', errorText);
				throw new Error('Failed to get credit assessment');
			}

			const mlResult = await mlResponse.json();

			if (browser && import.meta.env.DEV) {
				console.log('[Client] ML API response:', mlResult);
			}

			if (mlResult.status !== 'success' || !mlResult.results || !mlResult.results[0]) {
				throw new Error('Invalid response from credit assessment');
			}

			const creditResult = {
				isSelected: mlResult.results[0].prediction === 1,
				score: Math.round(mlResult.results[0].probability * 100)
			};

			// Update prediction using helper function with correct ID
			await updatePrediction(authUserId, creditResult.isSelected, creditResult.score);

			// Refresh only user data dependency
			await invalidate('user:data');

			// Show success message
			alert(`Your information has been updated successfully! Your credit assessment score is ${creditResult.score}%`);

			// Redirect to dashboard with fresh data
			goto('/dashboard');
		} catch (error: unknown) {
			console.error('[Client] Error submitting form:', error);
			if (error instanceof Error) {
				alert(error.message || 'Failed to process your information');
			} else {
				alert('Failed to process your information');
			}
		}
	};

	// Helper function to check if a field should be disabled
	function isFieldDisabled(fieldName: string): boolean {
		const nonEditableFields = ['email', 'mobile', 'full_name'];
		return nonEditableFields.includes(fieldName);
	}
</script>

<div class="min-h-screen py-12">
	<div class="mx-auto px-4 sm:px-6 lg:px-8">
		<div class="rounded-lg bg-white p-6 md:p-8">
			<h2 class="mb-6 text-2xl font-bold text-gray-800">Complete Your Profile</h2>

			{#if validationErrors.length > 0}
				<div class="mb-6 rounded-lg bg-red-50 p-4">
					<h3 class="mb-2 text-lg font-medium text-red-800">Please fix the following errors:</h3>
					<ul class="list-inside list-disc text-red-700">
						{#each validationErrors as error}
							<li>{error.message}</li>
						{/each}
					</ul>
				</div>
			{/if}

			<form on:submit|preventDefault={handleSubmit} class="space-y-6">
				<!-- Basic Information -->
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div>
						<label for="age" class="block text-sm font-medium text-gray-700">Age</label>
						<input
							id="age"
							type="number"
							bind:value={formData.age}
							min="18"
							max="100"
							required
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 {validationErrors.find(e => e.field === 'age') ? 'border-red-500' : ''}"
						/>
						{#if validationErrors.find(e => e.field === 'age')}
							<p class="mt-1 text-sm text-red-600">{validationErrors.find(e => e.field === 'age')?.message}</p>
						{/if}
					</div>

					<div>
						<label for="gender" class="block text-sm font-medium text-gray-700">Gender</label>
						<select
							id="gender"
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
						<label for="maritalStatus" class="block text-sm font-medium text-gray-700">Marital Status</label>
						<select
							id="maritalStatus"
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
						<label for="familyMembers" class="block text-sm font-medium text-gray-700">Number of Family Members</label>
						<input
							id="familyMembers"
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
						<label for="isPrimaryEarner" class="block text-sm font-medium text-gray-700"
							>Are you the Primary Earner?</label
						>
						<select
							id="isPrimaryEarner"
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
						<label for="relationWithPrimaryEarner" class="block text-sm font-medium text-gray-700"
							>Relation with Primary Earner</label
						>
						<input
							id="relationWithPrimaryEarner"
							type="text"
							bind:value={formData.relationWithPrimaryEarner}
							placeholder="If not primary earner"
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
						/>
					</div>

					<div>
						<label for="education" class="block text-sm font-medium text-gray-700">Education</label>
						<select
							id="education"
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
								<label for={"skill-" + index} class="block text-sm font-medium text-gray-700">Skill {index + 1}</label>
								<select
									id={"skill-" + index}
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
								<label for={"rating-" + index} class="block text-sm font-medium text-gray-700">Rating (out of 10)</label>
								<input
									id={"rating-" + index}
									type="number"
									bind:value={formData.skills[index].rating}
									min="1"
									max="10"
									required={formData.skills[index].skill !== ''}
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label for={"years-" + index} class="block text-sm font-medium text-gray-700">Years of Experience</label>
								<input
									id={"years-" + index}
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
						<label for="hasCertification" class="block text-sm font-medium text-gray-700"
							>Do you have any certification?</label
						>
						<select
							id="hasCertification"
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

<style>
	/* Add global styles for SVG icons */
	:global(svg[width="1.25rem"]) {
		width: 20px;
	}
	:global(svg[height="1.25rem"]) {
		height: 20px;
	}
</style>
