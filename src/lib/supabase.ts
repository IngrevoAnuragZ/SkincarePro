import { createClient } from '@supabase/supabase-js'

// Use environment variables with fallback for demo
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  }
})

// Types for our database tables
export interface Ingredient {
  ingredient_id: number
  ingredient_name: string
  inci_name?: string
  category?: string
  function?: string
  natural_sources?: string[]
  source_icons?: string[]
  benefits?: string
  concentration_range?: string
  ph_range?: string
  compatibility_good?: string[]
  compatibility_avoid?: string[]
  skin_types?: string[]
  cautions?: string
  safety_level?: 'safe' | 'caution' | 'unsafe'
  evidence_level?: 'high' | 'medium' | 'low'
  time_of_use?: string
  created_at?: string
  updated_at?: string
}

export interface Product {
  product_id: number
  product_name: string
  brand?: string
  category?: string
  price?: number
  ingredients?: string[]
  skin_types?: string[]
  concerns_addressed?: string[]
  rating?: number
  review_count?: number
  availability?: boolean
  image_url?: string
  description?: string
  usage_instructions?: string
  created_at?: string
}

export interface UserAssessment {
  assessment_id?: number
  user_id?: string
  skin_type?: string
  skin_concerns?: string[]
  medical_conditions?: string[]
  age_range?: string
  lifestyle_factors?: string[]
  current_routine?: string
  goals?: string[]
  assessment_date?: string
}

export interface CalendarIntegration {
  integration_id?: number
  user_id?: string
  assessment_id?: number
  morning_time?: string
  afternoon_time?: string
  evening_time?: string
  timezone?: string
  recurring_pattern?: string
  active?: boolean
  google_calendar_id?: string
  created_at?: string
}

export interface UserRecommendation {
  recommendation_id?: string
  user_id?: string
  assessment_id?: string
  recommendations_data: any
  user_profile?: any
  routine_suggestions?: any
  warnings?: any[]
  timeline?: any
  follow_up_recommendations?: any
  algorithm_version?: string
  generated_at?: string
  is_active?: boolean
  user_rating?: number
  user_feedback?: string
  feedback_date?: string
}

