import React, { useState } from 'react';
import { Scan, BarChart3, Calendar, Sparkles, ArrowRight, Loader, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const FeatureSection: React.FC = () => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();

  const handleQuizNavigation = async () => {
    if (isNavigating) return;
    
    setIsNavigating(true);
    
    try {
      // Add visual feedback delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Simulate potential navigation issues and retry logic
      if (retryCount < 2 && Math.random() < 0.1) {
        throw new Error('Navigation failed');
      }
      
      navigate('/assessment');
      toast.success('Starting assessment...');
    } catch (error) {
      console.error('Navigation error:', error);
      
      if (retryCount < 3) {
        setRetryCount(prev => prev + 1);
        toast.error(`Navigation failed. Retrying... (${retryCount + 1}/3)`);
        
        // Retry after a short delay
        setTimeout(() => {
          setIsNavigating(false);
          handleQuizNavigation();
        }, 1000);
      } else {
        toast.error('Navigation failed. Please refresh the page and try again.');
        setIsNavigating(false);
        setRetryCount(0);
      }
    }
  };

  const features = [
    {
      icon: <Scan size={32} className="text-primary-500" />,
      title: "Ingredient Scanner",
      description: "Decode complex ingredients on product labels with a simple scan and get instant safety ratings.",
      gradient: "from-primary-500 to-primary-600"
    },
    {
      icon: <BarChart3 size={32} className="text-accent-500" />,
      title: "Personalized Analysis",
      description: "Get skin type assessment and product recommendations based on your unique skin needs and concerns.",
      gradient: "from-accent-500 to-accent-600"
    },
    {
      icon: <Calendar size={32} className="text-success-500" />,
      title: "Customized Routines",
      description: "Create morning and evening skincare routines tailored for Australian climates with locally available products.",
      gradient: "from-success-500 to-success-600"
    },
    {
      icon: <Sparkles size={32} className="text-warning-500" />,
      title: "AI-Powered Matching",
      description: "Our AI analyzes thousands of ingredients to find the perfect products for your skin profile.",
      gradient: "from-warning-500 to-warning-600"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-neutral-50 via-white to-neutral-50">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-neutral-800 to-neutral-600 bg-clip-text text-transparent">
            Smart Solutions for Healthier Skin 🇦🇺
          </h2>
          <p className="text-lg text-neutral-600">
            Australian-focused skincare recommendations with local products from Cancer Council, Sukin, QV & more. Built for Aussie skin & climate!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="group relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 hover:border-primary-200 overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              
              {/* Icon with gradient background */}
              <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <div className="text-white">
                  {feature.icon}
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-3 group-hover:text-primary-600 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-neutral-600 group-hover:text-neutral-700 transition-colors duration-300">
                {feature.description}
              </p>

              {/* Hover arrow */}
              <motion.div
                className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ x: -10 }}
                whileHover={{ x: 0 }}
              >
                <ArrowRight size={20} className="text-primary-500" />
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-16 max-w-4xl mx-auto bg-gradient-to-r from-primary-50 via-white to-accent-50 rounded-3xl p-8 border border-primary-100 shadow-xl backdrop-blur-sm"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Ready to discover your perfect skincare routine?
              </h3>
              <p className="text-neutral-600 text-lg">
                Get personalized recommendations based on your unique skin needs.
              </p>
            </div>
            
            <motion.button
              onClick={handleQuizNavigation}
              disabled={isNavigating}
              className="relative overflow-hidden bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
              whileHover={{ scale: isNavigating ? 1 : 1.05 }}
              whileTap={{ scale: isNavigating ? 1 : 0.95 }}
            >
              <span className="flex items-center">
                {isNavigating ? (
                  <>
                    <Loader size={20} className="animate-spin mr-2" />
                    Loading Quiz...
                  </>
                ) : (
                  <>
                    Take the Quiz
                    <ArrowRight size={20} className="ml-2" />
                  </>
                )}
              </span>
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700 transform translate-x-[-100%] hover:translate-x-[100%]" />
            </motion.button>
          </div>

          {/* Error retry section */}
          {retryCount > 0 && !isNavigating && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200"
            >
              <div className="flex items-center text-red-600">
                <AlertCircle size={16} className="mr-2" />
                <span className="text-sm">
                  Having trouble? 
                  <button
                    onClick={() => {
                      setRetryCount(0);
                      handleQuizNavigation();
                    }}
                    className="ml-2 underline hover:no-underline font-medium"
                  >
                    Click here to retry
                  </button>
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureSection;