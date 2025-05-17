import postgres from 'postgres';
import { env } from '$env/dynamic/private';

// Create the SQL client
const sql = postgres('postgresql://postgres:HCeHiVexynXOCUpQCgyAKjiKyOZlrdVp@gondola.proxy.rlwy.net:33210/railway', {
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10
});

// Initialize database by creating tables if they don't exist
export async function initializeDatabase() {
  try {
    // Create users table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        gender VARCHAR(10) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        mobile VARCHAR(15) NOT NULL UNIQUE,
        whatsapp_updates BOOLEAN DEFAULT false,
        age INTEGER,
        marital_status VARCHAR(5),
        family_members INTEGER,
        is_primary_earner VARCHAR(5),
        relation_with_primary_earner VARCHAR(100),
        education VARCHAR(50),
        skill_1 VARCHAR(100),
        skill_1_rating INTEGER,
        skill_1_years INTEGER,
        skill_2 VARCHAR(100),
        skill_2_rating INTEGER,
        skill_2_years INTEGER,
        skill_3 VARCHAR(100),
        skill_3_rating INTEGER,
        skill_3_years INTEGER,
        has_certification VARCHAR(5),
        ownership TEXT[],
        monthly_family_income DECIMAL,
        monthly_family_expenditure DECIMAL,
        is_selected BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Create or update user
export async function upsertUser(userData: any) {
  try {
    // First, try to find if user exists by email or mobile
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${userData.email} OR mobile = ${userData.mobile}
    `;

    if (existingUser.length > 0) {
      // Update existing user
      const userId = existingUser[0].id;
      const result = await sql`
        UPDATE users 
        SET 
          gender = ${userData.gender},
          full_name = ${userData.fullName},
          email = ${userData.email},
          mobile = ${userData.mobile},
          whatsapp_updates = ${userData.whatsappUpdates},
          age = ${userData.age},
          marital_status = ${userData.maritalStatus},
          family_members = ${userData.familyMembers},
          is_primary_earner = ${userData.isPrimaryEarner},
          relation_with_primary_earner = ${userData.relationWithPrimaryEarner},
          education = ${userData.education},
          skill_1 = ${userData.skills?.[0]?.skill},
          skill_1_rating = ${userData.skills?.[0]?.rating},
          skill_1_years = ${userData.skills?.[0]?.years},
          skill_2 = ${userData.skills?.[1]?.skill},
          skill_2_rating = ${userData.skills?.[1]?.rating},
          skill_2_years = ${userData.skills?.[1]?.years},
          skill_3 = ${userData.skills?.[2]?.skill},
          skill_3_rating = ${userData.skills?.[2]?.rating},
          skill_3_years = ${userData.skills?.[2]?.years},
          has_certification = ${userData.hasCertification},
          ownership = ${userData.ownership},
          monthly_family_income = ${userData.monthlyFamilyIncome},
          monthly_family_expenditure = ${userData.monthlyFamilyExpenditure},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${userId}
        RETURNING *
      `;
      return result[0];
    } else {
      // Insert new user
      const result = await sql`
        INSERT INTO users (
          gender, full_name, email, mobile, whatsapp_updates,
          age, marital_status, family_members, is_primary_earner,
          relation_with_primary_earner, education,
          skill_1, skill_1_rating, skill_1_years,
          skill_2, skill_2_rating, skill_2_years,
          skill_3, skill_3_rating, skill_3_years,
          has_certification, ownership,
          monthly_family_income, monthly_family_expenditure
        )
        VALUES (
          ${userData.gender},
          ${userData.fullName},
          ${userData.email},
          ${userData.mobile},
          ${userData.whatsappUpdates},
          ${userData.age},
          ${userData.maritalStatus},
          ${userData.familyMembers},
          ${userData.isPrimaryEarner},
          ${userData.relationWithPrimaryEarner},
          ${userData.education},
          ${userData.skills?.[0]?.skill},
          ${userData.skills?.[0]?.rating},
          ${userData.skills?.[0]?.years},
          ${userData.skills?.[1]?.skill},
          ${userData.skills?.[1]?.rating},
          ${userData.skills?.[1]?.years},
          ${userData.skills?.[2]?.skill},
          ${userData.skills?.[2]?.rating},
          ${userData.skills?.[2]?.years},
          ${userData.hasCertification},
          ${userData.ownership},
          ${userData.monthlyFamilyIncome},
          ${userData.monthlyFamilyExpenditure}
        )
        RETURNING *
      `;
      return result[0];
    }
  } catch (error) {
    console.error('Error upserting user:', error);
    throw error;
  }
}

// Get user by email or mobile
export async function getUserByEmailOrMobile(email: string, mobile: string) {
  try {
    const result = await sql`
      SELECT * FROM users WHERE email = ${email} OR mobile = ${mobile}
    `;
    return result[0] || null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

// Update user selection status
export async function updateUserSelection(userId: number, isSelected: boolean) {
  try {
    const result = await sql`
      UPDATE users 
      SET is_selected = ${isSelected}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${userId} 
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error updating user selection:', error);
    throw error;
  }
}

// Initialize database when this module is imported
initializeDatabase().catch(console.error); 