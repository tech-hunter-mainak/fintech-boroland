import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

// Create a single supabase client for interacting with your database
const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
    },
    db: {
        schema: 'public'
    },
    global: {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        }
    },
    realtime: {
        params: {
            eventsPerSecond: 10
        }
    }
});

// Error handling wrapper
export const handleSupabaseError = (error: any) => {
    console.error('[Supabase] Error:', error);
    if (error.status === 406) {
        console.error('[Supabase] Not Acceptable - Check request headers and data format');
    }
    throw error;
};

export default supabase;

// Helper types for database tables
export interface AuthUser {
    id: string;
    email: string;
    mobile: string;
    password_hash: string;
    created_at: string;
    updated_at: string;
}

export interface UserDetails {
    id: string;
    auth_user_id: string;
    full_name: string | null;
    gender: string | null;
    age: number | null;
    marital_status: string | null;
    family_members: number | null;
    is_primary_earner: string | null;
    relation_with_primary_earner: string | null;
    education: string | null;
    skill_1: string | null;
    skill_1_rating: number | null;
    skill_1_years: number | null;
    skill_2: string | null;
    skill_2_rating: number | null;
    skill_2_years: number | null;
    skill_3: string | null;
    skill_3_rating: number | null;
    skill_3_years: number | null;
    has_certification: string | null;
    ownership: string[] | null;
    monthly_family_income: number | null;
    monthly_family_expenditure: number | null;
    is_selected: boolean | null;
    prediction_percentage: number | null;
    created_at: string;
    updated_at: string;
    whatsappUpdates?: boolean;
    isOtpValidated?: boolean;
}

// Database helper functions
export async function fetchUserById(userId: string) {
    try {
        // Get auth user
        const { data: authUser, error: authError } = await supabase
            .from('auth_users')
            .select()
            .eq('id', userId)
            .maybeSingle();

        if (authError) handleSupabaseError(authError);

        // Get user details
        const { data: userDetails, error: detailsError } = await supabase
            .from('user_details')
            .select()
            .eq('auth_user_id', userId)
            .maybeSingle();

        if (detailsError) handleSupabaseError(detailsError);

        // Combine the data
        return {
            ...authUser,
            ...(userDetails || {}),
            hasSubmittedDetails: !!userDetails
        };
    } catch (error) {
        console.error('[Supabase] Error fetching user:', error);
        throw error;
    }
}

export async function updateUserDetails(userId: string, details: Partial<UserDetails>) {
    try {
        // First check if a record exists
        const { data: existingRecord, error: checkError } = await supabase
            .from('user_details')
            .select('id')
            .eq('auth_user_id', userId)
            .maybeSingle();

        if (checkError) handleSupabaseError(checkError);

        let result;
        if (existingRecord) {
            // Update existing record
            const { data, error } = await supabase
                .from('user_details')
                .update({
                    ...details,
                    updated_at: new Date().toISOString()
                })
                .eq('auth_user_id', userId)
                .select()
                .single();

            if (error) handleSupabaseError(error);
            result = data;
        } else {
            // Insert new record
            const { data, error } = await supabase
                .from('user_details')
                .insert({
                    auth_user_id: userId,
                    ...details,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) handleSupabaseError(error);
            result = data;
        }

        return result;
    } catch (error) {
        console.error('[Supabase] Error updating user details:', error);
        throw error;
    }
}

export async function updatePrediction(userId: string, isSelected: boolean, predictionPercentage: number) {
    try {
        // First check if a record exists
        const { data: existingRecord, error: checkError } = await supabase
            .from('user_details')
            .select('id')
            .eq('auth_user_id', userId)
            .maybeSingle();

        if (checkError) handleSupabaseError(checkError);

        let result;
        if (existingRecord) {
            // Update existing record
            const { data, error } = await supabase
                .from('user_details')
                .update({
                    is_selected: isSelected,
                    prediction_percentage: predictionPercentage,
                    updated_at: new Date().toISOString()
                })
                .eq('auth_user_id', userId)
                .select()
                .single();

            if (error) handleSupabaseError(error);
            result = data;
        } else {
            // Insert new record
            const { data, error } = await supabase
                .from('user_details')
                .insert({
                    auth_user_id: userId,
                    is_selected: isSelected,
                    prediction_percentage: predictionPercentage,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) handleSupabaseError(error);
            result = data;
        }

        return result;
    } catch (error) {
        console.error('[Supabase] Error updating prediction:', error);
        throw error;
    }
}
