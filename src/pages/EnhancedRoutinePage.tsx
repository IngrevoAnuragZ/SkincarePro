import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Sunset, Moon, Download, Info, Calendar as CalendarIcon, ShoppingBag, Star } from 'lucide-react';
import Button from '../components/common/Button';
import RoutineCard from '../components/routine/RoutineCard';
import CalendarIntegration from '../components/calendar/CalendarIntegration';
import { useAuth } from '../hooks/useAuth';
import DynamicSkincareRecommendationEngine from '../lib/dynamicRecommendationEngine';

// Enhanced routine data with product recommendations
const sampleMorningRoutine = {
  id: 'm1',
  title: 'Budget-Friendly Morning Routine',
  time: 'morning' as const,
  steps: [
    {
      id: 'm1s1',
      productName: 'Simple Refreshing Facial Wash',
      brand: 'Simple',
      price: 199,
      productType: 'Cleanser',
      timing: '30 seconds',
      description: 'Start your day with a gentle cleanser to remove impurities without stripping your skin.',
      benefits: ['No artificial perfumes', 'Vitamin B5', 'Triple purified water']
    },
    {
      id: 'm1s2',
      productName: 'Minimalist Niacinamide 10%',
      brand: 'Minimalist',
      price: 349,
      productType: 'Treatment',
      timing: 'Wait 2 minutes',
      description: 'Controls oil production and reduces inflammation for clearer skin.',
      benefits: ['Controls oil production', 'Minimizes pore appearance', 'Reduces inflammation']
    },
    {
      id: 'm1s3',
      productName: 'Pond\'s Super Light Gel',
      brand: 'Pond\'s',
      price: 199,
      productType: 'Moisturizer',
      timing: 'Wait 1 minute',
      description: 'Lock in hydration with a lightweight gel moisturizer suitable for Indian climate.',
      benefits: ['Non-greasy formula', 'Quick absorption', 'Hyaluronic acid']
    },
    {
      id: 'm1s4',
      productName: 'Neutrogena Ultra Sheer Sunscreen SPF 50+',
      brand: 'Neutrogena',
      price: 449,
      productType: 'Sun Protection',
      timing: 'Apply generously',
      description: 'Finish with broad-spectrum sunscreen to protect from harmful UV rays.',
      benefits: ['Dry-touch technology', 'Lightweight', 'Non-comedogenic']
    }
  ]
};

const sampleAfternoonRoutine = {
  id: 'a1',
  title: 'Midday Refresh & Protection',
  time: 'afternoon' as const,
  steps: [
    {
      id: 'a1s1',
      productName: 'Hydrating Face Mist',
      brand: 'Generic',
      price: 299,
      productType: 'Refresher',
      timing: 'As needed',
      description: 'Refresh and hydrate skin while providing antioxidant protection.'
    },
    {
      id: 'a1s2',
      productName: 'Sunscreen Reapplication',
      brand: 'Neutrogena',
      price: 449,
      productType: 'Sun Protection',
      timing: 'Every 2-3 hours',
      description: 'Reapply sunscreen for continued protection, especially if outdoors.'
    },
    {
      id: 'a1s3',
      productName: 'Blotting Papers (if needed)',
      brand: 'Generic',
      price: 99,
      productType: 'Oil Control',
      timing: 'As needed',
      description: 'Gently blot excess oil without disturbing makeup or skincare.'
    }
  ]
};

const sampleEveningRoutine = {
  id: 'e1',
  title: 'Budget Evening Repair Routine',
  time: 'evening' as const,
  steps: [
    {
      id: 'e1s1',
      productName: 'Simple Micellar Water',
      brand: 'Simple',
      price: 299,
      productType: 'Makeup Remover',
      timing: '1 minute',
      description: 'Remove makeup and surface impurities gently.'
    },
    {
      id: 'e1s2',
      productName: 'Simple Refreshing Facial Wash',
      brand: 'Simple',
      price: 199,
      productType: 'Cleanser',
      timing: '30 seconds',
      description: 'Deeply cleanse skin without disrupting its natural balance.'
    },
    {
      id: 'e1s3',
      productName: 'The Ordinary Hyaluronic Acid 2% + B5',
      brand: 'The Ordinary',
      price: 490,
      productType: 'Treatment',
      timing: 'Wait 3 minutes',
      description: 'Intense hydration and moisture retention for plumper skin.',
      benefits: ['Intense hydration', 'Plumps fine lines', 'Suitable for all skin types']
    },
    {
      id: 'e1s4',
      productName: 'Nivea Soft Light Moisturizer',
      brand: 'Nivea',
      price: 149,
      productType: 'Moisturizer',
      timing: 'Final step',
      description: 'Restore and repair skin overnight with gentle hydration.',
      benefits: ['24-hour hydration', 'Vitamin E', 'Jojoba oil']
    }
  ]
};

const EnhancedRoutinePage: React.FC = () => {
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [showCalendarIntegration, setShowCalendarIntegration] = useState(false);
  const [routines, setRoutines] = useState([sampleMorningRoutine, sampleAfternoonRoutine, sampleEveningRoutine]);
  const [totalBudget, setTotalBudget] = useState(0);
  const { user } = useAuth();

  // Mock assessment ID - in real app, this would come from the user's latest assessment
  const mockAssessmentId = 1;

  useEffect(() => {
    // Calculate total budget from all routines
    const total = routines.reduce((sum, routine) => {
      return sum + routine.steps.reduce((stepSum, step) => stepSum + (step.price || 0), 0);
    }, 0);
    setTotalBudget(total);
  }, [routines]);

  const toggleStepCompletion = (stepId: string) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  const exportRoutine = () => {
    const routineText = `
INGREVO PERSONALIZED SKINCARE ROUTINE

MORNING ROUTINE:
${routines[0].steps.map((step, index) => 
  `${index + 1}. ${step.productName} - ${step.brand} (₹${step.price})
     Timing: ${step.timing}
     ${step.description}
     Benefits: ${step.benefits?.join(', ') || 'General skincare benefits'}`
).join('\n\n')}

AFTERNOON ROUTINE:
${routines[1].steps.map((step, index) => 
  `${index + 1}. ${step.productName} - ${step.brand} (₹${step.price})
     Timing: ${step.timing}
     ${step.description}`
).join('\n\n')}

EVENING ROUTINE:
${routines[2].steps.map((step, index) => 
  `${index + 1}. ${step.productName} - ${step.brand} (₹${step.price})
     Timing: ${step.timing}
     ${step.description}
     Benefits: ${step.benefits?.join(', ') || 'General skincare benefits'}`
).join('\n\n')}

TOTAL BUDGET: ₹${totalBudget}

Generated by Ingrevo - Your AI Skincare Assistant
Visit: https://ingrevoskin.netlify.app
    `;
    
    const blob = new Blob([routineText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ingrevo-skincare-routine.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderInteractiveRoutine = (routine: any, timeIcon: React.ReactNode) => {
    return (
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            {timeIcon}
            <div className="ml-3">
              <h3 className="text-xl font-semibold">{routine.title}</h3>
              <p className="text-sm text-neutral-500 capitalize">{routine.time} Routine</p>
              <div className="flex items-center mt-1">
                <ShoppingBag size={14} className="text-primary-500 mr-1" />
                <span className="text-sm font-medium text-primary-600">
                  ₹{routine.steps.reduce((sum: number, step: any) => sum + (step.price || 0), 0)}
                </span>
              </div>
            </div>
          </div>
          <div className="text-sm text-neutral-500">
            {routine.steps.filter((step: any) => completedSteps[step.id]).length}/{routine.steps.length} completed
          </div>
        </div>

        <div className="space-y-4">
          {routine.steps.map((step: any, index: number) => (
            <motion.div 
              key={step.id}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                completedSteps[step.id] 
                  ? 'border-success-200 bg-success-50' 
                  : 'border-neutral-200 hover:border-primary-200'
              }`}
              onClick={() => toggleStepCompletion(step.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start">
                <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 mt-1 transition-all ${
                  completedSteps[step.id]
                    ? 'border-success-500 bg-success-500'
                    : 'border-neutral-300 hover:border-primary-500'
                }`}>
                  {completedSteps[step.id] && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      width="14" 
                      height="14" 
                      viewBox="0 0 14 14" 
                      fill="none"
                    >
                      <path 
                        d="M11 4L5.5 9.5L3 7" 
                        stroke="white" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  )}
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-semibold ${completedSteps[step.id] ? 'line-through text-neutral-500' : ''}`}>
                      {step.productName}
                    </h4>
                    <div className="flex items-center text-sm text-neutral-500">
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-neutral-500">{step.brand}</span>
                        <span className="text-xs font-medium text-primary-600">₹{step.price}</span>
                      </div>
                      <span className="mr-1">⏱️</span>
                      {step.timing}
                    </div>
                  </div>
                  
                  <p className="text-sm text-neutral-600 mb-2">{step.productType}</p>
                  <p className={`text-sm ${completedSteps[step.id] ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    {step.description}
                  </p>
                  
                  {step.benefits && (
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-1">
                        {step.benefits.slice(0, 2).map((benefit: string, idx: number) => (
                          <span key={idx} className="inline-block text-xs bg-success-100 text-success-700 rounded-full px-2 py-1">
                            {benefit}
                          </span>
                        ))}
                        {step.benefits.length > 2 && (
                          <span className="inline-block text-xs bg-neutral-100 text-neutral-600 rounded-full px-2 py-1">
                            +{step.benefits.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Smart Skincare Routines</h1>
            <p className="text-neutral-600 mb-6">
              Interactive routines customized for your skin profile with timing guidance and progress tracking.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                variant="outline"
                onClick={exportRoutine}
                icon={<Download size={18} />}
                iconPosition="left"
              >
                Export Routine
              </Button>
              {user && (
                <Button
                  variant="primary"
                  onClick={() => setShowCalendarIntegration(!showCalendarIntegration)}
                  icon={<CalendarIcon size={18} />}
                  iconPosition="left"
                >
                  {showCalendarIntegration ? 'Hide' : 'Add to'} Google Calendar
                </Button>
              )}
            </div>
          </motion.div>

          {/* Google Calendar Integration - Only show if user is authenticated */}
          {showCalendarIntegration && user && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-10"
            >
              <CalendarIntegration
                routines={routines}
                assessmentId={mockAssessmentId}
                userId={user.id}
              />
            </motion.div>
          )}

          <motion.div 
            className="bg-primary-50 rounded-xl p-6 mb-10 border border-primary-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center mr-4 flex-shrink-0">
                <Info size={20} className="text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Smart Routine Features</h3>
                <p className="text-neutral-600 mb-2">
                  These interactive routines adapt to your lifestyle and skin needs:
                </p>
                <ul className="list-disc list-inside space-y-1 text-neutral-600 text-sm">
                  <li>✅ Check off steps as you complete them to track progress</li>
                  <li>⏰ Follow timing recommendations for optimal absorption</li>
                  <li>📅 Add routines to Google Calendar with automatic reminders</li>
                  <li>🌤️ Afternoon routine adjusts based on your work environment</li>
                  <li>📄 Export your routine to share with dermatologists</li>
                  <li>💰 Budget-friendly product recommendations with pricing</li>
                  <li>🏷️ Real product names, brands, and benefits included</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Budget Summary */}
          <motion.div 
            className="bg-gradient-to-r from-success-50 to-success-100 rounded-xl p-6 mb-10 border border-success-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-success-200 flex items-center justify-center mr-4">
                  <ShoppingBag size={20} className="text-success-700" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-success-800">Complete Routine Budget</h3>
                  <p className="text-success-600">All products for your personalized routine</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-success-700">₹{totalBudget}</div>
                <div className="text-sm text-success-600">Total Investment</div>
                <div className="text-xs text-success-500">~₹{Math.round(totalBudget/3)}/month</div>
              </div>
            </div>
          </motion.div>
          {/* Interactive Routines */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Morning Routine */}
            <div>
              <motion.div 
                className="flex items-center mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Sun size={24} className="text-warning-500 mr-2" />
                <h2 className="text-xl font-bold">Morning Routine</h2>
              </motion.div>
              {renderInteractiveRoutine(routines[0], 
                <div className="h-12 w-12 rounded-full bg-warning-100 flex items-center justify-center">
                  <Sun size={24} className="text-warning-600" />
                </div>
              )}
            </div>

            {/* Afternoon Routine */}
            <div>
              <motion.div 
                className="flex items-center mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Sunset size={24} className="text-accent-500 mr-2" />
                <h2 className="text-xl font-bold">Afternoon Refresh</h2>
              </motion.div>
              {renderInteractiveRoutine(routines[1],
                <div className="h-12 w-12 rounded-full bg-accent-100 flex items-center justify-center">
                  <Sunset size={24} className="text-accent-600" />
                </div>
              )}
            </div>
          </div>

          {/* Evening Routine - Full Width */}
          <div className="mb-12">
            <motion.div 
              className="flex items-center mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Moon size={24} className="text-primary-500 mr-2" />
              <h2 className="text-xl font-bold">Evening Routine</h2>
            </motion.div>
            <div className="max-w-4xl mx-auto">
              {renderInteractiveRoutine(routines[2],
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <Moon size={24} className="text-primary-600" />
                </div>
              )}
            </div>
          </div>

          {/* Routine Builder CTA */}
          <motion.div 
            className="mt-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-8 text-white text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Get Your Personalized Routine?</h2>
              <p className="text-lg mb-6 opacity-90">
                Take our comprehensive skin assessment to get budget-specific routines with real product recommendations
              </p>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-6">
                <div className="flex items-center justify-center space-x-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">₹500</div>
                    <div className="text-sm opacity-90">Budget Option</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">₹1500</div>
                    <div className="text-sm opacity-90">Mid-Range</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">₹3000+</div>
                    <div className="text-sm opacity-90">Premium</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                onClick={() => window.location.href = '/assessment'}
              >
                Take Skin Assessment
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                onClick={() => window.location.href = '/ingredients'}
              >
                Explore Ingredients Database
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedRoutinePage;