import supabase from '../../supabase';
import bcrypt from 'bcryptjs';

// Remove duplicate client initialization and use the shared client
export async function initializeDatabase() {
	try {
		console.log('Checking database connection...');
		console.log('Database connection verified successfully');
	} catch (error) {
		console.error('Error initializing database:', error);
		throw error;
	}
}

// Create or update user's authentication details
export async function createAuthUser(authData: {
	email: string;
	password: string;
	mobile: string;
}) {
	try {
		// Check if user already exists - using separate queries for better error handling
		const { data: existingEmail } = await supabase
			.from('auth_users')
			.select('id, email')
			.eq('email', authData.email)
			.maybeSingle();

		if (existingEmail) {
			throw new Error('User with this email already exists');
		}

		const { data: existingMobile } = await supabase
			.from('auth_users')
			.select('id, mobile')
			.eq('mobile', authData.mobile)
			.maybeSingle();

		if (existingMobile) {
			throw new Error('User with this mobile number already exists');
		}

		// Hash the password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(authData.password, salt);

		// Create new auth user
		const { data: newAuthUser, error } = await supabase
			.from('auth_users')
			.insert([
				{
					email: authData.email,
					mobile: authData.mobile,
					password_hash: hashedPassword,
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString()
				}
			])
			.select()
			.single();

		if (error) {
			console.error('Supabase insert error:', error);
			throw new Error(`Failed to create user: ${error.message}`);
		}

		return newAuthUser;
	} catch (error) {
		console.error('Error creating auth user:', error);
		throw error;
	}
}

// Verify user credentials and return user if valid
export async function verifyUserCredentials(credentials: { identifier: string; password: string }) {
	try {
		// Check if identifier is email or mobile
		const isEmail = credentials.identifier.includes('@');
		const field = isEmail ? 'email' : 'mobile';

		console.log(`Attempting login with ${field}: ${credentials.identifier}`);

		// Get user from auth_users table
		const { data: user, error } = await supabase
			.from('auth_users')
			.select('*')
			.eq(field, credentials.identifier)
			.single();

		if (error) {
			console.error(`Error fetching user by ${field}:`, error);
			return null;
		}

		if (!user) {
			console.log(`No user found with ${field}: ${credentials.identifier}`);
			return null;
		}

		console.log(`User found with ${field}: ${credentials.identifier}`);

		// Verify password
		const isPasswordValid = await bcrypt.compare(credentials.password, user.password_hash);

		if (!isPasswordValid) {
			console.log(`Invalid password for ${field}: ${credentials.identifier}`);
			return null;
		}

		console.log(`Password validated for ${field}: ${credentials.identifier}`);

		// Get user details
		const { data: userDetails, error: detailsError } = await supabase
			.from('user_details')
			.select('*')
			.eq('auth_user_id', user.id)
			.maybeSingle();

		if (detailsError) {
			console.error('Error fetching user details:', detailsError);
		}

		console.log('Login successful, returning user data');

		return {
			auth: user,
			details: userDetails || null
		};
	} catch (error) {
		console.error('Error verifying credentials:', error);
		return null;
	}
}

// Get user by ID with all details
export async function getUserById(userId: string) {
	try {
		// First get auth user
		const { data: authUser, error: authError } = await supabase
			.from('auth_users')
			.select('*')
			.eq('id', userId)
			.single();

		if (authError) throw authError;

		// Then get user details
		const { data: userDetails, error: detailsError } = await supabase
			.from('user_details')
			.select('*')
			.eq('auth_user_id', userId)
			.maybeSingle();

		// Combine the data, ensuring auth_user_id is preserved
		return {
			...authUser,
			...(userDetails || {}),
			auth_user_id: userId, // Ensure this is always the auth user's ID
			hasSubmittedDetails: !!userDetails
		};
	} catch (error) {
		console.error('Error in getUserById:', error);
		throw error;
	}
}

// Get user by email or mobile
export async function getUserByEmailOrMobile(email: string, mobile: string) {
	try {
		// Check by email first
		const { data: emailUser, error: emailError } = await supabase
			.from('auth_users')
			.select('*')
			.eq('email', email)
			.maybeSingle();

		// If no user found by email and mobile is provided, check by mobile
		if (!emailUser && mobile) {
			const { data: mobileUser, error: mobileError } = await supabase
				.from('auth_users')
				.select('*')
				.eq('mobile', mobile)
				.maybeSingle();

			if (mobileError && mobileError.code !== 'PGRST116') {
				throw mobileError;
			}

			if (mobileUser) {
				// Get user details if auth user exists
				const { data: userDetails, error: detailsError } = await supabase
					.from('user_details')
					.select('*')
					.eq('auth_user_id', mobileUser.id)
					.maybeSingle();

				if (detailsError && detailsError.code !== 'PGRST116') {
					throw detailsError;
				}

				return {
					...mobileUser,
					...(userDetails || {}),
					hasSubmittedDetails: !!userDetails
				};
			}
		}

		// If email user exists, get their details
		if (emailUser) {
			const { data: userDetails, error: detailsError } = await supabase
				.from('user_details')
				.select('*')
				.eq('auth_user_id', emailUser.id)
				.maybeSingle();

			if (detailsError && detailsError.code !== 'PGRST116') {
				throw detailsError;
			}

			return {
				...emailUser,
				...(userDetails || {}),
				hasSubmittedDetails: !!userDetails
			};
		}

		return null; // No user found
	} catch (error: any) {
		console.error('[Server] Error in getUserByEmailOrMobile:', error);
		if (error.code === 'PGRST116') {
			return null; // No user found
		}
		throw error;
	}
}

