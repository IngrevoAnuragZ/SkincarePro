import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp, Leaf, TestTube, Clock, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SafetyBadge from '../common/SafetyBadge';
import { type Ingredient } from '../../lib/supabase';

interface EnhancedIngredientCardProps {
  ingredient: Ingredient;
  onClick?: () => void;
}

const EnhancedIngredientCard: React.FC<EnhancedIngredientCardProps> = ({
  ingredient,
  onClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const renderNaturalSources = () => {
    if (!ingredient.natural_sources || ingredient.natural_sources.length === 0) {
      return null;
    }

    return (
      <motion.div 
        className="mt-4 p-3 bg-success-50 rounded-lg border border-success-100"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex items-center mb-2">
          <Leaf size={16} className="text-success-600 mr-2" />
          <h4 className="text-sm font-semibold text-success-800">Natural Sources</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {ingredient.natural_sources.map((source, index) => (
            <motion.span
              key={index}
              className="inline-flex items-center bg-white rounded-full px-3 py-1 text-sm text-success-700 border border-success-200"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              {ingredient.source_icons && ingredient.source_icons[index] && (
                <span className="mr-1">{ingredient.source_icons[index]}</span>
              )}
              {source}
            </motion.span>
          ))}
        </div>
        <p className="text-xs text-success-600 mt-2 italic">
          *While these foods contain the nutrient, topical application differs from dietary consumption
        </p>
      </motion.div>
    );
  };

  const renderCompatibility = () => {
    const hasCompatibilityInfo = 
      (ingredient.compatibility_good && ingredient.compatibility_good.length > 0) ||
      (ingredient.compatibility_avoid && ingredient.compatibility_avoid.length > 0);

    if (!hasCompatibilityInfo) return null;

    return (
      <motion.div 
        className="mt-4 space-y-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {ingredient.compatibility_good && ingredient.compatibility_good.length > 0 && (
          <div>
            <h5 className="text-sm font-medium text-neutral-700 mb-2">✅ Works well with:</h5>
            <div className="flex flex-wrap gap-1">
              {ingredient.compatibility_good.map((item, index) => (
                <motion.span
                  key={index}
                  className="inline-block text-xs bg-success-100 text-success-700 rounded-full px-2 py-1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </div>
        )}

        {ingredient.compatibility_avoid && ingredient.compatibility_avoid.length > 0 && (
          <div>
            <h5 className="text-sm font-medium text-neutral-700 mb-2">⚠️ Avoid mixing with:</h5>
            <div className="flex flex-wrap gap-1">
              {ingredient.compatibility_avoid.map((item, index) => (
                <motion.span
                  key={index}
                  className="inline-block text-xs bg-warning-100 text-warning-700 rounded-full px-2 py-1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  const renderDetailedInfo = () => {
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="mt-4 space-y-4 border-t border-neutral-100 pt-4 overflow-hidden"
      >
        {/* Function and Benefits */}
        {ingredient.function && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h5 className="text-sm font-medium text-neutral-700 mb-1 flex items-center">
              <TestTube size={14} className="mr-1" />
              Function
            </h5>
            <p className="text-sm text-neutral-600">{ingredient.function}</p>
          </motion.div>
        )}

        {ingredient.benefits && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <h5 className="text-sm font-medium text-neutral-700 mb-1">Benefits</h5>
            <p className="text-sm text-neutral-600">{ingredient.benefits}</p>
          </motion.div>
        )}

        {/* Concentration and pH */}
        <motion.div 
          className="grid grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {ingredient.concentration_range && (
            <div>
              <h5 className="text-sm font-medium text-neutral-700 mb-1">Concentration</h5>
              <p className="text-sm text-neutral-600">{ingredient.concentration_range}</p>
            </div>
          )}

          {ingredient.ph_range && (
            <div>
              <h5 className="text-sm font-medium text-neutral-700 mb-1">pH Range</h5>
              <p className="text-sm text-neutral-600">{ingredient.ph_range}</p>
            </div>
          )}
        </motion.div>

        {/* Time of Use */}
        {ingredient.time_of_use && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
          >
            <h5 className="text-sm font-medium text-neutral-700 mb-1 flex items-center">
              <Clock size={14} className="mr-1" />
              Best Time to Use
            </h5>
            <span className={`inline-block text-xs rounded-full px-2 py-1 ${
              ingredient.time_of_use === 'AM' 
                ? 'bg-warning-100 text-warning-700'
                : ingredient.time_of_use === 'PM'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-neutral-100 text-neutral-700'
            }`}>
              {ingredient.time_of_use === 'AM' ? '🌅 Morning' : 
               ingredient.time_of_use === 'PM' ? '🌙 Evening' : 
               '⏰ Anytime'}
            </span>
          </motion.div>
        )}

        {/* Skin Types */}
        {ingredient.skin_types && ingredient.skin_types.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <h5 className="text-sm font-medium text-neutral-700 mb-2">Suitable for skin types:</h5>
            <div className="flex flex-wrap gap-1">
              {ingredient.skin_types.map((type, index) => (
                <motion.span
                  key={index}
                  className="inline-block text-xs bg-primary-100 text-primary-700 rounded-full px-2 py-1 capitalize"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                >
                  {type}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Natural Sources */}
        {renderNaturalSources()}

        {/* Compatibility */}
        {renderCompatibility()}

        {/* Cautions */}
        {ingredient.cautions && (
          <motion.div 
            className="bg-warning-50 rounded-lg p-3 border border-warning-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.35 }}
          >
            <h5 className="text-sm font-medium text-warning-800 mb-1 flex items-center">
              <AlertTriangle size={14} className="mr-1" />
              Important Notes
            </h5>
            <p className="text-sm text-warning-700">{ingredient.cautions}</p>
          </motion.div>
        )}

        {/* Evidence Level */}
        {ingredient.evidence_level && (
          <motion.div 
            className="text-xs text-neutral-500"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <span className="font-medium">Scientific Evidence: </span>
            <span className={`capitalize ${
              ingredient.evidence_level === 'high' ? 'text-success-600' :
              ingredient.evidence_level === 'medium' ? 'text-warning-600' :
              'text-neutral-600'
            }`}>
              {ingredient.evidence_level}
            </span>
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <motion.div 
      className="card hover:shadow-xl cursor-pointer transition-all duration-200"
      onClick={onClick}
      whileHover={{ y: -2 }}
      layout
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-grow">
          <h3 className="text-lg font-semibold">{ingredient.ingredient_name}</h3>
          {ingredient.inci_name && ingredient.inci_name !== ingredient.ingredient_name && (
            <p className="text-sm text-neutral-500 italic">INCI: {ingredient.inci_name}</p>
          )}
          {ingredient.category && (
            <span className="inline-block text-xs bg-neutral-100 text-neutral-600 rounded-full px-2 py-1 mt-1 capitalize">
              {ingredient.category}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <SafetyBadge level={ingredient.safety_level as any} />
          <motion.button
            onClick={toggleExpanded}
            className="p-1 rounded-full hover:bg-neutral-100 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={16} />
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Quick Natural Sources Preview */}
      {!isExpanded && ingredient.natural_sources && ingredient.natural_sources.length > 0 && (
        <motion.div 
          className="mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center mb-1">
            <Leaf size={14} className="text-success-600 mr-1" />
            <span className="text-sm font-medium text-success-700">Natural sources:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {ingredient.natural_sources.slice(0, 3).map((source, index) => (
              <span key={index} className="text-sm text-success-600">
                {ingredient.source_icons && ingredient.source_icons[index] && (
                  <span className="mr-1">{ingredient.source_icons[index]}</span>
                )}
                {source}
                {index < Math.min(2, ingredient.natural_sources!.length - 1) && ', '}
              </span>
            ))}
            {ingredient.natural_sources.length > 3 && (
              <span className="text-sm text-success-600">+{ingredient.natural_sources.length - 3} more</span>
            )}
          </div>
        </motion.div>
      )}

      {ingredient.function && !isExpanded && (
        <p className="text-neutral-600 text-sm mb-4 line-clamp-2">{ingredient.function}</p>
      )}

      <AnimatePresence mode="wait">
        {isExpanded && renderDetailedInfo()}
      </AnimatePresence>

      {!isExpanded && (
        <motion.button 
          onClick={toggleExpanded}
          className="mt-4 text-primary-600 text-sm font-medium flex items-center hover:text-primary-700 transition-colors group"
          whileHover={{ x: 2 }}
          transition={{ duration: 0.2 }}
        >
          <Info size={16} className="mr-1" />
          <span>View Details</span>
          <motion.div
            className="ml-1 opacity-0 group-hover:opacity-100"
            initial={{ x: -5 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.2 }}
          >
            →
          </motion.div>
        </motion.button>
      )}
    </motion.div>
  );
};

export default EnhancedIngredientCard;