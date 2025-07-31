import React, { useState } from 'react';
import { Plus, Info, Clock, Sun, Sunset, Moon, Download, Check, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../components/common/Button';
import RoutineCard from '../components/routine/RoutineCard';

// Enhanced routine data with afternoon routines
const morningRoutine = {
  id: 'm1',
  title: 'Daily Brightening Routine',
  time: 'morning',
  steps: [
    {
      id: 'm1s1',
      productName: 'Gentle Foaming Cleanser',
      productType: 'Cleanser',
      timing: '30 seconds',
      description: 'Start your day with a gentle cleanser to remove impurities without stripping your skin.'
    },
    {
      id: 'm1s2',
      productName: 'Vitamin C Serum',
      productType: 'Treatment',
      timing: 'Wait 2 minutes',
      description: 'Apply vitamin C serum to brighten skin and protect against environmental damage.'
    },
    {
      id: 'm1s3',
      productName: 'Hydrating Gel Moisturizer',
      productType: 'Moisturizer',
      timing: 'Wait 1 minute',
      description: 'Lock in hydration with a lightweight gel moisturizer suitable for Indian climate.'
    },
    {
      id: 'm1s4',
      productName: 'Mineral Sunscreen SPF 50',
      productType: 'Sun Protection',
      timing: 'Apply generously',
      description: 'Finish with broad-spectrum sunscreen to protect from harmful UV rays.'
    }
  ]
};

const afternoonRoutine = {
  id: 'a1',
  title: 'Midday Refresh & Protection',
  time: 'afternoon',
  steps: [
    {
      id: 'a1s1',
      productName: 'Antioxidant Face Mist',
      productType: 'Refresher',
      timing: 'As needed',
      description: 'Refresh and hydrate skin while providing antioxidant protection.'
    },
    {
      id: 'a1s2',
      productName: 'Sunscreen Reapplication',
      productType: 'Sun Protection',
      timing: 'Every 2-3 hours',
      description: 'Reapply sunscreen for continued protection, especially if outdoors.'
    },
    {
      id: 'a1s3',
      productName: 'Blotting Papers (if needed)',
      productType: 'Oil Control',
      timing: 'As needed',
      description: 'Gently blot excess oil without disturbing makeup or skincare.'
    }
  ]
};

const eveningRoutine = {
  id: 'e1',
  title: 'Hyperpigmentation Repair',
  time: 'evening',
  steps: [
    {
      id: 'e1s1',
      productName: 'Micellar Water',
      productType: 'Makeup Remover',
      timing: '1 minute',
      description: 'Remove makeup and surface impurities gently.'
    },
    {
      id: 'e1s2',
      productName: 'Nourishing Facial Cleanser',
      productType: 'Cleanser',
      timing: '30 seconds',
      description: 'Deeply cleanse skin without disrupting its natural balance.'
    },
    {
      id: 'e1s3',
      productName: 'Alpha Arbutin + Niacinamide Serum',
      productType: 'Treatment',
      timing: 'Wait 3 minutes',
      description: 'Target hyperpigmentation and even skin tone with this powerful combination.'
    },
    {
      id: 'e1s4',
      productName: 'Peptide Moisturizer',
      productType: 'Moisturizer',
      timing: 'Final step',
      description: 'Restore and repair skin overnight with peptides and ceramides.'
    }
  ]
};

// Supplement recommendations based on skin concerns
const supplementRecommendations = {
  acne: [
    {
      name: 'Zinc',
      dosage: '30-40mg daily',
      benefits: 'Reduces inflammation and regulates oil production',
      timing: 'With food to avoid stomach upset',
      note: 'Take with copper supplement if using long-term'
    },
    {
      name: 'Omega-3 Fatty Acids',
      dosage: '1000-2000mg daily',
      benefits: 'Anti-inflammatory properties help reduce acne severity',
      timing: 'With meals for better absorption',
      note: 'Choose high-quality fish oil or algae-based supplements'
    },
    {
      name: 'Probiotics',
      dosage: '10-50 billion CFU daily',
      benefits: 'Supports gut health and may improve skin clarity',
      timing: 'On empty stomach or as directed',
      note: 'Look for multi-strain formulas'
    }
  ],
  aging: [
    {
      name: 'Collagen Peptides',
      dosage: '10-20g daily',
      benefits: 'Supports skin elasticity and hydration',
      timing: 'Morning on empty stomach',
      note: 'Type I and III collagen are best for skin'
    },
    {
      name: 'Vitamin C',
      dosage: '500-1000mg daily',
      benefits: 'Antioxidant protection and collagen synthesis',
      timing: 'With meals to reduce stomach irritation',
      note: 'Choose buffered or liposomal forms for better tolerance'
    },
    {
      name: 'Resveratrol',
      dosage: '100-500mg daily',
      benefits: 'Powerful antioxidant with anti-aging properties',
      timing: 'With meals',
      note: 'Trans-resveratrol is the most active form'
    }
  ],
  dryness: [
    {
      name: 'Hyaluronic Acid',
      dosage: '120-240mg daily',
      benefits: 'Improves skin hydration and plumpness',
      timing: 'With water, preferably morning',
      note: 'Low molecular weight forms are better absorbed'
    },
    {
      name: 'Omega-3 Fatty Acids',
      dosage: '1000-2000mg daily',
      benefits: 'Supports skin barrier function and moisture retention',
      timing: 'With meals',
      note: 'EPA and DHA are most beneficial for skin'
    },
    {
      name: 'Vitamin D3',
      dosage: '1000-4000 IU daily',
      benefits: 'Supports skin barrier function and repair',
      timing: 'With fat-containing meals',
      note: 'Get blood levels tested to determine optimal dose'
    }
  ],
  hyperpigmentation: [
    {
      name: 'Vitamin C',
      dosage: '500-1000mg daily',
      benefits: 'Inhibits melanin production and brightens skin',
      timing: 'With meals',
      note: 'Combine with vitamin E for enhanced effectiveness'
    },
    {
      name: 'Glutathione',
      dosage: '250-500mg daily',
      benefits: 'Master antioxidant that may help lighten skin',
      timing: 'On empty stomach',
      note: 'Liposomal forms have better bioavailability'
    },
    {
      name: 'Alpha Lipoic Acid',
      dosage: '300-600mg daily',
      benefits: 'Antioxidant that may help with skin brightening',
      timing: 'On empty stomach',
      note: 'R-form is more bioactive than synthetic forms'
    }
  ]
};

const RoutinePage: React.FC = () => {
  const [routines, setRoutines] = useState({
    morning: [morningRoutine],
    afternoon: [afternoonRoutine],
    evening: [eveningRoutine]
  });
  
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [expandedSupplement, setExpandedSupplement] = useState<string | null>(null);
  const [showSupplements, setShowSupplements] = useState(false);

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
${morningRoutine.steps.map((step, index) => 
  `${index + 1}. ${step.productName} (${step.productType})
     Timing: ${step.timing}
     ${step.description}`
).join('\n\n')}

AFTERNOON ROUTINE:
${afternoonRoutine.steps.map((step, index) => 
  `${index + 1}. ${step.productName} (${step.productType})
     Timing: ${step.timing}
     ${step.description}`
).join('\n\n')}

EVENING ROUTINE:
${eveningRoutine.steps.map((step, index) => 
  `${index + 1}. ${step.productName} (${step.productType})
     Timing: ${step.timing}
     ${step.description}`
).join('\n\n')}

Generated by Ingrevo - Your AI Skincare Assistant
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
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            {timeIcon}
            <div className="ml-3">
              <h3 className="text-xl font-semibold">{routine.title}</h3>
              <p className="text-sm text-neutral-500 capitalize">{routine.time} Routine</p>
            </div>
          </div>
          <div className="text-sm text-neutral-500">
            {routine.steps.filter((step: any) => completedSteps[step.id]).length}/{routine.steps.length} completed
          </div>
        </div>

        <div className="space-y-4">
          {routine.steps.map((step: any, index: number) => (
            <div 
              key={step.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                completedSteps[step.id] 
                  ? 'border-success-200 bg-success-50' 
                  : 'border-neutral-200 hover:border-primary-200'
              }`}
            >
              <div className="flex items-start">
                <button
                  onClick={() => toggleStepCompletion(step.id)}
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 mt-1 transition-all ${
                    completedSteps[step.id]
                      ? 'border-success-500 bg-success-500'
                      : 'border-neutral-300 hover:border-primary-500'
                  }`}
                >
                  {completedSteps[step.id] && (
                    <Check size={14} className="text-white" />
                  )}
                </button>
                
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-semibold ${completedSteps[step.id] ? 'line-through text-neutral-500' : ''}`}>
                      {step.productName}
                    </h4>
                    <div className="flex items-center text-sm text-neutral-500">
                      <Clock size={14} className="mr-1" />
                      {step.timing}
                    </div>
                  </div>
                  
                  <p className="text-sm text-neutral-600 mb-2">{step.productType}</p>
                  <p className={`text-sm ${completedSteps[step.id] ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSupplementSection = () => {
    // Mock user concerns for demonstration
    const userConcerns = ['acne', 'aging', 'hyperpigmentation'];
    
    return (
      <div className="mt-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Personalized Supplement Recommendations</h2>
            <p className="text-neutral-600">Based on your skin assessment and concerns</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowSupplements(!showSupplements)}
            icon={showSupplements ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            iconPosition="right"
          >
            {showSupplements ? 'Hide' : 'Show'} Supplements
          </Button>
        </div>

        {showSupplements && (
          <div className="space-y-6">
            <div className="bg-warning-50 border border-warning-200 rounded-xl p-6">
              <div className="flex items-start">
                <Info size={20} className="text-warning-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-warning-800 mb-2">Important Supplement Disclaimer</h3>
                  <p className="text-sm text-warning-700 mb-2">
                    These supplement recommendations are for informational purposes only and should not replace professional medical advice.
                  </p>
                  <ul className="text-sm text-warning-700 space-y-1">
                    <li>• Always consult with a healthcare provider before starting any new supplements</li>
                    <li>• Inform your doctor about all medications and supplements you're taking</li>
                    <li>• Start with lower doses to assess tolerance</li>
                    <li>• Choose high-quality, third-party tested supplements</li>
                  </ul>
                </div>
              </div>
            </div>

            {userConcerns.map((concern) => (
              <div key={concern} className="card">
                <button
                  onClick={() => setExpandedSupplement(expandedSupplement === concern ? null : concern)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <h3 className="text-lg font-semibold capitalize">
                    Supplements for {concern.replace('-', ' ')}
                  </h3>
                  {expandedSupplement === concern ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedSupplement === concern && (
                  <div className="mt-6 space-y-4">
                    {supplementRecommendations[concern as keyof typeof supplementRecommendations]?.map((supplement, index) => (
                      <div key={index} className="bg-neutral-50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-primary-700">{supplement.name}</h4>
                          <span className="text-sm font-medium text-neutral-600">{supplement.dosage}</span>
                        </div>
                        <p className="text-sm text-neutral-600 mb-2">{supplement.benefits}</p>
                        <div className="text-xs text-neutral-500 space-y-1">
                          <p><strong>Best taken:</strong> {supplement.timing}</p>
                          <p><strong>Note:</strong> {supplement.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
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
              <Button
                variant="primary"
                onClick={() => setShowSupplements(!showSupplements)}
              >
                View Supplement Guide
              </Button>
            </div>
          </div>

          <div className="bg-primary-50 rounded-xl p-6 mb-10 border border-primary-100">
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center mr-4 flex-shrink-0">
                <Info size={20} className="text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Smart Routine Tips</h3>
                <p className="text-neutral-600 mb-2">
                  These interactive routines adapt to your lifestyle and skin needs:
                </p>
                <ul className="list-disc list-inside space-y-1 text-neutral-600 text-sm">
                  <li>Check off steps as you complete them to track progress</li>
                  <li>Follow the timing recommendations for optimal absorption</li>
                  <li>Afternoon routine adjusts based on your work environment</li>
                  <li>Export your routine to share with dermatologists or for reference</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Interactive Routines */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Morning Routine */}
            <div>
              <div className="flex items-center mb-4">
                <Sun size={24} className="text-warning-500 mr-2" />
                <h2 className="text-xl font-bold">Morning Routine</h2>
              </div>
              {renderInteractiveRoutine(morningRoutine, 
                <div className="h-12 w-12 rounded-full bg-warning-100 flex items-center justify-center">
                  <Sun size={24} className="text-warning-600" />
                </div>
              )}
            </div>

            {/* Afternoon Routine */}
            <div>
              <div className="flex items-center mb-4">
                <Sunset size={24} className="text-accent-500 mr-2" />
                <h2 className="text-xl font-bold">Afternoon Refresh</h2>
              </div>
              {renderInteractiveRoutine(afternoonRoutine,
                <div className="h-12 w-12 rounded-full bg-accent-100 flex items-center justify-center">
                  <Sunset size={24} className="text-accent-600" />
                </div>
              )}
            </div>
          </div>

          {/* Evening Routine - Full Width */}
          <div className="mb-12">
            <div className="flex items-center mb-4">
              <Moon size={24} className="text-primary-500 mr-2" />
              <h2 className="text-xl font-bold">Evening Routine</h2>
            </div>
            <div className="max-w-4xl mx-auto">
              {renderInteractiveRoutine(eveningRoutine,
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <Moon size={24} className="text-primary-600" />
                </div>
              )}
            </div>
          </div>

          {/* Supplement Recommendations */}
          {renderSupplementSection()}

          {/* Routine Builder CTA */}
          <div className="mt-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Want a Custom Routine?</h2>
            <p className="text-lg mb-6 opacity-90">
              Create additional routines for special occasions, travel, or seasonal changes
            </p>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              icon={<Plus size={18} />}
              iconPosition="left"
            >
              Build Custom Routine
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutinePage;