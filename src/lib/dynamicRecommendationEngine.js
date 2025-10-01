// 🧠 ENHANCED GLOBAL SKINCARE RECOMMENDATION ALGORITHM V4.0
// Comprehensive Australia 🇦🇺 and India 🇮🇳 support with expanded products

class DynamicSkincareRecommendationEngine {
  constructor() {
    this.productDatabase = this.initializeProductDatabase();
    this.ruleMatrix = this.initializeRuleMatrix();
    this.conflictMatrix = this.initializeConflictMatrix();
    this.climateDatabase = this.initializeClimateDatabase();
    this.benefitsDatabase = this.initializeBenefitsDatabase();
    this.fallbackRecommendations = this.initializeFallbacks();
    this.countryDatabase = this.initializeCountryDatabase();
  }

  // ============ MAIN RECOMMENDATION FUNCTION ============
  async generateRecommendations(userId, assessmentData) {
    try {
      const safeUserId = this.safeString(userId) || 'anonymous_user';
      
      const normalizedData = this.validateAndNormalizeInput(assessmentData);
      const userProfile = this.createUserProfile(normalizedData);
      const baseRecommendations = this.generateCountrySpecificRecommendations(userProfile);
      const budgetFilteredRecs = this.applyBudgetFiltering(baseRecommendations, userProfile);
      const medicallyFilteredRecs = this.applyMedicalConstraints(budgetFilteredRecs, userProfile);
      const conflictResolvedRecs = this.resolveIngredientConflicts(medicallyFilteredRecs);
      const scoredRecommendations = this.scoreAndRankRecommendations(conflictResolvedRecs, userProfile);
      const personalizedRecs = this.personalizeRecommendations(scoredRecommendations, userProfile);
      const finalRecommendations = this.structureRecommendations(personalizedRecs, userProfile);
      const completeResponse = this.addRoutineWarningsAndBenefits(finalRecommendations, userProfile);
      
      return this.sanitizeResponse(completeResponse);
      
    } catch (error) {
      console.error('Recommendation generation failed:', error);
      return this.generateFallbackRecommendations(assessmentData || {});
    }
  }

  // ============ COUNTRY DATABASE ============
  initializeCountryDatabase() {
    return {
      'australia': {
        currency: 'AUD',
        currencySymbol: '$',
        budgetRanges: {
          'budget-friendly': 30,
          'mid-range': 80,
          'premium': 150,
          'luxury': 300
        },
        popularRetailers: ['Chemist Warehouse', 'Priceline', 'Mecca', 'Adore Beauty', 'Sephora Australia'],
        climateTypes: ['temperate', 'tropical', 'arid', 'mediterranean'],
        sunProtectionPriority: 'very_high',
        localBrands: ['aesop', 'go_to', 'alpha_h', 'synergie_skin', 'rationale', 'aspect_dr', 'ultra_violette', 'qv', 'sukin', 'frank_body', 'sand_and_sky', 'ere_perez'],
        availableInternational: ['cerave', 'the_ordinary', 'paula_choice', 'neutrogena', 'la_roche_posay', 'bioderma', 'avene'],
        shippingNote: 'Most products available for same-day delivery in major cities',
        taxRate: 0.10, // GST
        prescriptionRequired: ['tretinoin', 'hydroquinone_4_percent']
      },
      'india': {
        currency: 'INR',
        currencySymbol: '₹',
        budgetRanges: {
          'budget-friendly': 500,
          'mid-range': 1500,
          'premium': 3000,
          'luxury': 5000
        },
        popularRetailers: ['Nykaa', 'Amazon India', 'Myntra', 'Local Pharmacy', 'Purplle', 'Foxy'],
        climateTypes: ['hot_humid', 'hot_dry', 'moderate', 'cold', 'varied'],
        sunProtectionPriority: 'high',
        localBrands: ['minimalist', 'plum', 'mamaearth', 'dot_key', 'pilgrim', 'derma_co', 'foxtale', 'conscious_chemist'],
        availableInternational: ['simple', 'neutrogena', 'cetaphil', 'the_ordinary', 'cerave', 'olay'],
        shippingNote: 'Products available across major Indian cities',
        taxRate: 0.18, // GST
        prescriptionRequired: ['tretinoin', 'hydroquinone_4_percent']
      }
    };
  }

  // ============ EXPANDED PRODUCT DATABASE ============
  initializeProductDatabase() {
    return {
      // ========== AUSTRALIAN BUDGET CLEANSERS ==========
      'qv_gentle_cleanser': {
        name: 'QV Gentle Wash',
        category: 'cleanser',
        price: 8.99,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['sensitive', 'dry', 'normal', 'eczema'],
        addresses: ['basic_cleansing', 'sensitivity_redness'],
        strength: 'gentle',
        brand: 'QV',
        size: '350ml',
        conflicts: [],
        benefits: ['Soap-free formula', 'pH balanced', 'Dermatologist recommended', 'TGA approved'],
        availability: ['Chemist Warehouse', 'Priceline', 'Woolworths', 'Coles'],
        australianMade: true,
        tgaApproved: true
      },
      'cetaphil_gentle_aus': {
        name: 'Cetaphil Gentle Skin Cleanser',
        category: 'cleanser',
        price: 12.99,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['sensitive', 'dry', 'normal'],
        addresses: ['basic_cleansing', 'sensitivity_redness'],
        strength: 'gentle',
        brand: 'Cetaphil',
        size: '500ml',
        conflicts: [],
        benefits: ['Maintains skin barrier', 'Non-comedogenic', 'Fragrance-free', 'Dermatologist tested'],
        availability: ['Chemist Warehouse', 'Priceline', 'Coles', 'Woolworths']
      },
      'sukin_foaming_cleanser': {
        name: 'Sukin Foaming Facial Cleanser',
        category: 'cleanser',
        price: 9.95,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['normal', 'combination', 'oily'],
        addresses: ['basic_cleansing', 'excess_oil_shine'],
        strength: 'gentle',
        brand: 'Sukin',
        size: '125ml',
        conflicts: [],
        benefits: ['Natural ingredients', 'Vegan', 'Cruelty-free', 'Carbon neutral'],
        availability: ['Chemist Warehouse', 'Priceline', 'Coles', 'Woolworths'],
        australianMade: true,
        vegan: true
      },
      'benzac_daily_cleanser': {
        name: 'Benzac Daily Facial Foam Cleanser',
        category: 'cleanser',
        price: 14.99,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['oily', 'acne_prone', 'combination'],
        addresses: ['acne_breakouts', 'excess_oil_shine'],
        strength: 'moderate',
        brand: 'Benzac',
        size: '130ml',
        conflicts: [],
        activeIngredients: ['salicylic_acid'],
        benefits: ['Oil-free', 'Non-comedogenic', 'Gentle exfoliation', 'Dermatologist recommended']
      },
      'simple_kind_face_wash_aus': {
        name: 'Simple Kind to Skin Refreshing Facial Wash',
        category: 'cleanser',
        price: 7.50,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['sensitive', 'normal', 'combination'],
        addresses: ['basic_cleansing'],
        strength: 'gentle',
        brand: 'Simple',
        size: '150ml',
        conflicts: [],
        benefits: ['No artificial perfume', 'No harsh chemicals', 'Triple purified water', 'Vitamin B5'],
        availability: ['Chemist Warehouse', 'Priceline', 'Woolworths', 'Coles']
      },

      // ========== AUSTRALIAN MID-RANGE CLEANSERS ==========
      'go_to_exfoliating_mask': {
        name: 'Go-To Exfoliating Swipeys',
        category: 'treatment',
        price: 25.00,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['normal', 'oily', 'combination'],
        addresses: ['uneven_texture', 'large_pores'],
        strength: 'moderate',
        brand: 'Go-To',
        size: '60 pads',
        conflicts: ['retinoids'],
        activeIngredients: ['glycolic_acid', 'salicylic_acid'],
        benefits: ['Dual action exfoliation', 'Convenient pads', 'Travel-friendly', 'Australian made'],
        availability: ['Mecca', 'Adore Beauty', 'Go-To website'],
        australianMade: true,
        nightUseOnly: true
      },

      // ========== INDIAN BUDGET CLEANSERS ==========
      'cetaphil_gentle_cleanser': {
        name: 'Cetaphil Gentle Skin Cleanser',
        category: 'cleanser',
        price: 299,
        currency: 'INR',
        country: 'india',
        suitableFor: ['sensitive', 'dry', 'normal'],
        addresses: ['basic_cleansing', 'sensitivity_redness'],
        strength: 'gentle',
        brand: 'Cetaphil',
        size: '125ml',
        conflicts: [],
        benefits: ['Maintains skin barrier', 'Non-comedogenic', 'Fragrance-free', 'Dermatologist recommended'],
        availability: ['Nykaa', 'Amazon India', 'Local Pharmacies']
      },
      'simple_refreshing_cleanser': {
        name: 'Simple Refreshing Facial Wash',
        category: 'cleanser',
        price: 199,
        currency: 'INR',
        country: 'india',
        suitableFor: ['normal', 'combination', 'sensitive'],
        addresses: ['basic_cleansing'],
        strength: 'gentle',
        brand: 'Simple',
        size: '150ml',
        conflicts: [],
        benefits: ['No artificial perfumes', 'Vitamin B5', 'Triple purified water', 'Gentle formula'],
        availability: ['Nykaa', 'Amazon India', 'Myntra', 'Local stores']
      },
      'neutrogena_oil_free_cleanser': {
        name: 'Neutrogena Oil-Free Acne Wash',
        category: 'cleanser',
        price: 399,
        currency: 'INR',
        country: 'india',
        suitableFor: ['oily', 'combination', 'acne_prone'],
        addresses: ['acne_breakouts', 'excess_oil_shine'],
        strength: 'moderate',
        brand: 'Neutrogena',
        size: '175ml',
        conflicts: ['retinoids'],
        activeIngredients: ['salicylic_acid'],
        benefits: ['Oil-free formula', 'Unclogs pores', 'Prevents new breakouts', 'Dermatologist tested'],
        availability: ['Nykaa', 'Amazon India', 'Pharmacies']
      },
      'plum_green_tea_cleanser': {
        name: 'Plum Green Tea Pore Cleansing Face Wash',
        category: 'cleanser',
        price: 345,
        currency: 'INR',
        country: 'india',
        suitableFor: ['oily', 'combination', 'acne_prone'],
        addresses: ['acne_breakouts', 'excess_oil_shine', 'large_pores'],
        strength: 'moderate',
        brand: 'Plum',
        size: '75ml',
        conflicts: [],
        activeIngredients: ['salicylic_acid', 'green_tea'],
        benefits: ['Green tea extracts', 'Oil control', 'Indian brand', 'Vegan'],
        availability: ['Nykaa', 'Amazon India', 'Purplle'],
        vegan: true
      },

      // ========== INDIAN ACTIVES ==========
      'minimalist_niacinamide': {
        name: 'Minimalist Niacinamide 10% Face Serum',
        category: 'active',
        price: 349,
        currency: 'INR',
        country: 'india',
        suitableFor: ['all'],
        addresses: ['excess_oil_shine', 'large_pores', 'acne_breakouts', 'dark_spots_hyperpigmentation'],
        strength: 'moderate',
        brand: 'Minimalist',
        size: '30ml',
        conflicts: [],
        activeIngredients: ['niacinamide'],
        requiresExperience: 'beginner',
        benefits: ['Controls oil production', 'Minimizes pores', 'Reduces inflammation', 'Affordable Indian brand'],
        availability: ['Nykaa', 'Amazon India', 'Minimalist website']
      },
      'minimalist_vitamin_c': {
        name: 'Minimalist Vitamin C 10% Face Serum',
        category: 'active',
        price: 599,
        currency: 'INR',
        country: 'india',
        suitableFor: ['normal', 'oily', 'combination'],
        addresses: ['dark_spots_hyperpigmentation', 'fine_lines_wrinkles'],
        strength: 'moderate',
        brand: 'Minimalist',
        size: '30ml',
        conflicts: ['retinoids', 'niacinamide'],
        activeIngredients: ['vitamin_c'],
        requiresExperience: 'intermediate',
        benefits: ['Ethyl ascorbic acid', 'Stable formula', 'Brightening', 'Indian brand'],
        availability: ['Nykaa', 'Amazon India', 'Minimalist website'],
        morningUse: true
      },
      'the_ordinary_hyaluronic_acid': {
        name: 'The Ordinary Hyaluronic Acid 2% + B5',
        category: 'hydrating',
        price: 490,
        currency: 'INR',
        country: 'india',
        suitableFor: ['all'],
        addresses: ['dryness_dehydration', 'fine_lines_wrinkles'],
        strength: 'gentle',
        brand: 'The Ordinary',
        size: '30ml',
        conflicts: [],
        activeIngredients: ['hyaluronic_acid'],
        requiresExperience: 'beginner',
        benefits: ['Intense hydration', 'Plumps fine lines', 'Multi-molecular HA', 'Affordable'],
        availability: ['Nykaa', 'Cult Beauty India']
      },
      'plum_vitamin_c': {
        name: 'Plum 15% Vitamin C Face Serum',
        category: 'active',
        price: 895,
        currency: 'INR',
        country: 'india',
        suitableFor: ['normal', 'oily', 'combination'],
        addresses: ['dark_spots_hyperpigmentation', 'fine_lines_wrinkles'],
        strength: 'strong',
        brand: 'Plum',
        size: '30ml',
        conflicts: ['retinoids'],
        activeIngredients: ['vitamin_c'],
        requiresExperience: 'intermediate',
        benefits: ['15% L-ascorbic acid', 'Mandarin extract', 'Indian brand', 'Vegan'],
        availability: ['Nykaa', 'Amazon India', 'Purplle'],
        vegan: true,
        morningUse: true
      },
      'dot_key_niacinamide': {
        name: 'Dot & Key Niacinamide + Zinc Serum',
        category: 'active',
        price: 599,
        currency: 'INR',
        country: 'india',
        suitableFor: ['all'],
        addresses: ['excess_oil_shine', 'large_pores', 'acne_breakouts'],
        strength: 'moderate',
        brand: 'Dot & Key',
        size: '30ml',
        conflicts: [],
        activeIngredients: ['niacinamide', 'zinc'],
        requiresExperience: 'beginner',
        benefits: ['Oil control', 'Pore minimizing', 'Indian brand', 'Dermatologist tested'],
        availability: ['Nykaa', 'Amazon India', 'Myntra']
      },

      // ========== INDIAN MOISTURIZERS ==========
      'ponds_super_light_gel': {
        name: "Pond's Super Light Gel",
        category: 'moisturizer',
        price: 199,
        currency: 'INR',
        country: 'india',
        suitableFor: ['oily', 'combination', 'normal'],
        addresses: ['basic_hydration'],
        strength: 'gentle',
        brand: "Pond's",
        size: '50g',
        conflicts: [],
        benefits: ['Non-greasy formula', 'Quick absorption', 'Hyaluronic acid', 'Perfect for Indian climate'],
        availability: ['Nykaa', 'Amazon India', 'Local stores']
      },
      'nivea_soft_cream': {
        name: 'Nivea Soft Light Moisturizer',
        category: 'moisturizer',
        price: 149,
        currency: 'INR',
        country: 'india',
        suitableFor: ['dry', 'normal'],
        addresses: ['dryness_dehydration'],
        strength: 'gentle',
        brand: 'Nivea',
        size: '50ml',
        conflicts: [],
        benefits: ['24-hour hydration', 'Vitamin E', 'Jojoba oil', 'Multi-purpose'],
        availability: ['Nykaa', 'Amazon India', 'Local stores']
      },
      'minimalist_moisturizer': {
        name: 'Minimalist Sepicalm 3% Oat Moisturizer',
        category: 'moisturizer',
        price: 399,
        currency: 'INR',
        country: 'india',
        suitableFor: ['sensitive', 'dry', 'normal'],
        addresses: ['dryness_dehydration', 'sensitivity_redness'],
        strength: 'gentle',
        brand: 'Minimalist',
        size: '50g',
        conflicts: [],
        activeIngredients: ['ceramides', 'oat_extract'],
        benefits: ['Barrier repair', 'Calming', 'Fragrance-free', 'Indian brand'],
        availability: ['Nykaa', 'Amazon India', 'Minimalist website']
      },
      'plum_moisturizer': {
        name: 'Plum Green Tea Renewed Clarity Night Gel',
        category: 'moisturizer',
        price: 475,
        currency: 'INR',
        country: 'india',
        suitableFor: ['oily', 'combination', 'acne_prone'],
        addresses: ['dryness_dehydration', 'acne_breakouts'],
        strength: 'gentle',
        brand: 'Plum',
        size: '50ml',
        conflicts: [],
        activeIngredients: ['green_tea', 'mandelic_acid'],
        benefits: ['Lightweight gel', 'Oil-free', 'Indian brand', 'Vegan'],
        availability: ['Nykaa', 'Amazon India', 'Purplle'],
        vegan: true,
        nightUse: true
      },

      // ========== INDIAN SUNSCREENS ==========
      'neutrogena_ultra_sheer': {
        name: 'Neutrogena Ultra Sheer Sunscreen SPF 50+',
        category: 'sunscreen',
        price: 449,
        currency: 'INR',
        country: 'india',
        suitableFor: ['all'],
        addresses: ['sun_protection'],
        strength: 'gentle',
        brand: 'Neutrogena',
        size: '30ml',
        conflicts: [],
        spf: 50,
        essential: true,
        benefits: ['Dry-touch technology', 'Lightweight', 'Non-comedogenic', 'Water resistant'],
        availability: ['Nykaa', 'Amazon India', 'Pharmacies']
      },
      'lakme_sunscreen': {
        name: 'Lakme Sun Expert SPF 50 PA+++',
        category: 'sunscreen',
        price: 399,
        currency: 'INR',
        country: 'india',
        suitableFor: ['normal', 'oily', 'combination'],
        addresses: ['sun_protection'],
        strength: 'moderate',
        brand: 'Lakme',
        size: '50ml',
        conflicts: [],
        spf: 50,
        essential: true,
        benefits: ['Broad spectrum protection', 'Non-greasy', 'Water resistant', 'Indian brand'],
        availability: ['Nykaa', 'Amazon India', 'Local stores']
      },
      'minimalist_sunscreen': {
        name: 'Minimalist SPF 50 PA++++ Sunscreen',
        category: 'sunscreen',
        price: 399,
        currency: 'INR',
        country: 'india',
        suitableFor: ['all'],
        addresses: ['sun_protection'],
        strength: 'gentle',
        brand: 'Minimalist',
        size: '50ml',
        conflicts: [],
        spf: 50,
        essential: true,
        benefits: ['Multi-vitamin formula', 'Non-greasy', 'No white cast', 'Indian brand'],
        availability: ['Nykaa', 'Amazon India', 'Minimalist website']
      },
      'dot_key_sunscreen': {
        name: 'Dot & Key Watermelon Sunscreen SPF 50',
        category: 'sunscreen',
        price: 549,
        currency: 'INR',
        country: 'india',
        suitableFor: ['all'],
        addresses: ['sun_protection', 'dryness_dehydration'],
        strength: 'gentle',
        brand: 'Dot & Key',
        size: '50g',
        conflicts: [],
        spf: 50,
        essential: true,
        benefits: ['Hydrating formula', 'Watermelon extract', 'No white cast', 'Indian brand'],
        availability: ['Nykaa', 'Amazon India', 'Myntra']
      },
      'bioderma_photoderm': {
        name: 'Bioderma Photoderm Max Aquafluid SPF 50+',
        category: 'sunscreen',
        price: 1299,
        currency: 'INR',
        country: 'india',
        suitableFor: ['sensitive', 'all'],
        addresses: ['sun_protection', 'sensitivity_redness'],
        strength: 'gentle',
        brand: 'Bioderma',
        size: '40ml',
        conflicts: [],
        spf: 50,
        essential: true,
        benefits: ['Ultra-light texture', 'Sensitive skin', 'No white cast', 'European quality'],
        availability: ['Nykaa', 'Pharmacies']
      },

      // ========== INTERNATIONAL PRODUCTS (BOTH COUNTRIES) ==========
      'cerave_foaming_cleanser': {
        name: 'CeraVe Foaming Facial Cleanser',
        category: 'cleanser',
        price: { australia: 24.99, india: 990 },
        currency: { australia: 'AUD', india: 'INR' },
        country: 'both',
        suitableFor: ['normal', 'oily', 'combination'],
        addresses: ['basic_cleansing', 'excess_oil_shine'],
        strength: 'gentle',
        brand: 'CeraVe',
        size: '236ml',
        conflicts: [],
        activeIngredients: ['ceramides', 'hyaluronic_acid'],
        benefits: ['Ceramides restore barrier', 'Hyaluronic acid hydrates', 'Non-comedogenic', 'MVE technology'],
        availability: {
          australia: ['Chemist Warehouse', 'Priceline', 'Pharmacies'],
          india: ['Nykaa', 'Amazon India']
        }
      },
      'cerave_daily_moisturizer': {
        name: 'CeraVe Daily Moisturizing Lotion',
        category: 'moisturizer',
        price: { australia: 19.99, india: 799 },
        currency: { australia: 'AUD', india: 'INR' },
        country: 'both',
        suitableFor: ['normal', 'dry', 'sensitive'],
        addresses: ['dryness_dehydration', 'sensitivity_redness'],
        strength: 'gentle',
        brand: 'CeraVe',
        size: { australia: '236ml', india: '88ml' },
        conflicts: [],
        activeIngredients: ['ceramides', 'hyaluronic_acid'],
        benefits: ['Restores skin barrier', '24-hour hydration', 'MVE technology', 'Non-comedogenic'],
        availability: {
          australia: ['Chemist Warehouse', 'Priceline'],
          india: ['Nykaa', 'Amazon India']
        }
      },
      'la_roche_posay_sunscreen': {
        name: 'La Roche-Posay Anthelios Sunscreen SPF 50+',
        category: 'sunscreen',
        price: { australia: 32.99, india: 1499 },
        currency: { australia: 'AUD', india: 'INR' },
        country: 'both',
        suitableFor: ['sensitive', 'all'],
        addresses: ['sun_protection', 'sensitivity_redness'],
        strength: 'gentle',
        brand: 'La Roche-Posay',
        size: '50ml',
        conflicts: [],
        spf: 50,
        essential: true,
        benefits: ['Photostable filters', 'Water resistant', 'Antioxidants', 'Dermatologist recommended'],
        availability: {
          australia: ['Chemist Warehouse', 'Priceline', 'Pharmacies'],
          india: ['Nykaa', 'Pharmacies']
        }
      },
      'the_ordinary_vitamin_c': {
        name: 'The Ordinary Vitamin C Suspension 23% + HA Spheres 2%',
        category: 'active',
        price: { australia: 9.90, india: 590 },
        currency: { australia: 'AUD', india: 'INR' },
        country: 'both',
        suitableFor: ['normal', 'oily', 'combination'],
        addresses: ['dark_spots_hyperpigmentation', 'fine_lines_wrinkles'],
        strength: 'strong',
        brand: 'The Ordinary',
        size: '30ml',
        conflicts: ['retinoids', 'niacinamide'],
        activeIngredients: ['vitamin_c'],
        requiresExperience: 'intermediate',
        benefits: ['23% L-Ascorbic Acid', 'Brightening', 'Affordable', 'High potency'],
        availability: {
          australia: ['Adore Beauty', 'Priceline'],
          india: ['Nykaa', 'Cult Beauty India']
        },
        morningUse: true
      },
      'the_ordinary_niacinamide': {
        name: 'The Ordinary Niacinamide 10% + Zinc 1%',
        category: 'active',
        price: { australia: 9.60, india: 590 },
        currency: { australia: 'AUD', india: 'INR' },
        country: 'both',
        suitableFor: ['all'],
        addresses: ['excess_oil_shine', 'large_pores', 'acne_breakouts'],
        strength: 'moderate',
        brand: 'The Ordinary',
        size: '30ml',
        conflicts: [],
        activeIngredients: ['niacinamide', 'zinc'],
        requiresExperience: 'beginner',
        benefits: ['Oil control', 'Pore minimizing', 'Affordable', 'Blemish reduction'],
        availability: {
          australia: ['Adore Beauty', 'Priceline'],
          india: ['Nykaa', 'Cult Beauty India']
        }
      },
      'paula_choice_bha': {
        name: "Paula's Choice 2% BHA Liquid Exfoliant",
        category: 'active',
        price: { australia: 49.00, india: 2399 },
        currency: { australia: 'AUD', india: 'INR' },
        country: 'both',
        suitableFor: ['oily', 'combination', 'acne_prone'],
        addresses: ['acne_breakouts', 'large_pores', 'uneven_texture'],
        strength: 'moderate',
        brand: "Paula's Choice",
        size: '118ml',
        conflicts: ['retinoids'],
        activeIngredients: ['salicylic_acid'],
        requiresExperience: 'intermediate',
        benefits: ['Unclogs pores', 'Exfoliates', 'Reduces blackheads', 'Cult favorite'],
        availability: {
          australia: ['Adore Beauty', 'Paula\'s Choice Australia'],
          india: ['Nykaa']
        },
        nightUseOnly: true
      }
    };
  }

  // ============ REMAINING INITIALIZATION METHODS (SIMPLIFIED) ============
  initializeRuleMatrix() {
    return {
      skin_type_priorities: {
        'dry': ['hydration', 'barrier_repair', 'gentle_cleansing'],
        'oily': ['oil_control', 'exfoliation', 'lightweight_hydration'],
        'combination': ['balanced_approach', 'targeted_treatment', 'oil_control_tzone'],
        'sensitive': ['minimal_ingredients', 'fragrance_free', 'soothing'],
        'normal': ['maintenance', 'prevention', 'versatile_products']
      },
      concern_hierarchy: {
        'acne_breakouts': 95,
        'sensitivity_redness': 90,
        'fine_lines_wrinkles': 85,
        'dark_spots_hyperpigmentation': 80,
        'dryness_dehydration': 75,
        'excess_oil_shine': 70,
        'uneven_texture': 65,
        'large_pores': 60
      }
    };
  }

  initializeConflictMatrix() {
    return {
      'retinoids': ['vitamin_c', 'glycolic_acid', 'salicylic_acid'],
      'vitamin_c': ['retinoids', 'niacinamide'],
      'glycolic_acid': ['retinoids', 'salicylic_acid'],
      'salicylic_acid': ['retinoids', 'glycolic_acid']
    };
  }

  initializeBenefitsDatabase() {
    return {
      'niacinamide': ['Oil control', 'Pore minimizing', 'Brightening', 'Anti-inflammatory'],
      'hyaluronic_acid': ['Intense hydration', 'Plumping', 'Moisture retention'],
      'vitamin_c': ['Brightening', 'Anti-aging', 'Antioxidant protection'],
      'salicylic_acid': ['Exfoliation', 'Unclogging pores', 'Acne treatment'],
      'glycolic_acid': ['Exfoliation', 'Texture improvement', 'Anti-aging'],
      'ceramides': ['Barrier repair', 'Moisture retention', 'Skin protection'],
      'retinoids': ['Anti-aging', 'Collagen production', 'Cell turnover'],
      'peptides': ['Collagen support', 'Firming', 'Anti-aging']
    };
  }

  initializeFallbacks() {
    return {
      australia: ['qv_gentle_cleanser', 'qv_cream', 'cancer_council_spf50'],
      india: ['cetaphil_gentle_cleanser', 'ponds_super_light_gel', 'neutrogena_ultra_sheer']
    };
  }

  // ============ ENHANCED INPUT VALIDATION ============
  validateAndNormalizeInput(assessmentData) {
    const data = assessmentData && typeof assessmentData === 'object' ? assessmentData : {};
    
    const defaults = {
      country: 'australia',
      skinType: 'normal',
      concerns: ['hydrate_skin'],
      medicalConditions: [],
      age: '20-29',
      gender: 'prefer_not_to_say',
      sensitivity: 5,
      climate: 'temperate',
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
      concerns: this.safeArray(data.concerns).filter(Boolean),
      medicalConditions: this.safeArray(data.medicalConditions).filter(Boolean),
      goals: this.safeArray(data.goals).filter(Boolean),
      sensitivity: Math.max(1, Math.min(10, parseInt(data.sensitivity) || 5)),
      country: this.safeString(data.country) || 'australia',
      skinType: this.safeString(data.skinType) || 'normal',
      climate: this.safeString(data.climate) || 'temperate',
      budget: this.safeString(data.budget) || 'budget-friendly',
      experience: this.safeString(data.experience) || 'beginner',
      location: this.safeString(data.location) || ''
    };

    // Auto-detect climate based on location
    if (normalized.country === 'australia' && normalized.location) {
      const location = normalized.location.toLowerCase();
      if (location.includes('melbourne') || location.includes('adelaide') || location.includes('hobart')) {
        normalized.climate = 'temperate';
      } else if (location.includes('darwin') || location.includes('cairns') || location.includes('queensland')) {
        normalized.climate = 'tropical';
      } else if (location.includes('perth')) {
        normalized.climate = 'mediterranean';
      } else if (location.includes('alice') || location.includes('outback')) {
        normalized.climate = 'arid';
      }
    }

    return normalized;
  }

  createUserProfile(data) {
    return {
      country: data.country,
      skinType: data.skinType,
      age: this.parseAgeRange(data.age),
      gender: data.gender,
      climate: data.climate,
      lifestyle: data.lifestyle,
      concerns: this.prioritizeConcerns(data.concerns, data.goals),
      medicalConditions: data.medicalConditions,
      sensitivity: data.sensitivity,
      additionalConcerns: data.additionalConcerns,
      experience: data.experience,
      budget: data.budget,
      goals: data.goals,
      location: data.location,
      riskTolerance: this.calculateRiskTolerance(data.experience, data.sensitivity),
      routineComplexity: this.calculateRoutineComplexity(data.experience, data.age),
      primaryConcern: this.identifyPrimaryConcern(data.concerns, data.goals)
    };
  }

  // ============ COUNTRY-SPECIFIC RECOMMENDATIONS ============
  generateCountrySpecificRecommendations(userProfile) {
    console.log(`🌏 Generating recommendations for ${userProfile.country} market`);
    
    const recommendations = [];
    
    recommendations.push(...this.getEssentialProducts(userProfile));
    recommendations.push(...this.getClimateSpecificProducts(userProfile));
    recommendations.push(...this.getLocalBrandProducts(userProfile));
    recommendations.push(...this.getSkinTypeProducts(userProfile));
    recommendations.push(...this.getConcernBasedProducts(userProfile));
    recommendations.push(...this.getAgeBasedProducts(userProfile));
    
    return this.deduplicateRecommendations(recommendations);
  }

  getEssentialProducts(userProfile) {
    const essentials = [];
    
    const cleanserOptions = this.getCountryCleanserOptions(userProfile);
    if (cleanserOptions.length > 0) {
      essentials.push({
        productId: cleanserOptions[0],
        reasoning: `Essential daily cleanser for ${userProfile.country === 'australia' ? 'Australian' : 'Indian'} conditions`,
        category: 'essential',
        priority: 100
      });
    }

    const moisturizerOptions = this.getCountryMoisturizerOptions(userProfile);
    if (moisturizerOptions.length > 0) {
      essentials.push({
        productId: moisturizerOptions[0],
        reasoning: 'Daily moisturizer for hydration and barrier protection',
        category: 'essential',
        priority: 95
      });
    }

    const sunscreenOptions = this.getCountrySunscreenOptions(userProfile);
    if (sunscreenOptions.length > 0) {
      const sunscreenPriority = userProfile.country === 'australia' ? 100 : 95;
      essentials.push({
        productId: sunscreenOptions[0],
        reasoning: userProfile.country === 'australia' 
          ? 'Critical sun protection for harsh Australian UV - highest cancer rate globally'
          : 'Daily sun protection to prevent aging and damage',
        category: 'essential',
        priority: sunscreenPriority
      });
    }

    return essentials;
  }

