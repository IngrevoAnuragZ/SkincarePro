/*
  # Enhanced Skincare Database Schema

  1. New Tables
    - `ingredients` - Comprehensive ingredient database with natural sources
    - `products` - Product catalog with ingredient lists
    - `user_assessments` - User skin assessment data
    - `calendar_integrations` - Google Calendar integration settings

  2. Security
    - Enable RLS on all tables
    - Add policies for public ingredient/product access
    - Add user-specific policies for assessments and calendar data

  3. Sample Data
    - Populate ingredients with natural sources and compatibility info
    - Add sample products for testing
*/

-- Create ingredients table with natural sources
CREATE TABLE IF NOT EXISTS ingredients (
  ingredient_id SERIAL PRIMARY KEY,
  ingredient_name VARCHAR(100) NOT NULL,
  inci_name VARCHAR(100),
  category VARCHAR(50),
  function TEXT,
  natural_sources TEXT[] DEFAULT ARRAY[]::TEXT[],
  source_icons TEXT[] DEFAULT ARRAY[]::TEXT[],
  benefits TEXT,
  concentration_range VARCHAR(50),
  ph_range VARCHAR(20),
  compatibility_good TEXT[] DEFAULT ARRAY[]::TEXT[],
  compatibility_avoid TEXT[] DEFAULT ARRAY[]::TEXT[],
  skin_types TEXT[] DEFAULT ARRAY[]::TEXT[],
  cautions TEXT,
  safety_level VARCHAR(20) DEFAULT 'safe',
  evidence_level VARCHAR(20) DEFAULT 'medium',
  time_of_use VARCHAR(10) DEFAULT 'AM/PM',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  product_id SERIAL PRIMARY KEY,
  product_name VARCHAR(200) NOT NULL,
  brand VARCHAR(100),
  category VARCHAR(50),
  price DECIMAL(10,2),
  ingredients TEXT[] DEFAULT ARRAY[]::TEXT[],
  skin_types TEXT[] DEFAULT ARRAY[]::TEXT[],
  concerns_addressed TEXT[] DEFAULT ARRAY[]::TEXT[],
  rating DECIMAL(3,2),
  review_count INTEGER DEFAULT 0,
  availability BOOLEAN DEFAULT true,
  image_url TEXT,
  description TEXT,
  usage_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user assessments table
CREATE TABLE IF NOT EXISTS user_assessments (
  assessment_id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  skin_type VARCHAR(50),
  skin_concerns TEXT[] DEFAULT ARRAY[]::TEXT[],
  medical_conditions TEXT[] DEFAULT ARRAY[]::TEXT[],
  age_range VARCHAR(20),
  lifestyle_factors TEXT[] DEFAULT ARRAY[]::TEXT[],
  current_routine TEXT,
  goals TEXT[] DEFAULT ARRAY[]::TEXT[],
  assessment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create calendar integrations table
CREATE TABLE IF NOT EXISTS calendar_integrations (
  integration_id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  assessment_id INTEGER REFERENCES user_assessments(assessment_id),
  morning_time TIME,
  afternoon_time TIME,
  evening_time TIME,
  timezone VARCHAR(50),
  recurring_pattern VARCHAR(20) DEFAULT 'daily',
  active BOOLEAN DEFAULT true,
  google_calendar_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_integrations ENABLE ROW LEVEL SECURITY;

-- Create policies for ingredients (public read)
CREATE POLICY "Ingredients are viewable by everyone"
  ON ingredients
  FOR SELECT
  TO public
  USING (true);

-- Create policies for products (public read)
CREATE POLICY "Products are viewable by everyone"
  ON products
  FOR SELECT
  TO public
  USING (true);

-- Create policies for user assessments (user-specific)
CREATE POLICY "Users can view own assessments"
  ON user_assessments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own assessments"
  ON user_assessments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policies for calendar integrations (user-specific)
CREATE POLICY "Users can view own calendar integrations"
  ON calendar_integrations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own calendar integrations"
  ON calendar_integrations
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert sample ingredients data with natural sources
INSERT INTO ingredients (
  ingredient_name, inci_name, category, function, natural_sources, source_icons,
  benefits, concentration_range, ph_range, compatibility_good, compatibility_avoid,
  skin_types, cautions, safety_level, evidence_level, time_of_use
) VALUES 
(
  'Retinol', 'Retinol', 'anti-aging', 'Vitamin A derivative that promotes cell turnover',
  ARRAY['Sweet potatoes', 'Carrots', 'Spinach', 'Kale', 'Fish oils', 'Liver']::TEXT[],
  ARRAY['🍠', '🥕', '🥬', '🥬', '🐟', '🥩']::TEXT[],
  'Reduces fine lines, improves texture, helps with acne, fades hyperpigmentation',
  '0.01% - 1%', '5.5 - 6.5',
  ARRAY['Hyaluronic acid', 'Ceramides', 'Peptides']::TEXT[],
  ARRAY['Vitamin C', 'Benzoyl peroxide', 'AHAs', 'BHAs']::TEXT[],
  ARRAY['normal', 'combination', 'oily']::TEXT[],
  'Sun sensitivity, not recommended during pregnancy, start with low concentration',
  'caution', 'high', 'PM'
),
(
  'Vitamin C', 'L-Ascorbic Acid', 'antioxidant', 'Powerful antioxidant and brightening agent',
  ARRAY['Oranges', 'Strawberries', 'Bell peppers', 'Broccoli', 'Kakadu plum', 'Acerola cherry']::TEXT[],
  ARRAY['🍊', '🍓', '🫑', '🥦', '🍇', '🍒']::TEXT[],
  'Brightens skin, protects against free radicals, stimulates collagen production',
  '5% - 20%', '3.0 - 4.0',
  ARRAY['Vitamin E', 'Ferulic acid', 'Hyaluronic acid']::TEXT[],
  ARRAY['Retinol', 'Benzoyl peroxide', 'Copper peptides']::TEXT[],
  ARRAY['all']::TEXT[],
  'Can cause irritation in sensitive skin, may oxidize if not stored properly',
  'safe', 'high', 'AM'
),
(
  'Hyaluronic Acid', 'Sodium Hyaluronate', 'humectant', 'Powerful moisture-binding ingredient',
  ARRAY['Bone broth', 'Soybeans', 'Sweet potatoes', 'Citrus fruits', 'Root vegetables']::TEXT[],
  ARRAY['🍲', '🫘', '🍠', '🍊', '🥕']::TEXT[],
  'Intense hydration, plumps skin, reduces appearance of fine lines',
  '0.1% - 2%', '5.0 - 7.0',
  ARRAY['Vitamin C', 'Retinol', 'Niacinamide', 'Peptides']::TEXT[],
  ARRAY[]::TEXT[],
  ARRAY['all']::TEXT[],
  'Generally well-tolerated, rare allergic reactions possible',
  'safe', 'high', 'AM/PM'
),
(
  'Niacinamide', 'Niacinamide', 'anti-inflammatory', 'Vitamin B3 that regulates oil and reduces inflammation',
  ARRAY['Tuna', 'Salmon', 'Mushrooms', 'Green peas', 'Chicken breast', 'Peanuts']::TEXT[],
  ARRAY['🐟', '🐟', '🍄', '🟢', '🍗', '🥜']::TEXT[],
  'Controls oil production, minimizes pores, reduces redness, brightens skin',
  '2% - 10%', '5.0 - 7.0',
  ARRAY['Hyaluronic acid', 'Ceramides', 'Zinc']::TEXT[],
  ARRAY[]::TEXT[],
  ARRAY['all']::TEXT[],
  'Very well-tolerated, minimal side effects',
  'safe', 'high', 'AM/PM'
),
(
  'Salicylic Acid', 'Salicylic Acid', 'exfoliant', 'Beta hydroxy acid that penetrates pores',
  ARRAY['Willow bark', 'Wintergreen leaves', 'Birch bark']::TEXT[],
  ARRAY['🌿', '🍃', '🌳']::TEXT[],
  'Unclogs pores, reduces blackheads, anti-inflammatory properties',
  '0.5% - 2%', '3.0 - 4.0',
  ARRAY['Niacinamide', 'Hyaluronic acid']::TEXT[],
  ARRAY['Retinol', 'Vitamin C', 'Other acids']::TEXT[],
  ARRAY['oily', 'combination', 'acne-prone']::TEXT[],
  'Can cause dryness and irritation, increases sun sensitivity',
  'caution', 'high', 'PM'
),
(
  'Glycolic Acid', 'Glycolic Acid', 'exfoliant', 'Alpha hydroxy acid for surface exfoliation',
  ARRAY['Sugar cane', 'Pineapple', 'Unripe grapes', 'Sugar beets']::TEXT[],
  ARRAY['🎋', '🍍', '🍇', '🫐']::TEXT[],
  'Removes dead skin cells, improves texture, reduces hyperpigmentation',
  '5% - 10%', '3.0 - 4.0',
  ARRAY['Hyaluronic acid', 'Ceramides']::TEXT[],
  ARRAY['Retinol', 'Vitamin C', 'Other acids']::TEXT[],
  ARRAY['normal', 'combination', 'oily']::TEXT[],
  'Increases sun sensitivity, can cause irritation',
  'caution', 'high', 'PM'
),
(
  'Lactic Acid', 'Lactic Acid', 'exfoliant', 'Gentle alpha hydroxy acid with hydrating properties',
  ARRAY['Yogurt', 'Kefir', 'Sauerkraut', 'Aged cheese', 'Fermented foods']::TEXT[],
  ARRAY['🥛', '🥛', '🥬', '🧀', '🫙']::TEXT[],
  'Gentle exfoliation, improves hydration, brightens skin',
  '5% - 10%', '3.0 - 4.0',
  ARRAY['Hyaluronic acid', 'Ceramides']::TEXT[],
  ARRAY['Retinol', 'Other acids']::TEXT[],
  ARRAY['all']::TEXT[],
  'Milder than glycolic acid, still increases sun sensitivity',
  'caution', 'medium', 'PM'
),
(
  'Ceramides', 'Ceramide NP', 'barrier-repair', 'Lipids that restore and maintain skin barrier',
  ARRAY['Wheat germ', 'Brown rice', 'Soybeans', 'Spinach', 'Sweet potatoes']::TEXT[],
  ARRAY['🌾', '🍚', '🫘', '🥬', '🍠']::TEXT[],
  'Restores skin barrier, prevents moisture loss, soothes irritation',
  '0.1% - 5%', '5.5 - 7.0',
  ARRAY['Hyaluronic acid', 'Niacinamide', 'Cholesterol']::TEXT[],
  ARRAY[]::TEXT[],
  ARRAY['all']::TEXT[],
  'Excellent tolerance, suitable for sensitive skin',
  'safe', 'high', 'AM/PM'
),
(
  'Peptides', 'Palmitoyl Pentapeptide-4', 'anti-aging', 'Amino acid chains that signal collagen production',
  ARRAY['Bone broth', 'Fish collagen', 'Eggs', 'Lean meats', 'Legumes']::TEXT[],
  ARRAY['🍲', '🐟', '🥚', '🥩', '🫘']::TEXT[],
  'Stimulates collagen production, improves firmness, reduces wrinkles',
  '0.1% - 10%', '5.5 - 7.0',
  ARRAY['Hyaluronic acid', 'Vitamin C', 'Retinol']::TEXT[],
  ARRAY[]::TEXT[],
  ARRAY['all']::TEXT[],
  'Generally well-tolerated, rare allergic reactions',
  'safe', 'medium', 'AM/PM'
),
(
  'Vitamin E', 'Tocopherol', 'antioxidant', 'Fat-soluble antioxidant that protects cell membranes',
  ARRAY['Almonds', 'Sunflower seeds', 'Avocados', 'Olive oil', 'Spinach']::TEXT[],
  ARRAY['🌰', '🌻', '🥑', '🫒', '🥬']::TEXT[],
  'Antioxidant protection, moisturizing, wound healing support',
  '0.1% - 1%', '5.0 - 8.0',
  ARRAY['Vitamin C', 'Ferulic acid']::TEXT[],
  ARRAY[]::TEXT[],
  ARRAY['all']::TEXT[],
  'Well-tolerated, rare contact allergies possible',
  'safe', 'high', 'AM/PM'
);

-- Insert sample products
INSERT INTO products (
  product_name, brand, category, price, ingredients, skin_types, concerns_addressed,
  rating, review_count, description, usage_instructions
) VALUES 
(
  'Gentle Vitamin C Serum', 'SkinCeuticals', 'serum', 89.99,
  ARRAY['L-Ascorbic Acid', 'Vitamin E', 'Ferulic Acid']::TEXT[],
  ARRAY['all']::TEXT[], ARRAY['aging', 'hyperpigmentation', 'dullness']::TEXT[],
  4.5, 1250,
  'A potent antioxidant serum that brightens skin and provides environmental protection.',
  'Apply 2-3 drops to clean skin in the morning, follow with moisturizer and SPF.'
),
(
  'Retinol Renewal Cream', 'Paula''s Choice', 'moisturizer', 45.00,
  ARRAY['Retinol', 'Ceramides', 'Hyaluronic Acid']::TEXT[],
  ARRAY['normal', 'combination', 'oily']::TEXT[], ARRAY['aging', 'texture', 'acne']::TEXT[],
  4.3, 890,
  'A gentle retinol cream that improves skin texture and reduces signs of aging.',
  'Use in the evening only. Start 2-3 times per week and gradually increase frequency.'
),
(
  'Hydrating Hyaluronic Serum', 'The Ordinary', 'serum', 12.99,
  ARRAY['Sodium Hyaluronate', 'Hyaluronic Acid', 'Vitamin B5']::TEXT[],
  ARRAY['all']::TEXT[], ARRAY['dryness', 'dehydration']::TEXT[],
  4.2, 2100,
  'Multi-molecular hyaluronic acid serum for intense hydration.',
  'Apply to damp skin morning and evening before heavier creams.'
);