import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ProgressSteps from '../components/common/ProgressSteps';
import QuestionCard, { AnswerType } from '../components/assessment/QuestionCard';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

// Complete 13-question assessment
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
      { id: 'sensitivity', text: 'Sensitivity', value: 'sensitivity_redness' },
      { id: 'pores', text: 'Large Pores', value: 'large_pores' },
      { id: 'texture', text: 'Uneven Texture', value: 'uneven_texture' }
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
    id: 'medicalConditions',
    text: 'Do you have any of these skin conditions?',
    description: 'Select all that apply. This helps us recommend safer products.',
    type: 'multiple' as const,
    answers: [
      { id: 'none', text: 'None of the above', value: 'none' },
      { id: 'eczema', text: 'Eczema/Atopic Dermatitis', value: 'eczema' },
      { id: 'rosacea', text: 'Rosacea', value: 'rosacea' },
      { id: 'psoriasis', text: 'Psoriasis', value: 'psoriasis' },
      { id: 'melasma', text: 'Melasma', value: 'melasma' },
      { id: 'seborrheic_dermatitis', text: 'Seborrheic Dermatitis', value: 'seborrheic_dermatitis' }
    ]
  },
  {
    id: 'otherConditions',
    text: 'Any other skin conditions or allergies?',
    description: 'Please describe any other conditions, allergies, or specific concerns.',
    type: 'text' as const,
    answers: []
  },
  {
    id: 'currentMedications',
    text: 'Are you currently taking any medications?',
    description: 'Some medications can affect skin sensitivity and product recommendations.',
    type: 'single' as const,
    answers: [
      { id: 'none', text: 'No medications', value: 'none' },
      { id: 'birth_control', text: 'Birth control pills', value: 'birth_control' },
      { id: 'antibiotics', text: 'Antibiotics', value: 'antibiotics' },
      { id: 'retinoids', text: 'Prescription retinoids', value: 'prescription_retinoids' },
      { id: 'other', text: 'Other medications', value: 'other_medications' }
    ]
  },
  {
    id: 'ageRange',
    text: 'What is your age range?',
    type: 'single' as const,
    answers: [
      { id: 'teens', text: '13-19 years', value: '13-19' },
      { id: 'twenties', text: '20-29 years', value: '20-29' },
      { id: 'thirties', text: '30-39 years', value: '30-39' },
      { id: 'forties', text: '40-49 years', value: '40-49' },
      { id: 'fifties-plus', text: '50+ years', value: '50+' }
    ]
  },
  {
    id: 'gender',
    text: 'What is your gender?',
    description: 'This helps us provide more personalized recommendations.',
    type: 'single' as const,
    answers: [
      { id: 'female', text: 'Female', value: 'female' },
      { id: 'male', text: 'Male', value: 'male' },
      { id: 'non_binary', text: 'Non-binary', value: 'non_binary' },
      { id: 'prefer_not_to_say', text: 'Prefer not to say', value: 'prefer_not_to_say' }
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
      { id: 'cold', text: 'Cold', value: 'cold', description: 'Hill stations and northern regions' },
      { id: 'varied', text: 'Varied/Seasonal', value: 'varied', description: 'Significant seasonal changes' }
    ]
  },
  {
    id: 'lifestyle',
    text: 'Which best describes your lifestyle?',
    description: 'Your daily activities affect your skin\'s needs.',
    type: 'single' as const,
    answers: [
      { id: 'office_indoor', text: 'Office Worker (Mostly Indoors)', value: 'office_indoor' },
      { id: 'outdoor_active', text: 'Outdoor Worker/Very Active', value: 'outdoor_active' },
      { id: 'mixed_environment', text: 'Mixed Indoor/Outdoor', value: 'mixed_environment' },
      { id: 'student', text: 'Student', value: 'student' },
      { id: 'work_from_home', text: 'Work from Home', value: 'work_from_home' }
    ]
  },
  {
    id: 'currentProducts',
    text: 'What products do you currently use?',
    description: 'Tell us about your current skincare routine.',
    type: 'multiple' as const,
    answers: [
      { id: 'cleanser', text: 'Cleanser', value: 'cleanser' },
      { id: 'moisturizer', text: 'Moisturizer', value: 'moisturizer' },
      { id: 'sunscreen', text: 'Sunscreen', value: 'sunscreen' },
      { id: 'serum', text: 'Serums/Treatments', value: 'serum' },
      { id: 'toner', text: 'Toner', value: 'toner' },
      { id: 'exfoliant', text: 'Exfoliants', value: 'exfoliant' },
      { id: 'none', text: 'No regular routine', value: 'none' }
    ]
  },
  {
    id: 'routineFrequency',
    text: 'How often do you follow a skincare routine?',
    type: 'single' as const,
    answers: [
      { id: 'twice_daily', text: 'Twice daily (morning & evening)', value: 'twice_daily' },
      { id: 'once_daily', text: 'Once daily', value: 'once_daily' },
      { id: 'few_times_week', text: 'Few times a week', value: 'few_times_week' },
      { id: 'occasionally', text: 'Occasionally', value: 'occasionally' },
      { id: 'never', text: 'I don\'t have a routine', value: 'never' }
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
    id: 'primaryGoals',
    text: 'What are your main skincare goals?',
    description: 'Select your top priorities (choose up to 3).',
    type: 'multiple' as const,
    answers: [
      { id: 'clear_acne', text: 'Clear Acne', value: 'clear_acne' },
      { id: 'anti_aging', text: 'Anti-Aging', value: 'anti_aging' },
      { id: 'brighten_skin', text: 'Brighten Skin Tone', value: 'brighten_skin' },
      { id: 'hydrate_skin', text: 'Hydrate Skin', value: 'hydrate_skin' },
      { id: 'minimize_pores', text: 'Minimize Pores', value: 'minimize_pores' },
      { id: 'even_texture', text: 'Even Skin Texture', value: 'even_texture' },
      { id: 'sun_protection', text: 'Sun Protection', value: 'sun_protection' },
      { id: 'gentle_care', text: 'Gentle Daily Care', value: 'gentle_care' }
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
  
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const steps = [
    { id: 1, label: 'Personal Info' },
    { id: 2, label: 'Skin Analysis' },
    { id: 3, label: 'Lifestyle' },
    { id: 4, label: 'Goals & Budget' },
    { id: 5, label: 'Results' }
  ];

  useEffect(() => {
    if (currentQuestionIndex < 3) {
      setCurrentStep(1);
    } else if (currentQuestionIndex < 6) {
      setCurrentStep(2);
    } else if (currentQuestionIndex < 10) {
      setCurrentStep(3);
    } else if (currentQuestionIndex < questions.length) {
      setCurrentStep(4);
    } else {
      setCurrentStep(5);
    }
  }, [currentQuestionIndex]);

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
      // Generate basic recommendations (enhanced engine temporarily disabled)
      const enhancedRecommendations = {
        recommendations: {
          essential: [],
          targeted: []
        },
        budget_summary: {
          total_cost: 0,
          product_count: 0,
          cost_per_month: 0
        },
        routine_suggestions: {
          morning: ['Cleanser', 'Moisturizer', 'Sunscreen'],
          evening: ['Cleanser', 'Treatment', 'Moisturizer']
        },
        warnings: []
      };

      setRecommendations(enhancedRecommendations);
      
      // Save to database if user is authenticated
      if (user) {
        await saveAssessmentToDatabase(assessmentData, enhancedRecommendations);
        toast.success('Assessment completed and saved!');
      } else {
        toast.success('Assessment completed! Sign up to save your results.');
      }
      
      setShowResults(true);
      setCurrentStep(5);
      
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
          medical_conditions: Array.isArray(assessmentData.medicalConditions) ? assessmentData.medicalConditions : [assessmentData.medicalConditions].filter(Boolean),
          other_medical_condition: assessmentData.otherConditions,
          current_medications: assessmentData.currentMedications,
          age_range: assessmentData.ageRange,
          gender: assessmentData.gender,
          climate: assessmentData.climate,
          lifestyle_factors: [assessmentData.lifestyle].filter(Boolean),
          current_products: assessmentData.currentProducts || {},
          routine_frequency: assessmentData.routineFrequency,
          budget_range: assessmentData.budget,
          primary_goals: Array.isArray(assessmentData.primaryGoals) ? assessmentData.primaryGoals : [assessmentData.primaryGoals].filter(Boolean),
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

    return (
      <motion.div 
        className="max-w-6xl mx-auto space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
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

          {/* Warnings */}
          {recommendations.warnings && recommendations.warnings.length > 0 && (
            <div className="mb-8 bg-gradient-to-r from-warning-50 to-warning-100 rounded-2xl p-6 border border-warning-200">
              <h3 className="text-lg font-bold text-warning-800 mb-4">⚠️ Important Notes</h3>
              <div className="space-y-2">
                {recommendations.warnings.map((warning: any, index: number) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="text-warning-600">•</span>
                    <p className="text-sm text-warning-700">{warning.message || warning}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
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
            Generating Your Personalized Recommendations
          </h3>
          <p className="text-neutral-600">Analyzing your responses with our advanced algorithm...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {showCelebration && <CelebrationScreen onComplete={handleCelebrationComplete} />}

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
                  Complete Skin Assessment 🇦🇺
                </motion.h1>
                <motion.p
                  className="text-neutral-600 text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  Answer 13 questions to get personalized Australian skincare recommendations
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
    </>
  );
};

export default AssessmentPage;