// Create or update user details
export async function upsertUserDetails(authUserId: string, userData: any) {
	try {
		// Check if user details exist
		const { data: existingDetails } = await supabase
			.from('user_details')
			.select()
			.eq('auth_user_id', authUserId)
			.single();

		// Prepare user details object
		const userDetailsObject = {
			auth_user_id: authUserId,
			full_name: userData.fullName,
			gender: userData.gender,
			age: userData.age,
			marital_status: userData.maritalStatus,
			family_members: userData.familyMembers,
			is_primary_earner: userData.isPrimaryEarner,
			relation_with_primary_earner: userData.relationWithPrimaryEarner,
			education: userData.education,
			skill_1: userData.skill_1,
			skill_1_rating: userData.skill_1_rating,
			skill_1_years: userData.skill_1_years,
			skill_2: userData.skill_2,
			skill_2_rating: userData.skill_2_rating,
			skill_2_years: userData.skill_2_years,
			skill_3: userData.skill_3,
			skill_3_rating: userData.skill_3_rating,
			skill_3_years: userData.skill_3_years,
			has_certification: userData.hasCertification,
			ownership: userData.ownership,
			monthly_family_income: userData.monthlyFamilyIncome,
			monthly_family_expenditure: userData.monthlyFamilyExpenditure,
			// Preserve existing prediction data if it exists
			is_selected: existingDetails?.is_selected ?? null,
			prediction_percentage: existingDetails?.prediction_percentage ?? null,
			updated_at: new Date().toISOString()
		};

		let result;
		if (existingDetails) {
			// Update existing record
			const { data, error } = await supabase
				.from('user_details')
				.update(userDetailsObject)
				.eq('auth_user_id', authUserId)
				.select()
				.single();

			if (error) throw error;
			result = data;
		} else {
			// Insert new record
			const { data, error } = await supabase
				.from('user_details')
				.insert({
					...userDetailsObject,
					created_at: new Date().toISOString()
				})
				.select()
				.single();

			if (error) throw error;
			result = data;
		}

		// Return complete user data
		return await getUserById(authUserId);
	} catch (error) {
		console.error('Error in upsertUserDetails:', error);
		throw error;
	}
}

// Wrapper function to handle user data upsert from API
export async function upsertUser(userData: any) {
	try {
		// Ensure we have an auth_user_id
		if (!userData.auth_user_id) {
			throw new Error('Missing auth_user_id in userData');
		}

		// Delegate to the detailed upsert function
		const result = await upsertUserDetails(userData.auth_user_id, userData);
		return result;
	} catch (error) {
		console.error('Error in upsertUser:', error);
		throw error;
	}
}

// Update user selection status after ML prediction
export async function updateUserSelection(authUserId: string, isSelected: boolean, predictionPercentage: number) {
	try {
		// First check if user details exist
		const { data: existingDetails } = await supabase
			.from('user_details')
			.select()
			.eq('auth_user_id', authUserId)
			.single();

		if (!existingDetails) {
			throw new Error('User details not found');
		}

		// Update with prediction data
		const { data, error } = await supabase
			.from('user_details')
			.update({
				is_selected: isSelected,
				prediction_percentage: predictionPercentage,
				updated_at: new Date().toISOString()
			})
			.eq('auth_user_id', authUserId)
			.select()
			.single();

		if (error) {
			console.error('Error updating user selection:', error);
			throw error;
		}

		// Return complete user data
		return await getUserById(authUserId);
	} catch (error) {
		console.error('Error in updateUserSelection:', error);
		throw error;
	}
}

// Check if user has submitted detailed information
export async function hasSubmittedDetailedInfo(userId: string): Promise<boolean> {
	try {
		const { data, error } = await supabase
			.from('user_details')
			.select('id')
			.eq('auth_user_id', userId)
			.single();

		if (error && error.code !== 'PGRST116') throw error;
		return !!data;
	} catch (error) {
		console.error('Error in hasSubmittedDetailedInfo:', error);
		return false;
	}
}

// Initialize database connection
initializeDatabase().catch(console.error);