// Mock data for demo purposes when Supabase is not configured
const mockIngredients: Ingredient[] = [
  {
    ingredient_id: 1,
    ingredient_name: 'Retinol',
    inci_name: 'Retinol',
    category: 'anti-aging',
    function: 'Vitamin A derivative that promotes cell turnover',
    natural_sources: ['Sweet potatoes', 'Carrots', 'Spinach', 'Kale', 'Fish oils', 'Liver'],
    source_icons: ['🍠', '🥕', '🥬', '🥬', '🐟', '🥩'],
    benefits: 'Reduces fine lines, improves texture, helps with acne, fades hyperpigmentation',
    concentration_range: '0.01% - 1%',
    ph_range: '5.5 - 6.5',
    compatibility_good: ['Hyaluronic acid', 'Ceramides', 'Peptides'],
    compatibility_avoid: ['Vitamin C', 'Benzoyl peroxide', 'AHAs', 'BHAs'],
    skin_types: ['normal', 'combination', 'oily'],
    cautions: 'Sun sensitivity, not recommended during pregnancy, start with low concentration',
    safety_level: 'caution',
    evidence_level: 'high',
    time_of_use: 'PM'
  },
  {
    ingredient_id: 2,
    ingredient_name: 'Vitamin C',
    inci_name: 'L-Ascorbic Acid',
    category: 'antioxidant',
    function: 'Powerful antioxidant and brightening agent',
    natural_sources: ['Oranges', 'Strawberries', 'Bell peppers', 'Broccoli', 'Kakadu plum', 'Acerola cherry'],
    source_icons: ['🍊', '🍓', '🫑', '🥦', '🍇', '🍒'],
    benefits: 'Brightens skin, protects against free radicals, stimulates collagen production',
    concentration_range: '5% - 20%',
    ph_range: '3.0 - 4.0',
    compatibility_good: ['Vitamin E', 'Ferulic acid', 'Hyaluronic acid'],
    compatibility_avoid: ['Retinol', 'Benzoyl peroxide', 'Copper peptides'],
    skin_types: ['all'],
    cautions: 'Can cause irritation in sensitive skin, may oxidize if not stored properly',
    safety_level: 'safe',
    evidence_level: 'high',
    time_of_use: 'AM'
  },
  {
    ingredient_id: 3,
    ingredient_name: 'Hyaluronic Acid',
    inci_name: 'Sodium Hyaluronate',
    category: 'humectant',
    function: 'Powerful moisture-binding ingredient',
    natural_sources: ['Bone broth', 'Soybeans', 'Sweet potatoes', 'Citrus fruits', 'Root vegetables'],
    source_icons: ['🍲', '🫘', '🍠', '🍊', '🥕'],
    benefits: 'Intense hydration, plumps skin, reduces appearance of fine lines',
    concentration_range: '0.1% - 2%',
    ph_range: '5.0 - 7.0',
    compatibility_good: ['Vitamin C', 'Retinol', 'Niacinamide', 'Peptides'],
    compatibility_avoid: [],
    skin_types: ['all'],
    cautions: 'Generally well-tolerated, rare allergic reactions possible',
    safety_level: 'safe',
    evidence_level: 'high',
    time_of_use: 'AM/PM'
  },
  {
    ingredient_id: 4,
    ingredient_name: 'Niacinamide',
    inci_name: 'Niacinamide',
    category: 'anti-inflammatory',
    function: 'Vitamin B3 that regulates oil and reduces inflammation',
    natural_sources: ['Tuna', 'Salmon', 'Mushrooms', 'Green peas', 'Chicken breast', 'Peanuts'],
    source_icons: ['🐟', '🐟', '🍄', '🟢', '🍗', '🥜'],
    benefits: 'Controls oil production, minimizes pores, reduces redness, brightens skin',
    concentration_range: '2% - 10%',
    ph_range: '5.0 - 7.0',
    compatibility_good: ['Hyaluronic acid', 'Ceramides', 'Zinc'],
    compatibility_avoid: [],
    skin_types: ['all'],
    cautions: 'Very well-tolerated, minimal side effects',
    safety_level: 'safe',
    evidence_level: 'high',
    time_of_use: 'AM/PM'
  },
  {
    ingredient_id: 5,
    ingredient_name: 'Salicylic Acid',
    inci_name: 'Salicylic Acid',
    category: 'exfoliant',
    function: 'Beta hydroxy acid that penetrates pores',
    natural_sources: ['Willow bark', 'Wintergreen leaves', 'Birch bark'],
    source_icons: ['🌿', '🍃', '🌳'],
    benefits: 'Unclogs pores, reduces blackheads, anti-inflammatory properties',
    concentration_range: '0.5% - 2%',
    ph_range: '3.0 - 4.0',
    compatibility_good: ['Niacinamide', 'Hyaluronic acid'],
    compatibility_avoid: ['Retinol', 'Vitamin C', 'Other acids'],
    skin_types: ['oily', 'combination', 'acne-prone'],
    cautions: 'Can cause dryness and irritation, increases sun sensitivity',
    safety_level: 'caution',
    evidence_level: 'high',
    time_of_use: 'PM'
  },
  {
    ingredient_id: 6,
    ingredient_name: 'Ceramides',
    inci_name: 'Ceramide NP',
    category: 'barrier-repair',
    function: 'Lipids that restore and maintain skin barrier',
    natural_sources: ['Wheat germ', 'Brown rice', 'Soybeans', 'Spinach', 'Sweet potatoes'],
    source_icons: ['🌾', '🍚', '🫘', '🥬', '🍠'],
    benefits: 'Restores skin barrier, prevents moisture loss, soothes irritation',
    concentration_range: '0.1% - 5%',
    ph_range: '5.5 - 7.0',
    compatibility_good: ['Hyaluronic acid', 'Niacinamide', 'Cholesterol'],
    compatibility_avoid: [],
    skin_types: ['all'],
    cautions: 'Excellent tolerance, suitable for sensitive skin',
    safety_level: 'safe',
    evidence_level: 'high',
    time_of_use: 'AM/PM'
  }
];

// Database functions with fallback to mock data
export const ingredientsService = {
  async getAll() {
    try {
      // Try to fetch from Supabase first
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .order('ingredient_name')
      
      if (error) throw error
      return data as Ingredient[]
    } catch (error) {
      // Fallback to mock data if Supabase is not configured
      console.log('Using mock ingredient data for demo')
      return mockIngredients
    }
  },

  async getById(id: number) {
    try {
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .eq('ingredient_id', id)
        .single()
      
      if (error) throw error
      return data as Ingredient
    } catch (error) {
      // Fallback to mock data
      const ingredient = mockIngredients.find(ing => ing.ingredient_id === id)
      if (!ingredient) throw new Error('Ingredient not found')
      return ingredient
    }
  },

  async search(query: string) {
    try {
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .or(`ingredient_name.ilike.%${query}%,inci_name.ilike.%${query}%,function.ilike.%${query}%`)
        .order('ingredient_name')
      
      if (error) throw error
      return data as Ingredient[]
    } catch (error) {
      // Fallback to mock data search
      const normalizedQuery = query.toLowerCase()
      return mockIngredients.filter(ingredient =>
        ingredient.ingredient_name.toLowerCase().includes(normalizedQuery) ||
        (ingredient.inci_name && ingredient.inci_name.toLowerCase().includes(normalizedQuery)) ||
        (ingredient.function && ingredient.function.toLowerCase().includes(normalizedQuery)) ||
        (ingredient.natural_sources && ingredient.natural_sources.some(source => 
          source.toLowerCase().includes(normalizedQuery)
        ))
      )
    }
  },

  async filterBySkinType(skinType: string) {
    try {
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .contains('skin_types', [skinType])
        .order('ingredient_name')
      
      if (error) throw error
      return data as Ingredient[]
    } catch (error) {
      // Fallback to mock data filter
      return mockIngredients.filter(ingredient =>
        ingredient.skin_types && (
          ingredient.skin_types.includes(skinType) || 
          ingredient.skin_types.includes('all')
        )
      )
    }
  }
}

export const productsService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('availability', true)
        .order('rating', { ascending: false })
      
      if (error) throw error
      return data as Product[]
    } catch (error) {
      console.log('Products service not available in demo mode')
      return []
    }
  },

  async getByCategory(category: string) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .eq('availability', true)
        .order('rating', { ascending: false })
      
      if (error) throw error
      return data as Product[]
    } catch (error) {
      console.log('Products service not available in demo mode')
      return []
    }
  }
}

export const assessmentService = {
  async save(assessment: UserAssessment) {
    try {
      // Save to skin_assessments table instead
      const { data, error } = await supabase
        .from('skin_assessments')
        .insert({
          user_id: assessment.user_id,
          skin_type: assessment.skin_type,
          skin_concerns: assessment.skin_concerns || [],
          skin_sensitivity: assessment.skin_sensitivity || 3,
          medical_conditions: assessment.medical_conditions || [],
          other_medical_condition: assessment.other_medical_condition,
          current_medications: assessment.current_medications,
          age_range: assessment.age_range,
          gender: assessment.gender,
          climate: assessment.climate,
          lifestyle_factors: assessment.lifestyle_factors || [],
          current_products: assessment.current_products || {},
          routine_frequency: assessment.routine_frequency,
          budget_range: assessment.budget_range,
          primary_goals: assessment.primary_goals || [],
          ingredient_preferences: assessment.ingredient_preferences || [],
          ingredient_allergies: assessment.ingredient_allergies || [],
          assessment_score: assessment.assessment_score,
          completed_at: new Date().toISOString()
        })
        .select()
        .single()
      
      if (error) throw error
      return data as UserAssessment
    } catch (error) {
      console.log('Assessment service not available in demo mode')
      return assessment
    }
  },

  async getByUserId(userId: string) {
    try {
      const { data, error } = await supabase
        .from('skin_assessments')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
      
      if (error) throw error
      return data as UserAssessment[]
    } catch (error) {
      console.log('Assessment service not available in demo mode')
      return []
    }
  }
}

export const recommendationsService = {
  async save(recommendation: UserRecommendation) {
    try {
      const { data, error } = await supabase
        .from('user_recommendations')
        .insert(recommendation)
        .select()
        .single()
      
      if (error) throw error
      return data as UserRecommendation
    } catch (error) {
      console.log('Recommendations service not available in demo mode')
      return recommendation
    }
  },

  async getByUserId(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_recommendations')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('generated_at', { ascending: false })
      
      if (error) throw error
      return data as UserRecommendation[]
    } catch (error) {
      console.log('Recommendations service not available in demo mode')
      return []
    }
  },

  async getLatestByUserId(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_recommendations')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('generated_at', { ascending: false })
        .limit(1)
        .single()
      
      if (error) throw error
      return data as UserRecommendation
    } catch (error) {
      console.log('Recommendations service not available in demo mode')
      return null
    }
  },

  async updateFeedback(recommendationId: string, rating: number, feedback?: string) {
    try {
      const { data, error } = await supabase
        .from('user_recommendations')
        .update({
          user_rating: rating,
          user_feedback: feedback,
          feedback_date: new Date().toISOString()
        })
        .eq('recommendation_id', recommendationId)
        .select()
        .single()
      
      if (error) throw error
      return data as UserRecommendation
    } catch (error) {
      console.log('Recommendations feedback service not available in demo mode')
      return null
    }
  }
}

export const calendarService = {
  async save(integration: CalendarIntegration) {
    try {
      const { data, error } = await supabase
        .from('calendar_integrations')
        .insert(integration)
        .select()
        .single()
      
      if (error) throw error
      return data as CalendarIntegration
    } catch (error) {
      console.log('Calendar service not available in demo mode')
      return integration
    }
  },

  async getByUserId(userId: string) {
    try {
      const { data, error } = await supabase
        .from('calendar_integrations')
        .select('*')
        .eq('user_id', userId)
        .eq('active', true)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as CalendarIntegration[]
    } catch (error) {
      console.log('Calendar service not available in demo mode')
      return []
    }
  },

  async update(integrationId: number, updates: Partial<CalendarIntegration>) {
    try {
      const { data, error } = await supabase
        .from('calendar_integrations')
        .update(updates)
        .eq('integration_id', integrationId)
        .select()
        .single()
      
      if (error) throw error
      return data as CalendarIntegration
    } catch (error) {
      console.log('Calendar service not available in demo mode')
      return { integration_id: integrationId, ...updates } as CalendarIntegration
    }
  }
}