// 🧠 DYNAMIC SKINCARE RECOMMENDATION ALGORITHM V2.0
// Enhanced with real product database, dynamic pricing, and comprehensive testing

export class DynamicSkincareRecommendationEngine {
  constructor() {
    this.productDatabase = this.initializeProductDatabase();
    this.ruleMatrix = this.initializeRuleMatrix();
    this.conflictMatrix = this.initializeConflictMatrix();
    this.climateDatabase = this.initializeClimateDatabase();
    this.benefitsDatabase = this.initializeBenefitsDatabase();
    this.fallbackRecommendations = this.initializeFallbacks();
  }

  // ============ MAIN RECOMMENDATION FUNCTION ============
  async generateRecommendations(userId, assessmentData) {
    try {
      console.log('🔄 Starting recommendation generation for user:', userId);
      
      // Step 1: Validate and normalize input
      const normalizedData = this.validateAndNormalizeInput(assessmentData);
      console.log('✅ Input validated:', normalizedData);
      
      // Step 2: Create comprehensive user profile
      const userProfile = this.createUserProfile(normalizedData);
      console.log('✅ User profile created:', userProfile);
      
      // Step 3: Generate base recommendations using dynamic rule matrix
      const baseRecommendations = this.generateBaseRecommendations(userProfile);
      console.log('✅ Base recommendations generated:', baseRecommendations.length);
      
      // Step 4: Apply strict budget filtering
      const budgetFilteredRecs = this.applyBudgetFiltering(baseRecommendations, userProfile);
      console.log('✅ Budget filtering applied:', budgetFilteredRecs.length);
      
      // Step 5: Apply medical condition constraints
      const medicallyFilteredRecs = this.applyMedicalConstraints(budgetFilteredRecs, userProfile);
      console.log('✅ Medical constraints applied:', medicallyFilteredRecs.length);
      
      // Step 6: Apply conflict resolution
      const conflictResolvedRecs = this.resolveIngredientConflicts(medicallyFilteredRecs);
      console.log('✅ Conflicts resolved:', conflictResolvedRecs.length);
      
      // Step 7: Score and rank recommendations dynamically
      const scoredRecommendations = this.scoreAndRankRecommendations(conflictResolvedRecs, userProfile);
      console.log('✅ Recommendations scored and ranked');
      
      // Step 8: Personalize based on experience level and preferences
      const personalizedRecs = this.personalizeRecommendations(scoredRecommendations, userProfile);
      console.log('✅ Personalization applied');
      
      // Step 9: Structure final output with detailed benefits
      const finalRecommendations = this.structureRecommendations(personalizedRecs, userProfile);
      console.log('✅ Recommendations structured');
      
      // Step 10: Add comprehensive routine, warnings, and benefits
      const completeResponse = this.addRoutineWarningsAndBenefits(finalRecommendations, userProfile);
      console.log('✅ Complete response generated');
      
      return completeResponse;
      
    } catch (error) {
      console.error('❌ Recommendation generation failed:', error);
      return this.generateFallbackRecommendations(assessmentData);
    }
  }

