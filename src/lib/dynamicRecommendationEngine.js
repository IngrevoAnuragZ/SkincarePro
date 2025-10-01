// 🧠 DYNAMIC SKINCARE RECOMMENDATION ALGORITHM V2.0
// Enhanced with real product database, dynamic pricing, and comprehensive testing

class DynamicSkincareRecommendationEngine {
  constructor() {
    this.productDatabase = this.initializeProductDatabase();
    this.countryDatabase = this.initializeCountryDatabase();
    this.ruleMatrix = this.initializeRuleMatrix();
    this.conflictMatrix = this.initializeConflictMatrix();
    this.climateDatabase = this.initializeClimateDatabase();
    this.benefitsDatabase = this.initializeBenefitsDatabase();
    this.fallbackRecommendations = this.initializeFallbacks();
  }

  // ============ MAIN RECOMMENDATION FUNCTION ============
  async generateRecommendations(userId, assessmentData) {
    try {
      // Ensure userId is a string
      const safeUserId = this.safeString(userId) || 'anonymous_user';
      
      // Step 1: Validate and normalize input
      const normalizedData = this.validateAndNormalizeInput(assessmentData);
      
      // Step 2: Create comprehensive user profile
      const userProfile = this.createUserProfile(normalizedData);
      
      // Step 2.5: Apply country-specific adaptations
      const countryAdaptedProfile = this.applyCountryAdaptations(userProfile);
      
      // Step 3: Generate base recommendations using dynamic rule matrix
      const baseRecommendations = this.generateBaseRecommendations(countryAdaptedProfile);
      
      // Step 4: Apply strict budget filtering
      const budgetFilteredRecs = this.applyBudgetFiltering(baseRecommendations, countryAdaptedProfile);
      
      // Step 5: Apply medical condition constraints
      const medicallyFilteredRecs = this.applyMedicalConstraints(budgetFilteredRecs, countryAdaptedProfile);
      
      // Step 6: Apply conflict resolution
      const conflictResolvedRecs = this.resolveIngredientConflicts(medicallyFilteredRecs);
      
      // Step 7: Score and rank recommendations dynamically
      const scoredRecommendations = this.scoreAndRankRecommendations(conflictResolvedRecs, countryAdaptedProfile);
      
      // Step 8: Personalize based on experience level and preferences
      const personalizedRecs = this.personalizeRecommendations(scoredRecommendations, countryAdaptedProfile);
      
      // Step 9: Structure final output with detailed benefits
      const finalRecommendations = this.structureRecommendations(personalizedRecs, countryAdaptedProfile);
      
      // Step 10: Add comprehensive routine, warnings, and benefits
      const completeResponse = this.addRoutineWarningsAndBenefits(finalRecommendations, countryAdaptedProfile);
      
      return this.sanitizeResponse(completeResponse);
      
    } catch (error) {
      console.error('Recommendation generation failed:', error);
      return this.generateFallbackRecommendations(assessmentData || {});
    }
  }

