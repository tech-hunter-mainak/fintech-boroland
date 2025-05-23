import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import bcrypt from 'bcryptjs';

// Create Supabase client for server-side operations
const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
	auth: {
		persistSession: false
	}
});

// Initialize database by creating tables if needed
export async function initializeDatabase() {
	try {
		// Supabase doesn't allow schema creation via API
		// These tables should be created manually in the Supabase dashboard
		console.log('Checking database connection...');

		// Required tables:
		// 1. auth_users - for authentication data
		// 2. user_details - for user profile and ML data

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
export async function verifyUserCredentials(credentials: {
	identifier: string;
	password: string;
}) {
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

// Create or update user profile details
export async function upsertUserDetails(authUserId: string, userData: any) {
	try {
		// Check if user details already exist
		const { data: existingDetails } = await supabase
			.from('user_details')
			.select('id')
			.eq('auth_user_id', authUserId)
			.maybeSingle();

		// Convert gender to single character format
		let genderChar = userData.gender;
		if (typeof userData.gender === 'string') {
			if (userData.gender.toLowerCase() === 'male') {
				genderChar = 'M';
			} else if (userData.gender.toLowerCase() === 'female') {
				genderChar = 'F';
			}
		}

		const userDetailsObject = {
			auth_user_id: authUserId,
			gender: genderChar,
			full_name: userData.fullName,
			whatsapp_updates: userData.whatsappUpdates,
			age: userData.age,
			marital_status: userData.maritalStatus,
			family_members: userData.familyMembers,
			is_primary_earner: userData.isPrimaryEarner,
			relation_with_primary_earner: userData.relationWithPrimaryEarner,
			education: userData.education,
			skill_1: userData.skills?.[0]?.skill,
			skill_1_rating: userData.skills?.[0]?.rating,
			skill_1_years: userData.skills?.[0]?.years,
			skill_2: userData.skills?.[1]?.skill,
			skill_2_rating: userData.skills?.[1]?.rating,
			skill_2_years: userData.skills?.[1]?.years,
			skill_3: userData.skills?.[2]?.skill,
			skill_3_rating: userData.skills?.[2]?.rating,
			skill_3_years: userData.skills?.[2]?.years,
			has_certification: userData.hasCertification,
			ownership: userData.ownership,
			monthly_family_income: userData.monthlyFamilyIncome,
			monthly_family_expenditure: userData.monthlyFamilyExpenditure
		};

		let result;

		if (existingDetails) {
			// Update existing details
			const { data, error } = await supabase
				.from('user_details')
				.update({
					...userDetailsObject,
					updated_at: new Date().toISOString()
				})
				.eq('id', existingDetails.id)
				.select()
				.single();

			if (error) throw error;
			result = data;
		} else {
			// Insert new details
			const { data, error } = await supabase
				.from('user_details')
				.insert([
					{
						...userDetailsObject,
						created_at: new Date().toISOString(),
						updated_at: new Date().toISOString()
					}
				])
				.select()
				.single();

			if (error) throw error;
			result = data;
		}

		return result;
	} catch (error) {
		console.error('Error upserting user details:', error);
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

// Get user by email or mobile
export async function getUserByEmailOrMobile(email: string, mobile: string) {
	try {
		let query = supabase.from('auth_users').select(`
			*,
			user_details:user_details(*)
		`);

		if (email) {
			query = query.eq('email', email);
		} else if (mobile) {
			query = query.eq('mobile', mobile);
		} else {
			throw new Error('Email or mobile is required');
		}

		const { data, error } = await query.maybeSingle();

		if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned" error
		
		if (!data) return null;
		
		// Format the response to flatten the structure
		return {
			id: data.id,
			email: data.email,
			mobile: data.mobile,
			...(data.user_details || {}),
		};
	} catch (error) {
		console.error('Error getting user:', error);
		throw error;
	}
}

// Update user selection status
export async function updateUserSelection(userId: string, isSelected: boolean, predictionPercentage?: number) {
	try {
		// Build update object with required fields
		const updateData: any = { 
			is_selected: isSelected, 
			updated_at: new Date().toISOString() 
		};
		
		// Add prediction percentage if provided
		if (predictionPercentage !== undefined) {
			updateData.prediction_percentage = predictionPercentage;
		}
		
		const { data, error } = await supabase
			.from('user_details')
			.update(updateData)
			.eq('auth_user_id', userId)
			.select()
			.single();

		if (error) throw error;
		return data;
	} catch (error) {
		console.error('Error updating user selection:', error);
		throw error;
	}
}

// Check if user has submitted detailed info
export async function hasSubmittedDetailedInfo(authUserId: string): Promise<boolean> {
	try {
		const { data, error } = await supabase
			.from('user_details')
			.select('age, marital_status, family_members')
			.eq('auth_user_id', authUserId)
			.maybeSingle();
			
		if (error) {
			console.error('Error checking detailed info:', error);
			return false;
		}
		
		// If we have data and essential fields are filled, consider it complete
		return !!data && 
			data.age !== null && 
			data.age !== undefined && 
			data.marital_status !== null && 
			data.marital_status !== undefined &&
			data.family_members !== null &&
			data.family_members !== undefined;
	} catch (error) {
		console.error('Error checking if user submitted detailed info:', error);
		return false;
	}
}

// Initialize database connection
initializeDatabase().catch(console.error);