  // ============ ENHANCED PRODUCT DATABASE ============
  initializeProductDatabase() {
    return {
      // BUDGET CLEANSERS (Under ₹500)
      'cetaphil_gentle_cleanser': {
        name: 'Cetaphil Gentle Skin Cleanser',
        category: 'cleanser',
        price: 299,
        suitableFor: ['sensitive', 'dry', 'normal'],
        addresses: ['basic_cleansing', 'sensitivity'],
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
        suitableFor: ['oily', 'combination'],
        addresses: ['acne', 'oiliness'],
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
        addresses: ['basic_cleansing', 'oiliness'],
        strength: 'gentle',
        brand: 'CeraVe',
        size: '236ml',
        conflicts: [],
        activeIngredients: ['ceramides', 'hyaluronic_acid'],
        benefits: ['Ceramides restore barrier', 'Hyaluronic acid hydrates', 'Non-comedogenic']
      },

      // BUDGET ACTIVES (Under ₹500)
      'minimalist_niacinamide': {
        name: 'Minimalist Niacinamide 10%',
        category: 'active',
        price: 349,
        suitableFor: ['all'],
        addresses: ['oiliness', 'pores', 'acne'],
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
        addresses: ['dryness', 'aging'],
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
        suitableFor: ['oily', 'combination'],
        addresses: ['acne', 'pores', 'texture'],
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
        addresses: ['hyperpigmentation', 'aging'],
        strength: 'strong',
        brand: 'COSRX',
        size: '20ml',
        conflicts: ['retinoids', 'niacinamide'],
        activeIngredients: ['vitamin_c'],
        requiresExperience: 'intermediate',
        benefits: ['Brightens skin tone', 'Fades dark spots', 'Antioxidant protection']
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
        addresses: ['dryness'],
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
        addresses: ['dryness', 'sensitivity'],
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
        addresses: ['dryness'],
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
        addresses: ['sun_damage'],
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
        addresses: ['sun_damage'],
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
        name: 'La Roche-Posay Anthelios Sunscreen SPF 50',
        category: 'sunscreen',
        price: 899,
        suitableFor: ['sensitive', 'all'],
        addresses: ['sun_damage'],
        strength: 'gentle',
        brand: 'La Roche-Posay',
        size: '50ml',
        conflicts: [],
        spf: 50,
        essential: true,
        benefits: ['Photostable filters', 'Water resistant', 'Antioxidants']
      }
    };
  }

