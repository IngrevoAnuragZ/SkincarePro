import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  Snowflake, 
  Thermometer, 
  Droplets, 
  Wind,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

interface SeasonalRule {
  priorityAdjustments: Record<string, number>;
  recommendedIngredients: string[];
  avoidIngredients: string[];
  routineModifications: {
    morning: string[];
    afternoon?: string[];
    evening: string[];
  };
}

interface SeasonalAdaptationProps {
  currentSeason: 'winter' | 'summer' | 'monsoon' | 'spring';
  climate: string;
  userProfile: any;
  seasonalRules: Record<string, SeasonalRule>;
  onSeasonalChange?: (season: string) => void;
}

const SeasonalAdaptation: React.FC<SeasonalAdaptationProps> = ({
  currentSeason,
  climate,
  userProfile,
  seasonalRules,
  onSeasonalChange
}) => {
  const [selectedSeason, setSelectedSeason] = useState(currentSeason);
  const [showComparison, setShowComparison] = useState(false);
  const [weatherData, setWeatherData] = useState({
    temperature: 28,
    humidity: 65,
    uvIndex: 7,
    airQuality: 'Moderate'
  });

  const seasonIcons = {
    winter: Snowflake,
    summer: Sun,
    monsoon: CloudRain,
    spring: Cloud
  };

  const seasonColors = {
    winter: 'from-blue-500 to-cyan-500',
    summer: 'from-orange-500 to-red-500',
    monsoon: 'from-gray-500 to-blue-600',
    spring: 'from-green-500 to-teal-500'
  };

  const seasonBgColors = {
    winter: 'from-blue-50 to-cyan-50',
    summer: 'from-orange-50 to-red-50',
    monsoon: 'from-gray-50 to-blue-50',
    spring: 'from-green-50 to-teal-50'
  };

  const formatIngredientName = (ingredient: string) => {
    return ingredient.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getCurrentSeasonInfo = () => {
    const seasonInfo = {
      winter: {
        title: 'Winter Care',
        description: 'Focus on hydration and barrier protection',
        challenges: ['Dry air', 'Cold winds', 'Indoor heating'],
        benefits: ['Less sun exposure', 'Reduced sweating', 'Better product absorption']
      },
      summer: {
        title: 'Summer Protection',
        description: 'Emphasize sun protection and oil control',
        challenges: ['UV radiation', 'Heat', 'Increased sweating', 'Humidity'],
        benefits: ['Natural vitamin D', 'Better circulation', 'Faster healing']
      },
      monsoon: {
        title: 'Monsoon Defense',
        description: 'Combat humidity and prevent fungal issues',
        challenges: ['High humidity', 'Fungal growth', 'Pollution', 'Inconsistent weather'],
        benefits: ['Natural hydration', 'Cooler temperatures', 'Less UV exposure']
      },
      spring: {
        title: 'Spring Renewal',
        description: 'Transition and renewal for balanced care',
        challenges: ['Changing weather', 'Allergies', 'Pollution'],
        benefits: ['Mild temperatures', 'Balanced humidity', 'Skin renewal']
      }
    };

    return seasonInfo[selectedSeason];
  };

  const renderSeasonalRecommendations = () => {
    const rules = seasonalRules[selectedSeason];
    if (!rules) return null;

    return (
      <div className="space-y-6">
        {/* Priority Adjustments */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <TrendingUp size={20} className="text-primary-500 mr-2" />
            Seasonal Priority Adjustments
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(rules.priorityAdjustments).map(([concern, adjustment]) => (
              <motion.div
                key={concern}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl text-center ${
                  adjustment > 0 ? 'bg-success-50 border border-success-200' : 'bg-warning-50 border border-warning-200'
                }`}
              >
                <div className={`text-2xl font-bold ${
                  adjustment > 0 ? 'text-success-600' : 'text-warning-600'
                }`}>
                  {adjustment > 0 ? '+' : ''}{adjustment}%
                </div>
                <div className="text-sm font-medium capitalize text-neutral-700">
                  {concern.replace('_', ' ')}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recommended Ingredients */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <CheckCircle size={20} className="text-success-500 mr-2" />
            Seasonal Superstar Ingredients
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {rules.recommendedIngredients.map((ingredient, index) => (
              <motion.div
                key={ingredient}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-r from-success-50 to-success-100 border border-success-200 rounded-xl p-3 text-center"
              >
                <div className="font-medium text-success-800">
                  {formatIngredientName(ingredient)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Ingredients to Avoid */}
        {rules.avoidIngredients.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <AlertTriangle size={20} className="text-warning-500 mr-2" />
              Use with Caution This Season
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {rules.avoidIngredients.map((ingredient, index) => (
                <motion.div
                  key={ingredient}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-r from-warning-50 to-warning-100 border border-warning-200 rounded-xl p-3 text-center"
                >
                  <div className="font-medium text-warning-800">
                    {formatIngredientName(ingredient)}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Routine Modifications */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <Calendar size={20} className="text-primary-500 mr-2" />
            Seasonal Routine Adjustments
          </h3>
          <div className="space-y-4">
            {Object.entries(rules.routineModifications).map(([timeOfDay, modifications]) => (
              <div key={timeOfDay} className="border border-neutral-200 rounded-xl p-4">
                <h4 className="font-semibold text-neutral-800 mb-3 capitalize flex items-center">
                  {timeOfDay === 'morning' && <Sun size={16} className="text-warning-500 mr-2" />}
                  {timeOfDay === 'afternoon' && <Thermometer size={16} className="text-orange-500 mr-2" />}
                  {timeOfDay === 'evening' && <Cloud size={16} className="text-primary-500 mr-2" />}
                  {timeOfDay} Routine
                </h4>
                <div className="flex flex-wrap gap-2">
                  {modifications.map((modification, index) => (
                    <span
                      key={index}
                      className="inline-block bg-primary-100 text-primary-700 text-sm px-3 py-1 rounded-full"
                    >
                      {formatIngredientName(modification)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderWeatherWidget = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
      <h3 className="text-lg font-bold mb-4 flex items-center">
        <Thermometer size={20} className="text-primary-500 mr-2" />
        Current Conditions
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl">
          <Thermometer size={24} className="text-orange-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-orange-600">{weatherData.temperature}°C</div>
          <div className="text-sm text-orange-700">Temperature</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
          <Droplets size={24} className="text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-600">{weatherData.humidity}%</div>
          <div className="text-sm text-blue-700">Humidity</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl">
          <Sun size={24} className="text-yellow-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-yellow-600">{weatherData.uvIndex}</div>
          <div className="text-sm text-yellow-700">UV Index</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-gray-50 to-neutral-50 rounded-xl">
          <Wind size={24} className="text-gray-500 mx-auto mb-2" />
          <div className="text-sm font-bold text-gray-600">{weatherData.airQuality}</div>
          <div className="text-sm text-gray-700">Air Quality</div>
        </div>
      </div>
    </div>
  );

  const renderSeasonComparison = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
      <h3 className="text-lg font-bold mb-4">Seasonal Comparison</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.keys(seasonalRules).map((season) => {
          const Icon = seasonIcons[season as keyof typeof seasonIcons];
          const isActive = season === selectedSeason;
          
          return (
            <motion.button
              key={season}
              onClick={() => setSelectedSeason(season as any)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                isActive 
                  ? `bg-gradient-to-br ${seasonBgColors[season as keyof typeof seasonBgColors]} border-primary-300`
                  : 'bg-white border-neutral-200 hover:border-primary-200'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon size={32} className={`mx-auto mb-2 ${
                isActive ? 'text-primary-600' : 'text-neutral-500'
              }`} />
              <div className={`font-medium capitalize ${
                isActive ? 'text-primary-800' : 'text-neutral-700'
              }`}>
                {season}
              </div>
              <div className="text-xs text-neutral-500 mt-1">
                {seasonalRules[season].recommendedIngredients.length} ingredients
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );

  const seasonInfo = getCurrentSeasonInfo();
  const SeasonIcon = seasonIcons[selectedSeason];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className={`bg-gradient-to-r ${seasonColors[selectedSeason]} rounded-3xl p-8 text-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <SeasonIcon size={40} className="mr-4" />
              <div>
                <h2 className="text-3xl font-bold">{seasonInfo.title}</h2>
                <p className="text-lg opacity-90">{seasonInfo.description}</p>
              </div>
            </div>
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl px-4 py-2 transition-all duration-200"
            >
              Compare Seasons
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2 flex items-center">
                <AlertTriangle size={16} className="mr-2" />
                Seasonal Challenges
              </h4>
              <ul className="space-y-1 text-sm opacity-90">
                {seasonInfo.challenges.map((challenge, index) => (
                  <li key={index}>• {challenge}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center">
                <CheckCircle size={16} className="mr-2" />
                Seasonal Benefits
              </h4>
              <ul className="space-y-1 text-sm opacity-90">
                {seasonInfo.benefits.map((benefit, index) => (
                  <li key={index}>• {benefit}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Season Comparison */}
      <AnimatePresence>
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {renderSeasonComparison()}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Recommendations */}
        <div className="lg:col-span-2">
          {renderSeasonalRecommendations()}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {renderWeatherWidget()}
          
          {/* Seasonal Tips */}
          <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-6 border border-primary-100">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Info size={20} className="text-primary-500 mr-2" />
              Pro Tips for {selectedSeason.charAt(0).toUpperCase() + selectedSeason.slice(1)}
            </h3>
            <div className="space-y-3 text-sm">
              {selectedSeason === 'summer' && (
                <>
                  <div className="flex items-start">
                    <Sun size={16} className="text-warning-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Reapply sunscreen every 2-3 hours, especially outdoors</span>
                  </div>
                  <div className="flex items-start">
                    <Droplets size={16} className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Use lightweight, water-based products to prevent clogged pores</span>
                  </div>
                </>
              )}
              {selectedSeason === 'winter' && (
                <>
                  <div className="flex items-start">
                    <Snowflake size={16} className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Layer moisturizers and use a humidifier indoors</span>
                  </div>
                  <div className="flex items-start">
                    <Wind size={16} className="text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Protect exposed skin from cold winds with barrier creams</span>
                  </div>
                </>
              )}
              {selectedSeason === 'monsoon' && (
                <>
                  <div className="flex items-start">
                    <CloudRain size={16} className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Keep skin clean and dry to prevent fungal infections</span>
                  </div>
                  <div className="flex items-start">
                    <Droplets size={16} className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Use antimicrobial ingredients like tea tree oil</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonalAdaptation;