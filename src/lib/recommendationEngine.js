// 🧠 ADVANCED SKINCARE RECOMMENDATION ALGORITHM
// Comprehensive system handling all assessment criteria with fallback mechanisms

export class SkincareRecommendationEngine {
  constructor() {
    this.ingredientDatabase = this.initializeIngredientDatabase();
    this.ruleMatrix = this.initializeRuleMatrix();
    this.conflictMatrix = this.initializeConflictMatrix();
    this.fallbackRecommendations = this.initializeFallbacks();
  }

  // ============ MAIN RECOMMENDATION FUNCTION ============
  async generateRecommendations(userId, assessmentData) {
    try {
      // Step 1: Validate and normalize input
      const normalizedData = this.validateAndNormalizeInput(assessmentData);
      
      // Step 2: Create comprehensive user profile
      const userProfile = this.createUserProfile(normalizedData);
      
      // Step 3: Generate base recommendations using rule matrix
      const baseRecommendations = this.generateBaseRecommendations(userProfile);
      
      // Step 4: Apply medical condition constraints
      const medicallyFilteredRecs = this.applyMedicalConstraints(baseRecommendations, userProfile);
      
      // Step 5: Apply conflict resolution
      const conflictResolvedRecs = this.resolveIngredientConflicts(medicallyFilteredRecs);
      
      // Step 6: Score and rank recommendations
      const scoredRecommendations = this.scoreAndRankRecommendations(conflictResolvedRecs, userProfile);
      
      // Step 7: Personalize based on experience level and budget
      const personalizedRecs = this.personalizeRecommendations(scoredRecommendations, userProfile);
      
      // Step 8: Structure final output
      const finalRecommendations = this.structureRecommendations(personalizedRecs, userProfile);
      
      // Step 9: Add routine suggestions and warnings
      const completeResponse = this.addRoutineAndWarnings(finalRecommendations, userProfile);
      
      return completeResponse;
      
    } catch (error) {
      console.error('Recommendation generation failed:', error);
      return this.generateFallbackRecommendations(assessmentData);
    }
  }

  // ============ INPUT VALIDATION & NORMALIZATION ============
  validateAndNormalizeInput(assessmentData) {
    const defaults = {
      skinType: 'normal',
      concerns: ['hydrate_skin'],
      medicalConditions: [],
      age: '20-29',
      gender: 'prefer_not_to_say',
      sensitivity: 5,
      climate: 'moderate',
      budget: 'mid-range',
      experience: 'beginner',
      goals: ['hydrate_skin'],
      lifestyle: 'mixed',
      additionalConcerns: ''
    };

    return {
      ...defaults,
      ...assessmentData,
      // Normalize arrays
      concerns: Array.isArray(assessmentData.concerns) ? assessmentData.concerns : [assessmentData.concerns].filter(Boolean),
      medicalConditions: Array.isArray(assessmentData.medicalConditions) ? assessmentData.medicalConditions : [assessmentData.medicalConditions].filter(Boolean),
      goals: Array.isArray(assessmentData.goals) ? assessmentData.goals : [assessmentData.goals].filter(Boolean),
      // Normalize sensitivity to 1-10 scale
      sensitivity: Math.max(1, Math.min(10, parseInt(assessmentData.sensitivity) || 5))
    };
  }

  // ============ USER PROFILE CREATION ============
  createUserProfile(data) {
    return {
      // Basic demographics
      skinType: data.skinType,
      age: this.parseAgeRange(data.age),
      gender: data.gender,
      climate: data.climate,
      lifestyle: data.lifestyle,
      
      // Skin analysis
      concerns: this.prioritizeConcerns(data.concerns, data.goals),
      medicalConditions: data.medicalConditions,
      sensitivity: data.sensitivity,
      additionalConcerns: data.additionalConcerns,
      
      // Personalization factors
      experience: data.experience,
      budget: this.parseBudgetRange(data.budget),
      goals: data.goals,
      
      // Derived attributes
      riskTolerance: this.calculateRiskTolerance(data.experience, data.sensitivity),
      routineComplexity: this.calculateRoutineComplexity(data.experience, data.age),
      primaryConcern: this.identifyPrimaryConcern(data.concerns, data.goals),
      
      // Flags
      isPregnant: false, // Would be additional question
      isNursing: false,  // Would be additional question
      hasHormonalIssues: this.detectHormonalIssues(data.medicalConditions, data.age, data.gender)
    };
  }

  // ============ CONCERN PRIORITIZATION ============
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
      'sun-damage': 95 // Always high priority
    };

    // Map goals to concerns
    const goalToConcernMap = {
      'clear-acne': 'acne',
      'anti-aging': 'aging',
      'brighten-skin': 'hyperpigmentation',
      'hydrate-skin': 'dryness',
      'minimize-pores': 'pores',
      'sun-protection': 'sun-damage'
    };

    // Combine concerns and goals
    const allConcerns = [...concerns];
    goals.forEach(goal => {
      if (goalToConcernMap[goal] && !allConcerns.includes(goalToConcernMap[goal])) {
        allConcerns.push(goalToConcernMap[goal]);
      }
    });

    // Sort by priority
    return allConcerns.sort((a, b) => 
      (concernPriority[b] || 0) - (concernPriority[a] || 0)
    );
  }

  // ============ INGREDIENT DATABASE ============
  initializeIngredientDatabase() {
    return {
      // CLEANSERS
      'gentle_cleanser': {
        category: 'cleanser',
        suitableFor: ['sensitive', 'dry', 'normal'],
        addresses: ['basic_cleansing'],
        strength: 'gentle',
        priceRange: [300, 1200],
        pH: 5.5,
        conflicts: []
      },
      'salicylic_acid_cleanser': {
        category: 'cleanser',
        suitableFor: ['oily', 'combination'],
        addresses: ['acne', 'oiliness', 'pores'],
        strength: 'moderate',
        priceRange: [500, 2000],
        conflicts: ['retinoids', 'benzoyl_peroxide'],
        requiresExperience: 'beginner'
      },

      // ACTIVES
      'retinol': {
        category: 'active',
        suitableFor: ['normal', 'oily', 'combination'],
        addresses: ['aging', 'acne', 'texture'],
        strength: 'strong',
        priceRange: [800, 3000],
        conflicts: ['benzoyl_peroxide', 'vitamin_c', 'aha_bha'],
        requiresExperience: 'intermediate',
        contraindications: ['pregnancy', 'nursing', 'severe_sensitivity']
      },
      'niacinamide': {
        category: 'active',
        suitableFor: ['all'],
        addresses: ['oiliness', 'pores', 'sensitivity', 'acne'],
        strength: 'gentle',
        priceRange: [400, 1500],
        conflicts: ['vitamin_c_high_concentration'],
        requiresExperience: 'beginner'
      },
      'vitamin_c': {
        category: 'active',
        suitableFor: ['normal', 'dry', 'oily'],
        addresses: ['hyperpigmentation', 'aging', 'sun-damage'],
        strength: 'moderate',
        priceRange: [600, 2500],
        conflicts: ['retinoids', 'niacinamide_high_concentration'],
        requiresExperience: 'intermediate'
      },
      'salicylic_acid': {
        category: 'active',
        suitableFor: ['oily', 'combination'],
        addresses: ['acne', 'oiliness', 'pores', 'texture'],
        strength: 'moderate',
        priceRange: [500, 2000],
        conflicts: ['retinoids', 'benzoyl_peroxide'],
        requiresExperience: 'beginner'
      },
      'hyaluronic_acid': {
        category: 'hydrating',
        suitableFor: ['all'],
        addresses: ['dryness', 'aging'],
        strength: 'gentle',
        priceRange: [400, 1800],
        conflicts: [],
        requiresExperience: 'beginner'
      },

      // MOISTURIZERS
      'lightweight_moisturizer': {
        category: 'moisturizer',
        suitableFor: ['oily', 'combination', 'normal'],
        addresses: ['basic_hydration'],
        strength: 'gentle',
        priceRange: [300, 1500],
        conflicts: []
      },
      'rich_moisturizer': {
        category: 'moisturizer',
        suitableFor: ['dry', 'sensitive'],
        addresses: ['dryness', 'sensitivity'],
        strength: 'gentle',
        priceRange: [500, 2500],
        conflicts: []
      },

      // SUNSCREENS
      'mineral_sunscreen': {
        category: 'sunscreen',
        suitableFor: ['sensitive', 'all'],
        addresses: ['sun-damage'],
        strength: 'gentle',
        priceRange: [400, 2000],
        conflicts: [],
        essential: true
      },
      'chemical_sunscreen': {
        category: 'sunscreen',
        suitableFor: ['normal', 'oily', 'combination'],
        addresses: ['sun-damage'],
        strength: 'moderate',
        priceRange: [300, 1800],
        conflicts: []
      },

      // SPECIALIZED TREATMENTS
      'azelaic_acid': {
        category: 'active',
        suitableFor: ['sensitive', 'combination'],
        addresses: ['acne', 'sensitivity', 'hyperpigmentation'],
        strength: 'gentle',
        priceRange: [800, 2500],
        conflicts: [],
        requiresExperience: 'intermediate'
      },
      'ceramide_cream': {
        category: 'treatment',
        suitableFor: ['dry', 'sensitive'],
        addresses: ['dryness', 'sensitivity'],
        strength: 'gentle',
        priceRange: [600, 2800],
        conflicts: []
      }
    };
  }

  // ============ RULE MATRIX INITIALIZATION ============
  initializeRuleMatrix() {
    return {
      // SKIN TYPE RULES
      skinType: {
        'oily': {
          recommended: ['salicylic_acid_cleanser', 'niacinamide', 'lightweight_moisturizer', 'salicylic_acid'],
          avoid: ['rich_moisturizer', 'heavy_oils'],
          priorityConcerns: ['oiliness', 'pores', 'acne']
        },
        'dry': {
          recommended: ['gentle_cleanser', 'hyaluronic_acid', 'rich_moisturizer', 'ceramide_cream'],
          avoid: ['salicylic_acid_cleanser', 'alcohol_based_products'],
          priorityConcerns: ['dryness', 'sensitivity']
        },
        'combination': {
          recommended: ['gentle_cleanser', 'niacinamide', 'lightweight_moisturizer', 'salicylic_acid'],
          avoid: ['rich_moisturizer_all_over'],
          priorityConcerns: ['oiliness', 'pores', 'texture']
        },
        'sensitive': {
          recommended: ['gentle_cleanser', 'niacinamide', 'mineral_sunscreen', 'azelaic_acid'],
          avoid: ['retinoids', 'high_concentration_actives', 'fragrance'],
          priorityConcerns: ['sensitivity', 'basic_care']
        },
        'normal': {
          recommended: ['gentle_cleanser', 'vitamin_c', 'lightweight_moisturizer', 'retinol'],
          avoid: [],
          priorityConcerns: ['prevention', 'maintenance']
        }
      },

      // MEDICAL CONDITION RULES
      medicalConditions: {
        'eczema': {
          required: ['gentle_cleanser', 'ceramide_cream', 'mineral_sunscreen'],
          avoid: ['all_actives', 'fragrance', 'alcohol'],
          modifications: { sensitivity: 10 }
        },
        'rosacea': {
          required: ['gentle_cleanser', 'azelaic_acid', 'mineral_sunscreen'],
          avoid: ['retinoids', 'alcohol', 'menthol', 'high_concentration_actives'],
          modifications: { sensitivity: 9 }
        },
        'cystic-acne': {
          required: ['medical_consultation_note'],
          recommended: ['gentle_cleanser', 'niacinamide'],
          avoid: ['harsh_scrubs', 'over_drying_products'],
          modifications: { requiresProfessional: true }
        },
        'psoriasis': {
          required: ['gentle_cleanser', 'rich_moisturizer'],
          avoid: ['salicylic_acid', 'retinoids'],
          modifications: { sensitivity: 8 }
        },
        'melasma': {
          required: ['mineral_sunscreen', 'vitamin_c'],
          recommended: ['azelaic_acid', 'niacinamide'],
          avoid: ['retinoids_without_supervision'],
          modifications: { sunProtectionCritical: true }
        }
      },

      // AGE-BASED RULES
      age: {
        'teen': {
          focus: ['acne_prevention', 'gentle_care', 'sun_protection'],
          avoid: ['anti_aging_actives', 'complex_routines'],
          maxProducts: 4
        },
        'twenties': {
          focus: ['prevention', 'acne_management', 'sun_protection'],
          recommended: ['vitamin_c', 'niacinamide', 'retinol_introduction'],
          maxProducts: 6
        },
        'thirties': {
          focus: ['early_aging_prevention', 'maintenance'],
          recommended: ['retinol', 'vitamin_c', 'hyaluronic_acid'],
          maxProducts: 8
        },
        'forties_plus': {
          focus: ['anti_aging', 'intensive_care'],
          recommended: ['retinol', 'vitamin_c', 'rich_moisturizer'],
          maxProducts: 10
        }
      },

      // EXPERIENCE LEVEL RULES
      experience: {
        'beginner': {
          maxActives: 1,
          recommended: ['gentle_cleanser', 'niacinamide', 'hyaluronic_acid'],
          avoid: ['retinoids', 'high_concentration_actives'],
          introductionPeriod: 'gradual'
        },
        'intermediate': {
          maxActives: 2,
          recommended: ['retinol', 'vitamin_c', 'salicylic_acid'],
          avoid: ['professional_grade_actives'],
          introductionPeriod: 'moderate'
        },
        'advanced': {
          maxActives: 3,
          recommended: ['multiple_actives', 'targeted_treatments'],
          avoid: [],
          introductionPeriod: 'fast'
        }
      }
    };
  }

  // ============ CONFLICT MATRIX ============
  initializeConflictMatrix() {
    return {
      'retinoids': ['vitamin_c', 'benzoyl_peroxide', 'salicylic_acid'],
      'vitamin_c': ['retinoids', 'niacinamide_high_concentration'],
      'salicylic_acid': ['retinoids', 'benzoyl_peroxide'],
      'benzoyl_peroxide': ['retinoids', 'salicylic_acid'],
      'niacinamide': ['vitamin_c_high_concentration']
    };
  }

  // ============ BASE RECOMMENDATIONS GENERATION ============
  generateBaseRecommendations(userProfile) {
    const recommendations = [];
    
    // 1. Essential products (always include)
    recommendations.push(...this.getEssentialProducts(userProfile));
    
    // 2. Skin type specific products
    recommendations.push(...this.getSkinTypeProducts(userProfile));
    
    // 3. Concern-based products
    recommendations.push(...this.getConcernBasedProducts(userProfile));
    
    // 4. Age-appropriate products
    recommendations.push(...this.getAgeBasedProducts(userProfile));
    
    // 5. Climate-specific adjustments
    recommendations.push(...this.getClimateProducts(userProfile));
    
    return this.deduplicateRecommendations(recommendations);
  }

  getEssentialProducts(userProfile) {
    const essentials = [];
    
    // Cleanser - always needed
    if (userProfile.skinType === 'sensitive' || userProfile.sensitivity > 7) {
      essentials.push({
        ingredient: 'gentle_cleanser',
        reasoning: 'Essential gentle daily cleanser suitable for sensitive skin',
        category: 'essential',
        priority: 100
      });
    } else if (userProfile.skinType === 'oily' || userProfile.concerns.includes('acne')) {
      essentials.push({
        ingredient: 'salicylic_acid_cleanser',
        reasoning: 'BHA cleanser to control oil and prevent breakouts',
        category: 'essential',
        priority: 95
      });
    } else {
      essentials.push({
        ingredient: 'gentle_cleanser',
        reasoning: 'Essential daily cleanser for healthy skin maintenance',
        category: 'essential',
        priority: 90
      });
    }

    // Moisturizer - always needed
    if (userProfile.skinType === 'dry' || userProfile.climate === 'cold') {
      essentials.push({
        ingredient: 'rich_moisturizer',
        reasoning: 'Rich moisturizer for dry skin and harsh climate protection',
        category: 'essential',
        priority: 95
      });
    } else {
      essentials.push({
        ingredient: 'lightweight_moisturizer',
        reasoning: 'Daily moisturizer for hydration without heaviness',
        category: 'essential',
        priority: 90
      });
    }

    // Sunscreen - always essential
    essentials.push({
      ingredient: 'mineral_sunscreen',
      reasoning: 'Daily sun protection to prevent aging and damage',
      category: 'essential',
      priority: 100
    });

    return essentials;
  }

  getConcernBasedProducts(userProfile) {
    const concernProducts = [];
    
    userProfile.concerns.forEach((concern, index) => {
      const priority = 90 - (index * 10); // Decreasing priority
      
      switch(concern) {
        case 'acne':
          if (userProfile.experience !== 'beginner') {
            concernProducts.push({
              ingredient: 'salicylic_acid',
              reasoning: 'BHA to unclog pores and reduce breakouts',
              category: 'targeted',
              priority: priority
            });
          }
          concernProducts.push({
            ingredient: 'niacinamide',
            reasoning: 'Regulates oil production and reduces inflammation',
            category: 'targeted',
            priority: priority - 5
          });
          break;
          
        case 'aging':
          if (userProfile.experience !== 'beginner' && userProfile.age > 25) {
            concernProducts.push({
              ingredient: 'retinol',
              reasoning: 'Gold standard for anti-aging and skin renewal',
              category: 'targeted',
              priority: priority
            });
          }
          concernProducts.push({
            ingredient: 'vitamin_c',
            reasoning: 'Antioxidant protection and collagen support',
            category: 'targeted',
            priority: priority - 5
          });
          break;
          
        case 'hyperpigmentation':
          concernProducts.push({
            ingredient: 'vitamin_c',
            reasoning: 'Brightens skin and fades dark spots',
            category: 'targeted',
            priority: priority
          });
          if (userProfile.sensitivity <= 6) {
            concernProducts.push({
              ingredient: 'azelaic_acid',
              reasoning: 'Gentle yet effective for hyperpigmentation',
              category: 'targeted',
              priority: priority - 5
            });
          }
          break;
          
        case 'dryness':
          concernProducts.push({
            ingredient: 'hyaluronic_acid',
            reasoning: 'Intense hydration and moisture retention',
            category: 'targeted',
            priority: priority
          });
          concernProducts.push({
            ingredient: 'ceramide_cream',
            reasoning: 'Repairs and strengthens skin barrier',
            category: 'supporting',
            priority: priority - 10
          });
          break;
          
        case 'sensitivity':
          concernProducts.push({
            ingredient: 'niacinamide',
            reasoning: 'Calms inflammation and reduces redness',
            category: 'targeted',
            priority: priority
          });
          if (userProfile.medicalConditions.includes('rosacea')) {
            concernProducts.push({
              ingredient: 'azelaic_acid',
              reasoning: 'Specifically effective for rosacea and sensitive skin',
              category: 'targeted',
              priority: priority + 5
            });
          }
          break;
          
        case 'oiliness':
          concernProducts.push({
            ingredient: 'niacinamide',
            reasoning: 'Controls sebum production and minimizes shine',
            category: 'targeted',
            priority: priority
          });
          if (userProfile.experience !== 'beginner') {
            concernProducts.push({
              ingredient: 'salicylic_acid',
              reasoning: 'Deep cleanses pores and controls oil',
              category: 'targeted',
              priority: priority - 5
            });
          }
          break;
          
        case 'pores':
          concernProducts.push({
            ingredient: 'niacinamide',
            reasoning: 'Minimizes pore appearance and refines texture',
            category: 'targeted',
            priority: priority
          });
          if (userProfile.experience !== 'beginner') {
            concernProducts.push({
              ingredient: 'salicylic_acid',
              reasoning: 'Clears pores and improves texture',
              category: 'targeted',
              priority: priority - 5
            });
          }
          break;
      }
    });

    return concernProducts;
  }

  // ============ MEDICAL CONSTRAINTS APPLICATION ============
  applyMedicalConstraints(recommendations, userProfile) {
    if (userProfile.medicalConditions.length === 0) {
      return recommendations;
    }

    const constraints = this.ruleMatrix.medicalConditions;
    const filteredRecommendations = [...recommendations];

    userProfile.medicalConditions.forEach(condition => {
      if (constraints[condition]) {
        const { required, avoid } = constraints[condition];
        
        // Remove avoided ingredients
        if (avoid) {
          avoid.forEach(avoidIngredient => {
            const index = filteredRecommendations.findIndex(rec => 
              rec.ingredient === avoidIngredient || 
              this.ingredientDatabase[rec.ingredient]?.category === avoidIngredient
            );
            if (index !== -1) {
              filteredRecommendations.splice(index, 1);
            }
          });
        }
        
        // Add required ingredients
        if (required) {
          required.forEach(requiredIngredient => {
            const exists = filteredRecommendations.some(rec => rec.ingredient === requiredIngredient);
            if (!exists) {
              filteredRecommendations.push({
                ingredient: requiredIngredient,
                reasoning: `Required for ${condition} management`,
                category: 'essential',
                priority: 100,
                medicallyRequired: true
              });
            }
          });
        }
      }
    });

    return filteredRecommendations;
  }

  // ============ CONFLICT RESOLUTION ============
  resolveIngredientConflicts(recommendations) {
    const conflictMatrix = this.conflictMatrix;
    const resolvedRecommendations = [];
    const addedIngredients = new Set();

    // Sort by priority (highest first)
    const sortedRecommendations = recommendations.sort((a, b) => b.priority - a.priority);

    for (const recommendation of sortedRecommendations) {
      const ingredient = recommendation.ingredient;
      const ingredientData = this.ingredientDatabase[ingredient];
      
      if (!ingredientData) continue;

      let hasConflict = false;
      
      // Check for conflicts with already added ingredients
      for (const addedIngredient of addedIngredients) {
        if (this.hasConflict(ingredient, addedIngredient)) {
          hasConflict = true;
          break;
        }
      }

      if (!hasConflict) {
        resolvedRecommendations.push(recommendation);
        addedIngredients.add(ingredient);
      } else {
        // Try to find alternative
        const alternative = this.findAlternativeIngredient(ingredient, addedIngredients);
        if (alternative) {
          resolvedRecommendations.push({
            ...recommendation,
            ingredient: alternative.ingredient,
            reasoning: alternative.reasoning + ' (alternative due to ingredient conflict)'
          });
          addedIngredients.add(alternative.ingredient);
        }
      }
    }

    return resolvedRecommendations;
  }

  hasConflict(ingredient1, ingredient2) {
    const conflicts1 = this.conflictMatrix[ingredient1] || [];
    const conflicts2 = this.conflictMatrix[ingredient2] || [];
    
    return conflicts1.includes(ingredient2) || conflicts2.includes(ingredient1);
  }

  // ============ SCORING AND RANKING ============
  scoreAndRankRecommendations(recommendations, userProfile) {
    return recommendations.map(rec => {
      const score = this.calculateIngredientScore(rec, userProfile);
      return {
        ...rec,
        matchScore: score,
        finalPriority: rec.priority + (score * 0.3) // Blend rule priority with match score
      };
    }).sort((a, b) => b.finalPriority - a.finalPriority);
  }

  calculateIngredientScore(recommendation, userProfile) {
    const ingredient = this.ingredientDatabase[recommendation.ingredient];
    if (!ingredient) return 0;

    let score = 0;
    let maxScore = 0;

    // 1. Skin Type Compatibility (30%)
    const skinTypeScore = this.getSkinTypeCompatibility(ingredient, userProfile.skinType);
    score += skinTypeScore * 0.3;
    maxScore += 100 * 0.3;

    // 2. Concern Addressing (40%)
    const concernScore = this.getConcernEffectiveness(ingredient, userProfile.concerns);
    score += concernScore * 0.4;
    maxScore += 100 * 0.4;

    // 3. Safety/Sensitivity (20%)
    const safetyScore = this.getSafetyScore(ingredient, userProfile.sensitivity);
    score += safetyScore * 0.2;
    maxScore += 100 * 0.2;

    // 4. Experience Level (10%)
    const experienceScore = this.getExperienceCompatibility(ingredient, userProfile.experience);
    score += experienceScore * 0.1;
    maxScore += 100 * 0.1;

    return Math.round((score / maxScore) * 100);
  }

  getSkinTypeCompatibility(ingredient, skinType) {
    if (ingredient.suitableFor.includes('all') || ingredient.suitableFor.includes(skinType)) {
      return 100;
    }
    
    // Partial compatibility scoring
    const compatibilityMatrix = {
      'oily': { 'combination': 70, 'normal': 50, 'dry': 20, 'sensitive': 30 },
      'dry': { 'normal': 60, 'sensitive': 80, 'combination': 40, 'oily': 20 },
      'combination': { 'normal': 80, 'oily': 70, 'dry': 50, 'sensitive': 40 },
      'sensitive': { 'dry': 70, 'normal': 60, 'combination': 40, 'oily': 30 },
      'normal': { 'combination': 80, 'oily': 60, 'dry': 60, 'sensitive': 50 }
    };

    const bestMatch = ingredient.suitableFor.reduce((best, suitable) => {
      const score = compatibilityMatrix[skinType]?.[suitable] || 0;
      return score > best ? score : best;
    }, 0);

    return bestMatch;
  }

  getConcernEffectiveness(ingredient, concerns) {
    const addressedConcerns = ingredient.addresses || [];
    let effectiveness = 0;
    
    concerns.forEach((concern, index) => {
      const priority = 1 - (index * 0.1); // Decreasing priority
      if (addressedConcerns.includes(concern)) {
        effectiveness += 100 * priority;
      }
    });
    
    return Math.min(100, effectiveness);
  }

  getSafetyScore(ingredient, sensitivityLevel) {
    const strength = ingredient.strength || 'gentle';
    const strengthScores = {
      'gentle': 100,
      'moderate': 80,
      'strong': 60,
      'very_strong': 40
    };

    let baseScore = strengthScores[strength] || 70;
    
    // Adjust for sensitivity level (1-10 scale)
    const sensitivityPenalty = Math.max(0, (sensitivityLevel - 5) * 10);
    baseScore -= sensitivityPenalty;
    
    return Math.max(0, Math.min(100, baseScore));
  }

  getExperienceCompatibility(ingredient, experience) {
    const requiredExperience = ingredient.requiresExperience || 'beginner';
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
      // Penalty for recommending advanced products to beginners
      const levelDifference = requiredLevel - userLevel;
      return Math.max(0, 100 - (levelDifference * 30));
    }
  }

  // ============ PERSONALIZATION ============
  personalizeRecommendations(recommendations, userProfile) {
    return recommendations.map(rec => {
      const ingredient = this.ingredientDatabase[rec.ingredient];
      if (!ingredient) return rec;

      // Budget filtering
      const budgetRange = userProfile.budget;
      const inBudget = this.isInBudget(ingredient.priceRange, budgetRange);
      
      if (!inBudget && !rec.medicallyRequired) {
        // Try to find budget-friendly alternative
        const alternative = this.findBudgetAlternative(rec.ingredient, budgetRange);
        if (alternative) {
          return {
            ...rec,
            ingredient: alternative,
            reasoning: rec.reasoning + ' (budget-friendly alternative)',
            budgetAdjusted: true
          };
        }
      }

      // Experience level adjustments
      const experienceAdjustment = this.getExperienceAdjustment(rec, userProfile);
      
      return {
        ...rec,
        ...experienceAdjustment,
        inBudget: inBudget
      };
    }).filter(rec => rec.inBudget || rec.medicallyRequired);
  }

  isInBudget(priceRange, budgetRange) {
    const budgetLimits = {
      'budget': [0, 500],
      'mid-range': [500, 1500],
      'premium': [1500, 3000],
      'luxury': [3000, 10000]
    };

    const [userMin, userMax] = budgetLimits[budgetRange] || [0, 1500];
    const [productMin, productMax] = priceRange || [0, 1000];

    return productMin <= userMax && productMax >= userMin;
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

    // Limit recommendations based on experience
    const limits = this.getRecommendationLimits(userProfile);
    Object.keys(structured).forEach(category => {
      if (structured[category].length > limits[category]) {
        structured[category] = structured[category].slice(0, limits[category]);
      }
    });

    return structured;
  }

  determineOutputCategory(recommendation, userProfile) {
    const ingredient = this.ingredientDatabase[recommendation.ingredient];
    
    if (recommendation.medicallyRequired || 
        recommendation.category === 'essential' || 
        ['sunscreen', 'cleanser', 'moisturizer'].includes(ingredient?.category)) {
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

  // ============ ROUTINE AND WARNINGS ============
  addRoutineAndWarnings(recommendations, userProfile) {
    const routine = this.generateRoutineSuggestions(recommendations, userProfile);
    const warnings = this.generateWarnings(recommendations, userProfile);
    const timeline = this.generateTimeline(recommendations, userProfile);

    return {
      user_profile: userProfile,
      generated_at: new Date().toISOString(),
      recommendations: recommendations,
      routine_suggestions: routine,
      warnings: warnings,
      timeline: timeline,
      follow_up_recommendations: this.generateFollowUpRecommendations(userProfile)
    };
  }

  generateRoutineSuggestions(recommendations, userProfile) {
    const allIngredients = Object.keys(recommendations).reduce((acc, category) => {
      return acc.concat(recommendations[category]);
    }, []);

    const morning = [];
    const evening = [];

    // Basic routine structure
    const routineOrder = ['cleanser', 'active', 'hydrating', 'moisturizer', 'sunscreen'];

    routineOrder.forEach(step => {
      const stepIngredients = allIngredients.filter(rec => {
        const ingredient = this.ingredientDatabase[rec.ingredient];
        return ingredient?.category === step;
      });

      stepIngredients.forEach(rec => {
        const ingredient = this.ingredientDatabase[rec.ingredient];
        
        if (step === 'sunscreen') {
          morning.push({
            ingredient: rec.ingredient,
            name: this.getIngredientDisplayName(rec.ingredient),
            instructions: 'Apply 15 minutes before sun exposure'
          });
        } else if (ingredient?.category === 'active') {
          // Most actives go in evening
          if (['vitamin_c'].includes(rec.ingredient)) {
            morning.push({
              ingredient: rec.ingredient,
              name: this.getIngredientDisplayName(rec.ingredient),
              instructions: this.getUsageInstructions(rec.ingredient, userProfile)
            });
          } else {
            evening.push({
              ingredient: rec.ingredient,
              name: this.getIngredientDisplayName(rec.ingredient),
              instructions: this.getUsageInstructions(rec.ingredient, userProfile)
            });
          }
        } else {
          // Add to both routines
          const instruction = this.getUsageInstructions(rec.ingredient, userProfile);
          morning.push({
            ingredient: rec.ingredient,
            name: this.getIngredientDisplayName(rec.ingredient),
            instructions: instruction
          });
          if (step !== 'sunscreen') {
            evening.push({
              ingredient: rec.ingredient,
              name: this.getIngredientDisplayName(rec.ingredient),
              instructions: instruction
            });
          }
        }
      });
    });

    return { morning, evening };
  }

  generateWarnings(recommendations, userProfile) {
    const warnings = [];
    const allIngredients = Object.keys(recommendations).reduce((acc, category) => {
      return acc.concat(recommendations[category]);
    }, []);

    // Check for actives
    const actives = allIngredients.filter(rec => {
      const ingredient = this.ingredientDatabase[rec.ingredient];
      return ingredient?.category === 'active';
    });

    if (actives.length > 0) {
      warnings.push({
        type: 'general',
        message: 'Always use sunscreen when using active ingredients',
        severity: 'high'
      });
    }

    // Specific ingredient warnings
    allIngredients.forEach(rec => {
      const warnings_for_ingredient = this.getIngredientWarnings(rec.ingredient, userProfile);
      warnings.push(...warnings_for_ingredient);
    });

    // Experience-based warnings
    if (userProfile.experience === 'beginner') {
      warnings.push({
        type: 'beginner',
        message: 'Start with one new product at a time and patch test everything',
        severity: 'medium'
      });
    }

    return warnings;
  }

  generateTimeline(recommendations, userProfile) {
    const timeline = {};

    if (userProfile.experience === 'beginner') {
      timeline.week_1_2 = 'Start with cleanser, moisturizer, and sunscreen only';
      timeline.week_3_4 = 'Add gentle ingredients like niacinamide or hyaluronic acid';
      timeline.month_2_3 = 'Introduce actives gradually if previous products are well-tolerated';
      timeline.month_4_plus = 'Add additional treatments based on skin response';
    } else if (userProfile.experience === 'intermediate') {
      timeline.week_1_2 = 'Establish basic routine with cleanser, moisturizer, sunscreen';
      timeline.week_3_4 = 'Add primary active ingredient';
      timeline.month_2 = 'Add supporting ingredients';
      timeline.month_3_plus = 'Add secondary actives if needed';
    } else {
      timeline.week_1_2 = 'Establish full routine gradually';
      timeline.week_3_4 = 'All products should be introduced';
      timeline.month_2_plus = 'Evaluate effectiveness and adjust as needed';
    }

    return timeline;
  }

  // ============ FALLBACK SYSTEM ============
  generateFallbackRecommendations(assessmentData) {
    const skinType = assessmentData.skinType || 'normal';
    const fallback = this.fallbackRecommendations[skinType] || this.fallbackRecommendations.default;

    return {
      user_profile: { 
        skinType,
        fallback: true,
        error: 'Algorithm failed, using fallback recommendations'
      },
      generated_at: new Date().toISOString(),
      recommendations: {
        essential: fallback.map(ingredient => ({
          ingredient: ingredient.toLowerCase().replace(/\s+/g, '_'),
          ingredient_name: ingredient,
          category: 'essential',
          match_score: 70,
          reasoning: 'Safe fallback recommendation for your skin type',
          priority: 'high'
        })),
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
      timeline: {
        week_1_2: 'Start with basic routine',
        week_3_4: 'Continue if products are well-tolerated',
        month_2_plus: 'Retake assessment for more personalized recommendations'
      }
    };
  }

  initializeFallbacks() {
    return {
      'oily': ['Salicylic Acid Cleanser', 'Niacinamide Serum', 'Lightweight Moisturizer', 'Mineral Sunscreen'],
      'dry': ['Gentle Cleanser', 'Hyaluronic Acid Serum', 'Rich Moisturizer', 'Mineral Sunscreen'],
      'sensitive': ['Gentle Cleanser', 'Fragrance-Free Moisturizer', 'Mineral Sunscreen'],
      'combination': ['Gentle Cleanser', 'Niacinamide Serum', 'Lightweight Moisturizer', 'Mineral Sunscreen'],
      'normal': ['Gentle Cleanser', 'Vitamin C Serum', 'Daily Moisturizer', 'Broad Spectrum Sunscreen'],
      'default': ['Gentle Cleanser', 'Basic Moisturizer', 'Broad Spectrum Sunscreen']
    };
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

  parseBudgetRange(budgetString) {
    const budgetMap = {
      'budget': 'budget',
      'mid-range': 'mid-range',
      'premium': 'premium',
      'luxury': 'luxury'
    };
    return budgetMap[budgetString] || 'mid-range';
  }

  calculateRiskTolerance(experience, sensitivity) {
    const experienceScore = { 'beginner': 1, 'intermediate': 2, 'advanced': 3, 'expert': 4 }[experience] || 1;
    const sensitivityScore = 11 - sensitivity; // Invert sensitivity (higher sensitivity = lower tolerance)
    return Math.round((experienceScore + sensitivityScore) / 2);
  }

  calculateRoutineComplexity(experience, age) {
    const experienceScore = { 'beginner': 1, 'intermediate': 2, 'advanced': 3, 'expert': 4 }[experience] || 1;
    const ageScore = age < 25 ? 1 : age < 35 ? 2 : age < 45 ? 3 : 4;
    return Math.round((experienceScore + ageScore) / 2);
  }

  identifyPrimaryConcern(concerns, goals) {
    if (concerns.length === 0) return 'maintenance';
    return concerns[0]; // First concern is highest priority
  }

  detectHormonalIssues(medicalConditions, age, gender) {
    const hormonalConditions = ['cystic-acne', 'melasma'];
    const hasHormonalCondition = medicalConditions.some(condition => hormonalConditions.includes(condition));
    const isHormonalAge = (gender === 'female' && (age < 25 || age > 40));
    return hasHormonalCondition || isHormonalAge;
  }

  deduplicateRecommendations(recommendations) {
    const seen = new Set();
    return recommendations.filter(rec => {
      if (seen.has(rec.ingredient)) {
        return false;
      }
      seen.add(rec.ingredient);
      return true;
    });
  }

  getSkinTypeProducts(userProfile) {
    const rules = this.ruleMatrix.skinType[userProfile.skinType];
    if (!rules) return [];

    return rules.recommended.map(ingredient => ({
      ingredient,
      reasoning: `Recommended for ${userProfile.skinType} skin type`,
      category: 'skin_type',
      priority: 75
    }));
  }

  getAgeBasedProducts(userProfile) {
    const ageCategory = userProfile.age < 20 ? 'teen' : 
                       userProfile.age < 30 ? 'twenties' : 
                       userProfile.age < 40 ? 'thirties' : 'forties_plus';
    
    const rules = this.ruleMatrix.age[ageCategory];
    if (!rules || !rules.recommended) return [];

    return rules.recommended.map(ingredient => ({
      ingredient,
      reasoning: `Age-appropriate ingredient for ${ageCategory}`,
      category: 'age_based',
      priority: 70
    }));
  }

  getClimateProducts(userProfile) {
    const climateAdjustments = {
      'hot_humid': ['lightweight_moisturizer', 'chemical_sunscreen'],
      'hot_dry': ['rich_moisturizer', 'hyaluronic_acid'],
      'cold': ['rich_moisturizer', 'ceramide_cream'],
      'moderate': [],
      'varied': ['hyaluronic_acid']
    };

    const products = climateAdjustments[userProfile.climate] || [];
    return products.map(ingredient => ({
      ingredient,
      reasoning: `Suitable for ${userProfile.climate} climate`,
      category: 'climate',
      priority: 65
    }));
  }

  findAlternativeIngredient(originalIngredient, usedIngredients) {
    const alternatives = {
      'retinol': 'azelaic_acid',
      'vitamin_c': 'niacinamide',
      'salicylic_acid': 'niacinamide',
      'benzoyl_peroxide': 'salicylic_acid'
    };

    const alternative = alternatives[originalIngredient];
    if (alternative && !usedIngredients.has(alternative)) {
      return {
        ingredient: alternative,
        reasoning: `Alternative to ${originalIngredient}`
      };
    }
    return null;
  }

  findBudgetAlternative(ingredient, budgetRange) {
    const budgetAlternatives = {
      'retinol': 'niacinamide',
      'vitamin_c': 'niacinamide',
      'rich_moisturizer': 'lightweight_moisturizer',
      'ceramide_cream': 'hyaluronic_acid'
    };

    return budgetAlternatives[ingredient];
  }

  getExperienceAdjustment(recommendation, userProfile) {
    const ingredient = this.ingredientDatabase[recommendation.ingredient];
    const required = ingredient?.requiresExperience || 'beginner';
    const user = userProfile.experience;

    if (required === 'intermediate' && user === 'beginner') {
      return {
        reasoning: recommendation.reasoning + ' (introduce gradually)',
        usageInstructions: 'Start 1-2 times per week, increase slowly'
      };
    }

    if (required === 'advanced' && ['beginner', 'intermediate'].includes(user)) {
      return {
        reasoning: recommendation.reasoning + ' (requires careful introduction)',
        usageInstructions: 'Start once per week, monitor skin response carefully'
      };
    }

    return {};
  }

  getIngredientDisplayName(ingredient) {
    const displayNames = {
      'gentle_cleanser': 'Gentle Daily Cleanser',
      'salicylic_acid_cleanser': 'Salicylic Acid Cleanser',
      'retinol': 'Retinol Serum',
      'niacinamide': 'Niacinamide Serum',
      'vitamin_c': 'Vitamin C Serum',
      'salicylic_acid': 'Salicylic Acid Treatment',
      'hyaluronic_acid': 'Hyaluronic Acid Serum',
      'lightweight_moisturizer': 'Lightweight Moisturizer',
      'rich_moisturizer': 'Rich Moisturizer',
      'mineral_sunscreen': 'Mineral Sunscreen SPF 30+',
      'chemical_sunscreen': 'Chemical Sunscreen SPF 30+',
      'azelaic_acid': 'Azelaic Acid Treatment',
      'ceramide_cream': 'Ceramide Barrier Cream'
    };

    return displayNames[ingredient] || ingredient.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  getUsageInstructions(ingredient, userProfile) {
    const instructions = {
      'gentle_cleanser': 'Use twice daily, morning and evening',
      'salicylic_acid_cleanser': 'Use once daily in evening, increase to twice daily if tolerated',
      'retinol': userProfile.experience === 'beginner' ? 'Start 1-2 times per week in evening' : 'Use every other evening',
      'niacinamide': 'Use once or twice daily, can be used morning or evening',
      'vitamin_c': 'Use once daily in morning routine',
      'salicylic_acid': 'Use 2-3 times per week in evening, increase gradually',
      'hyaluronic_acid': 'Use twice daily on damp skin, follow with moisturizer',
      'lightweight_moisturizer': 'Use twice daily as final step before sunscreen',
      'rich_moisturizer': 'Use twice daily, can be used as final evening step',
      'mineral_sunscreen': 'Use every morning, reapply every 2 hours when outdoors',
      'chemical_sunscreen': 'Use every morning, reapply every 2 hours when outdoors',
      'azelaic_acid': 'Start 2-3 times per week in evening, increase gradually',
      'ceramide_cream': 'Use twice daily, especially after cleansing'
    };

    return instructions[ingredient] || 'Follow product instructions';
  }

  getIngredientWarnings(ingredient, userProfile) {
    const warnings = [];
    const ingredientData = this.ingredientDatabase[ingredient];

    if (!ingredientData) return warnings;

    // General active ingredient warnings
    if (ingredientData.category === 'active') {
      warnings.push({
        type: 'active',
        message: `${this.getIngredientDisplayName(ingredient)} is an active ingredient. Start slowly and monitor skin response.`,
        severity: 'medium'
      });
    }

    // Specific ingredient warnings
    const specificWarnings = {
      'retinol': {
        message: 'Retinol can cause initial irritation. Start slowly and always use sunscreen.',
        severity: 'high'
      },
      'salicylic_acid': {
        message: 'Salicylic acid can increase sun sensitivity. Use sunscreen daily.',
        severity: 'medium'
      },
      'vitamin_c': {
        message: 'Vitamin C can cause irritation if concentration is too high. Start with lower concentrations.',
        severity: 'medium'
      }
    };

    if (specificWarnings[ingredient]) {
      warnings.push({
        type: 'ingredient_specific',
        ...specificWarnings[ingredient]
      });
    }

    // Sensitivity-based warnings
    if (userProfile.sensitivity > 7 && ingredientData.strength !== 'gentle') {
      warnings.push({
        type: 'sensitivity',
        message: `Due to your sensitive skin, introduce ${this.getIngredientDisplayName(ingredient)} very gradually.`,
        severity: 'high'
      });
    }

    return warnings;
  }

  generateFollowUpRecommendations(userProfile) {
    return {
      reassessment_period: userProfile.experience === 'beginner' ? '3 months' : '6 months',
      signs_to_watch: [
        'Persistent irritation or redness',
        'No improvement after 8-12 weeks',
        'New skin concerns developing'
      ],
      next_steps: [
        'Consider adding complementary ingredients',
        'Evaluate product effectiveness',
        'Adjust routine based on seasonal changes'
      ]
    };
  }
}