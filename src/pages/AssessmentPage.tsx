import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ProgressSteps from '../components/common/ProgressSteps';
import QuestionCard, { AnswerType } from '../components/assessment/QuestionCard';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { SkincareRecommendationEngine } from '../lib/recommendationEngine';

type Question = {
  id: string;
  text: string;
  description?: string;
  type: 'single' | 'multiple' | 'slider' | 'text';
  answers: AnswerType[];
  dependsOn?: { 
    questionId: string; 
    values: any[]; 
  };
};

const questions: Question[] = [
  {
    id: 'skinType',
    text: 'What is your skin type?',
    description: 'Select the option that best describes how your skin feels most days.',
    type: 'single',
    answers: [
      { 
        id: 'dry', 
        text: 'Dry', 
        value: 'dry',
        description: 'Skin feels tight, may have flaky patches, and lacks natural oils'
      },
      { 
        id: 'oily', 
        text: 'Oily',
        value: 'oily',
        description: 'Excess shine throughout the day, especially in T-zone area'
      },
      { 
        id: 'combination', 
        text: 'Combination',
        value: 'combination',
        description: 'Oily T-zone with normal to dry cheeks'
      },
      { 
        id: 'normal', 
        text: 'Normal',
        value: 'normal',
        description: 'Well-balanced, neither too oily nor too dry'
      },
      { 
        id: 'sensitive', 
        text: 'Sensitive',
        value: 'sensitive',
        description: 'Easily irritated, may experience redness or reactions'
      }
    ]
  },
  {
    id: 'skinConcerns',
    text: 'What are your main skin concerns?',
    description: 'Select all that apply to your skin. You can choose multiple options.',
    type: 'multiple',
    answers: [
      { 
        id: 'acne', 
        text: 'Acne & Breakouts',
        value: 'acne',
        description: 'Regular occurrence of pimples, blackheads, or whiteheads'
      },
      { 
        id: 'aging', 
        text: 'Fine Lines & Wrinkles',
        value: 'aging',
        description: 'Visible signs of aging including fine lines and loss of firmness'
      },
      { 
        id: 'hyperpigmentation', 
        text: 'Dark Spots & Hyperpigmentation',
        value: 'hyperpigmentation',
        description: 'Uneven skin tone, dark patches, or post-acne marks'
      },
      { 
        id: 'texture', 
        text: 'Uneven Texture',
        value: 'texture',
        description: 'Rough skin texture, bumps, or lack of smoothness'
      },
      { 
        id: 'dryness', 
        text: 'Dryness & Dehydration',
        value: 'dryness',
        description: 'Lack of moisture, flakiness, or tight feeling'
      },
      { 
        id: 'oiliness', 
        text: 'Excess Oil & Shine',
        value: 'oiliness',
        description: 'Persistent oiliness and unwanted shine'
      },
      { 
        id: 'pores', 
        text: 'Large Pores',
        value: 'pores',
        description: 'Visible or enlarged pores, especially in T-zone'
      },
      { 
        id: 'sensitivity', 
        text: 'Sensitivity & Redness',
        value: 'sensitivity',
        description: 'Easily irritated skin, redness, or reactive to products'
      }
    ]
  },
  {
    id: 'medicalConditions',
    text: 'Do you have any of these skin-related medical conditions?',
    description: 'Select all that apply. This helps us provide safer, more appropriate recommendations.',
    type: 'multiple',
    answers: [
      { 
        id: 'eczema', 
        text: 'Eczema/Atopic Dermatitis',
        value: 'eczema',
        description: 'Chronic inflammatory skin condition with dry, itchy patches'
      },
      { 
        id: 'psoriasis', 
        text: 'Psoriasis',
        value: 'psoriasis',
        description: 'Autoimmune condition causing scaly, red patches'
      },
      { 
        id: 'rosacea', 
        text: 'Rosacea',
        value: 'rosacea',
        description: 'Chronic condition causing facial redness and visible blood vessels'
      },
      { 
        id: 'cystic-acne', 
        text: 'Severe/Cystic Acne',
        value: 'cystic-acne',
        description: 'Deep, painful acne cysts and nodules'
      },
      { 
        id: 'melasma', 
        text: 'Melasma',
        value: 'melasma',
        description: 'Brown or gray patches, often triggered by hormones'
      },
      { 
        id: 'seborrheic-dermatitis', 
        text: 'Seborrheic Dermatitis',
        value: 'seborrheic-dermatitis',
        description: 'Scaly, itchy rash often affecting oily areas'
      },
      { 
        id: 'contact-dermatitis', 
        text: 'Contact Dermatitis',
        value: 'contact-dermatitis',
        description: 'Allergic reactions to specific ingredients or materials'
      },
      { 
        id: 'sun-damage', 
        text: 'Sun Damage/Photoaging',
        value: 'sun-damage',
        description: 'Premature aging and damage from UV exposure'
      },
      { 
        id: 'none', 
        text: 'None of the above',
        value: 'none',
        description: 'I don\'t have any diagnosed skin conditions'
      }
    ]
  },
  {
    id: 'otherConditions',
    text: 'Do you have any other skin conditions or concerns?',
    description: 'Please describe any other medical conditions, allergies, or specific skin concerns not mentioned above.',
    type: 'text',
    answers: []
  },
  {
    id: 'lifestyle',
    text: 'What best describes your daily lifestyle?',
    description: 'This helps us recommend appropriate afternoon routine adjustments.',
    type: 'single',
    answers: [
      { 
        id: 'office-indoor', 
        text: 'Office Worker (Mostly Indoors)',
        value: 'office-indoor',
        description: 'Spend most of the day in air-conditioned indoor environments'
      },
      { 
        id: 'outdoor-active', 
        text: 'Outdoor Worker/Very Active',
        value: 'outdoor-active',
        description: 'Frequently outdoors, exposed to sun, wind, and elements'
      },
      { 
        id: 'mixed-environment', 
        text: 'Mixed Indoor/Outdoor',
        value: 'mixed-environment',
        description: 'Balance of indoor and outdoor activities throughout the day'
      },
      { 
        id: 'student', 
        text: 'Student',
        value: 'student',
        description: 'Classroom, library, and campus environments'
      },
      { 
        id: 'work-from-home', 
        text: 'Work from Home',
        value: 'work-from-home',
        description: 'Primarily at home with minimal sun exposure'
      }
    ]
  },
  {
    id: 'ageRange',
    text: 'What is your age range?',
    description: 'Age helps us tailor supplement and skincare recommendations appropriately.',
    type: 'single',
    answers: [
      { 
        id: 'teens', 
        text: '13-19 years',
        value: 'teens',
        description: 'Teenage years with hormonal changes'
      },
      { 
        id: 'twenties', 
        text: '20-29 years',
        value: 'twenties',
        description: 'Early adulthood, prevention-focused care'
      },
      { 
        id: 'thirties', 
        text: '30-39 years',
        value: 'thirties',
        description: 'Early signs of aging, maintenance phase'
      },
      { 
        id: 'forties', 
        text: '40-49 years',
        value: 'forties',
        description: 'Visible aging signs, corrective treatments'
      },
      { 
        id: 'fifties-plus', 
        text: '50+ years',
        value: 'fifties-plus',
        description: 'Mature skin with advanced aging concerns'
      }
    ]
  },
  {
    id: 'gender',
    text: 'What is your gender?',
    description: 'This helps us provide more targeted recommendations.',
    type: 'single',
    answers: [
      { 
        id: 'female', 
        text: 'Female',
        value: 'female',
        description: 'Female'
      },
      { 
        id: 'male', 
        text: 'Male',
        value: 'male',
        description: 'Male'
      },
      { 
        id: 'non-binary', 
        text: 'Non-binary',
        value: 'non-binary',
        description: 'Non-binary'
      },
      { 
        id: 'prefer-not-to-say', 
        text: 'Prefer not to say',
        value: 'prefer-not-to-say',
        description: 'Prefer not to say'
      }
    ]
  },
  {
    id: 'skinSensitivity',
    text: 'How sensitive is your skin?',
    description: 'Rate your skin\'s sensitivity when trying new products.',
    type: 'slider',
    answers: [
      { id: '1', text: 'Not Sensitive', value: 1 },
      { id: '2', text: '', value: 2 },
      { id: '3', text: '', value: 3 },
      { id: '4', text: '', value: 4 },
      { id: '5', text: 'Extremely Sensitive', value: 5 }
    ]
  },
  {
    id: 'climate',
    text: 'What climate do you live in?',
    description: 'This helps us recommend products suitable for your environment.',
    type: 'single',
    answers: [
      { 
        id: 'hot_humid', 
        text: 'Hot and Humid',
        value: 'hot_humid',
        description: 'e.g., Mumbai, Chennai, Kolkata'
      },
      { 
        id: 'hot_dry', 
        text: 'Hot and Dry',
        value: 'hot_dry',
        description: 'e.g., Delhi, Rajasthan, Gujarat'
      },
      { 
        id: 'moderate', 
        text: 'Moderate',
        value: 'moderate',
        description: 'e.g., Bangalore, Pune, Dehradun'
      },
      { 
        id: 'cold', 
        text: 'Cold',
        value: 'cold',
        description: 'e.g., Shimla, Manali, Srinagar'
      },
      { 
        id: 'varied', 
        text: 'Varied/Seasonal',
        value: 'varied',
        description: 'Significant changes between seasons'
      }
    ]
  },
  {
    id: 'budget',
    text: 'What is your typical budget for skincare products?',
    description: 'This helps us recommend products within your price range.',
    type: 'single',
    answers: [
      { 
        id: 'budget', 
        text: 'Budget-Friendly (₹500 or less)',
        value: 'budget',
        description: 'Affordable drugstore and local brands'
      },
      { 
        id: 'mid-range', 
        text: 'Mid-Range (₹500-1500)',
        value: 'mid-range',
        description: 'Quality brands with good ingredients'
      },
      { 
        id: 'premium', 
        text: 'Premium (₹1500-3000)',
        value: 'premium',
        description: 'High-end brands and specialized treatments'
      },
      { 
        id: 'luxury', 
        text: 'Luxury (₹3000+)',
        value: 'luxury',
        description: 'Luxury brands and professional treatments'
      }
    ]
  },
  {
    id: 'experience',
    text: 'How experienced are you with skincare?',
    description: 'This helps us adjust our recommendations to your comfort level.',
    type: 'single',
    answers: [
      { 
        id: 'beginner', 
        text: 'Beginner',
        value: 'beginner',
        description: 'New to skincare, looking for basic guidance'
      },
      { 
        id: 'intermediate', 
        text: 'Intermediate',
        value: 'intermediate',
        description: 'Familiar with basic routines and some ingredients'
      },
      { 
        id: 'advanced', 
        text: 'Advanced',
        value: 'advanced',
        description: 'Well-versed in skincare and active ingredients'
      },
      { 
        id: 'expert', 
        text: 'Expert',
        value: 'expert',
        description: 'Deep understanding of skincare science and formulations'
      }
    ]
  },
  {
    id: 'primaryGoals',
    text: 'What are your primary skincare goals?',
    description: 'Select your top 3 goals to help us prioritize recommendations.',
    type: 'multiple',
    answers: [
      { 
        id: 'clear-acne', 
        text: 'Clear Acne',
        value: 'clear-acne',
        description: 'Reduce breakouts and prevent new acne'
      },
      { 
        id: 'anti-aging', 
        text: 'Anti-Aging',
        value: 'anti-aging',
        description: 'Reduce fine lines and prevent aging'
      },
      { 
        id: 'brighten-skin', 
        text: 'Brighten Skin',
        value: 'brighten-skin',
        description: 'Even skin tone and add radiance'
      },
      { 
        id: 'hydrate-skin', 
        text: 'Hydrate Skin',
        value: 'hydrate-skin',
        description: 'Improve moisture and plumpness'
      },
      { 
        id: 'minimize-pores', 
        text: 'Minimize Pores',
        value: 'minimize-pores',
        description: 'Reduce appearance of large pores'
      },
      { 
        id: 'sun-protection', 
        text: 'Sun Protection',
        value: 'sun-protection',
        description: 'Prevent UV damage and photoaging'
      }
    ]
  }
];

const AssessmentPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [productRecommendations, setProductRecommendations] = useState<any[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const steps = [
    { id: 1, label: 'Basics' },
    { id: 2, label: 'Concerns' },
    { id: 3, label: 'Medical' },
    { id: 4, label: 'Lifestyle' },
    { id: 5, label: 'Preferences' },
    { id: 6, label: 'Results' }
  ];

  useEffect(() => {
    if (currentQuestionIndex < 2) {
      setCurrentStep(1);
    } else if (currentQuestionIndex < 4) {
      setCurrentStep(2);
    } else if (currentQuestionIndex < 6) {
      setCurrentStep(3);
    } else if (currentQuestionIndex < 9) {
      setCurrentStep(4);
    } else if (currentQuestionIndex < questions.length) {
      setCurrentStep(5);
    } else {
      setCurrentStep(6);
    }
  }, [currentQuestionIndex]);

  const saveAssessmentToDatabase = async (assessmentData: any) => {
    try {
      const { data, error } = await supabase
        .from('skin_assessments')
        .insert({
          user_id: user?.id || null,
          skin_type: assessmentData.skinType,
          skin_concerns: Array.isArray(assessmentData.skinConcerns) ? assessmentData.skinConcerns : [],
          skin_sensitivity: assessmentData.skinSensitivity || 3,
          medical_conditions: Array.isArray(assessmentData.medicalConditions) ? assessmentData.medicalConditions : [],
          other_medical_condition: assessmentData.otherConditions || null,
          age_range: assessmentData.ageRange,
          gender: assessmentData.gender,
          climate: assessmentData.climate,
          lifestyle_factors: [assessmentData.lifestyle],
          budget_range: assessmentData.budget,
          primary_goals: Array.isArray(assessmentData.primaryGoals) ? assessmentData.primaryGoals : [],
          ingredient_preferences: [],
          ingredient_allergies: [],
          assessment_score: calculateAssessmentScore(assessmentData),
          completed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving assessment:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to save assessment:', error);
      throw error;
    }
  };

  const generateRecommendations = async (assessmentData: any) => {
    try {
      const engine = new SkincareRecommendationEngine();
      
      const engineData = {
        skinType: assessmentData.skinType,
        concerns: assessmentData.skinConcerns || [],
        medicalConditions: assessmentData.medicalConditions || [],
        age: assessmentData.ageRange,
        gender: assessmentData.gender,
        sensitivity: assessmentData.skinSensitivity || 3,
        climate: assessmentData.climate,
        budget: assessmentData.budget,
        experience: assessmentData.experience,
        goals: assessmentData.primaryGoals || [],
        lifestyle: assessmentData.lifestyle,
        additionalConcerns: assessmentData.otherConditions || ''
      };

      const recommendations = await engine.generateRecommendations(user?.id || 'anonymous', engineData);
      return recommendations;
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
      throw error;
    }
  };

  const generateProductRecommendations = (assessmentData: any) => {
    const products = [
      {
        category: 'Cleanser',
        products: [
          {
            name: 'CeraVe Foaming Facial Cleanser',
            reason: `Recommended for ${assessmentData.skinType} skin type and gentle daily cleansing`,
            price: '₹899',
            rating: 4.5
          },
          {
            name: 'Neutrogena Ultra Gentle Daily Cleanser',
            reason: `Perfect for sensitive skin and ${assessmentData.skinType} skin type`,
            price: '₹649',
            rating: 4.3
          }
        ]
      },
      {
        category: 'Moisturizer',
        products: [
          {
            name: 'Olay Regenerist Micro-Sculpting Cream',
            reason: `Ideal for ${assessmentData.ageRange} age group and anti-aging concerns`,
            price: '₹1,299',
            rating: 4.4
          },
          {
            name: 'Cetaphil Daily Facial Moisturizer',
            reason: `Suitable for ${assessmentData.skinType} skin and daily hydration`,
            price: '₹799',
            rating: 4.2
          }
        ]
      },
      {
        category: 'Treatment',
        products: [
          {
            name: 'The Ordinary Niacinamide 10% + Zinc 1%',
            reason: `Targets ${assessmentData.skinConcerns?.join(', ')} concerns effectively`,
            price: '₹590',
            rating: 4.6
          },
          {
            name: 'Paula\'s Choice 2% BHA Liquid Exfoliant',
            reason: `Perfect for ${assessmentData.skinType} skin and pore concerns`,
            price: '₹2,200',
            rating: 4.7
          }
        ]
      },
      {
        category: 'Sunscreen',
        products: [
          {
            name: 'La Roche-Posay Anthelios Ultra Light',
            reason: `Essential daily protection for ${assessmentData.climate} climate`,
            price: '₹1,450',
            rating: 4.5
          },
          {
            name: 'Neutrogena Ultra Sheer Dry-Touch',
            reason: `Lightweight formula perfect for ${assessmentData.skinType} skin`,
            price: '₹899',
            rating: 4.3
          }
        ]
      }
    ];

    return products;
  };

  const calculateAssessmentScore = (data: any) => {
    let score = 50;
    
    if (Array.isArray(data.skinConcerns)) {
      score += data.skinConcerns.length * 5;
    }
    
    if (Array.isArray(data.medicalConditions) && !data.medicalConditions.includes('none')) {
      score += data.medicalConditions.length * 10;
    }
    
    if (data.skinSensitivity >= 4) {
      score += 15;
    }
    
    if (data.experience === 'advanced' || data.experience === 'expert') {
      score += 10;
    }
    
    return Math.min(score, 100);
  };

  const handleAnswer = async (questionId: string, value: any) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsSubmitting(true);
      
      try {
        const aiRecommendations = await generateRecommendations(newAnswers);
        setRecommendations(aiRecommendations);

        const products = generateProductRecommendations(newAnswers);
        setProductRecommendations(products);

        if (user) {
          await saveAssessmentToDatabase(newAnswers);
          toast.success('Assessment completed and saved!');
        } else {
          toast.success('Assessment completed! Sign up to save your results.');
        }
        
        setCurrentStep(6);
      } catch (error) {
        toast.error('Failed to process assessment. Please try again.');
        console.error('Assessment processing error:', error);
      } finally {
        setIsSubmitting(false);
      }
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
    setProductRecommendations([]);
    setCurrentStep(1);
  };
  
  const renderQuestion = () => {
    if (currentQuestionIndex >= questions.length) {
      return null;
    }
    
    const question = questions[currentQuestionIndex];
    
    if (question.id === 'medicalConditions') {
      return (
        <AnimatePresence mode="wait">
          <div key={question.id}>
            <QuestionCard
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
            <div className="mt-6 max-w-2xl mx-auto">
              <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
                <p className="text-sm text-warning-800">
                  <strong>Medical Disclaimer:</strong> This assessment is for informational purposes only and does not replace professional medical advice. Please consult with a dermatologist or healthcare provider for proper diagnosis and treatment of skin conditions.
                </p>
              </div>
            </div>
          </div>
        </AnimatePresence>
      );
    }
    
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
    return (
      <motion.div 
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="card text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="w-24 h-24 mx-auto bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center mb-6 shadow-lg"
          >
            <svg 
              className="w-12 h-12 text-white"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            Assessment Complete! 🎉
          </h2>
          <p className="text-neutral-600 mb-8 text-lg">
            We've analyzed your responses and created a comprehensive skincare profile for you.
            {user && ' Your results have been saved to your account.'}
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <motion.div 
              className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 border border-primary-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold mb-4 text-primary-800">Your Skin Profile</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between">
                  <span className="text-neutral-600">Skin Type:</span>
                  <span className="font-medium capitalize text-primary-700">{answers.skinType}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-neutral-600">Sensitivity:</span>
                  <span className="font-medium text-primary-700">{answers.skinSensitivity}/5</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-neutral-600">Age Range:</span>
                  <span className="font-medium text-primary-700">
                    {answers.ageRange === 'teens' ? '13-19' :
                     answers.ageRange === 'twenties' ? '20-29' :
                     answers.ageRange === 'thirties' ? '30-39' :
                     answers.ageRange === 'forties' ? '40-49' : '50+'}
                  </span>
                </li>
              </ul>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-accent-50 to-accent-100 rounded-2xl p-6 border border-accent-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold mb-4 text-accent-800">Top Concerns</h3>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(answers.skinConcerns) && answers.skinConcerns.slice(0, 4).map((concern: string) => (
                  <span 
                    key={concern}
                    className="inline-block bg-white rounded-full px-3 py-1 text-xs font-medium text-accent-700 border border-accent-200"
                  >
                    {concern.charAt(0).toUpperCase() + concern.slice(1)}
                  </span>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-success-50 to-success-100 rounded-2xl p-6 border border-success-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold mb-4 text-success-800">Lifestyle</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between">
                  <span className="text-neutral-600">Environment:</span>
                  <span className="font-medium text-success-700">
                    {answers.lifestyle === 'office-indoor' ? 'Indoor' :
                     answers.lifestyle === 'outdoor-active' ? 'Outdoor' :
                     answers.lifestyle === 'mixed-environment' ? 'Mixed' :
                     answers.lifestyle === 'student' ? 'Student' : 'Home'}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-neutral-600">Climate:</span>
                  <span className="font-medium text-success-700">
                    {answers.climate === 'hot_humid' ? 'Hot & Humid' :
                     answers.climate === 'hot_dry' ? 'Hot & Dry' :
                     answers.climate === 'moderate' ? 'Moderate' :
                     answers.climate === 'cold' ? 'Cold' : 'Varied'}
                  </span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Enhanced Product Recommendations */}
          {productRecommendations.length > 0 && (
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Personalized Product Recommendations
              </h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {productRecommendations.map((category, index) => (
                  <motion.div
                    key={category.category}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <h4 className="text-lg font-semibold mb-4 text-neutral-800">{category.category}</h4>
                    <div className="space-y-4">
                      {category.products.map((product: any, productIndex: number) => (
                        <div key={productIndex} className="border-b border-neutral-100 pb-3 last:border-b-0">
                          <h5 className="font-medium text-sm text-neutral-800 mb-1">{product.name}</h5>
                          <p className="text-xs text-neutral-600 mb-2">{product.reason}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-primary-600">{product.price}</span>
                            <div className="flex items-center">
                              <span className="text-xs text-warning-600 mr-1">★</span>
                              <span className="text-xs text-neutral-500">{product.rating}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* AI Recommendations Section */}
          {recommendations && (
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                AI-Powered Ingredient Recommendations
              </h3>
              
              {recommendations.recommendations.essential && recommendations.recommendations.essential.length > 0 && (
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 mb-6 text-left border border-primary-200">
                  <h4 className="text-lg font-semibold mb-4 text-primary-800">Essential Ingredients</h4>
                  <div className="space-y-4">
                    {recommendations.recommendations.essential.map((rec: any, index: number) => (
                      <motion.div 
                        key={index} 
                        className="bg-white/80 rounded-xl p-4 shadow-sm"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                      >
                        <h5 className="font-semibold text-primary-700 mb-1">
                          {rec.ingredient.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </h5>
                        <p className="text-sm text-neutral-600 mb-2">{rec.reasoning}</p>
                        {rec.matchScore && (
                          <div className="flex items-center">
                            <div className="w-full bg-neutral-200 rounded-full h-2 mr-3">
                              <div 
                                className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${rec.matchScore}%` }}
                              />
                            </div>
                            <span className="text-xs text-neutral-500 font-medium">{rec.matchScore}% match</span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {recommendations.recommendations.targeted && recommendations.recommendations.targeted.length > 0 && (
                <div className="bg-gradient-to-br from-accent-50 to-accent-100 rounded-2xl p-6 mb-6 text-left border border-accent-200">
                  <h4 className="text-lg font-semibold mb-4 text-accent-800">Targeted Treatments</h4>
                  <div className="space-y-4">
                    {recommendations.recommendations.targeted.map((rec: any, index: number) => (
                      <motion.div 
                        key={index} 
                        className="bg-white/80 rounded-xl p-4 shadow-sm"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 + index * 0.1 }}
                      >
                        <h5 className="font-semibold text-accent-700 mb-1">
                          {rec.ingredient.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </h5>
                        <p className="text-sm text-neutral-600 mb-2">{rec.reasoning}</p>
                        {rec.matchScore && (
                          <div className="flex items-center">
                            <div className="w-full bg-neutral-200 rounded-full h-2 mr-3">
                              <div 
                                className="bg-gradient-to-r from-accent-500 to-warning-500 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${rec.matchScore}%` }}
                              />
                            </div>
                            <span className="text-xs text-neutral-500 font-medium">{rec.matchScore}% match</span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {recommendations.warnings && recommendations.warnings.length > 0 && (
                <div className="bg-gradient-to-br from-warning-50 to-warning-100 rounded-2xl p-6 mb-6 text-left border border-warning-200">
                  <h4 className="text-lg font-semibold mb-4 text-warning-800">Important Warnings</h4>
                  <div className="space-y-3">
                    {recommendations.warnings.map((warning: any, index: number) => (
                      <motion.div 
                        key={index} 
                        className="flex items-start bg-white/80 rounded-xl p-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2 + index * 0.1 }}
                      >
                        <span className="text-warning-600 mr-3 mt-0.5">⚠️</span>
                        <p className="text-sm text-warning-700">{warning.message}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {recommendations.timeline && (
                <div className="bg-gradient-to-br from-success-50 to-success-100 rounded-2xl p-6 mb-6 text-left border border-success-200">
                  <h4 className="text-lg font-semibold mb-4 text-success-800">Introduction Timeline</h4>
                  <div className="space-y-3">
                    {Object.entries(recommendations.timeline).map(([period, instruction]: [string, any], index) => (
                      <motion.div 
                        key={period} 
                        className="flex bg-white/80 rounded-xl p-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.4 + index * 0.1 }}
                      >
                        <span className="font-semibold text-success-700 mr-4 capitalize min-w-0 flex-shrink-0">
                          {period.replace(/_/g, ' ')}:
                        </span>
                        <span className="text-sm text-success-600">{instruction}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
          
          {Array.isArray(answers.medicalConditions) && answers.medicalConditions.length > 0 && !answers.medicalConditions.includes('none') && (
            <motion.div 
              className="bg-gradient-to-br from-warning-50 to-warning-100 rounded-2xl p-6 mb-8 border border-warning-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h3 className="text-lg font-semibold mb-3 text-warning-800">Medical Considerations</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {answers.medicalConditions.map((condition: string) => (
                  <span 
                    key={condition}
                    className="inline-block bg-white rounded-full px-4 py-2 text-sm font-medium text-warning-800 border border-warning-200"
                  >
                    {condition.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </span>
                ))}
              </div>
              <p className="text-sm text-warning-700">
                Our recommendations have been adjusted to be gentle and suitable for your skin conditions. Always consult your dermatologist before trying new products.
              </p>
            </motion.div>
          )}
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <motion.button 
              onClick={() => navigate('/routine')}
              className="btn btn-primary bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View Smart Routines & Supplements
            </motion.button>
            <motion.button
              onClick={() => navigate('/ingredients')}
              className="btn btn-outline bg-white/80 backdrop-blur-sm border-white/50 hover:bg-white/90"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Explore Safe Ingredients
            </motion.button>
            <motion.button
              onClick={handleRetakeAssessment}
              className="btn btn-ghost text-neutral-600 hover:text-neutral-800"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Retake Assessment
            </motion.button>
          </div>

          {!user && (
            <motion.div 
              className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl border border-primary-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <p className="text-primary-700 mb-4 text-lg">
                <strong>Save Your Results:</strong> Create an account to save your assessment and get personalized recommendations.
              </p>
              <motion.button
                onClick={() => navigate('/signup')}
                className="btn btn-primary bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Create Account
              </motion.button>
            </motion.div>
          )}
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
          <p className="text-neutral-600">Our AI is analyzing your responses to create the perfect skincare routine...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-accent-50/30 pt-24 pb-16 px-4">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Comprehensive Skin Assessment
          </motion.h1>
          <motion.p 
            className="text-neutral-600 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Complete our detailed assessment to receive personalized skincare routines, supplement recommendations, and safe ingredient guidance.
          </motion.p>
        </div>
        
        <div className="max-w-4xl mx-auto mb-10">
          <ProgressSteps 
            steps={steps} 
            currentStep={currentStep}
            onChange={(stepId) => {
              if (stepId <= currentStep) {
                setCurrentStep(stepId);
                if (stepId === 1) setCurrentQuestionIndex(0);
                else if (stepId === 2) setCurrentQuestionIndex(2);
                else if (stepId === 3) setCurrentQuestionIndex(4);
                else if (stepId === 4) setCurrentQuestionIndex(6);
                else if (stepId === 5) setCurrentQuestionIndex(9);
              }
            }}
          />
        </div>
        
        {currentStep < 6 ? renderQuestion() : renderResults()}
      </div>
    </div>
  );
};

export default AssessmentPage;