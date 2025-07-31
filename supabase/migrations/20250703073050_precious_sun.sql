/*
  # Add User Recommendations Table

  1. New Table
    - `user_recommendations` - Store AI-generated skincare recommendations
    
  2. Security
    - Enable RLS on recommendations table
    - Users can only access their own recommendations
    
  3. Indexes
    - Add performance indexes for common queries
*/

-- Create user recommendations table
CREATE TABLE IF NOT EXISTS user_recommendations (
  recommendation_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES skin_assessments(assessment_id) ON DELETE CASCADE,
  
  -- Recommendation Data
  recommendations_data JSONB NOT NULL DEFAULT '{}'::JSONB,
  user_profile JSONB DEFAULT '{}'::JSONB,
  routine_suggestions JSONB DEFAULT '{}'::JSONB,
  warnings JSONB DEFAULT '[]'::JSONB,
  timeline JSONB DEFAULT '{}'::JSONB,
  follow_up_recommendations JSONB DEFAULT '{}'::JSONB,
  
  -- Metadata
  algorithm_version VARCHAR(20) DEFAULT 'v1.0',
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  
  -- User Feedback
  user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
  user_feedback TEXT,
  feedback_date TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE user_recommendations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own recommendations" ON user_recommendations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own recommendations" ON user_recommendations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recommendations" ON user_recommendations
  FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_recommendations_user_id ON user_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_recommendations_assessment_id ON user_recommendations(assessment_id);
CREATE INDEX IF NOT EXISTS idx_user_recommendations_generated_at ON user_recommendations(generated_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_recommendations_active ON user_recommendations(is_active);

-- Add function to automatically deactivate old recommendations when new ones are created
CREATE OR REPLACE FUNCTION deactivate_old_recommendations()
RETURNS TRIGGER AS $$
BEGIN
  -- Deactivate previous recommendations for the same user
  UPDATE user_recommendations 
  SET is_active = false 
  WHERE user_id = NEW.user_id 
    AND recommendation_id != NEW.recommendation_id 
    AND is_active = true;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically deactivate old recommendations
CREATE TRIGGER trigger_deactivate_old_recommendations
  AFTER INSERT ON user_recommendations
  FOR EACH ROW EXECUTE FUNCTION deactivate_old_recommendations();