  getCountryCleanserOptions(userProfile) {
    const countryInfo = this.countryDatabase[userProfile.country];
    const maxBudget = countryInfo.budgetRanges[userProfile.budget];
    const cleanserPriority = [];

    if (userProfile.country === 'australia') {
      if (userProfile.skinType === 'sensitive' || userProfile.sensitivity > 7) {
        cleanserPriority.push('qv_gentle_cleanser', 'cetaphil_gentle_aus', 'simple_kind_face_wash_aus');
      } else if (userProfile.skinType === 'oily' || userProfile.concerns.includes('acne_breakouts')) {
        cleanserPriority.push('benzac_daily_cleanser', 'sukin_foaming_cleanser');
      } else {
        cleanserPriority.push('sukin_foaming_cleanser', 'qv_gentle_cleanser');
      }

      if (maxBudget >= 45) {
        cleanserPriority.unshift('go_to_properly_clean');
        if (userProfile.experience !== 'beginner') {
          cleanserPriority.unshift('aspect_dr_cleanser');
        }
      }

      if (maxBudget >= 45 && userProfile.experience === 'advanced') {
        cleanserPriority.unshift('aesop_purifying_cleanser');
      }
    } else {
      if (userProfile.skinType === 'sensitive' || userProfile.sensitivity > 7) {
        cleanserPriority.push('cetaphil_gentle_cleanser', 'simple_refreshing_cleanser');
      } else if (userProfile.skinType === 'oily' || userProfile.concerns.includes('acne_breakouts')) {
        cleanserPriority.push('neutrogena_oil_free_cleanser', 'plum_green_tea_cleanser');
      } else {
        cleanserPriority.push('simple_refreshing_cleanser', 'cetaphil_gentle_cleanser');
      }
    }

    const ceravePrice = this.getProductPrice(this.productDatabase['cerave_foaming_cleanser'], userProfile.country);
    if (maxBudget >= ceravePrice) {
      cleanserPriority.push('cerave_foaming_cleanser');
    }

    return cleanserPriority.filter(id => {
      const product = this.productDatabase[id];
      const productPrice = this.getProductPrice(product, userProfile.country);
      return product && productPrice <= maxBudget && 
             (product.country === userProfile.country || product.country === 'both');
    });
  }

  getCountryMoisturizerOptions(userProfile) {
    const countryInfo = this.countryDatabase[userProfile.country];
    const maxBudget = countryInfo.budgetRanges[userProfile.budget];
    const moisturizerPriority = [];

    if (userProfile.country === 'australia') {
      if (userProfile.skinType === 'dry' || userProfile.climate === 'arid') {
        moisturizerPriority.push('qv_cream', 'qv_intensive_moisturiser');
      } else if (userProfile.skinType === 'oily' || userProfile.climate === 'tropical') {
        moisturizerPriority.push('synergie_hydrogel', 'go_to_face_hero');
      } else {
        moisturizerPriority.push('go_to_face_hero', 'sukin_hydrating_moisturiser');
      }

      if (maxBudget >= 125 && userProfile.skinType === 'oily') {
        moisturizerPriority.unshift('synergie_hydrogel');
      }
    } else {
      if (userProfile.skinType === 'dry' || userProfile.climate === 'cold') {
        moisturizerPriority.push('nivea_soft_cream', 'minimalist_moisturizer');
      } else {
        moisturizerPriority.push('ponds_super_light_gel', 'plum_moisturizer');
      }
    }

    const ceravePrice = this.getProductPrice(this.productDatabase['cerave_daily_moisturizer'], userProfile.country);
    if (maxBudget >= ceravePrice) {
      moisturizerPriority.unshift('cerave_daily_moisturizer');
    }

    return moisturizerPriority.filter(id => {
      const product = this.productDatabase[id];
      const productPrice = this.getProductPrice(product, userProfile.country);
      return product && productPrice <= maxBudget && 
             (product.country === userProfile.country || product.country === 'both');
    });
  }

  getCountrySunscreenOptions(userProfile) {
    const countryInfo = this.countryDatabase[userProfile.country];
    const maxBudget = countryInfo.budgetRanges[userProfile.budget];
    const sunscreenPriority = [];

    if (userProfile.country === 'australia') {
      sunscreenPriority.push('cancer_council_spf50');
      if (userProfile.sensitivity > 7) {
        sunscreenPriority.unshift('hamilton_everyday_face', 'invisible_zinc_spf50');
      }
      if (maxBudget >= 40) {
        sunscreenPriority.unshift('ultra_violette_supreme_screen', 'mecca_to_save_face');
      }
      if (userProfile.concerns.includes('sensitivity_redness') && maxBudget >= 46) {
        sunscreenPriority.unshift('ultra_violette_clean_screen');
      }
    } else {
      sunscreenPriority.push('lakme_sunscreen', 'minimalist_sunscreen');
      if (maxBudget >= 449) {
        sunscreenPriority.unshift('neutrogena_ultra_sheer');
      }
      if (maxBudget >= 549) {
        sunscreenPriority.unshift('dot_key_sunscreen');
      }
    }

    const lrpPrice = this.getProductPrice(this.productDatabase['la_roche_posay_sunscreen'], userProfile.country);
    if (maxBudget >= lrpPrice) {
      sunscreenPriority.unshift('la_roche_posay_sunscreen');
    }

    return sunscreenPriority.filter(id => {
      const product = this.productDatabase[id];
      const productPrice = this.getProductPrice(product, userProfile.country);
      return product && productPrice <= maxBudget && 
             (product.country === userProfile.country || product.country === 'both');
    });
  }

  getConcernBasedProducts(userProfile) {
    const concernProducts = [];
    const countryInfo = this.countryDatabase[userProfile.country];
    const maxBudget = countryInfo.budgetRanges[userProfile.budget];
    
    userProfile.concerns.forEach((concern, index) => {
      const priority = 90 - (index * 10);
      
      switch(concern) {
        case 'acne_breakouts':
          if (userProfile.country === 'australia') {
            if (maxBudget >= 95) {
              concernProducts.push({
                productId: 'synergie_vitamin_b',
                reasoning: 'Australian cosmeceutical niacinamide for oil control and acne',
                category: 'targeted',
                priority: priority
              });
            }
          } else {
            if (maxBudget >= 349) {
              concernProducts.push({
                productId: 'minimalist_niacinamide',
                reasoning: 'Controls oil and reduces acne inflammation',
                category: 'targeted',
                priority: priority
              });
            }
            if (maxBudget >= 599) {
              concernProducts.push({
                productId: 'dot_key_niacinamide',
                reasoning: 'Indian brand niacinamide for acne-prone skin',
                category: 'targeted',
                priority: priority - 5
              });
            }
          }

          const toNiacPrice = this.getProductPrice(this.productDatabase['the_ordinary_niacinamide'], userProfile.country);
          if (maxBudget >= toNiacPrice) {
            concernProducts.push({
              productId: 'the_ordinary_niacinamide',
              reasoning: 'Affordable niacinamide for oil control',
              category: 'targeted',
              priority: priority
            });
          }
          break;
          
        case 'fine_lines_wrinkles':
        case 'dark_spots_hyperpigmentation':
          if (userProfile.country === 'australia') {
            if (maxBudget >= 180 && userProfile.experience === 'advanced') {
              concernProducts.push({
                productId: 'rationale_essential_six',
                reasoning: 'Premium Australian anti-aging serum',
                category: 'targeted',
                priority: priority + 5
              });
            }
            if (maxBudget >= 125 && userProfile.experience !== 'beginner') {
              concernProducts.push({
                productId: 'aspect_dr_vitamin_c',
                reasoning: 'Professional-grade vitamin C for brightening',
                category: 'targeted',
                priority: priority
              });
            }
            if (maxBudget >= 69.95 && userProfile.experience !== 'beginner') {
              concernProducts.push({
                productId: 'alpha_h_liquid_gold',
                reasoning: 'Iconic Australian glycolic acid treatment',
                category: 'targeted',
                priority: priority
              });
            }
          } else {
            if (maxBudget >= 599 && userProfile.experience !== 'beginner') {
              concernProducts.push({
                productId: 'minimalist_vitamin_c',
                reasoning: 'Stable vitamin C for Indian climate',
                category: 'targeted',
                priority: priority
              });
            }
            if (maxBudget >= 895 && userProfile.experience === 'advanced') {
              concernProducts.push({
                productId: 'plum_vitamin_c',
                reasoning: 'High-strength Indian brand vitamin C',
                category: 'targeted',
                priority: priority - 5
              });
            }
          }

          const toVitCPrice = this.getProductPrice(this.productDatabase['the_ordinary_vitamin_c'], userProfile.country);
          if (maxBudget >= toVitCPrice && userProfile.experience !== 'beginner') {
            concernProducts.push({
              productId: 'the_ordinary_vitamin_c',
              reasoning: 'Powerful vitamin C for brightening',
              category: 'targeted',
              priority: priority
            });
          }
          break;
          
        case 'dryness_dehydration':
          if (userProfile.country === 'australia' && maxBudget >= 49.95) {
            concernProducts.push({
              productId: 'sand_and_sky_serum',
              reasoning: 'Australian hydrating serum with Tasmanian spring water',
              category: 'targeted',
              priority: priority
            });
          }
          
          const haPrice = this.getProductPrice(this.productDatabase['the_ordinary_hyaluronic_acid'], userProfile.country);
          if (maxBudget >= haPrice) {
            concernProducts.push({
              productId: 'the_ordinary_hyaluronic_acid',
              reasoning: 'Intense hydration for all skin types',
              category: 'targeted',
              priority: priority
            });
          }
          break;
          
        case 'uneven_texture':
        case 'large_pores':
          if (userProfile.experience !== 'beginner') {
            const pcPrice = this.getProductPrice(this.productDatabase['paula_choice_bha'], userProfile.country);
            if (maxBudget >= pcPrice) {
              concernProducts.push({
                productId: 'paula_choice_bha',
                reasoning: 'Gold-standard BHA for texture and pores',
                category: 'targeted',
                priority: priority
              });
            }
          }
          break;
      }
    });

    return concernProducts;
  }

  getLocalBrandProducts(userProfile) {
    const countryInfo = this.countryDatabase[userProfile.country];
    if (!countryInfo) return [];

    const localProducts = [];
    const maxBudget = countryInfo.budgetRanges[userProfile.budget];

    countryInfo.localBrands.slice(0, 5).forEach(brand => {
      const brandProducts = Object.entries(this.productDatabase)
        .filter(([id, product]) => {
          const productPrice = this.getProductPrice(product, userProfile.country);
          return product.brand?.toLowerCase().replace(/[^a-z]/g, '_') === brand &&
                 productPrice <= maxBudget &&
                 (product.country === userProfile.country || product.country === 'both');
        })
        .slice(0, 1);

      brandProducts.forEach(([productId, product]) => {
        localProducts.push({
          productId,
          reasoning: `Local ${userProfile.country === 'australia' ? 'Australian' : 'Indian'} brand - better availability and value`,
          category: 'local_brand',
          priority: 85,
          localBrand: true
        });
      });
    });

    return localProducts;
  }

  getClimateSpecificProducts(userProfile) {
    const climate = this.climateDatabase[userProfile.climate];
    if (!climate) return [];

    const climateProducts = [];
    const priorityIngredients = climate.priorityIngredients || [];

    priorityIngredients.forEach(ingredient => {
      const matchingProducts = Object.entries(this.productDatabase)
        .filter(([id, product]) => {
          const activeIngredients = product.activeIngredients || [];
          return activeIngredients.includes(ingredient) &&
                 (product.country === userProfile.country || product.country === 'both');
        })
        .slice(0, 1);

      matchingProducts.forEach(([productId]) => {
        climateProducts.push({
          productId,
          reasoning: `Recommended for ${userProfile.climate} climate conditions`,
          category: 'climate_specific',
          priority: 80
        });
      });
    });

    return climateProducts;
  }

  getSkinTypeProducts(userProfile) {
    return [];
  }

  getAgeBasedProducts(userProfile) {
    const ageProducts = [];
    
    if (userProfile.age >= 30) {
      ageProducts.push({
        productId: userProfile.country === 'australia' ? 'alpha_h_liquid_gold' : 'minimalist_vitamin_c',
        reasoning: 'Anti-aging prevention for 30+ skin',
        category: 'age_appropriate',
        priority: 75
      });
    }

    return ageProducts;
  }

  getProductPrice(product, country) {
    if (!product) return 0;
    if (typeof product.price === 'object') {
      return product.price[country] || product.price.australia || product.price.india || 0;
    }
    return product.price || 0;
  }

  applyBudgetFiltering(recommendations, userProfile) {
    const countryInfo = this.countryDatabase[userProfile.country];
    const maxBudget = countryInfo.budgetRanges[userProfile.budget];
    
    const filteredRecommendations = [];

    recommendations.forEach(rec => {
      const product = this.productDatabase[rec.productId];
      if (!product) return;

      if (product.country !== 'both' && product.country !== userProfile.country) {
        return;
      }

      const productPrice = this.getProductPrice(product, userProfile.country);

      if (productPrice <= maxBudget) {
        filteredRecommendations.push({
          ...rec,
          price: productPrice,
          currency: countryInfo.currency,
          withinBudget: true
        });
      } else {
        const alternative = this.findBudgetAlternative(rec, maxBudget, userProfile.country);
        if (alternative) {
          filteredRecommendations.push({
            ...alternative,
            budgetAlternative: true
          });
        }
      }
    });

    return filteredRecommendations;
  }

  findBudgetAlternative(originalRec, maxBudget, country) {
    const originalProduct = this.productDatabase[originalRec.productId];
    if (!originalProduct) return null;

    const alternatives = Object.entries(this.productDatabase)
      .filter(([id, product]) => {
        const productPrice = this.getProductPrice(product, country);
        return product.category === originalProduct.category &&
               productPrice <= maxBudget &&
               (product.country === country || product.country === 'both') &&
               id !== originalRec.productId;
      })
      .sort((a, b) => {
        const aPrice = this.getProductPrice(a[1], country);
        const bPrice = this.getProductPrice(b[1], country);
        return bPrice - aPrice;
      });

    if (alternatives.length === 0) return null;

    const [alternativeId, alternativeProduct] = alternatives[0];
    
    return {
      ...originalRec,
      productId: alternativeId,
      reasoning: `Budget-friendly alternative`,
      price: this.getProductPrice(alternativeProduct, country)
    };
  }

  applyMedicalConstraints(recommendations, userProfile) {
    return recommendations.filter(rec => {
      const product = this.productDatabase[rec.productId];
      if (!product) return false;

      if (userProfile.medicalConditions.includes('eczema')) {
        return !product.activeIngredients || 
               !product.activeIngredients.some(ing => ing.includes('acid'));
      }

      return true;
    });
  }

  resolveIngredientConflicts(recommendations) {
    const activeProducts = recommendations.filter(rec => {
      const product = this.productDatabase[rec.productId];
      return product && product.activeIngredients && product.activeIngredients.length > 0;
    });

    const conflictFreeRecs = [];
    const usedIngredients = new Set();

    activeProducts.forEach(rec => {
      const product = this.productDatabase[rec.productId];
      const ingredients = product.activeIngredients || [];
      
      const hasConflict = ingredients.some(ing => {
        const conflicts = this.conflictMatrix[ing] || [];
        return conflicts.some(conflictIng => usedIngredients.has(conflictIng));
      });

      if (!hasConflict) {
        ingredients.forEach(ing => usedIngredients.add(ing));
        conflictFreeRecs.push(rec);
      }
    });

    const nonActiveRecs = recommendations.filter(rec => {
      const product = this.productDatabase[rec.productId];
      return !product || !product.activeIngredients || product.activeIngredients.length === 0;
    });

    return [...conflictFreeRecs, ...nonActiveRecs];
  }

  scoreAndRankRecommendations(recommendations, userProfile) {
    return recommendations.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }

  personalizeRecommendations(recommendations, userProfile) {
    return recommendations.slice(0, 8);
  }

  structureRecommendations(recommendations, userProfile) {
    return {
      essential: recommendations.filter(r => r.category === 'essential'),
      targeted: recommendations.filter(r => r.category === 'targeted'),
      supporting: recommendations.filter(r => r.category === 'local_brand' || r.category === 'climate_specific'),
      optional: []
    };
  }

  addRoutineWarningsAndBenefits(recommendations, userProfile) {
    const routine = this.generateDetailedRoutine(recommendations, userProfile);
    const warnings = this.generateDetailedWarnings(recommendations, userProfile);
    const benefits = this.generatePersonalizedBenefits(recommendations, userProfile);

    return {
      user_profile: userProfile,
      generated_at: new Date().toISOString(),
      recommendations: recommendations,
      routine_suggestions: routine,
      warnings: warnings,
      expected_benefits: benefits,
      budget_summary: this.generateBudgetSummary(recommendations)
    };
  }

  generateDetailedRoutine(recommendations, userProfile) {
    const allProducts = Object.keys(recommendations).reduce((acc, category) => {
      return acc.concat(recommendations[category]);
    }, []);

    const morningRoutine = [];
    const eveningRoutine = [];
    const countryInfo = this.countryDatabase[userProfile.country];

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

        const productPrice = this.getProductPrice(product, userProfile.country);
        const availability = this.getAvailability(product, userProfile.country);

        const routineItem = {
          product_id: this.safeString(rec.productId),
          product_name: this.safeString(product.name),
          brand: this.safeString(product.brand),
          price: productPrice,
          currency: countryInfo.currency,
          step: this.safeString(step),
          instructions: this.getDetailedUsageInstructions(rec.productId, userProfile),
          why_recommended: this.safeString(rec.reasoning),
          key_benefits: this.safeArray(product.benefits),
          where_to_buy: this.safeArray(availability),
          local_brand: rec.localBrand || false,
          australian_made: product.australianMade || false
        };

        if (timing === 'both' || timing === 'morning') {
          morningRoutine.push({ ...routineItem, routine_time: 'morning' });
        }
        
        if (timing === 'both' || timing === 'evening') {
          eveningRoutine.push({ ...routineItem, routine_time: 'evening' });
        }
        
        if (timing === 'specific') {
          const activeIngredients = this.safeArray(product.activeIngredients);
          if (activeIngredients.includes('vitamin_c') || product.morningUse) {
            morningRoutine.push({ ...routineItem, routine_time: 'morning' });
          } else {
            eveningRoutine.push({ ...routineItem, routine_time: 'evening' });
          }
        }
      });
    });

    return {
      morning: morningRoutine,
      evening: eveningRoutine,
      routine_tips: this.getCountrySpecificRoutineTips(userProfile),
      shopping_guide: this.generateShoppingGuide(allProducts, userProfile)
    };
  }

  getAvailability(product, country) {
    if (typeof product.availability === 'object' && product.availability[country]) {
      return product.availability[country];
    }
    if (Array.isArray(product.availability)) {
      return product.availability;
    }
    return this.countryDatabase[country].popularRetailers;
  }

  getDetailedUsageInstructions(productId, userProfile) {
    const product = this.productDatabase[productId];
    if (!product) return 'Follow product instructions';

    const instructions = {
      cleanser: 'Apply to damp skin, massage gently for 30-60 seconds, rinse with lukewarm water',
      active: 'Apply 2-3 drops to clean, dry skin. Allow to absorb before next step',
      hydrating: 'Apply to damp skin immediately after cleansing. Pat gently to absorb',
      moisturizer: 'Apply pea-sized amount to face and neck. Massage in upward motions',
      sunscreen: 'Apply generously (1/4 teaspoon for face). Reapply every 2 hours if outdoors',
      treatment: 'Use 1-2 times per week. Apply to clean skin and leave for specified time'
    };

    return instructions[product.category] || 'Follow product instructions';
  }

  getCountrySpecificRoutineTips(userProfile) {
    const baseTips = [
      'Apply products to slightly damp skin for better absorption',
      'Allow each product to absorb before applying the next',
      'Introduce new products one at a time'
    ];

    if (userProfile.country === 'australia') {
      baseTips.push('Australian UV is extremely harsh - never skip SPF 50+ sunscreen');
      baseTips.push('Reapply sunscreen every 2 hours when outdoors');
      baseTips.push('Shop at Chemist Warehouse for best prices');
    } else {
      baseTips.push('Never skip sunscreen, even on cloudy days');
      baseTips.push('In humid weather, use lighter formulations');
      baseTips.push('Check Nykaa for authentic products and deals');
    }

    return baseTips;
  }

  generateShoppingGuide(allProducts, userProfile) {
    const countryInfo = this.countryDatabase[userProfile.country];
    const totalCost = allProducts.reduce((sum, rec) => sum + (rec.price || 0), 0);
    
    return {
      total_budget: `${countryInfo.currencySymbol}${totalCost}`,
      currency: countryInfo.currency,
      recommended_retailers: countryInfo.popularRetailers,
      shipping_info: countryInfo.shippingNote,
      local_brands_count: allProducts.filter(rec => rec.localBrand).length
    };
  }

  generateBudgetSummary(recommendations) {
    const allProducts = Object.keys(recommendations).reduce((acc, category) => {
      return acc.concat(recommendations[category]);
    }, []);

    if (allProducts.length === 0) return { total_cost: 0, product_count: 0 };

    const firstProduct = this.productDatabase[allProducts[0].productId];
    const currency = firstProduct?.currency || 'AUD';
    const currencySymbol = currency === 'AUD' ? '_to_properly_clean': {
        name: 'Go-To Properly Clean Cleanser',
        category: 'cleanser',
        price: 45.00,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['all'],
        addresses: ['basic_cleansing', 'uneven_texture'],
        strength: 'gentle',
        brand: 'Go-To',
        size: '150ml',
        conflicts: [],
        benefits: ['Jojoba beads for gentle exfoliation', 'Rosehip oil', 'Australian made', 'Cruelty-free'],
        availability: ['Mecca', 'Adore Beauty', 'Go-To website'],
        australianMade: true,
        crueltyfree: true
      },
      'aspect_dr_cleanser': {
        name: 'Aspect Dr Cleansing Facial Wash',
        category: 'cleanser',
        price: 75.00,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['normal', 'combination', 'oily'],
        addresses: ['basic_cleansing', 'uneven_texture'],
        strength: 'moderate',
        brand: 'Aspect Dr',
        size: '220ml',
        conflicts: [],
        activeIngredients: ['glycolic_acid'],
        benefits: ['Glycolic acid', 'Professional grade', 'Dermatologist formulated', 'Australian made'],
        australianMade: true
      },
      'frank_body_cleanser': {
        name: 'Frank Body Creamy Face Cleanser',
        category: 'cleanser',
        price: 24.95,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['dry', 'normal', 'sensitive'],
        addresses: ['basic_cleansing', 'dryness_dehydration'],
        strength: 'gentle',
        brand: 'Frank Body',
        size: '120ml',
        conflicts: [],
        benefits: ['Nourishing oils', 'Non-stripping', 'Australian made', 'Vegan'],
        availability: ['Mecca', 'Adore Beauty', 'Frank Body website'],
        australianMade: true,
        vegan: true
      },

      // ========== AUSTRALIAN PREMIUM CLEANSERS ==========
      'aesop_purifying_cleanser': {
        name: 'Aesop Purifying Facial Exfoliant Paste',
        category: 'cleanser',
        price: 45.00,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['normal', 'oily', 'combination'],
        addresses: ['basic_cleansing', 'uneven_texture'],
        strength: 'moderate',
        brand: 'Aesop',
        size: '75ml',
        conflicts: [],
        benefits: ['Quartz and lactic acid', 'Botanical extracts', 'Luxury experience', 'Australian icon'],
        availability: ['Aesop stores', 'Mecca', 'David Jones'],
        australianMade: true,
        luxury: true
      },

      // ========== AUSTRALIAN ACTIVES & TREATMENTS ==========
      'alpha_h_liquid_gold': {
        name: 'Alpha-H Liquid Gold',
        category: 'active',
        price: 69.95,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['normal', 'combination', 'oily'],
        addresses: ['fine_lines_wrinkles', 'uneven_texture', 'dark_spots_hyperpigmentation'],
        strength: 'strong',
        brand: 'Alpha-H',
        size: '100ml',
        conflicts: ['retinoids', 'vitamin_c'],
        activeIngredients: ['glycolic_acid'],
        requiresExperience: 'intermediate',
        benefits: ['5% glycolic acid', 'Silk proteins', 'Australian icon product', 'Award-winning'],
        availability: ['Mecca', 'Adore Beauty', 'Priceline'],
        australianMade: true,
        nightUseOnly: true
      },
      'synergie_vitamin_b': {
        name: 'Synergie Skin VitaMin B',
        category: 'active',
        price: 95.00,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['all'],
        addresses: ['excess_oil_shine', 'large_pores', 'sensitivity_redness', 'acne_breakouts'],
        strength: 'moderate',
        brand: 'Synergie Skin',
        size: '30ml',
        conflicts: [],
        activeIngredients: ['niacinamide'],
        requiresExperience: 'beginner',
        benefits: ['10% niacinamide', 'Cosmeceutical grade', 'Australian made', 'Multi-functional'],
        availability: ['Synergie clinics', 'Adore Beauty'],
        australianMade: true
      },
      'rationale_essential_six': {
        name: 'Rationale Essential Six Serum',
        category: 'active',
        price: 180.00,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['normal', 'dry', 'mature'],
        addresses: ['fine_lines_wrinkles', 'dark_spots_hyperpigmentation', 'dryness_dehydration'],
        strength: 'strong',
        brand: 'Rationale',
        size: '30ml',
        conflicts: [],
        activeIngredients: ['vitamin_c', 'peptides', 'antioxidants'],
        requiresExperience: 'advanced',
        benefits: ['6 active ingredients', 'Clinical strength', 'Luxury formulation', 'Australian made'],
        availability: ['Rationale clinics', 'Select retailers'],
        australianMade: true,
        luxury: true
      },
      'sand_and_sky_serum': {
        name: 'Sand & Sky Tasmanian Spring Water Hydration Serum',
        category: 'hydrating',
        price: 49.95,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['all'],
        addresses: ['dryness_dehydration', 'sensitivity_redness'],
        strength: 'gentle',
        brand: 'Sand & Sky',
        size: '30ml',
        conflicts: [],
        activeIngredients: ['hyaluronic_acid', 'tasmanian_spring_water'],
        requiresExperience: 'beginner',
        benefits: ['Tasmanian spring water', 'Lightweight', 'Fast-absorbing', 'Australian made'],
        availability: ['Mecca', 'Adore Beauty', 'Sephora'],
        australianMade: true
      },
      'aspect_dr_vitamin_c': {
        name: 'Aspect Dr Active C Serum',
        category: 'active',
        price: 125.00,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['normal', 'oily', 'combination'],
        addresses: ['dark_spots_hyperpigmentation', 'fine_lines_wrinkles'],
        strength: 'strong',
        brand: 'Aspect Dr',
        size: '30ml',
        conflicts: ['retinoids', 'glycolic_acid'],
        activeIngredients: ['vitamin_c'],
        requiresExperience: 'intermediate',
        benefits: ['L-ascorbic acid', 'Professional grade', 'Brightening', 'Australian made'],
        availability: ['Aspect clinics', 'Professional retailers'],
        australianMade: true,
        morningUse: true
      },

      // ========== AUSTRALIAN MOISTURIZERS ==========
      'qv_cream': {
        name: 'QV Cream',
        category: 'moisturizer',
        price: 12.99,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['dry', 'sensitive', 'eczema'],
        addresses: ['dryness_dehydration', 'sensitivity_redness'],
        strength: 'gentle',
        brand: 'QV',
        size: '100g',
        conflicts: [],
        benefits: ['Fragrance-free', 'Suitable for eczema', 'Dermatologist recommended', 'TGA approved'],
        availability: ['Chemist Warehouse', 'Priceline', 'Pharmacies'],
        australianMade: true,
        tgaApproved: true
      },
      'qv_intensive_moisturiser': {
        name: 'QV Intensive Moisturiser',
        category: 'moisturizer',
        price: 14.99,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['dry', 'very_dry', 'eczema'],
        addresses: ['dryness_dehydration', 'sensitivity_redness'],
        strength: 'gentle',
        brand: 'QV',
        size: '100g',
        conflicts: [],
        benefits: ['Extra rich formula', 'Long-lasting hydration', 'Eczema-friendly', 'Fragrance-free'],
        availability: ['Chemist Warehouse', 'Priceline', 'Pharmacies'],
        australianMade: true,
        tgaApproved: true
      },
      'go_to_face_hero': {
        name: 'Go-To Face Hero',
        category: 'moisturizer',
        price: 45.00,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['normal', 'dry', 'combination'],
        addresses: ['dryness_dehydration'],
        strength: 'gentle',
        brand: 'Go-To',
        size: '60ml',
        conflicts: [],
        activeIngredients: ['hyaluronic_acid'],
        benefits: ['Lightweight texture', 'Hyaluronic acid', 'Australian cult favorite', 'Vegan'],
        availability: ['Mecca', 'Adore Beauty', 'Go-To website'],
        australianMade: true,
        vegan: true
      },
      'synergie_hydrogel': {
        name: 'Synergie Skin HydroGel',
        category: 'moisturizer',
        price: 125.00,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['oily', 'combination', 'acne_prone'],
        addresses: ['dryness_dehydration', 'excess_oil_shine'],
        strength: 'gentle',
        brand: 'Synergie Skin',
        size: '50ml',
        conflicts: [],
        activeIngredients: ['hyaluronic_acid', 'niacinamide'],
        benefits: ['Oil-free hydration', 'Cosmeceutical grade', 'Non-comedogenic', 'Australian made'],
        availability: ['Synergie clinics', 'Adore Beauty'],
        australianMade: true
      },
      'sukin_hydrating_moisturiser': {
        name: 'Sukin Hydrating Facial Moisturiser',
        category: 'moisturizer',
        price: 14.95,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['normal', 'dry'],
        addresses: ['dryness_dehydration'],
        strength: 'gentle',
        brand: 'Sukin',
        size: '125ml',
        conflicts: [],
        benefits: ['Natural ingredients', 'Aloe vera', 'Rosehip oil', 'Vegan'],
        availability: ['Chemist Warehouse', 'Priceline', 'Coles', 'Woolworths'],
        australianMade: true,
        vegan: true
      },
      'frank_body_moisturiser': {
        name: 'Frank Body Moisturizer',
        category: 'moisturizer',
        price: 34.95,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['all'],
        addresses: ['dryness_dehydration'],
        strength: 'gentle',
        brand: 'Frank Body',
        size: '50ml',
        conflicts: [],
        benefits: ['Lightweight', 'Fast-absorbing', 'Australian made', 'Vegan'],
        availability: ['Mecca', 'Adore Beauty', 'Frank Body website'],
        australianMade: true,
        vegan: true
      },

      // ========== AUSTRALIAN SUNSCREENS ==========
      'cancer_council_spf50': {
        name: 'Cancer Council Face Day Wear SPF 50+',
        category: 'sunscreen',
        price: 14.95,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['all'],
        addresses: ['sun_protection'],
        strength: 'gentle',
        brand: 'Cancer Council',
        size: '75ml',
        conflicts: [],
        spf: 50,
        essential: true,
        benefits: ['Broad spectrum', 'Water resistant 4 hours', 'Australian made', 'Cancer Council approved'],
        availability: ['Chemist Warehouse', 'Priceline', 'Woolworths', 'Coles'],
        australianMade: true,
        tgaApproved: true
      },
      'ultra_violette_supreme_screen': {
        name: 'Ultra Violette Supreme Screen SPF 50+',
        category: 'sunscreen',
        price: 46.00,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['all'],
        addresses: ['sun_protection'],
        strength: 'gentle',
        brand: 'Ultra Violette',
        size: '75ml',
        conflicts: [],
        spf: 50,
        essential: true,
        benefits: ['Invisible finish', 'Antioxidants', 'Modern Australian brand', 'Reef-safe'],
        availability: ['Mecca', 'Adore Beauty', 'Sephora'],
        australianMade: true
      },
      'ultra_violette_clean_screen': {
        name: 'Ultra Violette Clean Screen SPF 30',
        category: 'sunscreen',
        price: 46.00,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['sensitive', 'acne_prone'],
        addresses: ['sun_protection', 'sensitivity_redness'],
        strength: 'gentle',
        brand: 'Ultra Violette',
        size: '85ml',
        conflicts: [],
        spf: 30,
        essential: true,
        benefits: ['Fragrance-free', 'Sensitive skin', 'Reef-safe', 'Lightweight'],
        availability: ['Mecca', 'Adore Beauty', 'Sephora'],
        australianMade: true
      },
      'hamilton_everyday_face': {
        name: 'Hamilton Everyday Face SPF 50+',
        category: 'sunscreen',
        price: 19.95,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['sensitive', 'all'],
        addresses: ['sun_protection', 'sensitivity_redness'],
        strength: 'gentle',
        brand: 'Hamilton',
        size: '75ml',
        conflicts: [],
        spf: 50,
        essential: true,
        benefits: ['Fragrance-free', 'Zinc oxide', 'Sensitive skin formula', 'Dermatologist tested'],
        availability: ['Chemist Warehouse', 'Priceline', 'Pharmacies']
      },
      'invisible_zinc_spf50': {
        name: 'Invisible Zinc Face & Body SPF 50+',
        category: 'sunscreen',
        price: 29.95,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['sensitive', 'all'],
        addresses: ['sun_protection'],
        strength: 'gentle',
        brand: 'Invisible Zinc',
        size: '75ml',
        conflicts: [],
        spf: 50,
        essential: true,
        benefits: ['Physical sunscreen', 'No white cast', 'Water resistant', '4 hours protection'],
        availability: ['Chemist Warehouse', 'Priceline', 'Pharmacies'],
        australianMade: true
      },
      'mecca_to_save_face': {
        name: 'Mecca Cosmetica To Save Face SPF 50+',
        category: 'sunscreen',
        price: 40.00,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['all'],
        addresses: ['sun_protection'],
        strength: 'gentle',
        brand: 'Mecca',
        size: '75ml',
        conflicts: [],
        spf: 50,
        essential: true,
        benefits: ['Broad spectrum', 'Lightweight', 'Makeup-friendly', 'Antioxidants'],
        availability: ['Mecca'],
        australianMade: false
      },

      // ========== AUSTRALIAN TREATMENTS & MASKS ==========
      'aesop_blue_chamomile_mask': {
        name: 'Aesop Blue Chamomile Facial Hydrating Masque',
        category: 'treatment',
        price: 72.00,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['dry', 'sensitive', 'normal'],
        addresses: ['dryness_dehydration', 'sensitivity_redness'],
        strength: 'gentle',
        brand: 'Aesop',
        size: '60ml',
        conflicts: [],
        benefits: ['Blue chamomile', 'Intensive hydration', 'Luxury botanical formula', 'Australian made'],
        availability: ['Aesop stores', 'Mecca', 'David Jones'],
        australianMade: true,
        luxury: true,
        weeklyUse: true
      },
      'sand_and_sky_pink_clay_mask': {
        name: 'Sand & Sky Australian Pink Clay Flash Perfection Mask',
        category: 'treatment',
        price: 49.95,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['normal', 'oily', 'combination'],
        addresses: ['large_pores', 'uneven_texture', 'excess_oil_shine'],
        strength: 'moderate',
        brand: 'Sand & Sky',
        size: '60g',
        conflicts: [],
        benefits: ['Australian pink clay', 'Exfoliating', 'Brightening', 'Instagram-famous'],
        availability: ['Mecca', 'Adore Beauty', 'Sephora'],
        australianMade: true,
        weeklyUse: true
      },
      // Currency symbol removed - invalid syntax

    const totalCost = allProducts.reduce((sum, rec) => sum + (rec.price || 0), 0);

    return {
      total_cost: totalCost,
      product_count: allProducts.length,
      currency: currency,
      currency_symbol: currencySymbol,
      cost_per_month: Math.round(totalCost / 3)
    };
  }

  generateDetailedWarnings(recommendations, userProfile) {
    const warnings = [];
    
    warnings.push({
      type: 'general',
      message: 'Always patch test new products before full application',
      severity: 'high'
    });

    if (userProfile.country === 'australia') {
      warnings.push({
        type: 'sun_protection',
        message: 'Australian UV levels are extremely high - SPF 50+ is essential year-round',
        severity: 'high'
      });
    }

    return warnings;
  }

  generatePersonalizedBenefits(recommendations, userProfile) {
    return {
      country_specific: `Products selected for ${userProfile.country === 'australia' ? 'Australian' : 'Indian'} climate`,
      local_availability: `Available through ${this.countryDatabase[userProfile.country].popularRetailers.slice(0, 3).join(', ')}`
    };
  }

  generateFallbackRecommendations(assessmentData) {
    const country = assessmentData.country || 'australia';
    const fallbacks = this.fallbackRecommendations[country] || this.fallbackRecommendations.australia;
    
    return {
      user_profile: { country },
      recommendations: { essential: fallbacks.map(id => ({ productId: id, priority: 100 })) },
      error: 'Using fallback recommendations'
    };
  }

  // ============ UTILITY FUNCTIONS ============
  safeString(value) {
    if (typeof value === 'string') return value;
    if (value === null || value === undefined) return '';
    return String(value);
  }

  safeArray(value) {
    if (Array.isArray(value)) return value;
    if (!value) return [];
    return [value];
  }

  sanitizeResponse(response) {
    return JSON.parse(JSON.stringify(response));
  }

  parseAgeRange(ageString) {
    const ageRanges = {
      '13-19': 16, '20-29': 25, '30-39': 35, '40-49': 45, '50+': 55
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
    const ageScore = age < 25 ? 1 : age < 35 ? 2 : age < 45 ? 3 : 4;
    return Math.round((experienceScore + ageScore) / 2);
  }

  identifyPrimaryConcern(concerns, goals) {
    return concerns.length > 0 ? concerns[0] : 'maintenance';
  }

  prioritizeConcerns(concerns, goals) {
    const concernPriority = {
      'severe_cystic_acne': 100, 'acne_breakouts': 90, 'sensitivity_redness': 85,
      'fine_lines_wrinkles': 80, 'dark_spots_hyperpigmentation': 75,
      'dryness_dehydration': 70, 'excess_oil_shine': 65, 'uneven_texture': 60,
      'large_pores': 55, 'sun_protection': 95
    };

    return concerns.sort((a, b) => (concernPriority[b] || 0) - (concernPriority[a] || 0));
  }

  deduplicateRecommendations(recommendations) {
    const seen = new Set();
    return recommendations.filter(rec => {
      if (seen.has(rec.productId)) return false;
      seen.add(rec.productId);
      return true;
    });
  }

  calculateAlternativeCompatibility(alternative, original) {
    let score = 0;
    if (alternative.category === original.category) score += 50;
    if (alternative.strength === original.strength) score += 20;
    
    const altSuitable = new Set(alternative.suitableFor || []);
    const origSuitable = new Set(original.suitableFor || []);
    const overlap = [...altSuitable].filter(x => origSuitable.has(x)).length;
    score += overlap * 10;
    
    return score;
  }
}

// ============ EXPORT & USAGE ============
// Example usage:
// const engine = new DynamicSkincareRecommendationEngine();
// const recommendations = await engine.generateRecommendations('user123', {
//   country: 'australia',
//   skinType: 'combination',
//   concerns: ['acne_breakouts', 'dark_spots_hyperpigmentation'],
//   age: '25-30',
//   budget: 'mid-range',
//   experience: 'intermediate',
//   climate: 'temperate',
//   location: 'Melbourne',
//   sensitivity: 5
// });

console.log('Enhanced Global Skincare Recommendation Engine v4.0 - Ready');
console.log('Supports: Australia 🇦🇺 and India 🇮🇳');
console.log('Features:');
console.log('✅ Expanded Australian product database (40+ products)');
console.log('✅ Indian product database (25+ products)');
console.log('✅ International products available in both markets');
console.log('✅ Climate-specific recommendations');
console.log('✅ Budget filtering with local currency');
console.log('✅ Australian-made product prioritization');
console.log('✅ TGA-approved medical products');
console.log('✅ Conflict resolution for active ingredients');
console.log('✅ Experience-level based recommendations');
console.log('✅ Detailed routine generation (AM/PM)');
console.log('✅ Retailer availability mapping');
console.log('✅ Country-specific warnings and tips');_to_properly_clean': {
        name: 'Go-To Properly Clean Cleanser',
        category: 'cleanser',
        price: 45.00,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['all'],
        addresses: ['basic_cleansing', 'uneven_texture'],
        strength: 'gentle',
        brand: 'Go-To',
        size: '150ml',
        conflicts: [],
        benefits: ['Jojoba beads for gentle exfoliation', 'Rosehip oil', 'Australian made', 'Cruelty-free'],
        availability: ['Mecca', 'Adore Beauty', 'Go-To website'],
        australianMade: true,
        crueltyfree: true
      },
      'aspect_dr_cleanser': {
        name: 'Aspect Dr Cleansing Facial Wash',
        category: 'cleanser',
        price: 75.00,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['normal', 'combination', 'oily'],
        addresses: ['basic_cleansing', 'uneven_texture'],
        strength: 'moderate',
        brand: 'Aspect Dr',
        size: '220ml',
        conflicts: [],
        activeIngredients: ['glycolic_acid'],
        benefits: ['Glycolic acid', 'Professional grade', 'Dermatologist formulated', 'Australian made'],
        australianMade: true
      },
      'frank_body_cleanser': {
        name: 'Frank Body Creamy Face Cleanser',
        category: 'cleanser',
        price: 24.95,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['dry', 'normal', 'sensitive'],
        addresses: ['basic_cleansing', 'dryness_dehydration'],
        strength: 'gentle',
        brand: 'Frank Body',
        size: '120ml',
        conflicts: [],
        benefits: ['Nourishing oils', 'Non-stripping', 'Australian made', 'Vegan'],
        availability: ['Mecca', 'Adore Beauty', 'Frank Body website'],
        australianMade: true,
        vegan: true
      },

      // ========== AUSTRALIAN PREMIUM CLEANSERS ==========
      'aesop_purifying_cleanser': {
        name: 'Aesop Purifying Facial Exfoliant Paste',
        category: 'cleanser',
        price: 45.00,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['normal', 'oily', 'combination'],
        addresses: ['basic_cleansing', 'uneven_texture'],
        strength: 'moderate',
        brand: 'Aesop',
        size: '75ml',
        conflicts: [],
        benefits: ['Quartz and lactic acid', 'Botanical extracts', 'Luxury experience', 'Australian icon'],
        availability: ['Aesop stores', 'Mecca', 'David Jones'],
        australianMade: true,
        luxury: true
      },

      // ========== AUSTRALIAN ACTIVES & TREATMENTS ==========
      'alpha_h_liquid_gold': {
        name: 'Alpha-H Liquid Gold',
        category: 'active',
        price: 69.95,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['normal', 'combination', 'oily'],
        addresses: ['fine_lines_wrinkles', 'uneven_texture', 'dark_spots_hyperpigmentation'],
        strength: 'strong',
        brand: 'Alpha-H',
        size: '100ml',
        conflicts: ['retinoids', 'vitamin_c'],
        activeIngredients: ['glycolic_acid'],
        requiresExperience: 'intermediate',
        benefits: ['5% glycolic acid', 'Silk proteins', 'Australian icon product', 'Award-winning'],
        availability: ['Mecca', 'Adore Beauty', 'Priceline'],
        australianMade: true,
        nightUseOnly: true
      },
      'synergie_vitamin_b': {
        name: 'Synergie Skin VitaMin B',
        category: 'active',
        price: 95.00,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['all'],
        addresses: ['excess_oil_shine', 'large_pores', 'sensitivity_redness', 'acne_breakouts'],
        strength: 'moderate',
        brand: 'Synergie Skin',
        size: '30ml',
        conflicts: [],
        activeIngredients: ['niacinamide'],
        requiresExperience: 'beginner',
        benefits: ['10% niacinamide', 'Cosmeceutical grade', 'Australian made', 'Multi-functional'],
        availability: ['Synergie clinics', 'Adore Beauty'],
        australianMade: true
      },
      'rationale_essential_six': {
        name: 'Rationale Essential Six Serum',
        category: 'active',
        price: 180.00,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['normal', 'dry', 'mature'],
        addresses: ['fine_lines_wrinkles', 'dark_spots_hyperpigmentation', 'dryness_dehydration'],
        strength: 'strong',
        brand: 'Rationale',
        size: '30ml',
        conflicts: [],
        activeIngredients: ['vitamin_c', 'peptides', 'antioxidants'],
        requiresExperience: 'advanced',
        benefits: ['6 active ingredients', 'Clinical strength', 'Luxury formulation', 'Australian made'],
        availability: ['Rationale clinics', 'Select retailers'],
        australianMade: true,
        luxury: true
      },
      'sand_and_sky_serum': {
        name: 'Sand & Sky Tasmanian Spring Water Hydration Serum',
        category: 'hydrating',
        price: 49.95,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['all'],
        addresses: ['dryness_dehydration', 'sensitivity_redness'],
        strength: 'gentle',
        brand: 'Sand & Sky',
        size: '30ml',
        conflicts: [],
        activeIngredients: ['hyaluronic_acid', 'tasmanian_spring_water'],
        requiresExperience: 'beginner',
        benefits: ['Tasmanian spring water', 'Lightweight', 'Fast-absorbing', 'Australian made'],
        availability: ['Mecca', 'Adore Beauty', 'Sephora'],
        australianMade: true
      },
      'aspect_dr_vitamin_c': {
        name: 'Aspect Dr Active C Serum',
        category: 'active',
        price: 125.00,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['normal', 'oily', 'combination'],
        addresses: ['dark_spots_hyperpigmentation', 'fine_lines_wrinkles'],
        strength: 'strong',
        brand: 'Aspect Dr',
        size: '30ml',
        conflicts: ['retinoids', 'glycolic_acid'],
        activeIngredients: ['vitamin_c'],
        requiresExperience: 'intermediate',
        benefits: ['L-ascorbic acid', 'Professional grade', 'Brightening', 'Australian made'],
        availability: ['Aspect clinics', 'Professional retailers'],
        australianMade: true,
        morningUse: true
      },

      // ========== AUSTRALIAN MOISTURIZERS ==========
      'qv_cream': {
        name: 'QV Cream',
        category: 'moisturizer',
        price: 12.99,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['dry', 'sensitive', 'eczema'],
        addresses: ['dryness_dehydration', 'sensitivity_redness'],
        strength: 'gentle',
        brand: 'QV',
        size: '100g',
        conflicts: [],
        benefits: ['Fragrance-free', 'Suitable for eczema', 'Dermatologist recommended', 'TGA approved'],
        availability: ['Chemist Warehouse', 'Priceline', 'Pharmacies'],
        australianMade: true,
        tgaApproved: true
      },
      'qv_intensive_moisturiser': {
        name: 'QV Intensive Moisturiser',
        category: 'moisturizer',
        price: 14.99,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['dry', 'very_dry', 'eczema'],
        addresses: ['dryness_dehydration', 'sensitivity_redness'],
        strength: 'gentle',
        brand: 'QV',
        size: '100g',
        conflicts: [],
        benefits: ['Extra rich formula', 'Long-lasting hydration', 'Eczema-friendly', 'Fragrance-free'],
        availability: ['Chemist Warehouse', 'Priceline', 'Pharmacies'],
        australianMade: true,
        tgaApproved: true
      },
      'go_to_face_hero': {
        name: 'Go-To Face Hero',
        category: 'moisturizer',
        price: 45.00,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['normal', 'dry', 'combination'],
        addresses: ['dryness_dehydration'],
        strength: 'gentle',
        brand: 'Go-To',
        size: '60ml',
        conflicts: [],
        activeIngredients: ['hyaluronic_acid'],
        benefits: ['Lightweight texture', 'Hyaluronic acid', 'Australian cult favorite', 'Vegan'],
        availability: ['Mecca', 'Adore Beauty', 'Go-To website'],
        australianMade: true,
        vegan: true
      },
      'synergie_hydrogel': {
        name: 'Synergie Skin HydroGel',
        category: 'moisturizer',
        price: 125.00,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['oily', 'combination', 'acne_prone'],
        addresses: ['dryness_dehydration', 'excess_oil_shine'],
        strength: 'gentle',
        brand: 'Synergie Skin',
        size: '50ml',
        conflicts: [],
        activeIngredients: ['hyaluronic_acid', 'niacinamide'],
        benefits: ['Oil-free hydration', 'Cosmeceutical grade', 'Non-comedogenic', 'Australian made'],
        availability: ['Synergie clinics', 'Adore Beauty'],
        australianMade: true
      },
      'sukin_hydrating_moisturiser': {
        name: 'Sukin Hydrating Facial Moisturiser',
        category: 'moisturizer',
        price: 14.95,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['normal', 'dry'],
        addresses: ['dryness_dehydration'],
        strength: 'gentle',
        brand: 'Sukin',
        size: '125ml',
        conflicts: [],
        benefits: ['Natural ingredients', 'Aloe vera', 'Rosehip oil', 'Vegan'],
        availability: ['Chemist Warehouse', 'Priceline', 'Coles', 'Woolworths'],
        australianMade: true,
        vegan: true
      },
      'frank_body_moisturiser': {
        name: 'Frank Body Moisturizer',
        category: 'moisturizer',
        price: 34.95,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['all'],
        addresses: ['dryness_dehydration'],
        strength: 'gentle',
        brand: 'Frank Body',
        size: '50ml',
        conflicts: [],
        benefits: ['Lightweight', 'Fast-absorbing', 'Australian made', 'Vegan'],
        availability: ['Mecca', 'Adore Beauty', 'Frank Body website'],
        australianMade: true,
        vegan: true
      },

      // ========== AUSTRALIAN SUNSCREENS ==========
      'cancer_council_spf50': {
        name: 'Cancer Council Face Day Wear SPF 50+',
        category: 'sunscreen',
        price: 14.95,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['all'],
        addresses: ['sun_protection'],
        strength: 'gentle',
        brand: 'Cancer Council',
        size: '75ml',
        conflicts: [],
        spf: 50,
        essential: true,
        benefits: ['Broad spectrum', 'Water resistant 4 hours', 'Australian made', 'Cancer Council approved'],
        availability: ['Chemist Warehouse', 'Priceline', 'Woolworths', 'Coles'],
        australianMade: true,
        tgaApproved: true
      },
      'ultra_violette_supreme_screen': {
        name: 'Ultra Violette Supreme Screen SPF 50+',
        category: 'sunscreen',
        price: 46.00,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['all'],
        addresses: ['sun_protection'],
        strength: 'gentle',
        brand: 'Ultra Violette',
        size: '75ml',
        conflicts: [],
        spf: 50,
        essential: true,
        benefits: ['Invisible finish', 'Antioxidants', 'Modern Australian brand', 'Reef-safe'],
        availability: ['Mecca', 'Adore Beauty', 'Sephora'],
        australianMade: true
      },
      'ultra_violette_clean_screen': {
        name: 'Ultra Violette Clean Screen SPF 30',
        category: 'sunscreen',
        price: 46.00,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['sensitive', 'acne_prone'],
        addresses: ['sun_protection', 'sensitivity_redness'],
        strength: 'gentle',
        brand: 'Ultra Violette',
        size: '85ml',
        conflicts: [],
        spf: 30,
        essential: true,
        benefits: ['Fragrance-free', 'Sensitive skin', 'Reef-safe', 'Lightweight'],
        availability: ['Mecca', 'Adore Beauty', 'Sephora'],
        australianMade: true
      },
      'hamilton_everyday_face': {
        name: 'Hamilton Everyday Face SPF 50+',
        category: 'sunscreen',
        price: 19.95,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['sensitive', 'all'],
        addresses: ['sun_protection', 'sensitivity_redness'],
        strength: 'gentle',
        brand: 'Hamilton',
        size: '75ml',
        conflicts: [],
        spf: 50,
        essential: true,
        benefits: ['Fragrance-free', 'Zinc oxide', 'Sensitive skin formula', 'Dermatologist tested'],
        availability: ['Chemist Warehouse', 'Priceline', 'Pharmacies']
      },
      'invisible_zinc_spf50': {
        name: 'Invisible Zinc Face & Body SPF 50+',
        category: 'sunscreen',
        price: 29.95,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['sensitive', 'all'],
        addresses: ['sun_protection'],
        strength: 'gentle',
        brand: 'Invisible Zinc',
        size: '75ml',
        conflicts: [],
        spf: 50,
        essential: true,
        benefits: ['Physical sunscreen', 'No white cast', 'Water resistant', '4 hours protection'],
        availability: ['Chemist Warehouse', 'Priceline', 'Pharmacies'],
        australianMade: true
      },
      'mecca_to_save_face': {
        name: 'Mecca Cosmetica To Save Face SPF 50+',
        category: 'sunscreen',
        price: 40.00,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['all'],
        addresses: ['sun_protection'],
        strength: 'gentle',
        brand: 'Mecca',
        size: '75ml',
        conflicts: [],
        spf: 50,
        essential: true,
        benefits: ['Broad spectrum', 'Lightweight', 'Makeup-friendly', 'Antioxidants'],
        availability: ['Mecca'],
        australianMade: false
      },

      // ========== AUSTRALIAN TREATMENTS & MASKS ==========
      'aesop_blue_chamomile_mask': {
        name: 'Aesop Blue Chamomile Facial Hydrating Masque',
        category: 'treatment',
        price: 72.00,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['dry', 'sensitive', 'normal'],
        addresses: ['dryness_dehydration', 'sensitivity_redness'],
        strength: 'gentle',
        brand: 'Aesop',
        size: '60ml',
        conflicts: [],
        benefits: ['Blue chamomile', 'Intensive hydration', 'Luxury botanical formula', 'Australian made'],
        availability: ['Aesop stores', 'Mecca', 'David Jones'],
        australianMade: true,
        luxury: true,
        weeklyUse: true
      },
      'sand_and_sky_pink_clay_mask': {
        name: 'Sand & Sky Australian Pink Clay Flash Perfection Mask',
        category: 'treatment',
        price: 49.95,
        currency: 'AUD',
        country: 'australia',
        suitableFor: ['normal', 'oily', 'combination'],
        addresses: ['large_pores', 'uneven_texture', 'excess_oil_shine'],
        strength: 'moderate',
        brand: 'Sand & Sky',
        size: '60g',
        conflicts: [],
        benefits: ['Australian pink clay', 'Exfoliating', 'Brightening', 'Instagram-famous'],
        availability: ['Mecca', 'Adore Beauty', 'Sephora'],
        australianMade: true,
        weeklyUse: true
      },
      'go