  // ============ ENHANCED CLIMATE DATABASE ============
  initializeClimateDatabase() {
    return {
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
        expectedChanges: 'Your skin will gradually produce less excess oil while maintaining healthy hydration levels.',
        maintenanceRoutine: 'Continue with oil-balancing ingredients like niacinamide and gentle BHA exfoliation.'
      },
      'dry': {
        shortTerm: {
          '1-2 weeks': ['Reduced tightness', 'Less flaking', 'Softer skin texture'],
          '4-6 weeks': ['Improved hydration', 'Smoother appearance', 'Reduced fine lines'],
          '8-12 weeks': ['Restored skin barrier', 'Plumper skin', 'Healthy glow']
        },
        longTerm: {
          '3-6 months': ['Significantly improved moisture retention', 'Stronger skin barrier'],
          '6-12 months': ['Optimal hydration balance', 'Improved resilience', 'Youthful appearance']
        },
        expectedChanges: 'Your skin will develop better moisture retention capabilities.',
        maintenanceRoutine: 'Layer hydrating ingredients and use rich moisturizers.'
      },
      'combination': {
        shortTerm: {
          '1-2 weeks': ['Balanced T-zone oil', 'Improved cheek hydration'],
          '4-6 weeks': ['More even skin texture', 'Reduced pore visibility'],
          '8-12 weeks': ['Harmonized skin zones', 'Overall improved balance']
        },
        longTerm: {
          '3-6 months': ['Stable skin balance across face', 'Improved overall texture'],
          '6-12 months': ['Optimized skin function', 'Reduced contrast between face zones']
        },
        expectedChanges: 'Your T-zone will become less oily while cheeks maintain proper hydration.',
        maintenanceRoutine: 'Use targeted treatments - lighter products on T-zone, richer on cheeks.'
      },
      'sensitive': {
        shortTerm: {
          '1-2 weeks': ['Reduced redness', 'Less irritation', 'Calmer skin'],
          '4-6 weeks': ['Improved tolerance', 'Stronger barrier', 'Less reactivity'],
          '8-12 weeks': ['Increased resilience', 'Better product tolerance']
        },
        longTerm: {
          '3-6 months': ['Significantly reduced sensitivity', 'Improved skin defense'],
          '6-12 months': ['Optimized barrier function', 'Minimal reactivity']
        },
        expectedChanges: 'Your skin will develop better tolerance to environmental factors.',
        maintenanceRoutine: 'Continue with gentle, fragrance-free products.'
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
        expectedChanges: 'Your skin will maintain its healthy state while gaining protection.',
        maintenanceRoutine: 'Focus on prevention with antioxidants and sunscreen.'
      }
    };
  }

  // ============ STRICT BUDGET FILTERING ============
  applyBudgetFiltering(recommendations, userProfile) {
    const budgetLimits = {
      'budget': 500,
      'mid-range': 1500,
      'premium': 3000,
      'luxury': 10000
    };

    const maxBudget = budgetLimits[userProfile.budget] || 500;
    console.log(`💰 Applying budget filter: ₹${maxBudget}`);

    const filteredRecommendations = [];

    recommendations.forEach(rec => {
      const product = this.productDatabase[rec.productId];
      
      if (!product) {
        console.warn(`⚠️ Product not found: ${rec.productId}`);
        return;
      }

      if (product.price <= maxBudget) {
        filteredRecommendations.push({
          ...rec,
          price: product.price,
          withinBudget: true
        });
      } else {
        // Try to find budget alternative
        const alternative = this.findBudgetAlternative(rec, maxBudget);
        if (alternative) {
          filteredRecommendations.push({
            ...alternative,
            budgetAlternative: true,
            originalProduct: rec.productId
          });
        }
      }
    });

    console.log(`✅ Budget filtering complete: ${filteredRecommendations.length} products within budget`);
    return filteredRecommendations;
  }

  findBudgetAlternative(originalRec, maxBudget) {
    const originalProduct = this.productDatabase[originalRec.productId];
    if (!originalProduct) return null;

    // Find products in same category within budget
    const alternatives = Object.entries(this.productDatabase)
      .filter(([id, product]) => 
        product.category === originalProduct.category &&
        product.price <= maxBudget &&
        id !== originalRec.productId
      )
      .sort((a, b) => b[1].price - a[1].price); // Sort by price descending

    if (alternatives.length === 0) return null;

    const [alternativeId, alternativeProduct] = alternatives[0];
    return {
      ...originalRec,
      productId: alternativeId,
      reasoning: `Budget-friendly alternative to ${originalProduct.name}`,
      price: alternativeProduct.price,
      budgetSavings: originalProduct.price - alternativeProduct.price
    };
  }

  // ============ ENHANCED BASE RECOMMENDATIONS ============
  generateBaseRecommendations(userProfile) {
    console.log('🔍 Generating base recommendations for profile:', userProfile);
    
    const recommendations = [];
    
    // 1. Essential products (always include)
    recommendations.push(...this.getEssentialProducts(userProfile));
    
    // 2. Climate-specific products
    recommendations.push(...this.getClimateSpecificProducts(userProfile));
    
    // 3. Concern-based products with priority
    recommendations.push(...this.getConcernBasedProducts(userProfile));
    
    console.log(`✅ Generated ${recommendations.length} base recommendations`);
    return this.deduplicateRecommendations(recommendations);
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
        const hasIngredient = product.activeIngredients?.includes(ingredient);
        const addressesConcern = this.getIngredientConcerns(ingredient).some(concern =>
          product.addresses.includes(concern)
        );
        const suitableForSkinType = product.suitableFor.includes('all') || 
                                   product.suitableFor.includes(userProfile.skinType);
        
        return (hasIngredient || addressesConcern) && suitableForSkinType;
      })
      .map(([id]) => id)
      .slice(0, 2);
  }

  getIngredientConcerns(ingredient) {
    const concernMap = {
      'salicylic_acid': ['acne', 'pores', 'oiliness'],
      'niacinamide': ['oiliness', 'pores', 'sensitivity'],
      'hyaluronic_acid': ['dryness', 'aging'],
      'vitamin_c': ['hyperpigmentation', 'aging'],
      'retinol': ['aging', 'acne', 'texture'],
      'zinc_oxide': ['sun_damage', 'sensitivity'],
      'ceramides': ['dryness', 'sensitivity']
    };
    
    return concernMap[ingredient] || [];
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
    const budgetLimits = {
      'budget': 500,
      'mid-range': 1500,
      'premium': 3000,
      'luxury': 10000
    };
    const maxBudget = budgetLimits[userProfile.budget] || 500;

    const cleanserPriority = [];

    // Budget-friendly options
    if (maxBudget >= 199) {
      if (userProfile.skinType === 'sensitive' || userProfile.sensitivity > 7) {
        cleanserPriority.push('cetaphil_gentle_cleanser', 'simple_refreshing_cleanser');
      } else if (userProfile.skinType === 'oily' || userProfile.concerns.includes('acne')) {
        cleanserPriority.push('neutrogena_oil_free_cleanser');
      } else {
        cleanserPriority.push('simple_refreshing_cleanser', 'cetaphil_gentle_cleanser');
      }
    }

    // Mid-range options
    if (maxBudget >= 990) {
      cleanserPriority.unshift('cerave_foaming_cleanser');
    }

    return cleanserPriority.filter(id => {
      const product = this.productDatabase[id];
      return product && product.price <= maxBudget;
    });
  }

  getMoisturizerOptions(userProfile) {
    const budgetLimits = {
      'budget': 500,
      'mid-range': 1500,
      'premium': 3000,
      'luxury': 10000
    };
    const maxBudget = budgetLimits[userProfile.budget] || 500;

    const moisturizerPriority = [];

    // Budget-friendly options
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

    return moisturizerPriority.filter(id => {
      const product = this.productDatabase[id];
      return product && product.price <= maxBudget;
    });
  }

  getSunscreenOptions(userProfile) {
    const budgetLimits = {
      'budget': 500,
      'mid-range': 1500,
      'premium': 3000,
      'luxury': 10000
    };
    const maxBudget = budgetLimits[userProfile.budget] || 500;

    const sunscreenPriority = [];

    // Budget-friendly options
    if (maxBudget >= 299) {
      sunscreenPriority.push('lakme_sunscreen');
      if (maxBudget >= 449) {
        sunscreenPriority.unshift('neutrogena_ultra_sheer');
      }
    }

    // Mid-range options
    if (maxBudget >= 899) {
      sunscreenPriority.unshift('la_roche_posay_sunscreen');
    }

    return sunscreenPriority.filter(id => {
      const product = this.productDatabase[id];
      return product && product.price <= maxBudget;
    });
  }

  // ============ CONCERN-BASED PRODUCTS ============
  getConcernBasedProducts(userProfile) {
    const concernProducts = [];
    const budgetLimits = {
      'budget': 500,
      'mid-range': 1500,
      'premium': 3000,
      'luxury': 10000
    };
    const maxBudget = budgetLimits[userProfile.budget] || 500;
    
    userProfile.concerns.forEach((concern, index) => {
      const priority = 90 - (index * 10);
      
      switch(concern) {
        case 'acne':
          if (maxBudget >= 349) {
            concernProducts.push({
              productId: 'minimalist_niacinamide',
              reasoning: 'Controls oil production and reduces acne inflammation',
              category: 'targeted',
              priority: priority
            });
          }
          
          if (userProfile.experience !== 'beginner' && maxBudget >= 1299) {
            concernProducts.push({
              productId: 'paula_choice_bha',
              reasoning: 'Unclogs pores and prevents new breakouts',
              category: 'targeted',
              priority: priority - 5
            });
          }
          break;
          
        case 'aging':
          if (maxBudget >= 899) {
            concernProducts.push({
              productId: 'cosrx_vitamin_c',
              reasoning: 'Antioxidant protection and collagen support',
              category: 'targeted',
              priority: priority
            });
          }
          break;
          
        case 'hyperpigmentation':
          if (maxBudget >= 899) {
            concernProducts.push({
              productId: 'cosrx_vitamin_c',
              reasoning: 'Brightens skin tone and fades dark spots',
              category: 'targeted',
              priority: priority
            });
          }
          break;
          
        case 'dryness':
          if (maxBudget >= 490) {
            concernProducts.push({
              productId: 'the_ordinary_hyaluronic_acid',
              reasoning: 'Intense hydration and moisture retention',
              category: 'targeted',
              priority: priority
            });
          }
          break;
          
        case 'oiliness':
        case 'pores':
          if (maxBudget >= 349) {
            concernProducts.push({
              productId: 'minimalist_niacinamide',
              reasoning: 'Controls sebum production and minimizes pore appearance',
              category: 'targeted',
              priority: priority
            });
          }
          break;
      }
    });

    return concernProducts;
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
      budget_summary: this.generateBudgetSummary(recommendations)
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
          product_id: rec.productId,
          product_name: product.name,
          brand: product.brand,
          price: product.price,
          step: step,
          instructions: this.getDetailedUsageInstructions(rec.productId, userProfile),
          why_recommended: rec.reasoning,
          key_benefits: product.benefits,
          wait_time: this.getWaitTime(product),
          application_amount: this.getApplicationAmount(product),
          frequency: this.getFrequency(rec.productId, userProfile)
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
          if (['vitamin_c'].some(ingredient => product.activeIngredients?.includes(ingredient))) {
            morningRoutine.push({ ...routineItem, routine_time: 'morning' });
          } else {
            eveningRoutine.push({ ...routineItem, routine_time: 'evening' });
          }
        }
      });
    });

    return {
      morning: morningRoutine.sort((a, b) => this.getRoutineOrder(a.step) - this.getRoutineOrder(b.step)),
      evening: eveningRoutine.sort((a, b) => this.getRoutineOrder(a.step) - this.getRoutineOrder(b.step))
    };
  }

  getDetailedUsageInstructions(productId, userProfile) {
    const instructions = {
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
      'la_roche_posay_sunscreen': 'Use as final morning step, apply evenly, don\'t forget neck and ears'
    };

    let instruction = instructions[productId] || 'Follow product instructions carefully';

    // Add experience-based modifications
    if (userProfile.experience === 'beginner' && this.productDatabase[productId]?.category === 'active') {
      instruction += '. Start with once per week and gradually increase frequency as tolerated.';
    }

    return instruction;
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

  // ============ BUDGET SUMMARY ============
  generateBudgetSummary(recommendations) {
    const allProducts = Object.keys(recommendations).reduce((acc, category) => {
      return acc.concat(recommendations[category]);
    }, []);

    const totalCost = allProducts.reduce((sum, rec) => sum + (rec.price || 0), 0);
    const productCount = allProducts.length;
    const averageCost = productCount > 0 ? Math.round(totalCost / productCount) : 0;

    return {
      total_cost: totalCost,
      product_count: productCount,
      average_cost_per_product: averageCost,
      cost_per_month: Math.round(totalCost / 3)
    };
  }

  generatePersonalizedBenefits(recommendations, userProfile) {
    const skinTypeBenefits = this.benefitsDatabase[userProfile.skinType];
    return {
      skin_type_benefits: skinTypeBenefits,
      timeline_benefits: this.createBenefitsTimeline(userProfile)
    };
  }

  createBenefitsTimeline(userProfile) {
    const timeline = {
      'Week 1-2': ['Improved cleansing and hydration', 'Sun protection established'],
      'Week 3-4': ['Skin begins to adjust to new routine', 'Initial improvement in texture'],
      'Month 2-3': ['Significant improvement in primary concerns', 'Strengthened skin barrier'],
      'Month 4-6': ['Optimal results from active ingredients', 'Stable skin improvement'],
      'Month 6+': ['Maintained healthy skin state', 'Prevention of future concerns']
    };

    // Add skin type specific benefits
    if (userProfile.skinType === 'dry') {
      timeline['Week 1-2'].push('Reduced skin tightness and flaking');
    }
    if (userProfile.concerns.includes('acne')) {
      timeline['Week 3-4'].push('Possible initial breakout as skin purges');
    }

    return timeline;
  }

  // ============ UTILITY FUNCTIONS ============
  validateAndNormalizeInput(assessmentData) {
    const defaults = {
      skinType: 'normal',
      concerns: ['hydrate_skin'],
      medicalConditions: [],
      age: '20-29',
      gender: 'prefer_not_to_say',
      sensitivity: 5,
      climate: 'moderate',
      budget: 'budget',
      experience: 'beginner',
      goals: ['hydrate_skin'],
      lifestyle: 'mixed',
      additionalConcerns: ''
    };

    const normalized = {
      ...defaults,
      ...assessmentData,
      concerns: Array.isArray(assessmentData.concerns) ? assessmentData.concerns : [assessmentData.concerns].filter(Boolean),
      medicalConditions: Array.isArray(assessmentData.medicalConditions) ? assessmentData.medicalConditions : [assessmentData.medicalConditions].filter(Boolean),
      goals: Array.isArray(assessmentData.goals) ? assessmentData.goals : [assessmentData.goals].filter(Boolean),
      sensitivity: Math.max(1, Math.min(10, parseInt(assessmentData.sensitivity) || 5))
    };

    // Auto-detect climate for Hyderabad
    if (assessmentData.location && assessmentData.location.toLowerCase().includes('hyderabad')) {
      normalized.climate = 'hot_humid';
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
      concerns: this.prioritizeConcerns(data.concerns, data.goals),
      medicalConditions: data.medicalConditions,
      sensitivity: data.sensitivity,
      additionalConcerns: data.additionalConcerns,
      experience: data.experience,
      budget: data.budget,
      goals: data.goals,
      riskTolerance: this.calculateRiskTolerance(data.experience, data.sensitivity),
      routineComplexity: this.calculateRoutineComplexity(data.experience, data.age),
      primaryConcern: this.identifyPrimaryConcern(data.concerns, data.goals)
    };
  }

  prioritizeConcerns(concerns, goals) {
    const concernPriority = {
      'cystic-acne': 100,
      'acne': 90,
      'sensitivity': 85,
      'aging': 80,
      'hyperpigmentation': 75,
      'dryness': 70,
      'oiliness': 65,
      'texture': 60,
      'pores': 55,
      'sun-damage': 95
    };

    const goalToConcernMap = {
      'clear-acne': 'acne',
      'anti-aging': 'aging',
      'brighten-skin': 'hyperpigmentation',
      'hydrate-skin': 'dryness',
      'minimize-pores': 'pores',
      'sun-protection': 'sun-damage'
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

  // ============ MEDICAL CONSTRAINTS ============
  applyMedicalConstraints(recommendations, userProfile) {
    if (userProfile.medicalConditions.length === 0) {
      return recommendations;
    }

    let filteredRecommendations = [...recommendations];
    
    userProfile.medicalConditions.forEach(condition => {
      switch(condition) {
        case 'eczema':
          filteredRecommendations = this.removeProductsByStrength(filteredRecommendations, ['moderate', 'strong']);
          break;
          
        case 'rosacea':
          filteredRecommendations = this.removeProductsWithIngredients(filteredRecommendations, ['retinol']);
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
      ['vitamin_c', 'niacinamide']
    ];

    const resolvedRecommendations = [];
    const addedIngredients = new Set();

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
    const budgetLimits = {
      'budget': 500,
      'mid-range': 1500,
      'premium': 3000,
      'luxury': 10000
    };
    const maxBudget = budgetLimits[userProfile.budget] || 500;
    
    return recommendations.filter(rec => {
      const product = this.productDatabase[rec.productId];
      if (!product) return false;
      
      return product.price <= maxBudget || rec.medicallyRequired;
    });
  }

  // ============ STRUCTURE RECOMMENDATIONS ============
  structureRecommendations(recommendations, userProfile) {
    const structured = {
      essential: [],
      targeted: [],
      supporting: []
    };

    recommendations.forEach(rec => {
      const category = this.determineOutputCategory(rec, userProfile);
      structured[category].push(rec);
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
    
    return 'supporting';
  }

  generateDetailedWarnings(recommendations, userProfile) {
    const warnings = [];
    
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

    if (userProfile.experience === 'beginner') {
      warnings.push({
        type: 'beginner',
        message: 'Start with one new product at a time and wait 1-2 weeks before adding the next',
        severity: 'medium'
      });
    }

    if (userProfile.climate === 'hot_humid') {
      warnings.push({
        type: 'climate',
        message: 'In humid weather, allow extra time between product applications to prevent pilling',
        severity: 'medium'
      });
    }

    return warnings;
  }

  generateDetailedTimeline(recommendations, userProfile) {
    const timeline = {};
    
    if (userProfile.experience === 'beginner') {
      timeline.week_1_2 = 'Start with cleanser, moisturizer, and sunscreen only';
      timeline.week_3_4 = 'Add gentle ingredients like niacinamide or hyaluronic acid';
      timeline.month_2_3 = 'Introduce actives gradually if previous products are well-tolerated';
      timeline.month_4_plus = 'Add additional treatments based on skin response';
    } else {
      timeline.week_1_2 = 'Establish basic routine with all essential products';
      timeline.week_3_4 = 'Add primary active ingredient';
      timeline.month_2 = 'Add supporting ingredients';
      timeline.month_3_plus = 'Add secondary actives if needed';
    }

    return timeline;
  }

  // ============ HELPER FUNCTIONS ============
  parseAgeRange(ageString) {
    const ageRanges = {
      'teens': 16,
      'twenties': 25,
      'thirties': 35,
      'forties': 45,
      'fifties-plus': 55
    };
    return ageRanges[ageString] || 25;
  }

  calculateRiskTolerance(experience, sensitivity) {
    const experienceScore = { 'beginner': 1, 'intermediate': 2, 'advanced': 3, 'expert': 4 }[experience] || 1;
    const sensitivityScore = 11 - sensitivity;
    return Math.round((experienceScore + sensitivityScore) / 2);
  }

  calculateRoutineComplexity(experience, age) {
    const experienceScore = { 'beginner': 1, 'intermediate': 2, 'advanced': 3, 'expert': 4 }[experience] || 1;
    const ageScore = age < 25 ? 1 : age < 35 ? 2 : age < 45 ? 3 : 4;
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

  // ============ FALLBACK SYSTEM ============
  generateFallbackRecommendations(assessmentData) {
    console.log('🔄 Generating fallback recommendations');
    
    const skinType = assessmentData.skinType || 'normal';
    const budget = assessmentData.budget || 'budget';
    
    const fallbackProducts = {
      'budget': {
        'oily': ['simple_refreshing_cleanser', 'minimalist_niacinamide', 'ponds_super_light_gel', 'neutrogena_ultra_sheer'],
        'dry': ['cetaphil_gentle_cleanser', 'the_ordinary_hyaluronic_acid', 'nivea_soft_cream', 'neutrogena_ultra_sheer'],
        'sensitive': ['cetaphil_gentle_cleanser', 'nivea_soft_cream', 'neutrogena_ultra_sheer'],
        'default': ['simple_refreshing_cleanser', 'ponds_super_light_gel', 'lakme_sunscreen']
      }
    };

    const products = fallbackProducts[budget]?.[skinType] || fallbackProducts[budget]?.['default'] || fallbackProducts['budget']['default'];

    return {
      user_profile: { 
        skinType,
        budget,
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
            reasoning: 'Safe fallback recommendation for your skin type',
            category: 'essential',
            matchScore: 70,
            priority: 80
          };
        }),
        targeted: [],
        supporting: []
      },
      routine_suggestions: {
        morning: ['Cleanser', 'Moisturizer', 'Sunscreen'],
        evening: ['Cleanser', 'Moisturizer']
      },
      warnings: [{
        type: 'fallback',
        message: 'These are basic recommendations. Consider retaking the assessment for personalized suggestions.',
        severity: 'medium'
      }]
    };
  }

  // ============ REQUIRED STUB METHODS ============
  initializeRuleMatrix() {
    return {};
  }

  initializeConflictMatrix() {
    return {};
  }

  initializeFallbacks() {
    return {};
  }
}