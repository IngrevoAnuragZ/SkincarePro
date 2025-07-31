/*
  # Complete Authentication System Setup

  1. User Profiles Table
    - Extends Supabase auth.users with custom profile data
    - Stores user preferences and skincare information
    
  2. Enhanced User Assessments
    - Links to user profiles for personalized data
    - Stores comprehensive skin assessment results
    
  3. User Favorites System
    - Allows users to save favorite products and ingredients
    
  4. Security Policies
    - Row Level Security for all user data
    - Users can only access their own information
*/

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name VARCHAR(100),
  age_range VARCHAR(20),
  phone_number VARCHAR(20),
  skin_goals TEXT[] DEFAULT ARRAY[]::TEXT[],
  lifestyle VARCHAR(50),
  notification_preferences JSONB DEFAULT '{
    "email": true,
    "sms": false,
    "routine_reminders": true,
    "product_updates": true
  }'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create enhanced skin assessments table
CREATE TABLE IF NOT EXISTS skin_assessments (
  assessment_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Skin Info
  skin_type VARCHAR(50) NOT NULL,
  skin_concerns TEXT[] DEFAULT ARRAY[]::TEXT[],
  skin_sensitivity INTEGER DEFAULT 3,
  
  -- Medical Conditions
  medical_conditions TEXT[] DEFAULT ARRAY[]::TEXT[],
  other_medical_condition TEXT,
  current_medications TEXT,
  
  -- Lifestyle Factors
  age_range VARCHAR(20),
  gender VARCHAR(20),
  climate VARCHAR(30),
  lifestyle_factors TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Current Routine
  current_products JSONB DEFAULT '{}'::JSONB,
  routine_frequency VARCHAR(30),
  budget_range VARCHAR(30),
  
  -- Goals & Preferences
  primary_goals TEXT[] DEFAULT ARRAY[]::TEXT[],
  ingredient_preferences TEXT[] DEFAULT ARRAY[]::TEXT[],
  ingredient_allergies TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Assessment Metadata
  assessment_score INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user routines table
CREATE TABLE IF NOT EXISTS user_routines (
  routine_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES skin_assessments(assessment_id) ON DELETE SET NULL,
  
  -- Routine Details
  routine_type VARCHAR(20) NOT NULL, -- 'morning', 'afternoon', 'evening'
  routine_steps JSONB DEFAULT '[]'::JSONB, -- Array of steps with products
  estimated_time INTEGER DEFAULT 15, -- in minutes
  
  -- Customization
  custom_timing TIME,
  active_days TEXT[] DEFAULT ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']::TEXT[],
  calendar_integrated BOOLEAN DEFAULT false,
  
  -- Tracking
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used TIMESTAMP WITH TIME ZONE,
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- Create user favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
  favorite_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type VARCHAR(20) NOT NULL, -- 'product', 'ingredient', 'routine'
  item_id VARCHAR(100) NOT NULL, -- Reference to product/ingredient ID
  item_name VARCHAR(200) NOT NULL,
  item_data JSONB DEFAULT '{}'::JSONB, -- Store additional item information
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Prevent duplicate favorites
  UNIQUE(user_id, item_type, item_id)
);

-- Create user progress tracking table
CREATE TABLE IF NOT EXISTS user_progress (
  progress_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  routine_id UUID REFERENCES user_routines(routine_id) ON DELETE CASCADE,
  
  -- Progress Data
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  completed_steps INTEGER DEFAULT 0,
  total_steps INTEGER DEFAULT 0,
  completion_percentage DECIMAL(5,2) DEFAULT 0.00,
  
  -- Notes and Photos
  notes TEXT,
  photo_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 5),
  skin_condition_rating INTEGER CHECK (skin_condition_rating >= 1 AND skin_condition_rating <= 5),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Prevent duplicate entries per day
  UNIQUE(user_id, routine_id, date)
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skin_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for skin_assessments
CREATE POLICY "Users can view own assessments" ON skin_assessments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own assessments" ON skin_assessments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assessments" ON skin_assessments
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for user_routines
CREATE POLICY "Users can view own routines" ON user_routines
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own routines" ON user_routines
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own routines" ON user_routines
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own routines" ON user_routines
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user_favorites
CREATE POLICY "Users can view own favorites" ON user_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own favorites" ON user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON user_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user_progress
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_skin_assessments_user_id ON skin_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_skin_assessments_completed_at ON skin_assessments(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_routines_user_id ON user_routines(user_id);
CREATE INDEX IF NOT EXISTS idx_user_routines_type ON user_routines(routine_type);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_type ON user_favorites(item_type);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_date ON user_progress(date DESC);

-- Create function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, full_name, age_range)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'age_range', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_skin_assessments_updated_at
  BEFORE UPDATE ON skin_assessments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample user data for demo (this would normally be created through signup)
-- Note: This is just for demo purposes, real users will be created through the auth system