  // ============ COUNTRY ADAPTATIONS ============
  applyCountryAdaptations(userProfile) {
    const country = userProfile.country || 'india';
    const countryData = this.countryDatabase[country];
    
    if (!countryData) {
      console.warn(`Country ${country} not found, using default settings`);
      return userProfile;
    }

    // Apply country-specific priority adjustments
    const adaptedProfile = { ...userProfile };
    
    // Australia-specific adaptations
    if (country === 'australia') {
      // Increase sun protection priority due to harsh UV
      if (!adaptedProfile.concerns.includes('sun_protection')) {
        adaptedProfile.concerns.unshift('sun_protection');
      }
      
      // Adjust for dry climate in many Australian regions
      if (adaptedProfile.climate === 'arid' && !adaptedProfile.concerns.includes('dryness_dehydration')) {
        adaptedProfile.concerns.push('dryness_dehydration');
      }
      
      // Prioritize local brands for better availability
      adaptedProfile.preferLocalBrands = true;
      adaptedProfile.localBrands = countryData.localBrands;
    }
    
    // India-specific adaptations
    if (country === 'india') {
      // Prioritize oil control in humid climates
      if (adaptedProfile.climate === 'hot_humid' && !adaptedProfile.concerns.includes('excess_oil_shine')) {
        adaptedProfile.concerns.push('excess_oil_shine');
      }
    }
    
    adaptedProfile.countryData = countryData;
    return adaptedProfile;
  }
  // ============ ENHANCED PRODUCT DATABASE ============
  initializeProductDatabase() {
    return {
      // ============ AUSTRALIAN PRODUCTS ============
      
      // BUDGET CLEANSERS (Under AUD $30)
      'qv_gentle_wash': {
        name: 'QV Gentle Wash',
        category: 'cleanser',
        price: 12.99,
        currency: 'AUD',
        suitableFor: ['sensitive', 'dry', 'normal'],
        addresses: ['basic_cleansing', 'sensitivity_redness'],
        strength: 'gentle',
        brand: 'QV',
        size: '350ml',
        conflicts: [],
        country: 'australia',
        benefits: ['Soap-free formula', 'pH balanced', 'Dermatologist recommended'],
        availability: 'Chemist Warehouse, Priceline, Woolworths'
      },
      'cetaphil_gentle_cleanser_au': {
        name: 'Cetaphil Gentle Skin Cleanser',
        category: 'cleanser',
        price: 16.99,
        currency: 'AUD',
        suitableFor: ['sensitive', 'dry', 'normal'],
        addresses: ['basic_cleansing', 'sensitivity_redness'],
        strength: 'gentle',
        brand: 'Cetaphil',
        size: '500ml',
        conflicts: [],
        country: 'australia',
        benefits: ['Non-comedogenic', 'Fragrance-free', 'Maintains skin barrier'],
        availability: 'Chemist Warehouse, Priceline, Coles'
      },
      'sukin_foaming_cleanser': {
        name: 'Sukin Foaming Facial Cleanser',
        category: 'cleanser',
        price: 9.95,
        currency: 'AUD',
        suitableFor: ['normal', 'combination', 'oily'],
        addresses: ['basic_cleansing', 'excess_oil_shine'],
        strength: 'gentle',
        brand: 'Sukin',
        size: '125ml',
        conflicts: [],
        country: 'australia',
        benefits: ['Natural ingredients', 'Chamomile & Aloe Vera', 'Australian made'],
        availability: 'Woolworths, Coles, Priceline'
      },
      'benzac_daily_cleanser': {
        name: 'Benzac Daily Facial Foam Cleanser',
        category: 'cleanser',
        price: 14.99,
        currency: 'AUD',
        suitableFor: ['oily', 'combination', 'acne_prone'],
        addresses: ['acne_breakouts', 'excess_oil_shine'],
        strength: 'moderate',
        brand: 'Benzac',
        size: '130ml',
        conflicts: [],
        country: 'australia',
        activeIngredients: ['salicylic_acid'],
        benefits: ['Oil-free formula', 'Unclogs pores', 'Prevents breakouts'],
        availability: 'Chemist Warehouse, Priceline'
      },

      // MID-RANGE CLEANSERS (AUD $30-80)
      'aesop_purifying_cleanser': {
        name: 'Aesop Purifying Facial Exfoliant Paste',
        category: 'cleanser',
        price: 45.00,
        currency: 'AUD',
        suitableFor: ['normal', 'oily', 'combination'],
        addresses: ['basic_cleansing', 'uneven_texture'],
        strength: 'moderate',
        brand: 'Aesop',
        size: '75ml',
        conflicts: [],
        country: 'australia',
        benefits: ['Quartz & Lactic Acid', 'Australian botanicals', 'Luxury formulation'],
        availability: 'Aesop stores, David Jones, Myer'
      },
      'la_roche_posay_toleriane_au': {
        name: 'La Roche-Posay Toleriane Caring Wash',
        category: 'cleanser',
        price: 32.99,
        currency: 'AUD',
        suitableFor: ['sensitive', 'dry', 'normal'],
        addresses: ['basic_cleansing', 'sensitivity_redness'],
        strength: 'gentle',
        brand: 'La Roche-Posay',
        size: '200ml',
        conflicts: [],
        country: 'australia',
        benefits: ['Thermal spring water', 'Soap-free', 'Allergy tested'],
        availability: 'Chemist Warehouse, Priceline'
      },

      // BUDGET ACTIVES (Under AUD $30)
      'the_ordinary_niacinamide_au': {
        name: 'The Ordinary Niacinamide 10% + Zinc 1%',
        category: 'active',
        price: 9.90,
        currency: 'AUD',
        suitableFor: ['all'],
        addresses: ['excess_oil_shine', 'large_pores', 'acne_breakouts'],
        strength: 'moderate',
        brand: 'The Ordinary',
        size: '30ml',
        conflicts: [],
        country: 'australia',
        activeIngredients: ['niacinamide', 'zinc'],
        requiresExperience: 'beginner',
        benefits: ['Controls sebum', 'Minimizes pores', 'Reduces blemishes'],
        availability: 'Priceline, Adore Beauty, Mecca'
      },
      'the_ordinary_hyaluronic_au': {
        name: 'The Ordinary Hyaluronic Acid 2% + B5',
        category: 'hydrating',
        price: 9.90,
        currency: 'AUD',
        suitableFor: ['all'],
        addresses: ['dryness_dehydration', 'fine_lines_wrinkles'],
        strength: 'gentle',
        brand: 'The Ordinary',
        size: '30ml',
        conflicts: [],
        country: 'australia',
        activeIngredients: ['hyaluronic_acid'],
        requiresExperience: 'beginner',
        benefits: ['Intense hydration', 'Plumps skin', 'Multiple molecular weights'],
        availability: 'Priceline, Adore Beauty, Mecca'
      },
      'benzac_spot_treatment': {
        name: 'Benzac AC Gel 5%',
        category: 'active',
        price: 19.99,
        currency: 'AUD',
        suitableFor: ['oily', 'acne_prone'],
        addresses: ['acne_breakouts'],
        strength: 'strong',
        brand: 'Benzac',
        size: '60g',
        conflicts: ['retinoids'],
        country: 'australia',
        activeIngredients: ['benzoyl_peroxide'],
        requiresExperience: 'intermediate',
        benefits: ['Kills acne bacteria', 'Reduces inflammation', 'Prevents new breakouts'],
        availability: 'Chemist Warehouse, Priceline'
      },

      // MID-RANGE ACTIVES (AUD $30-100)
      'paula_choice_bha_au': {
        name: 'Paula\'s Choice 2% BHA Liquid Exfoliant',
        category: 'active',
        price: 49.00,
        currency: 'AUD',
        suitableFor: ['oily', 'combination', 'acne_prone'],
        addresses: ['acne_breakouts', 'large_pores', 'uneven_texture'],
        strength: 'moderate',
        brand: 'Paula\'s Choice',
        size: '30ml',
        conflicts: ['retinoids'],
        country: 'australia',
        activeIngredients: ['salicylic_acid'],
        requiresExperience: 'intermediate',
        benefits: ['Unclogs pores', 'Smooths texture', 'Reduces blackheads'],
        availability: 'Adore Beauty, Mecca'
      },
      'alpha_h_liquid_gold': {
        name: 'Alpha-H Liquid Gold',
        category: 'active',
        price: 69.95,
        currency: 'AUD',
        suitableFor: ['normal', 'combination', 'oily'],
        addresses: ['fine_lines_wrinkles', 'uneven_texture', 'dark_spots_hyperpigmentation'],
        strength: 'moderate',
        brand: 'Alpha-H',
        size: '50ml',
        conflicts: ['retinoids'],
        country: 'australia',
        activeIngredients: ['glycolic_acid'],
        requiresExperience: 'intermediate',
        benefits: ['Australian brand', 'Glycolic acid exfoliation', 'Silk proteins'],
        availability: 'Mecca, David Jones, Adore Beauty'
      },
      'aspect_vitamin_c': {
        name: 'Aspect Dr Active C Serum',
        category: 'active',
        price: 89.00,
        currency: 'AUD',
        suitableFor: ['normal', 'dry', 'combination'],
        addresses: ['dark_spots_hyperpigmentation', 'fine_lines_wrinkles'],
        strength: 'moderate',
        brand: 'Aspect Dr',
        size: '30ml',
        conflicts: ['retinoids'],
        country: 'australia',
        activeIngredients: ['vitamin_c'],
        requiresExperience: 'intermediate',
        benefits: ['Australian dermatologist brand', 'Stable vitamin C', 'Antioxidant protection'],
        availability: 'Adore Beauty, selected clinics'
      },

      // PREMIUM ACTIVES (AUD $100-200)
      'synergie_vitamin_c': {
        name: 'Synergie Skin VitaC Serum',
        category: 'active',
        price: 125.00,
        currency: 'AUD',
        suitableFor: ['all'],
        addresses: ['dark_spots_hyperpigmentation', 'fine_lines_wrinkles'],
        strength: 'strong',
        brand: 'Synergie Skin',
        size: '30ml',
        conflicts: ['retinoids'],
        country: 'australia',
        activeIngredients: ['vitamin_c'],
        requiresExperience: 'intermediate',
        benefits: ['Australian cosmeceutical', '20% Vitamin C', 'Dermatologist formulated'],
        availability: 'Adore Beauty, selected clinics'
      },
      'rationale_retinol': {
        name: 'Rationale Essential Six Serum',
        category: 'active',
        price: 180.00,
        currency: 'AUD',
        suitableFor: ['normal', 'combination', 'oily'],
        addresses: ['fine_lines_wrinkles', 'acne_breakouts', 'uneven_texture'],
        strength: 'strong',
        brand: 'Rationale',
        size: '30ml',
        conflicts: ['vitamin_c', 'bha'],
        country: 'australia',
        activeIngredients: ['retinol'],
        requiresExperience: 'advanced',
        contraindications: ['pregnancy', 'nursing'],
        benefits: ['Australian luxury brand', 'Encapsulated retinol', 'Clinical strength'],
        availability: 'Rationale clinics, selected spas'
      },

      // BUDGET MOISTURIZERS (Under AUD $25)
      'qv_cream': {
        name: 'QV Cream',
        category: 'moisturizer',
        price: 8.99,
        currency: 'AUD',
        suitableFor: ['dry', 'sensitive', 'normal'],
        addresses: ['dryness_dehydration', 'sensitivity_redness'],
        strength: 'gentle',
        brand: 'QV',
        size: '100g',
        conflicts: [],
        country: 'australia',
        benefits: ['Fragrance-free', 'Suitable for eczema', 'Australian made'],
        availability: 'Chemist Warehouse, Woolworths, Coles'
      },
      'sukin_facial_moisturiser': {
        name: 'Sukin Facial Moisturiser',
        category: 'moisturizer',
        price: 9.95,
        currency: 'AUD',
        suitableFor: ['normal', 'combination', 'dry'],
        addresses: ['basic_hydration', 'dryness_dehydration'],
        strength: 'gentle',
        brand: 'Sukin',
        size: '125ml',
        conflicts: [],
        country: 'australia',
        benefits: ['Natural ingredients', 'Rosehip & Sesame oils', 'Vegan & cruelty-free'],
        availability: 'Woolworths, Coles, Priceline'
      },
      'hamilton_everyday_face': {
        name: 'Hamilton Everyday Face SPF 50+',
        category: 'moisturizer_spf',
        price: 19.95,
        currency: 'AUD',
        suitableFor: ['all'],
        addresses: ['basic_hydration', 'sun_protection'],
        strength: 'gentle',
        brand: 'Hamilton',
        size: '75ml',
        conflicts: [],
        country: 'australia',
        spf: 50,
        benefits: ['Moisturizer + SPF combo', 'Australian sun protection', 'Non-greasy'],
        availability: 'Chemist Warehouse, Priceline'
      },

      // MID-RANGE MOISTURIZERS (AUD $25-80)
      'cerave_daily_moisturizer_au': {
        name: 'CeraVe Daily Moisturising Lotion',
        category: 'moisturizer',
        price: 24.99,
        currency: 'AUD',
        suitableFor: ['normal', 'dry', 'sensitive'],
        addresses: ['dryness_dehydration', 'sensitivity_redness'],
        strength: 'gentle',
        brand: 'CeraVe',
        size: '236ml',
        conflicts: [],
        country: 'australia',
        activeIngredients: ['ceramides', 'hyaluronic_acid'],
        benefits: ['MVE technology', '24-hour hydration', 'Dermatologist developed'],
        availability: 'Chemist Warehouse, Priceline'
      },
      'go_to_face_hero': {
        name: 'Go-To Face Hero',
        category: 'moisturizer',
        price: 45.00,
        currency: 'AUD',
        suitableFor: ['normal', 'combination', 'oily'],
        addresses: ['basic_hydration'],
        strength: 'gentle',
        brand: 'Go-To',
        size: '60ml',
        conflicts: [],
        country: 'australia',
        benefits: ['Australian indie brand', 'Lightweight formula', 'Kakadu plum extract'],
        availability: 'Mecca, Adore Beauty, Go-To website'
      },
      'aspect_hydrating_serum': {
        name: 'Aspect Dr Hyaluronic Serum',
        category: 'hydrating',
        price: 75.00,
        currency: 'AUD',
        suitableFor: ['all'],
        addresses: ['dryness_dehydration', 'fine_lines_wrinkles'],
        strength: 'gentle',
        brand: 'Aspect Dr',
        size: '30ml',
        conflicts: [],
        country: 'australia',
        activeIngredients: ['hyaluronic_acid'],
        benefits: ['Clinical grade', 'Multiple molecular weights', 'Australian dermatologist brand'],
        availability: 'Adore Beauty, selected clinics'
      },

      // PREMIUM MOISTURIZERS (AUD $80-200)
      'rationale_b3_serum': {
        name: 'Rationale B3 Serum',
        category: 'active',
        price: 150.00,
        currency: 'AUD',
        suitableFor: ['all'],
        addresses: ['excess_oil_shine', 'large_pores', 'sensitivity_redness'],
        strength: 'moderate',
        brand: 'Rationale',
        size: '30ml',
        conflicts: [],
        country: 'australia',
        activeIngredients: ['niacinamide'],
        benefits: ['15% Niacinamide', 'Australian luxury', 'Clinical strength'],
        availability: 'Rationale clinics, selected spas'
      },
      'synergie_vitamin_b': {
        name: 'Synergie Skin VitaB3 Serum',
        category: 'active',
        price: 95.00,
        currency: 'AUD',
        suitableFor: ['all'],
        addresses: ['excess_oil_shine', 'large_pores', 'acne_breakouts'],
        strength: 'moderate',
        brand: 'Synergie Skin',
        size: '30ml',
        conflicts: [],
        country: 'australia',
        activeIngredients: ['niacinamide'],
        benefits: ['Australian cosmeceutical', '12% Niacinamide', 'Dermatologist tested'],
        availability: 'Adore Beauty, selected clinics'
      },

      // AUSTRALIAN SUNSCREENS (Essential for harsh Australian sun)
      'cancer_council_face_day_wear': {
        name: 'Cancer Council Face Day Wear Moisturiser SPF 50+',
        category: 'sunscreen',
        price: 14.95,
        currency: 'AUD',
        suitableFor: ['all'],
        addresses: ['sun_protection', 'basic_hydration'],
        strength: 'gentle',
        brand: 'Cancer Council',
        size: '75ml',
        conflicts: [],
        country: 'australia',
        spf: 50,
        essential: true,
        benefits: ['Australian Cancer Council approved', 'Moisturizer + SPF', '4 hours water resistant'],
        availability: 'Woolworths, Coles, Chemist Warehouse'
      },
      'hamilton_face_sunscreen': {
        name: 'Hamilton Everyday Face SPF 50+',
        category: 'sunscreen',
        price: 19.95,
        currency: 'AUD',
        suitableFor: ['all'],
        addresses: ['sun_protection'],
        strength: 'gentle',
        brand: 'Hamilton',
        size: '75ml',
        conflicts: [],
        country: 'australia',
        spf: 50,
        essential: true,
        benefits: ['Fragrance-free', 'Non-comedogenic', 'Australian made'],
        availability: 'Chemist Warehouse, Priceline'
      },
      'invisible_zinc_face_fluid': {
        name: 'Invisible Zinc Face & Body SPF 50+',
        category: 'sunscreen',
        price: 29.95,
        currency: 'AUD',
        suitableFor: ['sensitive', 'all'],
        addresses: ['sun_protection', 'sensitivity_redness'],
        strength: 'gentle',
        brand: 'Invisible Zinc',
        size: '50ml',
        conflicts: [],
        country: 'australia',
        spf: 50,
        essential: true,
        activeIngredients: ['zinc_oxide'],
        benefits: ['100% mineral', 'Reef safe', 'Australian owned'],
        availability: 'Chemist Warehouse, Priceline, Mecca'
      },
      'ultra_violette_supreme_screen': {
        name: 'Ultra Violette Supreme Screen SPF 50+',
        category: 'sunscreen',
        price: 42.00,
        currency: 'AUD',
        suitableFor: ['all'],
        addresses: ['sun_protection'],
        strength: 'gentle',
        brand: 'Ultra Violette',
        size: '60ml',
        conflicts: [],
        country: 'australia',
        spf: 50,
        essential: true,
        benefits: ['Australian indie brand', 'Invisible finish', 'Antioxidant complex'],
        availability: 'Mecca, Adore Beauty, Ultra Violette website'
      },
      // BUDGET CLEANSERS (Under ₹500)
      'cetaphil_gentle_cleanser': {
        name: 'Cetaphil Gentle Skin Cleanser',
        category: 'cleanser',
        price: 299,
        suitableFor: ['sensitive', 'dry', 'normal'],
        addresses: ['basic_cleansing', 'sensitivity_redness'],
        strength: 'gentle',
        brand: 'Cetaphil',
        size: '125ml',
        conflicts: [],
        benefits: ['Maintains skin barrier', 'Non-comedogenic', 'Fragrance-free']
      },
      'simple_refreshing_cleanser': {
        name: 'Simple Refreshing Facial Wash',
        category: 'cleanser',
        price: 199,
        suitableFor: ['normal', 'combination', 'sensitive'],
        addresses: ['basic_cleansing'],
        strength: 'gentle',
        brand: 'Simple',
        size: '150ml',
        conflicts: [],
        benefits: ['No artificial perfumes', 'Vitamin B5', 'Triple purified water']
      },
      'neutrogena_oil_free_cleanser': {
        name: 'Neutrogena Oil-Free Acne Wash',
        category: 'cleanser',
        price: 399,
        suitableFor: ['oily', 'combination', 'acne_prone'],
        addresses: ['acne_breakouts', 'excess_oil_shine'],
        strength: 'moderate',
        brand: 'Neutrogena',
        size: '175ml',
        conflicts: ['retinoids'],
        activeIngredients: ['salicylic_acid'],
        benefits: ['Oil-free formula', 'Unclogs pores', 'Prevents new breakouts']
      },

      // MID-RANGE CLEANSERS (₹500-1500)
      'cerave_foaming_cleanser': {
        name: 'CeraVe Foaming Facial Cleanser',
        category: 'cleanser',
        price: 990,
        suitableFor: ['normal', 'oily', 'combination'],
        addresses: ['basic_cleansing', 'excess_oil_shine'],
        strength: 'gentle',
        brand: 'CeraVe',
        size: '236ml',
        conflicts: [],
        activeIngredients: ['ceramides', 'hyaluronic_acid'],
        benefits: ['Ceramides restore barrier', 'Hyaluronic acid hydrates', 'Non-comedogenic']
      },
      'paula_choice_cleanser': {
        name: 'Paula\'s Choice CALM Cleanser',
        category: 'cleanser',
        price: 1299,
        suitableFor: ['sensitive', 'dry', 'rosacea'],
        addresses: ['sensitivity_redness', 'basic_cleansing'],
        strength: 'gentle',
        brand: 'Paula\'s Choice',
        size: '198ml',
        conflicts: [],
        benefits: ['Calms irritation', 'Fragrance-free', 'Plant-based ingredients']
      },

      // BUDGET ACTIVES (Under ₹500)
      'minimalist_niacinamide': {
        name: 'Minimalist Niacinamide 10%',
        category: 'active',
        price: 349,
        suitableFor: ['all'],
        addresses: ['excess_oil_shine', 'large_pores', 'acne_breakouts'],
        strength: 'moderate',
        brand: 'Minimalist',
        size: '30ml',
        conflicts: [],
        activeIngredients: ['niacinamide'],
        requiresExperience: 'beginner',
        benefits: ['Controls oil production', 'Minimizes pore appearance', 'Reduces inflammation']
      },
      'the_ordinary_hyaluronic_acid': {
        name: 'The Ordinary Hyaluronic Acid 2% + B5',
        category: 'hydrating',
        price: 490,
        suitableFor: ['all'],
        addresses: ['dryness_dehydration', 'fine_lines_wrinkles'],
        strength: 'gentle',
        brand: 'The Ordinary',
        size: '30ml',
        conflicts: [],
        activeIngredients: ['hyaluronic_acid'],
        requiresExperience: 'beginner',
        benefits: ['Intense hydration', 'Plumps fine lines', 'Suitable for all skin types']
      },

      // MID-RANGE ACTIVES (₹500-1500)
      'paula_choice_bha': {
        name: 'Paula\'s Choice 2% BHA Liquid',
        category: 'active',
        price: 1299,
        suitableFor: ['oily', 'combination', 'acne_prone'],
        addresses: ['acne_breakouts', 'large_pores', 'uneven_texture'],
        strength: 'moderate',
        brand: 'Paula\'s Choice',
        size: '30ml',
        conflicts: ['retinoids'],
        activeIngredients: ['salicylic_acid'],
        requiresExperience: 'intermediate',
        benefits: ['Unclogs pores', 'Reduces blackheads', 'Smooths texture']
      },
      'cosrx_vitamin_c': {
        name: 'COSRX Vitamin C 23% Suspension',
        category: 'active',
        price: 899,
        suitableFor: ['normal', 'dry', 'oily'],
        addresses: ['dark_spots_hyperpigmentation', 'fine_lines_wrinkles'],
        strength: 'strong',
        brand: 'COSRX',
        size: '20ml',
        conflicts: ['retinoids', 'niacinamide'],
        activeIngredients: ['vitamin_c'],
        requiresExperience: 'intermediate',
        benefits: ['Brightens skin tone', 'Fades dark spots', 'Antioxidant protection']
      },

      // PREMIUM ACTIVES (₹1500-3000)
      'skinceuticals_retinol': {
        name: 'SkinCeuticals Retinol 0.5',
        category: 'active',
        price: 2800,
        suitableFor: ['normal', 'oily', 'combination'],
        addresses: ['fine_lines_wrinkles', 'acne_breakouts', 'uneven_texture'],
        strength: 'strong',
        brand: 'SkinCeuticals',
        size: '30ml',
        conflicts: ['vitamin_c', 'bha'],
        activeIngredients: ['retinol'],
        requiresExperience: 'advanced',
        contraindications: ['pregnancy', 'nursing'],
        benefits: ['Stimulates collagen', 'Reduces fine lines', 'Improves texture']
      },
      'drunk_elephant_vitamin_c': {
        name: 'Drunk Elephant C-Firma Day Serum',
        category: 'active',
        price: 2499,
        suitableFor: ['normal', 'dry', 'oily'],
        addresses: ['dark_spots_hyperpigmentation', 'fine_lines_wrinkles'],
        strength: 'strong',
        brand: 'Drunk Elephant',
        size: '30ml',
        conflicts: ['retinoids'],
        activeIngredients: ['vitamin_c'],
        requiresExperience: 'intermediate',
        benefits: ['15% L-Ascorbic Acid', 'Firms skin', 'Brightens complexion']
      },

      // BUDGET MOISTURIZERS (Under ₹500)
      'ponds_super_light_gel': {
        name: 'Pond\'s Super Light Gel',
        category: 'moisturizer',
        price: 199,
        suitableFor: ['oily', 'combination', 'normal'],
        addresses: ['basic_hydration'],
        strength: 'gentle',
        brand: 'Pond\'s',
        size: '50g',
        conflicts: [],
        benefits: ['Non-greasy formula', 'Quick absorption', 'Hyaluronic acid']
      },
      'nivea_soft_cream': {
        name: 'Nivea Soft Light Moisturizer',
        category: 'moisturizer',
        price: 149,
        suitableFor: ['dry', 'normal'],
        addresses: ['dryness_dehydration'],
        strength: 'gentle',
        brand: 'Nivea',
        size: '50ml',
        conflicts: [],
        benefits: ['24-hour hydration', 'Vitamin E', 'Jojoba oil']
      },

      // MID-RANGE MOISTURIZERS (₹500-1500)
      'cerave_daily_moisturizer': {
        name: 'CeraVe Daily Moisturizing Lotion',
        category: 'moisturizer',
        price: 799,
        suitableFor: ['normal', 'dry', 'sensitive'],
        addresses: ['dryness_dehydration', 'sensitivity_redness'],
        strength: 'gentle',
        brand: 'CeraVe',
        size: '88ml',
        conflicts: [],
        activeIngredients: ['ceramides', 'hyaluronic_acid'],
        benefits: ['Restores skin barrier', '24-hour hydration', 'MVE technology']
      },
      'neutrogena_hydra_boost': {
        name: 'Neutrogena Hydra Boost Water Gel',
        category: 'moisturizer',
        price: 699,
        suitableFor: ['oily', 'combination', 'normal'],
        addresses: ['dryness_dehydration'],
        strength: 'gentle',
        brand: 'Neutrogena',
        size: '50g',
        conflicts: [],
        activeIngredients: ['hyaluronic_acid'],
        benefits: ['Oil-free hydration', 'Cooling gel texture', 'Non-comedogenic']
      },

      // BUDGET SUNSCREENS (Under ₹500)
      'lakme_sunscreen': {
        name: 'Lakme Sun Expert SPF 30 PA++',
        category: 'sunscreen',
        price: 299,
        suitableFor: ['normal', 'oily', 'combination'],
        addresses: ['sun_protection'],
        strength: 'moderate',
        brand: 'Lakme',
        size: '50ml',
        conflicts: [],
        spf: 30,
        benefits: ['Broad spectrum protection', 'Non-greasy', 'Water resistant']
      },
      'neutrogena_ultra_sheer': {
        name: 'Neutrogena Ultra Sheer Sunscreen SPF 50+',
        category: 'sunscreen',
        price: 449,
        suitableFor: ['all'],
        addresses: ['sun_protection'],
        strength: 'gentle',
        brand: 'Neutrogena',
        size: '30ml',
        conflicts: [],
        spf: 50,
        essential: true,
        benefits: ['Dry-touch technology', 'Lightweight', 'Non-comedogenic']
      },

      // MID-RANGE SUNSCREENS (₹500-1500)
      'la_roche_posay_sunscreen': {
  // ============ COUNTRY DATABASE ============
  initializeCountryDatabase() {
    return {
      'australia': {
        currency: 'AUD',
        climateTypes: ['temperate', 'tropical', 'arid', 'mediterranean'],
        sunIntensity: 'very_high',
        commonConcerns: ['sun_damage', 'dehydration', 'premature_aging'],
        priorityIngredients: ['zinc_oxide', 'vitamin_c', 'hyaluronic_acid'],
        availableRetailers: ['Chemist Warehouse', 'Priceline', 'Mecca', 'Adore Beauty', 'Woolworths', 'Coles'],
        localBrands: ['Aesop', 'Go-To', 'Alpha-H', 'Synergie Skin', 'Rationale', 'Aspect Dr', 'Ultra Violette', 'Sukin', 'QV'],
        budgetRanges: {
          'budget-friendly': 30,
          'mid-range': 80,
          'premium': 150,
          'luxury': 300
        },
        specialConsiderations: [
          'Harsh UV radiation requires SPF 50+ daily',
          'Dry climate in many regions increases dehydration risk',
          'Strong focus on sun protection and antioxidants',
          'Local brands often formulated for Australian conditions'
        ]
      },
      'india': {
        currency: 'INR',
        climateTypes: ['hot_humid', 'hot_dry', 'moderate', 'cold', 'varied'],
        sunIntensity: 'high',
        commonConcerns: ['excess_oil_shine', 'acne_breakouts', 'hyperpigmentation'],
        priorityIngredients: ['niacinamide', 'salicylic_acid', 'vitamin_c'],
        availableRetailers: ['Nykaa', 'Amazon', 'Local pharmacies', 'Myntra'],
        localBrands: ['Minimalist', 'Plum', 'Mamaearth', 'Dot & Key'],
        budgetRanges: {
          'budget-friendly': 500,
          'mid-range': 1500,
          'premium': 3000,
          'luxury': 5000
        },
        specialConsiderations: [
          'High humidity in coastal areas requires oil-free formulations',
          'Pollution concerns need antioxidant protection',
          'Budget-conscious market with effective affordable options'
        ]
      }
    };
  }
        name: 'La Roche-Posay Anthelios Sunscreen SPF 50',
        category: 'sunscreen',
        price: 899,
        suitableFor: ['sensitive', 'all'],
        addresses: ['sun_protection'],
        strength: 'gentle',
        brand: 'La Roche-Posay',
        size: '50ml',
        conflicts: [],
        spf: 50,
        essential: true,
        benefits: ['Photostable filters', 'Water resistant', 'Antioxidants']
      },
      'eltamd_sunscreen': {
        name: 'EltaMD UV Clear Broad-Spectrum SPF 46',
        category: 'sunscreen',
        price: 1299,
        suitableFor: ['sensitive', 'acne_prone', 'rosacea'],
        addresses: ['sun_protection', 'sensitivity_redness'],
        strength: 'gentle',
        brand: 'EltaMD',
        size: '48g',
        conflicts: [],
        spf: 46,
        activeIngredients: ['zinc_oxide', 'niacinamide'],
        benefits: ['Zinc oxide protection', 'Niacinamide calms', 'Fragrance-free']
      }
    };
  }

  // ============ ENHANCED CLIMATE DATABASE ============
  initializeClimateDatabase() {
    return {
      // AUSTRALIAN CLIMATES
      'temperate': {
        cities: ['Melbourne', 'Sydney', 'Adelaide', 'Hobart'],
        characteristics: ['Mild temperatures', 'Seasonal variation', 'Moderate humidity'],
        recommendations: ['versatile_products', 'seasonal_adjustments', 'antioxidant_protection'],
        avoid: ['heavy_winter_creams_in_summer'],
        priorityIngredients: ['vitamin_c', 'hyaluronic_acid', 'niacinamide']
      },
      'tropical': {
        cities: ['Brisbane', 'Cairns', 'Darwin', 'Gold Coast'],
        characteristics: ['High humidity', 'Intense UV', 'Year-round warmth'],
        recommendations: ['lightweight_textures', 'high_spf', 'oil_free_formulas'],
        avoid: ['heavy_creams', 'occlusive_ingredients'],
        priorityIngredients: ['zinc_oxide', 'niacinamide', 'salicylic_acid']
      },
      'arid': {
        cities: ['Perth', 'Alice Springs', 'Broken Hill'],
        characteristics: ['Low humidity', 'Intense sun', 'Dry conditions'],
        recommendations: ['intensive_hydration', 'barrier_repair', 'high_spf'],
        avoid: ['alcohol_based_products', 'over_exfoliation'],
        priorityIngredients: ['hyaluronic_acid', 'ceramides', 'zinc_oxide']
      },
      'mediterranean': {
        cities: ['Perth suburbs', 'Adelaide hills'],
        characteristics: ['Dry summers', 'Mild winters', 'Seasonal variation'],
        recommendations: ['seasonal_routine_changes', 'antioxidant_protection'],
        avoid: [],
        priorityIngredients: ['vitamin_c', 'retinol', 'hyaluronic_acid']
      },
      
      // EXISTING INDIAN CLIMATES
      'hot_humid': {
        cities: ['Mumbai', 'Chennai', 'Kolkata', 'Hyderabad', 'Bangalore', 'Kochi', 'Goa'],
        characteristics: ['High humidity', 'Excessive sweating', 'Fungal concerns'],
        recommendations: ['lightweight_textures', 'oil_free_formulas', 'antimicrobial_ingredients'],
        avoid: ['heavy_creams', 'occlusive_ingredients'],
        priorityIngredients: ['salicylic_acid', 'niacinamide', 'zinc_oxide']
      },
      'hot_dry': {
        cities: ['Delhi', 'Jaipur', 'Ahmedabad', 'Pune', 'Indore'],
        characteristics: ['Low humidity', 'High temperatures', 'Dust exposure'],
        recommendations: ['hydrating_ingredients', 'barrier_repair', 'antioxidants'],
        avoid: ['alcohol_based_products', 'over_cleansing'],
        priorityIngredients: ['hyaluronic_acid', 'ceramides', 'vitamin_c']
      },
      'moderate': {
        cities: ['Bangalore', 'Pune', 'Dehradun', 'Mysore'],
        characteristics: ['Mild temperatures', 'Moderate humidity', 'Seasonal changes'],
        recommendations: ['versatile_products', 'seasonal_adjustments'],
        avoid: [],
        priorityIngredients: ['niacinamide', 'vitamin_c', 'retinol']
      },
      'cold': {
        cities: ['Shimla', 'Manali', 'Srinagar', 'Darjeeling'],
        characteristics: ['Low temperatures', 'Dry air', 'Wind exposure'],
        recommendations: ['rich_moisturizers', 'barrier_protection', 'gentle_cleansing'],
        avoid: ['harsh_actives', 'alcohol_based_toners'],
        priorityIngredients: ['ceramides', 'petrolatum', 'glycerin']
      },
      'varied': {
        cities: ['Most Indian cities with seasonal variation'],
        characteristics: ['Seasonal temperature changes', 'Monsoon humidity variations'],
        recommendations: ['adaptable_routine', 'seasonal_product_rotation'],
        avoid: [],
        priorityIngredients: ['hyaluronic_acid', 'niacinamide', 'vitamin_c']
      }
    };
  }

  // ============ BENEFITS DATABASE ============
  initializeBenefitsDatabase() {
    return {
      'oily': {
        shortTerm: {
          '1-2 weeks': ['Reduced excess oil', 'Less midday shine', 'Cleaner-feeling skin'],
          '4-6 weeks': ['Fewer breakouts', 'Smaller-looking pores', 'Improved skin texture'],
          '8-12 weeks': ['Balanced oil production', 'Refined pore appearance', 'Clearer complexion']
        },
        longTerm: {
          '3-6 months': ['Significant reduction in acne', 'Improved skin barrier', 'Better makeup application'],
          '6-12 months': ['Stable oil control', 'Minimized scarring', 'Overall skin health improvement']
        },
        expectedChanges: 'Your skin will gradually produce less excess oil while maintaining healthy hydration levels. Pores will appear smaller and breakouts will become less frequent.',
        maintenanceRoutine: 'Continue with oil-balancing ingredients like niacinamide and gentle BHA exfoliation 2-3 times per week.'
      },
      'dry': {
        shortTerm: {
          '1-2 weeks': ['Reduced tightness', 'Less flaking', 'Softer skin texture'],
          '4-6 weeks': ['Improved hydration', 'Smoother appearance', 'Reduced fine lines'],
          '8-12 weeks': ['Restored skin barrier', 'Plumper skin', 'Healthy glow']
        },
        longTerm: {
          '3-6 months': ['Significantly improved moisture retention', 'Stronger skin barrier', 'Reduced sensitivity'],
          '6-12 months': ['Optimal hydration balance', 'Improved resilience', 'Youthful appearance']
        },
        expectedChanges: 'Your skin will develop better moisture retention capabilities. The barrier will strengthen, leading to less water loss and improved comfort.',
        maintenanceRoutine: 'Layer hydrating ingredients and use rich moisturizers. Consider adding facial oils in winter months.'
      },
      'combination': {
        shortTerm: {
          '1-2 weeks': ['Balanced T-zone oil', 'Improved cheek hydration'],
          '4-6 weeks': ['More even skin texture', 'Reduced pore visibility in T-zone'],
          '8-12 weeks': ['Harmonized skin zones', 'Overall improved balance']
        },
        longTerm: {
          '3-6 months': ['Stable skin balance across face', 'Improved overall texture'],
          '6-12 months': ['Optimized skin function', 'Reduced contrast between face zones']
        },
        expectedChanges: 'Your T-zone will become less oily while your cheeks maintain proper hydration. The contrast between different areas of your face will diminish.',
        maintenanceRoutine: 'Use targeted treatments - lighter products on T-zone, richer on cheeks. Multi-masking can be beneficial.'
      },
      'sensitive': {
        shortTerm: {
          '1-2 weeks': ['Reduced redness', 'Less irritation', 'Calmer skin'],
          '4-6 weeks': ['Improved tolerance', 'Stronger barrier', 'Less reactivity'],
          '8-12 weeks': ['Increased resilience', 'Better product tolerance', 'Healthier appearance']
        },
        longTerm: {
          '3-6 months': ['Significantly reduced sensitivity', 'Improved skin defense', 'Better environmental tolerance'],
          '6-12 months': ['Optimized barrier function', 'Minimal reactivity', 'Stable skin condition']
        },
        expectedChanges: 'Your skin will develop better tolerance to environmental factors and skincare products. Redness and irritation will significantly decrease.',
        maintenanceRoutine: 'Continue with gentle, fragrance-free products. Introduce new ingredients very slowly and always patch test.'
      },
      'normal': {
        shortTerm: {
          '1-2 weeks': ['Enhanced natural glow', 'Improved texture'],
          '4-6 weeks': ['Preventive benefits', 'Optimized skin function'],
          '8-12 weeks': ['Better aging prevention', 'Improved radiance']
        },
        longTerm: {
          '3-6 months': ['Maintained youthful appearance', 'Prevented premature aging'],
          '6-12 months': ['Optimal skin health', 'Enhanced natural beauty']
        },
        expectedChanges: 'Your skin will maintain its healthy state while gaining additional protection against environmental damage and aging.',
        maintenanceRoutine: 'Focus on prevention with antioxidants and sunscreen. Gradually introduce anti-aging ingredients as you age.'
      }
    };
  }

  // ============ STRICT BUDGET FILTERING ============
  applyBudgetFiltering(recommendations, userProfile) {
    const country = userProfile.country || 'india';
    const countryData = this.countryDatabase[country];
    
    const budgetLimits = {
      'budget-friendly': countryData?.budgetRanges?.['budget-friendly'] || 500,
      'mid-range': countryData?.budgetRanges?.['mid-range'] || 1500,
      'premium': countryData?.budgetRanges?.['premium'] || 3000,
      'luxury': countryData?.budgetRanges?.['luxury'] || 10000
    };

    const maxBudget = budgetLimits[userProfile.budget] || budgetLimits['budget-friendly'];
    const currency = countryData?.currency || 'INR';
    console.log(`💰 Applying budget filter: ${currency} ${maxBudget}`);

    const filteredRecommendations = [];

    recommendations.forEach(rec => {
      const product = this.productDatabase[rec.productId];
      
      if (!product) {
        console.warn(`⚠️ Product not found: ${rec.productId}`);
        return;
      }

      // Filter by country availability
      if (product.country && product.country !== country) {
        return; // Skip products not available in user's country
      }
      if (product.price <= maxBudget) {
        filteredRecommendations.push({
          ...rec,
          price: product.price,
          currency: product.currency || currency,
          withinBudget: true
        });
      } else {
        // Try to find budget alternative
        const alternative = this.findBudgetAlternative(rec, maxBudget, country);
        if (alternative) {
          filteredRecommendations.push({
            ...alternative,
            budgetAlternative: true,
            originalProduct: rec.productId
          });
        } else {
          console.log(`💸 No budget alternative found for ${product.name} (${currency} ${product.price})`);
        }
      }
    });

    console.log(`✅ Budget filtering complete: ${filteredRecommendations.length} products within budget`);
    return filteredRecommendations;
  }

  findBudgetAlternative(originalRec, maxBudget, country) {
    const originalProduct = this.productDatabase[originalRec.productId];
    if (!originalProduct) return null;

    // Find products in same category within budget
    const alternatives = Object.entries(this.productDatabase)
      .filter(([id, product]) => 
        product.category === originalProduct.category &&
        product.price <= maxBudget &&
        (!product.country || product.country === country) &&
        id !== originalRec.productId
      )
      .sort((a, b) => {
        // Sort by compatibility with original product's benefits
        const aCompatibility = this.calculateAlternativeCompatibility(a[1], originalProduct);
        const bCompatibility = this.calculateAlternativeCompatibility(b[1], originalProduct);
        return bCompatibility - aCompatibility;
      });

    if (alternatives.length === 0) return null;

    const [alternativeId, alternativeProduct] = alternatives[0];
    return {
      ...originalRec,
      productId: alternativeId,
      reasoning: `Budget-friendly alternative to ${originalProduct.name}`,
      price: alternativeProduct.price,
      currency: alternativeProduct.currency,
      budgetSavings: originalProduct.price - alternativeProduct.price
    };
  }

  calculateAlternativeCompatibility(alternative, original) {
    let compatibility = 0;
    
    // Same suitable skin types
    const commonSkinTypes = alternative.suitableFor.filter(type => 
      original.suitableFor.includes(type)
    ).length;
    compatibility += commonSkinTypes * 10;
    
    // Same concerns addressed
    const commonConcerns = alternative.addresses.filter(concern => 
      original.addresses.includes(concern)
    ).length;
    compatibility += commonConcerns * 15;
    
    // Same strength level
    if (alternative.strength === original.strength) {
      compatibility += 20;
    }
    
    return compatibility;
  }

  // ============ ENHANCED BASE RECOMMENDATIONS ============
  generateBaseRecommendations(userProfile) {
    console.log('🔍 Generating base recommendations for profile:', userProfile);
    
    const recommendations = [];
    const country = userProfile.country || 'india';
    
    // 1. Essential products (always include)
    recommendations.push(...this.getEssentialProducts(userProfile));
    
    // 2. Climate-specific products (NEW)
    recommendations.push(...this.getClimateSpecificProducts(userProfile));
    
    // 2.5. Country-specific products (NEW)
    recommendations.push(...this.getCountrySpecificProducts(userProfile));
    
    // 3. Skin type specific products
    recommendations.push(...this.getSkinTypeProducts(userProfile));
    
    // 4. Concern-based products with priority
    recommendations.push(...this.getConcernBasedProducts(userProfile));
    
    // 5. Age-appropriate products
    recommendations.push(...this.getAgeBasedProducts(userProfile));
    
    console.log(`✅ Generated ${recommendations.length} base recommendations`);
    return this.deduplicateRecommendations(recommendations);
  }

  getCountrySpecificProducts(userProfile) {
    const country = userProfile.country || 'india';
    const countryProducts = [];
    
    // Australia-specific recommendations
    if (country === 'australia') {
      // High SPF is essential in Australia
      countryProducts.push({
        productId: 'cancer_council_face_day_wear',
        reasoning: 'Essential high SPF protection for harsh Australian sun',
        category: 'country_essential',
        priority: 100,
        countrySpecific: true
      });
      
      // Local brand preference for better availability
      if (userProfile.preferLocalBrands) {
        const localBrandProducts = Object.entries(this.productDatabase)
          .filter(([id, product]) => 
            product.country === 'australia' &&
            userProfile.countryData.localBrands.includes(product.brand)
          )
          .slice(0, 3);
          
        localBrandProducts.forEach(([productId, product]) => {
          countryProducts.push({
            productId,
            reasoning: `Australian brand ${product.brand} - locally formulated and readily available`,
            category: 'local_brand',
            priority: 75,
            countrySpecific: true
          });
        });
      }
    }
    
    return countryProducts;
  }
  getClimateSpecificProducts(userProfile) {
    const climate = this.climateDatabase[userProfile.climate];
    if (!climate) return [];

    const climateProducts = [];
    
    // Add climate-priority ingredients
    climate.priorityIngredients.forEach(ingredient => {
      const suitableProducts = this.findProductsByIngredient(ingredient, userProfile);
      climateProducts.push(...suitableProducts.map(productId => ({
        productId,
        reasoning: `Recommended for ${userProfile.climate} climate conditions`,
        category: 'climate_specific',
        priority: 80,
        climateSpecific: true
      })));
    });

    return climateProducts;
  }

  findProductsByIngredient(ingredient, userProfile) {
    return Object.entries(this.productDatabase)
      .filter(([id, product]) => {
        // Check if product contains the ingredient or addresses related concerns
        const hasIngredient = product.activeIngredients?.includes(ingredient);
        const addressesConcern = this.getIngredientConcerns(ingredient).some(concern =>
          product.addresses.includes(concern)
        );
        const suitableForSkinType = product.suitableFor.includes('all') || 
                                   product.suitableFor.includes(userProfile.skinType);
        
        return (hasIngredient || addressesConcern) && suitableForSkinType;
      })
      .map(([id]) => id)
      .slice(0, 2); // Limit to top 2 products per ingredient
  }

  getIngredientConcerns(ingredient) {
    const concernMap = {
      'salicylic_acid': ['acne_breakouts', 'large_pores', 'excess_oil_shine'],
      'niacinamide': ['excess_oil_shine', 'large_pores', 'sensitivity_redness'],
      'hyaluronic_acid': ['dryness_dehydration', 'fine_lines_wrinkles'],
      'vitamin_c': ['dark_spots_hyperpigmentation', 'fine_lines_wrinkles'],
      'retinol': ['fine_lines_wrinkles', 'acne_breakouts', 'uneven_texture'],
      'zinc_oxide': ['sun_protection', 'sensitivity_redness'],
      'ceramides': ['dryness_dehydration', 'sensitivity_redness']
    };
    
    return concernMap[ingredient] || [];
  }

  // ============ ENHANCED ROUTINE GENERATION ============
  addRoutineWarningsAndBenefits(recommendations, userProfile) {
    const routine = this.generateDetailedRoutine(recommendations, userProfile);
    const warnings = this.generateDetailedWarnings(recommendations, userProfile);
    const benefits = this.generatePersonalizedBenefits(recommendations, userProfile);
    const timeline = this.generateDetailedTimeline(recommendations, userProfile);

    return {
      user_profile: userProfile,
      generated_at: new Date().toISOString(),
      recommendations: recommendations,
      routine_suggestions: routine,
      warnings: warnings,
      expected_benefits: benefits,
      timeline: timeline,
      budget_summary: this.generateBudgetSummary(recommendations),
      extend_button_data: this.generateExtendButtonData(userProfile, benefits)
    };
  }

  generateDetailedRoutine(recommendations, userProfile) {
    const allProducts = Object.keys(recommendations).reduce((acc, category) => {
      return acc.concat(recommendations[category]);
    }, []);

    const morningRoutine = [];
    const eveningRoutine = [];

    // Define routine order
    const routineSteps = [
      { category: 'cleanser', step: 'cleansing', timing: 'both' },
      { category: 'active', step: 'treatment', timing: 'specific' },
      { category: 'hydrating', step: 'hydration', timing: 'both' },
      { category: 'moisturizer', step: 'moisturizing', timing: 'both' },
      { category: 'sunscreen', step: 'protection', timing: 'morning' }
    ];

    routineSteps.forEach(({ category, step, timing }) => {
      const categoryProducts = allProducts.filter(rec => {
        const product = this.productDatabase[rec.productId];
        return product?.category === category;
      });

      categoryProducts.forEach(rec => {
        const product = this.productDatabase[rec.productId];
        if (!product) return;

        const routineItem = {
          product_id: this.safeString(rec.productId),
          product_name: this.safeString(product.name || 'Unknown Product'),
          brand: this.safeString(product.brand || 'Unknown Brand'),
          price: parseInt(product.price) || 0,
          step: this.safeString(step),
          instructions: this.safeString(this.getDetailedUsageInstructions(rec.productId, userProfile)),
          why_recommended: this.safeString(rec.reasoning || 'Recommended for your skin type'),
          key_benefits: this.safeArray(product.benefits || []),
          wait_time: this.safeString(this.getWaitTime(product)),
          application_amount: this.safeString(this.getApplicationAmount(product)),
          frequency: this.safeString(this.getFrequency(rec.productId, userProfile))
        };

        // Add to appropriate routine(s)
        if (timing === 'both' || timing === 'morning') {
          morningRoutine.push({ ...routineItem, routine_time: 'morning' });
        }
        
        if (timing === 'both' || timing === 'evening') {
          eveningRoutine.push({ ...routineItem, routine_time: 'evening' });
        }
        
        // Handle specific timing for actives
        if (timing === 'specific') {
          const activeIngredients = this.safeArray(product.activeIngredients || []);
          if (activeIngredients.includes('vitamin_c')) {
            morningRoutine.push({ ...routineItem, routine_time: 'morning' });
          } else {
            eveningRoutine.push({ ...routineItem, routine_time: 'evening' });
          }
        }
      });
    });

    return {
      morning: morningRoutine.sort((a, b) => this.getRoutineOrder(a.step) - this.getRoutineOrder(b.step)),
      evening: eveningRoutine.sort((a, b) => this.getRoutineOrder(a.step) - this.getRoutineOrder(b.step)),
      weekly_treatments: this.getWeeklyTreatments(allProducts, userProfile),
      routine_tips: this.getRoutineTips(userProfile)
    };
  }

  getDetailedUsageInstructions(productId, userProfile) {
    const product = this.productDatabase[productId];
    if (!product) return 'Follow product instructions';

    const baseInstructions = {
      'cetaphil_gentle_cleanser': 'Apply to damp skin, massage gently for 30 seconds, rinse with lukewarm water',
      'simple_refreshing_cleanser': 'Use morning and evening on wet face, massage gently, rinse thoroughly',
      'neutrogena_oil_free_cleanser': 'Apply to wet skin, work into lather avoiding eye area, rinse completely',
      'cerave_foaming_cleanser': 'Pump into hands, apply to wet skin, massage gently, rinse with water',
      'minimalist_niacinamide': 'Apply 2-3 drops to clean skin, gently pat in, wait 5 minutes before next step',
      'the_ordinary_hyaluronic_acid': 'Apply to slightly damp skin, press gently to absorb, follow with moisturizer',
      'paula_choice_bha': 'Apply thin layer to clean skin 2-3 times per week, start slowly',
      'cosrx_vitamin_c': 'Use in morning routine, apply 2-3 drops, wait 10 minutes before moisturizer',
      'ponds_super_light_gel': 'Apply small amount to face and neck, massage until absorbed',
      'cerave_daily_moisturizer': 'Apply liberally to face and neck while skin is still slightly damp',
      'neutrogena_ultra_sheer': 'Apply generously 15 minutes before sun exposure, reapply every 2 hours',
      'la_roche_posay_sunscreen': 'Use as final morning step, apply evenly, do not forget neck and ears'
    };

    let instructions = this.safeString(baseInstructions[productId] || 'Follow product instructions carefully');

    // Add experience-based modifications
    if (userProfile.experience === 'beginner' && product.category === 'active') {
      instructions += '. Start with once per week and gradually increase frequency as tolerated.';
    }

    // Add sensitivity modifications
    if (userProfile.sensitivity > 7 && product.strength !== 'gentle') {
      instructions += '. Patch test first and start with minimal amount.';
    }

    return instructions;
  }

  getWaitTime(product) {
    const waitTimes = {
      'active': '5-10 minutes',
      'hydrating': '2-3 minutes',
      'cleanser': 'None',
      'moisturizer': '2-3 minutes',
      'sunscreen': 'None (final step)'
    };
    return waitTimes[product.category] || '2-3 minutes';
  }

  getApplicationAmount(product) {
    const amounts = {
      'cleanser': '1-2 pumps or pea-sized amount',
      'active': '2-3 drops or thin layer',
      'hydrating': '3-4 drops',
      'moisturizer': 'Nickel-sized amount',
      'sunscreen': '1/4 teaspoon for face and neck'
    };
    return amounts[product.category] || 'As directed';
  }

  getFrequency(productId, userProfile) {
    const product = this.productDatabase[productId];
    if (!product) return 'As needed';

    const baseFrequencies = {
      'cleanser': 'Twice daily',
      'hydrating': 'Once or twice daily',
      'moisturizer': 'Twice daily',
      'sunscreen': 'Every morning'
    };

    if (product.category === 'active') {
      if (userProfile.experience === 'beginner') {
        return 'Start 1-2 times per week, gradually increase';
      } else if (userProfile.experience === 'intermediate') {
        return '3-4 times per week';
      } else {
        return 'Daily (evening) if tolerated';
      }
    }

    return baseFrequencies[product.category] || 'As directed';
  }

  getRoutineOrder(step) {
    const order = {
      'cleansing': 1,
      'treatment': 2,
      'hydration': 3,
      'moisturizing': 4,
      'protection': 5
    };
    return order[step] || 6;
  }

  getWeeklyTreatments(allProducts, userProfile) {
    const treatments = [];
    
    // Add exfoliation recommendation
    if (userProfile.skinType === 'oily' || userProfile.concerns.includes('acne_breakouts')) {
      treatments.push({
        treatment: 'Gentle exfoliation',
        frequency: '1-2 times per week',
        description: 'Use a gentle BHA product for deeper pore cleansing',
        timing: 'Evening',
        replace_step: 'Skip other actives on exfoliation nights'
      });
    }
    
    // Add mask recommendations
    if (userProfile.concerns.includes('dryness_dehydration')) {
      treatments.push({
        treatment: 'Hydrating mask',
        frequency: 'Once per week',
        description: 'Use a sheet mask or hydrating treatment mask',
        timing: 'Evening after cleansing',
        duration: '15-20 minutes'
      });
    }

    return treatments;
  }

  getRoutineTips(userProfile) {
    const tips = [
      '💧 Always apply products to slightly damp skin for better absorption',
      '⏰ Allow each product to absorb before applying the next',
      '🧪 Introduce new products one at a time to monitor reactions',
      '☀️ Never skip sunscreen, even on cloudy days'
    ];

    // Add experience-specific tips
    if (userProfile.experience === 'beginner') {
      tips.push('🐌 Start slowly with active ingredients - your skin needs time to adjust');
      tips.push('📝 Keep a skincare diary to track what works for you');
    }

    // Add climate-specific tips
    if (userProfile.climate === 'hot_humid') {
      tips.push('🌡️ In humid weather, use lighter formulations and wait longer between steps');
      tips.push('💨 Consider using a fan while applying products to help absorption');
    }

    // Add skin type tips
    if (userProfile.skinType === 'sensitive') {
      tips.push('🧾 Always patch test new products on your inner arm first');
      tips.push('🌡️ Use lukewarm water instead of hot when cleansing');
    }

    return tips;
  }

  // ============ DETAILED BENEFITS GENERATION ============
  generatePersonalizedBenefits(recommendations, userProfile) {
    const skinTypeBenefits = this.benefitsDatabase[userProfile.skinType];
    const allProducts = Object.keys(recommendations).reduce((acc, category) => {
      return acc.concat(recommendations[category]);
    }, []);

    // Calculate combined benefits from all recommended products
    const combinedBenefits = this.calculateCombinedBenefits(allProducts, userProfile);

    return {
      skin_type_benefits: skinTypeBenefits,
      product_specific_benefits: this.getProductSpecificBenefits(allProducts),
      synergistic_effects: combinedBenefits.synergisticEffects,
      timeline_benefits: this.createBenefitsTimeline(allProducts, userProfile),
      before_after_expectations: this.generateBeforeAfterExpectations(userProfile),
      maintenance_benefits: combinedBenefits.maintenanceBenefits
    };
  }

  calculateCombinedBenefits(products, userProfile) {
    const activeIngredients = [];
    const addressedConcerns = new Set();
    
    products.forEach(rec => {
      const product = this.productDatabase[rec.productId];
      if (product) {
        if (product.activeIngredients) {
          activeIngredients.push(...product.activeIngredients);
        }
        product.addresses.forEach(concern => addressedConcerns.add(concern));
      }
    });

    const synergisticEffects = this.calculateSynergisticEffects(activeIngredients);
    const maintenanceBenefits = this.calculateMaintenanceBenefits(addressedConcerns, userProfile);

    return { synergisticEffects, maintenanceBenefits };
  }

  calculateSynergisticEffects(ingredients) {
    const synergies = {
      'niacinamide + hyaluronic_acid': 'Enhanced hydration with oil control - perfect balance for all skin types',
      'vitamin_c + niacinamide': 'Powerful antioxidant protection with brightening effects (when used properly)',
      'retinol + hyaluronic_acid': 'Anti-aging benefits with minimized irritation and enhanced hydration',
      'ceramides + hyaluronic_acid': 'Superior barrier repair and long-lasting hydration',
      'salicylic_acid + niacinamide': 'Deep pore cleansing with anti-inflammatory benefits'
    };

    const foundSynergies = [];
    Object.keys(synergies).forEach(combo => {
      const [ing1, ing2] = combo.split(' + ');
      if (ingredients.includes(ing1) && ingredients.includes(ing2)) {
        foundSynergies.push({
          combination: combo,
          effect: synergies[combo],
          strength: 'Strong'
        });
      }
    });

    return foundSynergies;
  }

  calculateMaintenanceBenefits(addressedConcerns, userProfile) {
    const benefits = [];
    
    addressedConcerns.forEach(concern => {
      const maintenanceMap = {
        'acne_breakouts': 'Ongoing acne prevention and reduced scarring risk',
        'fine_lines_wrinkles': 'Continued collagen stimulation and aging prevention',
        'dark_spots_hyperpigmentation': 'Even skin tone maintenance and new spot prevention',
        'excess_oil_shine': 'Balanced sebum production and improved skin texture',
        'dryness_dehydration': 'Optimal hydration levels and strengthened skin barrier',
        'sensitivity_redness': 'Improved skin tolerance and reduced reactivity',
        'large_pores': 'Minimized pore appearance and refined skin texture'
      };

      if (maintenanceMap[concern]) {
        benefits.push({
          concern: concern,
          maintenance_benefit: maintenanceMap[concern],
          importance: 'High'
        });
      }
    });

    return benefits;
  }

  getProductSpecificBenefits(products) {
    return products.map(rec => {
      const product = this.productDatabase[rec.productId];
      if (!product) return null;

      return {
        product_name: product.name,
        brand: product.brand,
        key_benefits: product.benefits,
        expected_results: this.getExpectedResults(product),
        timeline: this.getProductTimeline(product)
      };
    }).filter(Boolean);
  }

  getExpectedResults(product) {
    const resultMap = {
      'cleanser': 'Clean, refreshed skin without tightness or irritation',
      'active': 'Gradual improvement in targeted concerns with consistent use',
      'hydrating': 'Plumper, more hydrated skin with improved texture',
      'moisturizer': 'Soft, comfortable skin with strengthened barrier',
      'sunscreen': 'Protection from UV damage and premature aging prevention'
    };

    return resultMap[product.category] || 'Improved skin health and appearance';
  }

  getProductTimeline(product) {
    const timelineMap = {
      'cleanser': 'Immediate comfort, long-term skin health',
      'active': '4-12 weeks for visible results, 3-6 months for optimal benefits',
      'hydrating': '1-2 weeks for improved hydration, ongoing maintenance',
      'moisturizer': 'Immediate comfort, 2-4 weeks for barrier improvement',
      'sunscreen': 'Immediate protection, lifelong aging prevention'
    };

    return timelineMap[product.category] || '4-8 weeks for noticeable improvement';
  }

  createBenefitsTimeline(products, userProfile) {
    const timeline = {
      'Week 1-2': [],
      'Week 3-4': [],
      'Month 2-3': [],
      'Month 4-6': [],
      'Month 6+': []
    };

    // Immediate benefits (Week 1-2)
    timeline['Week 1-2'].push('Improved cleansing and hydration');
    timeline['Week 1-2'].push('Sun protection established');
    if (userProfile.skinType === 'dry') {
      timeline['Week 1-2'].push('Reduced skin tightness and flaking');
    }

    // Early benefits (Week 3-4)
    timeline['Week 3-4'].push('Skin begins to adjust to new routine');
    timeline['Week 3-4'].push('Initial improvement in texture');
    if (userProfile.concerns.includes('acne_breakouts')) {
      timeline['Week 3-4'].push('Possible initial breakout as skin purges');
    }

    // Medium-term benefits (Month 2-3)
    timeline['Month 2-3'].push('Significant improvement in primary concerns');
    timeline['Month 2-3'].push('Strengthened skin barrier');
    timeline['Month 2-3'].push('Better product tolerance');

    // Long-term benefits (Month 4-6)
    timeline['Month 4-6'].push('Optimal results from active ingredients');
    timeline['Month 4-6'].push('Stable skin improvement');
    timeline['Month 4-6'].push('Reduced need for frequent adjustments');

    // Maintenance phase (Month 6+)
    timeline['Month 6+'].push('Maintained healthy skin state');
    timeline['Month 6+'].push('Prevention of future concerns');
    timeline['Month 6+'].push('Opportunity to add advanced treatments');

    return timeline;
  }

  generateBeforeAfterExpectations(userProfile) {
    const before = {
      'oily': 'Excessive shine, frequent breakouts, visible pores, makeup doesn\'t last',
      'dry': 'Tight, flaky skin, dull appearance, fine lines more visible, makeup looks cakey',
      'combination': 'Oily T-zone with dry cheeks, uneven texture, difficulty finding suitable products',
      'sensitive': 'Frequent redness, irritation, burning sensation, limited product options',
      'normal': 'Generally healthy but lacking optimization, minor concerns, preventive needs'
    };

    const after = {
      'oily': 'Controlled oil production, fewer breakouts, refined pores, longer-lasting makeup',
      'dry': 'Soft, supple skin, healthy glow, smoothed fine lines, better makeup application',
      'combination': 'Balanced skin zones, even texture, easier product selection, unified appearance',
      'sensitive': 'Calm, comfortable skin, reduced reactivity, expanded product tolerance',
      'normal': 'Optimized skin health, enhanced natural beauty, effective aging prevention'
    };

    return {
      current_state: before[userProfile.skinType] || 'Various skin concerns affecting confidence',
      expected_outcome: after[userProfile.skinType] || 'Healthier, more confident skin',
      transformation_timeline: '3-6 months for significant transformation',
      maintenance_effort: 'Daily routine with periodic adjustments'
    };
  }

  // ============ BUDGET SUMMARY ============
  generateBudgetSummary(recommendations) {
    const allProducts = Object.keys(recommendations).reduce((acc, category) => {
      return acc.concat(recommendations[category]);
    }, []);

    const totalCost = allProducts.reduce((sum, rec) => sum + (rec.price || 0), 0);
    const productCount = allProducts.length;
    const averageCost = productCount > 0 ? Math.round(totalCost / productCount) : 0;
    const currency = allProducts.length > 0 ? (allProducts[0].currency || 'INR') : 'INR';

    const categoryCosts = {};
    Object.keys(recommendations).forEach(category => {
      categoryCosts[category] = recommendations[category].reduce((sum, rec) => sum + (rec.price || 0), 0);
    });

    return {
      total_cost: totalCost,
      currency: currency,
      product_count: productCount,
      average_cost_per_product: averageCost,
      category_breakdown: categoryCosts,
      budget_tips: this.getBudgetTips(totalCost, currency),
      cost_per_month: Math.round(totalCost / 3), // Assuming 3-month supply
      value_assessment: this.assessValue(totalCost, productCount, currency)
    };
  }

  getBudgetTips(totalCost, currency = 'INR') {
    const tips = [];
    const currencySymbol = currency === 'AUD' ? '$' : '₹';
    
    const highCostThreshold = currency === 'AUD' ? 150 : 2000;
    
    if (totalCost > highCostThreshold) {
      tips.push('💡 Consider starting with essential products first, then adding treatments gradually');
      tips.push('🛒 Look for bundle deals or subscribe-and-save options');
    }
    
    tips.push('📦 Many products last 2-3 months, making the cost per use very reasonable');
    tips.push('🎯 Invest in quality basics (cleanser, moisturizer, sunscreen) before adding actives');
    tips.push('⚖️ Compare cost per ml/gram when choosing between similar products');
    
    if (currency === 'AUD') {
      tips.push('🇦🇺 Consider Australian brands for better availability and local climate formulation');
      tips.push('🛍️ Shop at Chemist Warehouse or Priceline for better prices on international brands');
    }
    
    return tips;
  }

  assessValue(totalCost, productCount, currency = 'INR') {
    const costPerProduct = totalCost / productCount;
    const currencySymbol = currency === 'AUD' ? '$' : '₹';
    
    const thresholds = currency === 'AUD' ? 
      { excellent: 25, good: 50, premium: 100 } : 
      { excellent: 400, good: 800, premium: 1500 };
    
    if (costPerProduct < thresholds.excellent) {
      return 'Excellent value - affordable products with good efficacy';
    } else if (costPerProduct < thresholds.good) {
      return 'Good value - balanced quality and pricing';
    } else if (costPerProduct < thresholds.premium) {
      return 'Premium value - higher quality ingredients and formulations';
    } else {
      return 'Luxury value - top-tier products with advanced formulations';
    }
  }

  // ============ EXTEND BUTTON DATA ============
  generateExtendButtonData(userProfile, benefits) {
    return {
      detailed_science: this.generateDetailedScience(userProfile),
      ingredient_deep_dive: this.generateIngredientDeepDive(userProfile),
      skin_transformation_guide: this.generateTransformationGuide(userProfile),
      troubleshooting_guide: this.generateTroubleshootingGuide(userProfile),
      advanced_tips: this.generateAdvancedTips(userProfile),
      seasonal_adjustments: this.generateSeasonalAdjustments(userProfile)
    };
  }

  generateDetailedScience(userProfile) {
    const scienceBase = {
      'oily': {
        explanation: 'Oily skin produces excess sebum due to overactive sebaceous glands, often triggered by hormones, genetics, or environmental factors.',
        how_products_work: 'Recommended products work by regulating sebum production, unclogging pores, and maintaining proper hydration without adding excess oil.',
        key_mechanisms: [
          'Niacinamide reduces sebum production by up to 30%',
          'Salicylic acid dissolves oil and dead skin in pores',
          'Lightweight moisturizers prevent dehydration without clogging pores'
        ]
      },
      'dry': {
        explanation: 'Dry skin lacks sufficient lipids and natural moisturizing factors, leading to impaired barrier function and water loss.',
        how_products_work: 'Products focus on replacing lost lipids, attracting and retaining moisture, and strengthening the skin barrier.',
        key_mechanisms: [
          'Hyaluronic acid can hold up to 1000x its weight in water',
          'Ceramides restore the skin\'s natural barrier',
          'Occlusives prevent transepidermal water loss'
        ]
      },
      'combination': {
        explanation: 'Combination skin has varying sebaceous gland activity across the face, typically with an oily T-zone and normal to dry cheeks.',
        how_products_work: 'The routine balances different needs across facial zones while using products suitable for the entire face.',
        key_mechanisms: [
          'Multi-functional ingredients address multiple concerns',
          'Lightweight formulations work for all areas',
          'Targeted application can optimize results'
        ]
      }
    };

    return scienceBase[userProfile.skinType] || scienceBase['combination'];
  }

  generateIngredientDeepDive(userProfile) {
    // This would contain detailed information about each recommended ingredient
    return {
      star_ingredients: this.getStarIngredients(userProfile),
      how_they_work: this.getIngredientMechanisms(userProfile),
      scientific_backing: this.getScientificEvidence(userProfile),
      concentration_guide: this.getConcentrationGuide(userProfile)
    };
  }

  getStarIngredients(userProfile) {
    const starIngredients = {
      'oily': ['Niacinamide', 'Salicylic Acid', 'Zinc Oxide'],
      'dry': ['Hyaluronic Acid', 'Ceramides', 'Glycerin'],
      'combination': ['Niacinamide', 'Hyaluronic Acid', 'Vitamin C'],
      'sensitive': ['Niacinamide', 'Ceramides', 'Zinc Oxide'],
      'normal': ['Vitamin C', 'Retinol', 'Hyaluronic Acid']
    };

    return starIngredients[userProfile.skinType] || starIngredients['normal'];
  }

  // ============ ENHANCED INPUT VALIDATION ============
  validateAndNormalizeInput(assessmentData) {
    // Handle case where assessmentData might be null, undefined, or not an object
    const data = assessmentData && typeof assessmentData === 'object' ? assessmentData : {};
    
    const defaults = {
      skinType: 'normal',
      skinConcerns: ['hydrate_skin'],
      medicalConditions: [],
      age: '20-29',
      gender: 'prefer_not_to_say',
      sensitivity: 5,
      climate: 'moderate',
      country: 'india',
      budget: 'budget-friendly',
      experience: 'beginner',
      goals: ['hydrate_skin'],
      lifestyle: 'mixed',
      additionalConcerns: '',
      location: ''
    };

    const normalized = {
      ...defaults,
      ...data,
      // Safely normalize arrays
      skinConcerns: this.safeArray(data.skinConcerns).filter(Boolean),
      medicalConditions: this.safeArray(data.medicalConditions).filter(Boolean),
      primaryGoals: this.safeArray(data.primaryGoals).filter(Boolean),
      // Safely normalize sensitivity
      sensitivity: Math.max(1, Math.min(10, parseInt(data.sensitivity) || 5)),
      // Safely normalize strings
      skinType: this.safeString(data.skinType) || 'normal',
      climate: this.safeString(data.climate) || 'moderate',
      country: this.safeString(data.country) || 'india',
      budget: this.safeString(data.budget) || 'budget-friendly',
      experience: this.safeString(data.experience) || 'beginner',
      location: this.safeString(data.location) || ''
    };

    // Auto-detect climate and country based on location
    const location = normalized.location.toLowerCase();
    if (location.includes('hyderabad') || location.includes('hyd')) {
      normalized.climate = 'hot_humid';
      normalized.country = 'india';
    } else if (location.includes('melbourne') || location.includes('sydney') || location.includes('australia')) {
      normalized.climate = 'temperate';
      normalized.country = 'australia';
    } else if (location.includes('brisbane') || location.includes('cairns') || location.includes('darwin')) {
      normalized.climate = 'tropical';
      normalized.country = 'australia';
    } else if (location.includes('perth') || location.includes('adelaide')) {
      normalized.climate = 'mediterranean';
      normalized.country = 'australia';
    }

    return normalized;
  }

  createUserProfile(data) {
    return {
      skinType: data.skinType,
      age: this.parseAgeRange(data.age),
      gender: data.gender,
      climate: data.climate,
      lifestyle: data.lifestyle,
      concerns: this.prioritizeConcerns(data.skinConcerns, data.primaryGoals),
      medicalConditions: data.medicalConditions,
      sensitivity: data.sensitivity,
      additionalConcerns: data.additionalConcerns,
      experience: data.experience,
      budget: data.budget,
      goals: data.primaryGoals,
      riskTolerance: this.calculateRiskTolerance(data.experience, data.sensitivity),
      routineComplexity: this.calculateRoutineComplexity(data.experience, data.age),
      primaryConcern: this.identifyPrimaryConcern(data.concerns, data.goals)
    };
  }

  prioritizeConcerns(concerns, goals) {
    const concernPriority = {
      'severe_cystic_acne': 100,
      'acne_breakouts': 90,
      'sensitivity_redness': 85,
      'fine_lines_wrinkles': 80,
      'dark_spots_hyperpigmentation': 75,
      'dryness_dehydration': 70,
      'excess_oil_shine': 65,
      'uneven_texture': 60,
      'large_pores': 55,
      'sun_protection': 95
    };

    const goalToConcernMap = {
      'clear_acne': 'acne_breakouts',
      'anti_aging': 'fine_lines_wrinkles',
      'brighten_skin': 'dark_spots_hyperpigmentation',
      'hydrate_skin': 'dryness_dehydration',
      'minimize_pores': 'large_pores',
      'sun_protection': 'sun_protection'
    };

    const allConcerns = [...concerns];
    goals.forEach(goal => {
      if (goalToConcernMap[goal] && !allConcerns.includes(goalToConcernMap[goal])) {
        allConcerns.push(goalToConcernMap[goal]);
      }
    });

    return allConcerns.sort((a, b) => 
      (concernPriority[b] || 0) - (concernPriority[a] || 0)
    );
  }

  // ============ ESSENTIAL PRODUCTS GENERATION ============
  getEssentialProducts(userProfile) {
    const essentials = [];
    
    // Cleanser selection based on skin type and budget
    const cleanserOptions = this.getCleanserOptions(userProfile);
    if (cleanserOptions.length > 0) {
      essentials.push({
        productId: cleanserOptions[0],
        reasoning: 'Essential daily cleanser for healthy skin maintenance',
        category: 'essential',
        priority: 100
      });
    }

    // Moisturizer selection
    const moisturizerOptions = this.getMoisturizerOptions(userProfile);
    if (moisturizerOptions.length > 0) {
      essentials.push({
        productId: moisturizerOptions[0],
        reasoning: 'Daily moisturizer for hydration and barrier protection',
        category: 'essential',
        priority: 95
      });
    }

    // Sunscreen selection
    const sunscreenOptions = this.getSunscreenOptions(userProfile);
    if (sunscreenOptions.length > 0) {
      essentials.push({
        productId: sunscreenOptions[0],
        reasoning: 'Daily sun protection to prevent aging and damage',
        category: 'essential',
        priority: 100
      });
    }

    return essentials;
  }

  getCleanserOptions(userProfile) {
    const country = userProfile.country || 'india';
    const budgetLimits = {
      'budget-friendly': userProfile.countryData?.budgetRanges?.['budget-friendly'] || 500,
      'mid-range': userProfile.countryData?.budgetRanges?.['mid-range'] || 1500,
      'premium': userProfile.countryData?.budgetRanges?.['premium'] || 3000,
      'luxury': userProfile.countryData?.budgetRanges?.['luxury'] || 10000
    };
    const maxBudget = budgetLimits[userProfile.budget] || 500;

    const cleanserPriority = [];

    // Country-specific cleanser recommendations
    if (country === 'australia') {
      // Budget-friendly Australian options
      if (maxBudget >= 9.95) {
        if (userProfile.skinType === 'sensitive' || userProfile.sensitivity > 7) {
          cleanserPriority.push('qv_gentle_wash', 'cetaphil_gentle_cleanser_au');
        } else if (userProfile.skinType === 'oily' || userProfile.concerns.includes('acne_breakouts')) {
          cleanserPriority.push('benzac_daily_cleanser', 'sukin_foaming_cleanser');
        } else {
          cleanserPriority.push('sukin_foaming_cleanser', 'qv_gentle_wash');
        }
      }
      
      // Mid-range Australian options
      if (maxBudget >= 32.99) {
        cleanserPriority.unshift('la_roche_posay_toleriane_au');
        if (userProfile.skinType === 'normal' || userProfile.skinType === 'combination') {
          cleanserPriority.unshift('aesop_purifying_cleanser');
        }
      }
    } else {
      // Indian options (existing logic)
      if (maxBudget >= 199) {
        if (userProfile.skinType === 'sensitive' || userProfile.sensitivity > 7) {
          cleanserPriority.push('cetaphil_gentle_cleanser', 'simple_refreshing_cleanser');
        } else if (userProfile.skinType === 'oily' || userProfile.concerns.includes('acne_breakouts')) {
          cleanserPriority.push('neutrogena_oil_free_cleanser');
        } else {
          cleanserPriority.push('simple_refreshing_cleanser', 'cetaphil_gentle_cleanser');
        }
      }

      // Mid-range options
      if (maxBudget >= 990) {
        cleanserPriority.unshift('cerave_foaming_cleanser');
        if (userProfile.medicalConditions.includes('rosacea')) {
          cleanserPriority.unshift('paula_choice_cleanser');
        }
      }
    }

    return cleanserPriority.filter(id => {
      const product = this.productDatabase[id];
      return product && product.price <= maxBudget && (!product.country || product.country === country);
    });
  }

  getMoisturizerOptions(userProfile) {
    const country = userProfile.country || 'india';
    const budgetLimits = {
      'budget-friendly': userProfile.countryData?.budgetRanges?.['budget-friendly'] || 500,
      'mid-range': userProfile.countryData?.budgetRanges?.['mid-range'] || 1500,
      'premium': userProfile.countryData?.budgetRanges?.['premium'] || 3000,
      'luxury': userProfile.countryData?.budgetRanges?.['luxury'] || 10000
    };
    const maxBudget = budgetLimits[userProfile.budget] || 500;

    const moisturizerPriority = [];

    if (country === 'australia') {
      // Budget-friendly Australian options
      if (maxBudget >= 8.99) {
        if (userProfile.skinType === 'dry' || userProfile.climate === 'arid') {
          moisturizerPriority.push('qv_cream');
        } else {
          moisturizerPriority.push('sukin_facial_moisturiser');
        }
        
        // SPF moisturizer for Australian sun
        if (maxBudget >= 19.95) {
          moisturizerPriority.unshift('hamilton_everyday_face');
        }
      }
      
      // Mid-range Australian options
      if (maxBudget >= 45.00) {
        moisturizerPriority.unshift('go_to_face_hero');
        if (userProfile.skinType === 'dry' || userProfile.concerns.includes('dryness_dehydration')) {
          moisturizerPriority.unshift('aspect_hydrating_serum');
        }
      }

    } else {
      // Indian options (existing logic)
      if (maxBudget >= 149) {
        if (userProfile.skinType === 'dry' || userProfile.climate === 'cold') {
          moisturizerPriority.push('nivea_soft_cream');
        } else {
          moisturizerPriority.push('ponds_super_light_gel');
        }
      }

      // Mid-range options
      if (maxBudget >= 699) {
        if (userProfile.skinType === 'oily' || userProfile.climate === 'hot_humid') {
          moisturizerPriority.unshift('neutrogena_hydra_boost');
        } else {
          moisturizerPriority.unshift('cerave_daily_moisturizer');
        }
      }
    }

    return moisturizerPriority.filter(id => {
      const product = this.productDatabase[id];
      return product && product.price <= maxBudget && (!product.country || product.country === country);
    });
  }

  getSunscreenOptions(userProfile) {
    const country = userProfile.country || 'india';
    const budgetLimits = {
      'budget-friendly': userProfile.countryData?.budgetRanges?.['budget-friendly'] || 500,
      'mid-range': userProfile.countryData?.budgetRanges?.['mid-range'] || 1500,
      'premium': userProfile.countryData?.budgetRanges?.['premium'] || 3000,
      'luxury': userProfile.countryData?.budgetRanges?.['luxury'] || 10000
    };
    const maxBudget = budgetLimits[userProfile.budget] || 500;

    const sunscreenPriority = [];

    if (country === 'australia') {
      // Budget-friendly Australian options (SPF 50+ essential)
      if (maxBudget >= 14.95) {
        sunscreenPriority.push('cancer_council_face_day_wear');
        if (maxBudget >= 19.95) {
          sunscreenPriority.unshift('hamilton_face_sunscreen');
        }
      }
      
      // Mid-range Australian options
      if (maxBudget >= 29.95) {
        if (userProfile.skinType === 'sensitive' || userProfile.medicalConditions.includes('rosacea')) {
          sunscreenPriority.unshift('invisible_zinc_face_fluid');
        }
        if (maxBudget >= 42.00) {
          sunscreenPriority.unshift('ultra_violette_supreme_screen');
        }
      }
    } else {
      // Indian options (existing logic)
      if (maxBudget >= 299) {
        sunscreenPriority.push('lakme_sunscreen');
        if (maxBudget >= 449) {
          sunscreenPriority.unshift('neutrogena_ultra_sheer');
        }
      }

      // Mid-range options
      if (maxBudget >= 899) {
        sunscreenPriority.unshift('la_roche_posay_sunscreen');
        if (userProfile.sensitivity > 7 || userProfile.medicalConditions.includes('rosacea')) {
          sunscreenPriority.unshift('eltamd_sunscreen');
        }
      }
    }

    return sunscreenPriority.filter(id => {
      const product = this.productDatabase[id];
      return product && product.price <= maxBudget && (!product.country || product.country === country);
    });
  }

