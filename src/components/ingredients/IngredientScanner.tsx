import React, { useState } from 'react';
import { Scan, X, Sparkles, Camera, Upload, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const IngredientScanner: React.FC = () => {
  const [showComingSoon, setShowComingSoon] = useState(false);

  const handleScannerClick = () => {
    setShowComingSoon(true);
    setTimeout(() => {
      setShowComingSoon(false);
    }, 5000);
  };

  return (
    <>
      {/* Floating Scanner Button - Top Right */}
      <motion.button
        onClick={handleScannerClick}
        className="fixed top-24 right-6 z-40 w-14 h-14 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Scan size={24} className="text-white" />
        </motion.div>
        
        {/* Pulse effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 animate-ping opacity-20" />
        
        {/* Tooltip */}
        <div className="absolute right-full mr-3 px-3 py-2 bg-neutral-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Scan Ingredients
          <div className="absolute top-1/2 -right-1 w-2 h-2 bg-neutral-800 rotate-45 transform -translate-y-1/2" />
        </div>
      </motion.button>

      {/* Coming Soon Notification */}
      <AnimatePresence>
        {showComingSoon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              className="bg-white rounded-3xl p-8 text-center max-w-md mx-auto shadow-2xl relative overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 to-accent-500" />
              
              {/* Animated scanner icon */}
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 360]
                }}
                transition={{ 
                  scale: { duration: 2, repeat: Infinity },
                  rotate: { duration: 3, repeat: Infinity, ease: "linear" }
                }}
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <Scan size={40} className="text-white" />
              </motion.div>

              <motion.h3 
                className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Ingredient Scanner Coming Soon! 🚀
              </motion.h3>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4 mb-6"
              >
                <p className="text-neutral-600 leading-relaxed">
                  We're working on an amazing AI-powered ingredient scanner that will let you:
                </p>
                
                <div className="grid grid-cols-1 gap-3 text-left">
                  <div className="flex items-center space-x-3 p-3 bg-primary-50 rounded-xl">
                    <Camera size={20} className="text-primary-500 flex-shrink-0" />
                    <span className="text-sm text-neutral-700">Scan product labels instantly</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-accent-50 rounded-xl">
                    <Sparkles size={20} className="text-accent-500 flex-shrink-0" />
                    <span className="text-sm text-neutral-700">Get real-time ingredient analysis</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-success-50 rounded-xl">
                    <Upload size={20} className="text-success-500 flex-shrink-0" />
                    <span className="text-sm text-neutral-700">Upload photos for detailed breakdown</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-warning-50 rounded-xl">
                    <Zap size={20} className="text-warning-500 flex-shrink-0" />
                    <span className="text-sm text-neutral-700">Instant safety ratings and compatibility</span>
                  </div>
                </div>
              </motion.div>

              <motion.p 
                className="text-sm text-neutral-500 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Stay tuned for this exciting feature! 
                <br />
                <span className="font-medium text-primary-600">Expected launch: Q2 2025</span>
              </motion.p>

              <motion.button
                onClick={() => setShowComingSoon(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} className="text-neutral-400" />
              </motion.button>

              {/* Auto-close progress bar */}
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary-500 to-accent-500"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 5, ease: "linear" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default IngredientScanner;