-- Create auth_users table for authentication
CREATE TABLE IF NOT EXISTS auth_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  mobile VARCHAR(15) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_details table for profile data
CREATE TABLE IF NOT EXISTS user_details (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id UUID REFERENCES auth_users(id) ON DELETE CASCADE,
  gender VARCHAR(1), -- 'M' or 'F'
  full_name VARCHAR(255),
  whatsapp_updates BOOLEAN DEFAULT FALSE,
  age INTEGER,
  marital_status VARCHAR(1), -- 'Y' or 'N'
  family_members INTEGER,
  is_primary_earner VARCHAR(1), -- 'Y' or 'N'
  relation_with_primary_earner VARCHAR(255),
  education VARCHAR(255),
  skill_1 VARCHAR(255),
  skill_1_rating INTEGER,
  skill_1_years INTEGER,
  skill_2 VARCHAR(255),
  skill_2_rating INTEGER,
  skill_2_years INTEGER,
  skill_3 VARCHAR(255),
  skill_3_rating INTEGER,
  skill_3_years INTEGER,
  has_certification VARCHAR(3), -- 'Yes' or 'No'
  ownership TEXT[], -- Array of ownership types
  monthly_family_income DECIMAL(10, 2),
  monthly_family_expenditure DECIMAL(10, 2),
  is_selected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(auth_user_id)
);

-- Create indices for better query performance
CREATE INDEX IF NOT EXISTS idx_user_details_auth_user_id ON user_details(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_auth_users_email ON auth_users(email);
CREATE INDEX IF NOT EXISTS idx_auth_users_mobile ON auth_users(mobile); 

-- also you need to alter the user_details to have a prediction_percentage numeric column