  // ============ CONCERN-BASED PRODUCTS ============
  getConcernBasedProducts(userProfile) {
    const concernProducts = [];
    const country = userProfile.country || 'india';
    const budgetLimits = {
      'budget-friendly': userProfile.countryData?.budgetRanges?.['budget-friendly'] || 500,
      'mid-range': userProfile.countryData?.budgetRanges?.['mid-range'] || 1500,
      'premium': userProfile.countryData?.budgetRanges?.['premium'] || 3000,
      'luxury': userProfile.countryData?.budgetRanges?.['luxury'] || 10000
    };
    const maxBudget = budgetLimits[userProfile.budget] || 500;
    
    userProfile.concerns.forEach((concern, index) => {
      const priority = 90 - (index * 10);
      
      switch(concern) {
        case 'acne_breakouts':
          if (country === 'australia') {
            // Australian acne products
            if (maxBudget >= 9.90) {
              concernProducts.push({
                productId: 'the_ordinary_niacinamide_au',
                reasoning: 'Controls oil production and reduces acne inflammation',
                category: 'targeted',
                priority: priority
              });
            }
            
            if (userProfile.experience !== 'beginner' && maxBudget >= 19.99) {
              concernProducts.push({
                productId: 'benzac_spot_treatment',
                reasoning: 'Targeted acne treatment with benzoyl peroxide',
                category: 'targeted',
                priority: priority - 5
              });
            }
          } else {
            // Indian acne products (existing logic)
            if (maxBudget >= 349) {
              concernProducts.push({
                productId: 'minimalist_niacinamide',
                reasoning: 'Controls oil production and reduces acne inflammation',
                category: 'targeted',
                priority: priority
              });
            }
          }
          
          // BHA for intermediate+ users (both countries)
          const bhaProduct = country === 'australia' ? 'paula_choice_bha_au' : 'paula_choice_bha';
          const bhaPrice = country === 'australia' ? 49.00 : 1299;
          
          if (userProfile.experience !== 'beginner' && maxBudget >= bhaPrice) {
            concernProducts.push({
              productId: bhaProduct,
              reasoning: 'Unclogs pores and prevents new breakouts',
              category: 'targeted',
              priority: priority - 5
            });
          }
          break;
          
        case 'fine_lines_wrinkles':
          if (country === 'australia') {
            // Australian anti-aging products
            if (maxBudget >= 89.00) {
              concernProducts.push({
                productId: 'aspect_vitamin_c',
                reasoning: 'Australian dermatologist-formulated vitamin C for anti-aging',
                category: 'targeted',
                priority: priority
              });
            }
            
            if (userProfile.experience === 'advanced' && maxBudget >= 180.00 && userProfile.age > 25) {
              concernProducts.push({
                productId: 'rationale_retinol',
                reasoning: 'Premium Australian retinol for advanced anti-aging',
                category: 'targeted',
                priority: priority + 5
              });
            }
          } else {
            // Indian anti-aging products (existing logic)
            if (maxBudget >= 899) {
              concernProducts.push({
                productId: 'cosrx_vitamin_c',
                reasoning: 'Antioxidant protection and collagen support',
                category: 'targeted',
                priority: priority
              });
            }
          }
          break;
          
        case 'dark_spots_hyperpigmentation':
          if (country === 'australia') {
            if (maxBudget >= 125.00) {
              concernProducts.push({
                productId: 'synergie_vitamin_c',
                reasoning: 'High-strength vitamin C for brightening and spot reduction',
                category: 'targeted',
                priority: priority
              });
            } else if (maxBudget >= 89.00) {
              concernProducts.push({
                productId: 'aspect_vitamin_c',
                reasoning: 'Clinical-grade vitamin C for pigmentation',
                category: 'targeted',
                priority: priority
              });
            }
          } else {
            if (maxBudget >= 899) {
              concernProducts.push({
                productId: 'cosrx_vitamin_c',
                reasoning: 'Brightens skin tone and fades dark spots',
                category: 'targeted',
                priority: priority
              });
            }
          }
          break;
          
        case 'dryness_dehydration':
          const hyaluronicProduct = country === 'australia' ? 'the_ordinary_hyaluronic_au' : 'the_ordinary_hyaluronic_acid';
          const hyaluronicPrice = country === 'australia' ? 9.90 : 490;
          
          if (maxBudget >= hyaluronicPrice) {
            concernProducts.push({
              productId: hyaluronicProduct,
              reasoning: 'Intense hydration and moisture retention',
              category: 'targeted',
              priority: priority
            });
          }
          break;
          
        case 'excess_oil_shine':
        case 'large_pores':
          if (country === 'australia') {
            if (maxBudget >= 9.90) {
              concernProducts.push({
                productId: 'the_ordinary_niacinamide_au',
                reasoning: 'Controls sebum production and minimizes pore appearance',
                category: 'targeted',
                priority: priority
              });
            }
            
            // Premium niacinamide for better results
            if (maxBudget >= 95.00) {
              concernProducts.push({
                productId: 'synergie_vitamin_b',
                reasoning: 'High-strength niacinamide for superior oil control',
                category: 'targeted',
                priority: priority + 5
              });
            }
          } else {
            if (maxBudget >= 349) {
              concernProducts.push({
                productId: 'minimalist_niacinamide',
                reasoning: 'Controls sebum production and minimizes pore appearance',
                category: 'targeted',
                priority: priority
              });
            }
          }
          break;
          
        case 'sun_protection':
          // Critical in Australia
          if (country === 'australia') {
            concernProducts.push({
              productId: 'cancer_council_face_day_wear',
              reasoning: 'Essential SPF 50+ protection for Australian conditions',
              category: 'targeted',
              priority: 100 // Highest priority in Australia
            });
          }
          break;
      }
    });

    return concernProducts;
  }

  // ============ MEDICAL CONSTRAINTS ============
  applyMedicalConstraints(recommendations, userProfile) {
    if (userProfile.medicalConditions.length === 0) {
      return recommendations;
    }

    const filteredRecommendations = [...recommendations];
    
    userProfile.medicalConditions.forEach(condition => {
      switch(condition) {
        case 'eczema':
          // Remove harsh actives, add gentle products
          this.removeProductsByStrength(filteredRecommendations, ['moderate', 'strong']);
          break;
          
        case 'rosacea':
          // Remove retinoids and strong actives
          this.removeProductsWithIngredients(filteredRecommendations, ['retinol']);
          // Prefer gentle, anti-inflammatory products
          break;
          
        case 'severe_cystic_acne':
          // Add medical consultation note
          filteredRecommendations.push({
            productId: 'medical_consultation',
            reasoning: 'Professional dermatological treatment recommended for severe acne',
            category: 'medical',
            priority: 100,
            medicallyRequired: true
          });
          break;
      }
    });

    return filteredRecommendations;
  }

  removeProductsByStrength(recommendations, strengthsToRemove) {
    return recommendations.filter(rec => {
      const product = this.productDatabase[rec.productId];
      return !product || !strengthsToRemove.includes(product.strength);
    });
  }

  removeProductsWithIngredients(recommendations, ingredientsToRemove) {
    return recommendations.filter(rec => {
      const product = this.productDatabase[rec.productId];
      if (!product || !product.activeIngredients) return true;
      
      return !product.activeIngredients.some(ingredient => 
        ingredientsToRemove.includes(ingredient)
      );
    });
  }

  // ============ CONFLICT RESOLUTION ============
  resolveIngredientConflicts(recommendations) {
    const conflictPairs = [
      ['retinol', 'vitamin_c'],
      ['retinol', 'salicylic_acid'],
      ['vitamin_c', 'niacinamide'] // Only at high concentrations
    ];

    const resolvedRecommendations = [];
    const addedIngredients = new Set();

    // Sort by priority
    const sortedRecommendations = recommendations.sort((a, b) => b.priority - a.priority);

    for (const recommendation of sortedRecommendations) {
      const product = this.productDatabase[recommendation.productId];
      if (!product) continue;

      let hasConflict = false;
      
      if (product.activeIngredients) {
        for (const ingredient of product.activeIngredients) {
          for (const [ing1, ing2] of conflictPairs) {
            if (ingredient === ing1 && addedIngredients.has(ing2)) {
              hasConflict = true;
              break;
            }
            if (ingredient === ing2 && addedIngredients.has(ing1)) {
              hasConflict = true;
              break;
            }
          }
          if (hasConflict) break;
        }
      }

      if (!hasConflict) {
        resolvedRecommendations.push(recommendation);
        if (product.activeIngredients) {
          product.activeIngredients.forEach(ing => addedIngredients.add(ing));
        }
      }
    }

    return resolvedRecommendations;
  }

  // ============ SCORING AND RANKING ============
  scoreAndRankRecommendations(recommendations, userProfile) {
    return recommendations.map(rec => {
      const score = this.calculateIngredientScore(rec, userProfile);
      return {
        ...rec,
        matchScore: score,
        finalPriority: rec.priority + (score * 0.3)
      };
    }).sort((a, b) => b.finalPriority - a.finalPriority);
  }

  calculateIngredientScore(recommendation, userProfile) {
    const product = this.productDatabase[recommendation.productId];
    if (!product) return 0;

    let score = 0;
    let maxScore = 0;

    // 1. Skin Type Compatibility (30%)
    const skinTypeScore = this.getSkinTypeCompatibility(product, userProfile.skinType);
    score += skinTypeScore * 0.3;
    maxScore += 100 * 0.3;

    // 2. Concern Addressing (40%)
    const concernScore = this.getConcernEffectiveness(product, userProfile.concerns);
    score += concernScore * 0.4;
    maxScore += 100 * 0.4;

    // 3. Safety/Sensitivity (20%)
    const safetyScore = this.getSafetyScore(product, userProfile.sensitivity);
    score += safetyScore * 0.2;
    maxScore += 100 * 0.2;

    // 4. Experience Level (10%)
    const experienceScore = this.getExperienceCompatibility(product, userProfile.experience);
    score += experienceScore * 0.1;
    maxScore += 100 * 0.1;

    return Math.round((score / maxScore) * 100);
  }

  getSkinTypeCompatibility(product, skinType) {
    if (product.suitableFor.includes('all') || product.suitableFor.includes(skinType)) {
      return 100;
    }
    
    const compatibilityMatrix = {
      'oily': { 'combination': 70, 'normal': 50, 'dry': 20, 'sensitive': 30 },
      'dry': { 'normal': 60, 'sensitive': 80, 'combination': 40, 'oily': 20 },
      'combination': { 'normal': 80, 'oily': 70, 'dry': 50, 'sensitive': 40 },
      'sensitive': { 'dry': 70, 'normal': 60, 'combination': 40, 'oily': 30 },
      'normal': { 'combination': 80, 'oily': 60, 'dry': 60, 'sensitive': 50 }
    };

    const bestMatch = product.suitableFor.reduce((best, suitable) => {
      const score = compatibilityMatrix[skinType]?.[suitable] || 0;
      return score > best ? score : best;
    }, 0);

    return bestMatch;
  }

  getConcernEffectiveness(product, concerns) {
    const addressedConcerns = product.addresses || [];
    let effectiveness = 0;
    
    concerns.forEach((concern, index) => {
      const priority = 1 - (index * 0.1);
      if (addressedConcerns.includes(concern)) {
        effectiveness += 100 * priority;
      }
    });
    
    return Math.min(100, effectiveness);
  }

  getSafetyScore(product, sensitivityLevel) {
    const strength = product.strength || 'gentle';
    const strengthScores = {
      'gentle': 100,
      'moderate': 80,
      'strong': 60,
      'very_strong': 40
    };

    let baseScore = strengthScores[strength] || 70;
    const sensitivityPenalty = Math.max(0, (sensitivityLevel - 5) * 10);
    baseScore -= sensitivityPenalty;
    
    return Math.max(0, Math.min(100, baseScore));
  }

  getExperienceCompatibility(product, experience) {
    const requiredExperience = product.requiresExperience || 'beginner';
    const experienceHierarchy = {
      'beginner': 1,
      'intermediate': 2,
      'advanced': 3,
      'expert': 4
    };

    const userLevel = experienceHierarchy[experience] || 1;
    const requiredLevel = experienceHierarchy[requiredExperience] || 1;

    if (userLevel >= requiredLevel) {
      return 100;
    } else {
      const levelDifference = requiredLevel - userLevel;
      return Math.max(0, 100 - (levelDifference * 30));
    }
  }

  // ============ PERSONALIZATION ============
  personalizeRecommendations(recommendations, userProfile) {
    return recommendations.filter(rec => {
      const product = this.productDatabase[rec.productId];
      if (!product) return false;

      // Budget check (already done in budget filtering, but double-check)
      const budgetLimits = {
        'budget-friendly': 500,
        'mid-range': 1500,
        'premium': 3000,
        'luxury': 10000
      };
      const maxBudget = budgetLimits[userProfile.budget] || 500;
      
      return product.price <= maxBudget || rec.medicallyRequired;
    });
  }

  // ============ STRUCTURE RECOMMENDATIONS ============
  structureRecommendations(recommendations, userProfile) {
    const structured = {
      essential: [],
      targeted: [],
      supporting: [],
      optional: []
    };

    recommendations.forEach(rec => {
      const category = this.determineOutputCategory(rec, userProfile);
      structured[category].push(rec);
    });

    // Apply limits based on experience
    const limits = this.getRecommendationLimits(userProfile);
    Object.keys(structured).forEach(category => {
      if (structured[category].length > limits[category]) {
        structured[category] = structured[category].slice(0, limits[category]);
      }
    });

    return structured;
  }

  determineOutputCategory(recommendation, userProfile) {
    const product = this.productDatabase[recommendation.productId];
    
    if (recommendation.medicallyRequired || 
        recommendation.category === 'essential' || 
        ['cleanser', 'moisturizer', 'sunscreen'].includes(product?.category)) {
      return 'essential';
    }
    
    if (recommendation.category === 'targeted' || 
        recommendation.matchScore > 80) {
      return 'targeted';
    }
    
    if (recommendation.matchScore > 60) {
      return 'supporting';
    }
    
    return 'optional';
  }

  getRecommendationLimits(userProfile) {
    const baseLimits = {
      'beginner': { essential: 4, targeted: 2, supporting: 1, optional: 0 },
      'intermediate': { essential: 4, targeted: 3, supporting: 2, optional: 1 },
      'advanced': { essential: 5, targeted: 4, supporting: 3, optional: 2 },
      'expert': { essential: 5, targeted: 5, supporting: 4, optional: 3 }
    };

    return baseLimits[userProfile.experience] || baseLimits['beginner'];
  }

  // ============ UTILITY FUNCTIONS FOR ERROR HANDLING ============
  safeString(value) {
    if (typeof value === 'string') return value;
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }

  safeArray(value) {
    if (Array.isArray(value)) return value;
    if (!value) return [];
    if (typeof value === 'string') return [value];
    return [value];
  }

  sanitizeResponse(response) {
    try {
      // Ensure all text fields are strings and handle any potential issues
      const sanitized = JSON.parse(JSON.stringify(response, (key, value) => {
        if (typeof value === 'string') {
          return value;
        }
        if (value === null || value === undefined) {
          return '';
        }
        if (typeof value === 'object' && !Array.isArray(value)) {
          return value;
        }
        return value;
      }));
      
      return sanitized;
    } catch (error) {
      console.error('Error sanitizing response:', error);
      return response;
    }
  }

  // Add the missing parseAgeRange function
  parseAgeRange(ageString) {
    const ageRanges = {
      '13-19': 16,
      '20-29': 25,
      '30-39': 35,
      '40-49': 45,
      '50+': 55
    };
    return ageRanges[this.safeString(ageString)] || 25;
  }

  calculateRiskTolerance(experience, sensitivity) {
    const experienceScore = { 'beginner': 1, 'intermediate': 2, 'advanced': 3, 'expert': 4 }[experience] || 1;
    const sensitivityScore = 11 - (parseInt(sensitivity) || 5);
    return Math.round((experienceScore + sensitivityScore) / 2);
  }

  calculateRoutineComplexity(experience, age) {
    const experienceScore = { 'beginner': 1, 'intermediate': 2, 'advanced': 3, 'expert': 4 }[experience] || 1;
    const numericAge = parseInt(age) || 25;
    const ageScore = numericAge < 25 ? 1 : numericAge < 35 ? 2 : numericAge < 45 ? 3 : 4;
    return Math.round((experienceScore + ageScore) / 2);
  }

  identifyPrimaryConcern(concerns, goals) {
    if (concerns.length === 0) return 'maintenance';
    return concerns[0];
  }

  deduplicateRecommendations(recommendations) {
    const seen = new Set();
    return recommendations.filter(rec => {
      if (seen.has(rec.productId)) {
        return false;
      }
      seen.add(rec.productId);
      return true;
    });
  }

  getSkinTypeProducts(userProfile) {
    // This is handled in getEssentialProducts and getConcernBasedProducts
    return [];
  }

  getAgeBasedProducts(userProfile) {
    const products = [];
    
    // Anti-aging for 30+
    if (userProfile.age >= 30 && userProfile.experience !== 'beginner') {
      const budgetLimits = {
        'budget-friendly': 500,
        'mid-range': 1500,
        'premium': 3000,
        'luxury': 10000
      };
      const maxBudget = budgetLimits[userProfile.budget] || 500;
      
      if (maxBudget >= 899) {
        products.push({
          productId: 'cosrx_vitamin_c',
          reasoning: 'Age-appropriate antioxidant for prevention',
          category: 'age_based',
          priority: 70
        });
      }
    }

    return products;
  }

  // ============ FALLBACK SYSTEM ============
  generateFallbackRecommendations(assessmentData) {
    console.log('🔄 Generating fallback recommendations');
    
    const skinType = assessmentData.skinType || 'normal';
    const budget = assessmentData.budget || 'budget-friendly';
    const country = assessmentData.country || 'india';
    
    const fallbackProducts = {
      'australia': {
        'budget-friendly': {
          'oily': ['sukin_foaming_cleanser', 'the_ordinary_niacinamide_au', 'sukin_facial_moisturiser', 'cancer_council_face_day_wear'],
          'dry': ['qv_gentle_wash', 'the_ordinary_hyaluronic_au', 'qv_cream', 'hamilton_face_sunscreen'],
          'sensitive': ['qv_gentle_wash', 'qv_cream', 'invisible_zinc_face_fluid'],
          'default': ['sukin_foaming_cleanser', 'sukin_facial_moisturiser', 'cancer_council_face_day_wear']
        },
        'mid-range': {
          'oily': ['benzac_daily_cleanser', 'the_ordinary_niacinamide_au', 'go_to_face_hero', 'ultra_violette_supreme_screen'],
          'dry': ['la_roche_posay_toleriane_au', 'aspect_hydrating_serum', 'cerave_daily_moisturizer_au', 'hamilton_face_sunscreen'],
          'sensitive': ['cetaphil_gentle_cleanser_au', 'cerave_daily_moisturizer_au', 'invisible_zinc_face_fluid'],
          'default': ['la_roche_posay_toleriane_au', 'go_to_face_hero', 'ultra_violette_supreme_screen']
        }
      },
      'india': {
        'budget-friendly': {
          'oily': ['simple_refreshing_cleanser', 'minimalist_niacinamide', 'ponds_super_light_gel', 'neutrogena_ultra_sheer'],
          'dry': ['cetaphil_gentle_cleanser', 'the_ordinary_hyaluronic_acid', 'nivea_soft_cream', 'neutrogena_ultra_sheer'],
          'sensitive': ['cetaphil_gentle_cleanser', 'nivea_soft_cream', 'neutrogena_ultra_sheer'],
          'default': ['simple_refreshing_cleanser', 'ponds_super_light_gel', 'lakme_sunscreen']
        },
        'mid-range': {
          'oily': ['cerave_foaming_cleanser', 'minimalist_niacinamide', 'neutrogena_hydra_boost', 'la_roche_posay_sunscreen'],
          'dry': ['cerave_foaming_cleanser', 'the_ordinary_hyaluronic_acid', 'cerave_daily_moisturizer', 'la_roche_posay_sunscreen'],
          'sensitive': ['cerave_foaming_cleanser', 'cerave_daily_moisturizer', 'la_roche_posay_sunscreen'],
          'default': ['cerave_foaming_cleanser', 'neutrogena_hydra_boost', 'la_roche_posay_sunscreen']
        }
      }
    };

    const countryFallbacks = fallbackProducts[country] || fallbackProducts['india'];
    const products = countryFallbacks[budget]?.[skinType] || countryFallbacks[budget]?.['default'] || countryFallbacks['budget-friendly']['default'];

    return {
      user_profile: { 
        skinType,
        budget,
        country,
        fallback: true,
        error: 'Algorithm failed, using fallback recommendations'
      },
      generated_at: new Date().toISOString(),
      recommendations: {
        essential: products.map(productId => {
          const product = this.productDatabase[productId];
          return {
            productId,
            product_name: product?.name || 'Unknown Product',
            brand: product?.brand || 'Unknown',
            price: product?.price || 0,
            currency: product?.currency || 'INR',
            reasoning: 'Safe fallback recommendation for your skin type',
            category: 'essential',
            matchScore: 70,
            priority: 80
          };
        }),
        targeted: [],
        supporting: [],
        optional: []
      },
      routine_suggestions: {
        morning: ['Cleanser', 'Moisturizer', 'Sunscreen'],
        evening: ['Cleanser', 'Moisturizer']
      },
      warnings: [{
        type: 'fallback',
        message: 'These are basic recommendations. Consider retaking the assessment for personalized suggestions.',
        severity: 'medium'
      }],
      budget_summary: {
        total_cost: products.reduce((sum, productId) => {
          const product = this.productDatabase[productId];
          return sum + (product?.price || 0);
        }, 0)
        currency: products.length > 0 ? (this.productDatabase[products[0]]?.currency || 'INR') : 'INR'
      }
    };
  }

  // ============ ADDITIONAL HELPER METHODS ============
  generateDetailedTimeline(recommendations, userProfile) {
    const timeline = {};
    
    if (userProfile.experience === 'beginner') {
      timeline.week_1_2 = 'Start with cleanser, moisturizer, and sunscreen only. Use gentle products to establish routine.';
      timeline.week_3_4 = 'Add one gentle active ingredient like niacinamide or hyaluronic acid if basic routine is well-tolerated.';
      timeline.month_2_3 = 'Introduce stronger actives gradually if previous products caused no irritation.';
      timeline.month_4_plus = 'Add additional treatments based on skin response and specific needs.';
    } else {
      timeline.week_1_2 = 'Establish basic routine with all essential products.';
      timeline.week_3_4 = 'Add primary active ingredient and monitor response.';
      timeline.month_2 = 'Add supporting ingredients and optimize routine timing.';
      timeline.month_3_plus = 'Evaluate effectiveness and adjust concentrations or add secondary actives if needed.';
    }

    return timeline;
  }

  generateDetailedWarnings(recommendations, userProfile) {
    const warnings = [];
    
    // General warnings
    warnings.push({
      type: 'general',
      message: 'Always patch test new products on a small area before full application',
      severity: 'high'
    });

    warnings.push({
      type: 'general', 
      message: 'Use sunscreen daily, especially when using active ingredients',
      severity: 'high'
    });

    // Experience-based warnings
    if (userProfile.experience === 'beginner') {
      warnings.push({
        type: 'beginner',
        message: 'Start with one new product at a time and wait 1-2 weeks before adding the next',
        severity: 'medium'
      });
    }

    // Climate-specific warnings
    if (userProfile.climate === 'hot_humid') {
      warnings.push({
        type: 'climate',
        message: 'In humid weather, allow extra time between product applications to prevent pilling',
        severity: 'medium'
      });
    }

    return warnings;
  }

  initializeConflictMatrix() {
    return {
      'retinol': ['vitamin_c', 'salicylic_acid'],
      'vitamin_c': ['retinol', 'niacinamide'],
      'salicylic_acid': ['retinol']
    };
  }

  initializeFallbacks() {
    return {
      'oily': ['Oil Control Cleanser', 'Niacinamide Serum', 'Lightweight Moisturizer', 'Mineral Sunscreen'],
      'dry': ['Gentle Cleanser', 'Hyaluronic Acid Serum', 'Rich Moisturizer', 'Mineral Sunscreen'],
      'sensitive': ['Gentle Cleanser', 'Fragrance-Free Moisturizer', 'Mineral Sunscreen'],
      'combination': ['Gentle Cleanser', 'Niacinamide Serum', 'Lightweight Moisturizer', 'Mineral Sunscreen'],
      'normal': ['Gentle Cleanser', 'Vitamin C Serum', 'Daily Moisturizer', 'Broad Spectrum Sunscreen'],
      'default': ['Gentle Cleanser', 'Basic Moisturizer', 'Broad Spectrum Sunscreen']
    };
  }

  initializeRuleMatrix() {
    // Simplified for space - in production this would be more comprehensive
    return {
      skinType: {
        'oily': {
          recommended: ['oil_control', 'bha', 'niacinamide'],
          avoid: ['heavy_creams', 'oils'],
          priorityConcerns: ['excess_oil_shine', 'acne_breakouts']
        }
      }
    };
  }

  // ============ MISSING METHODS IMPLEMENTATION ============
  getIngredientMechanisms(userProfile) {
    const mechanisms = {
      'niacinamide': 'Regulates sebaceous gland activity and reduces inflammation through multiple pathways',
      'hyaluronic_acid': 'Binds water molecules to provide intense hydration and plumping effects',
      'vitamin_c': 'Neutralizes free radicals and stimulates collagen synthesis for anti-aging benefits',
      'retinol': 'Accelerates cell turnover and stimulates collagen production for skin renewal',
      'salicylic_acid': 'Penetrates oil-filled pores to dissolve debris and reduce inflammation'
    };

    const starIngredients = this.getStarIngredients(userProfile);
    return starIngredients.reduce((acc, ingredient) => {
      const key = ingredient.toLowerCase().replace(' ', '_');
      acc[ingredient] = mechanisms[key] || 'Works through proven dermatological mechanisms';
      return acc;
    }, {});
  }

  getScientificEvidence(userProfile) {
    return {
      evidence_level: 'High',
      clinical_studies: 'Based on peer-reviewed dermatological research',
      safety_profile: 'Extensively tested for safety and efficacy',
      regulatory_approval: 'Ingredients approved by international cosmetic regulations'
    };
  }

  getConcentrationGuide(userProfile) {
    const guide = {
      'niacinamide': '2-10% - Start with 5% for beginners',
      'hyaluronic_acid': '0.1-2% - Higher concentrations for very dry skin',
      'vitamin_c': '5-20% - Start with 10% and gradually increase',
      'retinol': '0.01-1% - Begin with 0.25% for beginners',
      'salicylic_acid': '0.5-2% - Use 1% for daily use, 2% for spot treatment'
    };

    return guide;
  }

  generateTransformationGuide(userProfile) {
    return {
      phase_1: 'Foundation building (Weeks 1-4): Establish basic routine tolerance',
      phase_2: 'Active introduction (Weeks 5-12): Add targeted treatments gradually',
      phase_3: 'Optimization (Months 3-6): Fine-tune routine for maximum effectiveness',
      phase_4: 'Maintenance (6+ months): Sustain results with consistent routine'
    };
  }

  generateTroubleshootingGuide(userProfile) {
    return {
      common_issues: [
        'Initial breakouts: Normal purging process, should improve in 4-6 weeks',
        'Irritation: Reduce frequency or concentration of active ingredients',
        'No results: Allow 8-12 weeks for visible improvements',
        'Product pilling: Apply thinner layers and wait between applications'
      ],
      when_to_adjust: 'After 6-8 weeks of consistent use without improvement',
      red_flags: 'Severe irritation, persistent burning, or worsening of conditions'
    };
  }

  generateAdvancedTips(userProfile) {
    return {
      layering_order: 'Thinnest to thickest consistency for optimal absorption',
      timing_optimization: 'Use actives when skin is most receptive (evening for most)',
      seasonal_adjustments: 'Lighter formulations in summer, richer in winter',
      ingredient_cycling: 'Rotate strong actives to prevent tolerance buildup'
    };
  }

  generateSeasonalAdjustments(userProfile) {
    return {
      summer: 'Increase sun protection, use lighter moisturizers, add antioxidants',
      winter: 'Focus on barrier repair, use richer moisturizers, reduce exfoliation',
      monsoon: 'Emphasize antimicrobial ingredients, use oil-free formulations',
      spring: 'Transition routine gradually, introduce new products carefully'
    };
  }
}

// ============ SAFE EXPORT FOR DIFFERENT ENVIRONMENTS ============
try {
  // For browser environments
  if (typeof window !== 'undefined') {
    window.DynamicSkincareRecommendationEngine = DynamicSkincareRecommendationEngine;
    console.log('✅ Skincare Engine V2.0 loaded in browser');
  }
  
  // For Node.js environments
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
      DynamicSkincareRecommendationEngine
    };
  }
} catch (error) {
  console.warn('Environment detection failed:', error.message);
}

// Add default export for ES6 modules
export default DynamicSkincareRecommendationEngine;

// ============ SIMPLE USAGE EXAMPLE ============
const createSimpleExample = () => {
  const engine = new DynamicSkincareRecommendationEngine();
  
  // Simple test function that can be called safely
  const testUser = {
    skinType: 'oily',
    concerns: ['acne_breakouts'],
    budget: 'budget-friendly',
    experience: 'beginner',
    location: 'Hyderabad'
  };

  return engine.generateRecommendations('test_user', testUser)
    .then(result => {
      console.log('✅ Test successful!');
      console.log('Products recommended:', Object.keys(result.recommendations).reduce((acc, cat) => acc + result.recommendations[cat].length, 0));
      console.log('Total budget:', result.budget_summary?.total_cost || 'N/A');
      return result;
    })
    .catch(error => {
      console.error('❌ Test failed:', error);
      return { error: error.message };
    });
};

// Make the example function available globally
if (typeof window !== 'undefined') {
  window.createSimpleExample = createSimpleExample;
}