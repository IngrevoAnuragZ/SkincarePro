import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ProgressSteps from '../components/common/ProgressSteps';
import QuestionCard, { AnswerType } from '../components/assessment/QuestionCard';
import GamificationDashboard from '../components/gamification/GamificationDashboard';
import CollaborativeFiltering from '../components/ml/CollaborativeFiltering';
import SeasonalAdaptation from '../components/ml/SeasonalAdaptation';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { DynamicSkincareRecommendationEngine } from '../lib/dynamicRecommendationEngine';

// Import existing questions from the original assessment
const questions = [
  {
    id: 'skinType',
    text: 'What is your skin type?',
    description: 'Select the option that best describes how your skin feels most days.',
    type: 'single' as const,
    answers: [
      { id: 'dry', text: 'Dry', value: 'dry', description: 'Skin feels tight, may have flaky patches' },
      { id: 'oily', text: 'Oily', value: 'oily', description: 'Excess shine throughout the day' },
      { id: 'combination', text: 'Combination', value: 'combination', description: 'Oily T-zone with normal to dry cheeks' },
      { id: 'normal', text: 'Normal', value: 'normal', description: 'Well-balanced, neither too oily nor too dry' },
      { id: 'sensitive', text: 'Sensitive', value: 'sensitive', description: 'Easily irritated, may experience redness' }
    ]
  },
  {
    id: 'skinConcerns',
    text: 'What are your main skin concerns?',
    description: 'Select all that apply to your skin.',
    type: 'multiple' as const,
    answers: [
      { id: 'acne', text: 'Acne & Breakouts', value: 'acne_breakouts' },
      { id: 'aging', text: 'Fine Lines & Wrinkles', value: 'fine_lines_wrinkles' },
      { id: 'hyperpigmentation', text: 'Dark Spots', value: 'dark_spots_hyperpigmentation' },
      { id: 'dryness', text: 'Dryness', value: 'dryness_dehydration' },
      { id: 'oiliness', text: 'Excess Oil', value: 'excess_oil_shine' },
      { id: 'sensitivity', text: 'Sensitivity', value: 'sensitivity_redness' }
    ]
  },
  {
    id: 'skinSensitivity',
    text: 'How sensitive is your skin?',
    description: 'Rate your skin\'s sensitivity when trying new products.',
    type: 'slider' as const,
    answers: [
      { id: '1', text: 'Not Sensitive', value: 1 },
      { id: '2', text: '', value: 2 },
      { id: '3', text: '', value: 3 },
      { id: '4', text: '', value: 4 },
      { id: '5', text: 'Extremely Sensitive', value: 5 }
    ]
  },
  {
    id: 'ageRange',
    text: 'What is your age range?',
    type: 'single' as const,
    answers: [
      { id: 'twenties', text: '20-29 years', value: '20-29' },
      { id: 'thirties', text: '30-39 years', value: '30-39' },
      { id: 'forties', text: '40-49 years', value: '40-49' },
      { id: 'fifties-plus', text: '50+ years', value: '50+' }
    ]
  },
  {
    id: 'climate',
    text: 'What climate do you live in?',
    description: 'This helps us recommend products suitable for your environment. Hyderabad is classified as Hot and Humid.',
    type: 'single' as const,
    answers: [
      { id: 'hot_humid', text: 'Hot and Humid', value: 'hot_humid', description: 'Cities like Mumbai, Chennai, Hyderabad, Kolkata' },
      { id: 'hot_dry', text: 'Hot and Dry', value: 'hot_dry', description: 'Cities like Delhi, Jaipur' },
      { id: 'moderate', text: 'Moderate', value: 'moderate', description: 'Cities like Bangalore, Pune' },
      { id: 'cold', text: 'Cold', value: 'cold', description: 'Hill stations and northern regions' }
    ]
  },
  {
    id: 'budget',
    text: 'What is your preferred budget range per product?',
    description: 'This helps us recommend products within your price range.',
    type: 'single' as const,
    answers: [
      { id: 'budget', text: 'Budget-Friendly', value: 'budget-friendly', description: 'Under ₹500 per product - Great for students and beginners' },
      { id: 'mid', text: 'Mid-Range', value: 'mid-range', description: '₹500 - ₹1500 per product - Balanced quality and pricing' },
      { id: 'premium', text: 'Premium', value: 'premium', description: '₹1500 - ₹3000 per product - High-quality formulations' },
      { id: 'luxury', text: 'Luxury', value: 'luxury', description: 'Above ₹3000 per product - Top-tier brands and ingredients' }
    ]
  },
  {
    id: 'experience',
    text: 'How experienced are you with skincare?',
    type: 'single' as const,
    answers: [
      { id: 'beginner', text: 'Beginner', value: 'beginner', description: 'New to skincare routines' },
      { id: 'intermediate', text: 'Intermediate', value: 'intermediate', description: 'Some experience with products' },
      { id: 'advanced', text: 'Advanced', value: 'advanced', description: 'Very familiar with ingredients and routines' }
    ]
  }
];

const AssessmentPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);
  const [userLevel, setUserLevel] = useState(1);
  const [experiencePoints, setExperiencePoints] = useState(0);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [streakCount, setStreakCount] = useState(0);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const steps = [
    { id: 1, label: 'Basics' },
    { id: 2, label: 'Analysis' },
    { id: 3, label: 'Results' }
  ];

  useEffect(() => {
    if (currentQuestionIndex < 2) {
      setCurrentStep(1);
    } else if (currentQuestionIndex < questions.length) {
      setCurrentStep(2);
    } else {
      setCurrentStep(3);
    }
  }, [currentQuestionIndex]);

  // Initialize gamification data
  useEffect(() => {
    initializeGamificationData();
  }, [user]);

  const initializeGamificationData = () => {
    // Mock gamification data - in production, this would come from the database
    setUserLevel(2);
    setExperiencePoints(750);
    setStreakCount(5);
    
    setAchievements([
      {
        id: 'first_assessment',
        title: 'Skin Detective',
        description: 'Complete your first skin assessment',
        badge: '🎯',
        points: 100,
        unlocked: true
      },
      {
        id: 'routine_streak_7',
        title: 'Week Warrior',
        description: 'Maintain routine for 7 days',
        badge: '🔥',
        points: 200,
        unlocked: true,
        progress: 7,
        maxProgress: 7
      },
      {
        id: 'ingredient_expert',
        title: 'Ingredient Expert',
        description: 'Learn about 10 ingredients',
        badge: '🧪',
        points: 300,
        unlocked: false,
        progress: 6,
        maxProgress: 10
      }
    ]);

    setChallenges([
      {
        id: 'weekly_routine',
        title: 'Weekly Consistency',
        description: 'Complete routine 7 days in a row',
        points: 50,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 5,
        maxProgress: 7,
        completed: false
      },
      {
        id: 'ingredient_learning',
        title: 'Ingredient Explorer',
        description: 'Learn about 5 new ingredients',
        points: 75,
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 3,
        maxProgress: 5,
        completed: false
      }
    ]);
  };

  const handleAnswer = async (questionId: string, value: any) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      await processAssessment(newAnswers);
    }
  };

  const processAssessment = async (assessmentData: any) => {
    setIsSubmitting(true);
    
    try {
      // Generate enhanced recommendations using the dynamic engine
      const engine = new DynamicSkincareRecommendationEngine();
      const enhancedRecommendations = await engine.generateRecommendations(
        user?.id || 'anonymous',
        assessmentData
      );
      
      setRecommendations(enhancedRecommendations);
      
      // Update gamification data
      setExperiencePoints(prev => prev + 150); // Bonus for completing assessment
      
      // Save to database if user is authenticated
      if (user) {
        await saveAssessmentToDatabase(assessmentData, enhancedRecommendations);
        toast.success('Assessment completed and saved!');
      } else {
        toast.success('Assessment completed! Sign up to save your results.');
      }
      
      setShowResults(true);
      setCurrentStep(3);
      
    } catch (error) {
      toast.error('Failed to process assessment. Please try again.');
      console.error('Assessment processing error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveAssessmentToDatabase = async (assessmentData: any, recommendations: any) => {
    try {
      const { data, error } = await supabase
        .from('skin_assessments')
        .insert({
          user_id: user?.id,
          skin_type: assessmentData.skinType,
          skin_concerns: Array.isArray(assessmentData.skinConcerns) ? assessmentData.skinConcerns : [assessmentData.skinConcerns].filter(Boolean),
          skin_sensitivity: assessmentData.skinSensitivity || 3,
          age_range: assessmentData.ageRange,
          climate: assessmentData.climate,
          budget: assessmentData.budget,
          experience_level: assessmentData.experience,
          medical_conditions: [],
          current_medications: [],
          current_products: [],
          primary_goals: [],
          lifestyle_factors: {},
          assessment_responses: assessmentData,
          recommendations: recommendations,
          completed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to save assessment:', error);
      // Don't throw error to prevent blocking the user experience
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleRetakeAssessment = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setRecommendations(null);
    setShowResults(false);
    setCurrentStep(1);
  };

  const handleChallengeComplete = (challengeId: string) => {
    setChallenges(prev => prev.map(challenge => 
      challenge.id === challengeId 
        ? { ...challenge, completed: true, progress: challenge.maxProgress }
        : challenge
    ));
    setExperiencePoints(prev => prev + 50);
    toast.success('Challenge completed! +50 XP');
  };

  const renderQuestion = () => {
    if (currentQuestionIndex >= questions.length) return null;
    
    const question = questions[currentQuestionIndex];
    
    return (
      <AnimatePresence mode="wait">
        <QuestionCard
          key={question.id}
          questionId={question.id}
          questionText={question.text}
          questionDescription={question.description}
          answers={question.answers}
          answerType={question.type}
          onAnswer={handleAnswer}
          currentAnswer={answers[question.id]}
          onPrevious={handlePrevious}
          showPreviousButton={currentQuestionIndex > 0}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />
      </AnimatePresence>
    );
  };

  const renderResults = () => {
    if (!recommendations) return null;

    // Mock collaborative filtering data
    const collaborativeRecommendations = [
      {
        ingredient: 'niacinamide',
        ingredientName: 'Niacinamide',
        collaborativeScore: 0.89,
        userCount: 156,
        avgSuccessRate: 0.84,
        reasoning: [
          '89% similar users saw significant improvement',
          'Highly effective for your skin type and concerns',
          'Well-tolerated by users with similar sensitivity levels'
        ],
        similarUsers: [
          {
            userId: 'user_001',
            similarity: 0.91,
            profile: { skinType: answers.skinType, age: 25, concerns: ['acne', 'oiliness'], climate: answers.climate },
            successfulProducts: ['niacinamide', 'hyaluronic_acid'],
            routineSuccess: 0.87,
            improvementRate: 0.82
          }
        ]
      },
      {
        ingredient: 'hyaluronic_acid',
        ingredientName: 'Hyaluronic Acid',
        collaborativeScore: 0.82,
        userCount: 203,
        avgSuccessRate: 0.91,
        reasoning: [
          '82% match with users who have similar hydration needs',
          'Universally well-tolerated ingredient',
          'Excellent results for your climate conditions'
        ],
        similarUsers: []
      }
    ];

    // Mock seasonal adaptation data
    const seasonalRules = {
      summer: {
        priorityAdjustments: { 'oiliness': 25, 'sun_protection': 40, 'pores': 20 },
        recommendedIngredients: ['niacinamide', 'salicylic_acid', 'zinc_oxide'],
        avoidIngredients: ['heavy_oils', 'occlusive_moisturizers'],
        routineModifications: {
          morning: ['lightweight_moisturizer', 'antioxidant_serum', 'broad_spectrum_spf'],
          evening: ['gentle_cleanser', 'treatment_serum']
        }
      },
      winter: {
        priorityAdjustments: { 'dryness': 30, 'sensitivity': 20, 'barrier_repair': 25 },
        recommendedIngredients: ['ceramides', 'hyaluronic_acid', 'squalane'],
        avoidIngredients: ['strong_acids', 'high_concentration_retinoids'],
        routineModifications: {
          morning: ['rich_moisturizer', 'barrier_repair_serum'],
          evening: ['nourishing_oil', 'overnight_mask']
        }
      },
      monsoon: {
        priorityAdjustments: { 'fungal_protection': 35, 'humidity_adaptation': 30 },
        recommendedIngredients: ['tea_tree_oil', 'zinc_pyrithione'],
        avoidIngredients: ['heavy_creams'],
        routineModifications: {
          morning: ['antimicrobial_cleanser'],
          evening: ['thorough_cleansing']
        }
      }
    };

    return (
      <motion.div 
        className="max-w-7xl mx-auto space-y-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Gamification Dashboard */}
        <GamificationDashboard
          userId={user?.id || 'anonymous'}
          currentLevel={userLevel}
          experiencePoints={experiencePoints}
          achievements={achievements}
          challenges={challenges}
          streakCount={streakCount}
          onChallengeComplete={handleChallengeComplete}
        />

        {/* Collaborative Filtering */}
        <CollaborativeFiltering
          userId={user?.id || 'anonymous'}
          userProfile={recommendations.user_profile}
          recommendations={collaborativeRecommendations}
          onIngredientSelect={(ingredient) => {
            toast.success(`Added ${ingredient.replace('_', ' ')} to your routine!`);
          }}
        />

        {/* Seasonal Adaptation */}
        <SeasonalAdaptation
          currentSeason="summer"
          climate={answers.climate || 'moderate'}
          userProfile={recommendations.user_profile}
          seasonalRules={seasonalRules}
          onSeasonalChange={(season) => {
            toast.success(`Switched to ${season} recommendations`);
          }}
        />

        {/* Enhanced Recommendations Display */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            Your Personalized AI Recommendations
          </h2>
          
          {/* Budget Summary */}
          {recommendations.budget_summary && (
            <div className="mb-8 bg-gradient-to-r from-success-50 to-success-100 rounded-2xl p-6 border border-success-200">
              <h3 className="text-xl font-bold text-success-800 mb-4">💰 Budget Summary</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success-600">₹{recommendations.budget_summary.total_cost}</div>
                  <div className="text-sm text-success-700">Total Cost</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success-600">{recommendations.budget_summary.product_count}</div>
                  <div className="text-sm text-success-700">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success-600">₹{recommendations.budget_summary.cost_per_month}</div>
                  <div className="text-sm text-success-700">Per Month</div>
                </div>
              </div>
            </div>
          )}
          
          {/* Essential Products */}
          {recommendations.recommendations?.essential && recommendations.recommendations.essential.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-primary-800">Essential Products</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.recommendations.essential.map((rec: any, index: number) => (
                  <motion.div 
                    key={index} 
                    className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-4 border border-primary-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <h4 className="font-semibold text-primary-700 mb-2">
                      {rec.product_name || (rec.productId && rec.productId.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()))}
                    </h4>
                    <p className="text-sm text-primary-600 mb-3">{rec.reasoning}</p>
                    {rec.price && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-primary-500">Price</span>
                        <span className="text-sm font-bold text-primary-700">₹{rec.price}</span>
                      </div>
                    )}
                    {rec.matchScore && (
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-primary-500">Match Score</span>
                        <span className="text-sm font-bold text-primary-700">{rec.matchScore}%</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Targeted Products */}
          {recommendations.recommendations?.targeted && recommendations.recommendations.targeted.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-accent-800">Targeted Treatments</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.recommendations.targeted.map((rec: any, index: number) => (
                  <motion.div 
                    key={index} 
                    className="bg-gradient-to-br from-accent-50 to-accent-100 rounded-xl p-4 border border-accent-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <h4 className="font-semibold text-accent-700 mb-2">
                      {rec.product_name || (rec.productId && rec.productId.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()))}
                    </h4>
                    <p className="text-sm text-accent-600 mb-3">{rec.reasoning}</p>
                    {rec.price && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-accent-500">Price</span>
                        <span className="text-sm font-bold text-accent-700">₹{rec.price}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Routine Display */}
          {recommendations.routine_suggestions && (
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-neutral-800">Your Daily Routine</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Morning Routine */}
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                  <h4 className="font-bold text-yellow-800 mb-4 flex items-center">
                    ☀️ Morning Routine
                  </h4>
                  <div className="space-y-3">
                    {recommendations.routine_suggestions.morning?.map((step: any, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-yellow-200 text-yellow-800 rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-yellow-900">{step.product_name || step}</p>
                          {step.instructions && (
                            <p className="text-sm text-yellow-700 mt-1">{step.instructions}</p>
                          )}
                          {step.price && (
                            <p className="text-xs text-yellow-600 mt-1">₹{step.price}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evening Routine */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
                  <h4 className="font-bold text-purple-800 mb-4 flex items-center">
                    🌙 Evening Routine
                  </h4>
                  <div className="space-y-3">
                    {recommendations.routine_suggestions.evening?.map((step: any, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-purple-200 text-purple-800 rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-purple-900">{step.product_name || step}</p>
                          {step.instructions && (
                            <p className="text-sm text-purple-700 mt-1">{step.instructions}</p>
                          )}
                          {step.price && (
                            <p className="text-xs text-purple-600 mt-1">₹{step.price}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Gamification Elements in Results */}
          <div className="bg-gradient-to-r from-success-50 to-success-100 rounded-2xl p-6 border border-success-200">
            <h3 className="text-lg font-bold text-success-800 mb-4">🎉 Assessment Rewards</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-success-600">+150 XP</div>
                <div className="text-sm text-success-700">Assessment Bonus</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success-600">🏆</div>
                <div className="text-sm text-success-700">Achievement Unlocked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success-600">Level {userLevel}</div>
                <div className="text-sm text-success-700">Current Level</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <motion.button
            onClick={() => navigate('/routine')}
            className="btn btn-primary bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            View Smart Routines
          </motion.button>
          <motion.button
            onClick={() => navigate('/ingredients')}
            className="btn btn-outline"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Explore Ingredients
          </motion.button>
          <motion.button
            onClick={handleRetakeAssessment}
            className="btn btn-ghost"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Retake Assessment
          </motion.button>
        </div>
      </motion.div>
    );
  };

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-accent-50/30 pt-24 pb-16 px-4 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"
            />
          </motion.div>
          <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            Generating Your Enhanced AI Recommendations
          </h3>
          <p className="text-neutral-600">Analyzing with machine learning algorithms...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-accent-50/30 pt-24 pb-16 px-4">
      <div className="container mx-auto">
        {!showResults ? (
          <>
            <div className="text-center max-w-3xl mx-auto mb-10">
              <motion.h1 
                className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Enhanced AI Skin Assessment
              </motion.h1>
              <motion.p 
                className="text-neutral-600 text-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Get personalized recommendations powered by machine learning and collaborative filtering
              </motion.p>
            </div>
            
            <div className="max-w-4xl mx-auto mb-10">
              <ProgressSteps 
                steps={steps} 
                currentStep={currentStep}
              />
            </div>
            
            {renderQuestion()}
          </>
        ) : (
          renderResults()
        )}
      </div>
    </div>
  );
};

export default AssessmentPage;