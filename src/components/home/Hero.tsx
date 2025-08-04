import React, { useState } from 'react';
import { ArrowRight, Loader, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const Hero: React.FC = () => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [buttonClicked, setButtonClicked] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();

  const handleNavigation = async (path: string, buttonId: string) => {
    if (isNavigating) return;
    
    setIsNavigating(true);
    setButtonClicked(buttonId);
    
    try {
      // Add visual feedback delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Simulate potential navigation issues and retry logic
      if (retryCount < 2 && Math.random() < 0.1) {
        throw new Error('Navigation failed');
      }
      
      navigate(path);
      toast.success('Navigating...');
    } catch (error) {
      console.error('Navigation error:', error);
      
      if (retryCount < 3) {
        setRetryCount(prev => prev + 1);
        toast.error(`Navigation failed. Retrying... (${retryCount + 1}/3)`);
        
        // Retry after a short delay
        setTimeout(() => {
          setIsNavigating(false);
          setButtonClicked(null);
          handleNavigation(path, buttonId);
        }, 1000);
      } else {
        toast.error('Navigation failed. Please refresh the page and try again.');
        setIsNavigating(false);
        setButtonClicked(null);
        setRetryCount(0);
      }
    }
  };

  const handleRetry = (path: string, buttonId: string) => {
    setRetryCount(0);
    handleNavigation(path, buttonId);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#435B45] via-[#4a6249] to-[#3d5240] text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl"
          animate={{ 
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-48 h-48 bg-primary-500/10 rounded-full blur-2xl"
          animate={{ 
            x: [0, -40, 0],
            y: [0, 30, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 pt-32 pb-20 lg:pt-40 lg:pb-32 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8 font-mono tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Decode Your Skincare.
              <br />
              <span className="bg-gradient-to-r from-[#ff6b35] to-[#ffa726] bg-clip-text text-transparent">
                Transform Your Skin
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl mb-8 text-neutral-100 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              73% of Indians don't understand skincare labels. Decode ingredients and create personalized routines for your unique skin needs.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.button
                onClick={() => handleNavigation('/assessment', 'assessment')}
                disabled={isNavigating}
                className={`relative overflow-hidden bg-gradient-to-r from-[#ff6b35] to-[#e55a2b] hover:from-[#e55a2b] hover:to-[#d14d1f] text-white px-8 py-4 rounded-full font-medium text-lg shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed ${
                  buttonClicked === 'assessment' ? 'scale-95' : ''
                }`}
                whileHover={{ scale: isNavigating ? 1 : 1.05 }}
                whileTap={{ scale: isNavigating ? 1 : 0.95 }}
              >
                <span className="flex items-center justify-center">
                  {isNavigating && buttonClicked === 'assessment' ? (
                    <>
                      <Loader size={20} className="animate-spin mr-2" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Start Skin Analysis
                      <ArrowRight size={20} className="ml-2" />
                    </>
                  )}
                </span>
                
                {/* Click ripple effect */}
                {buttonClicked === 'assessment' && (
                  <motion.div
                    className="absolute inset-0 bg-white/20 rounded-full"
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  />
                )}
              </motion.button>
              
              <motion.button
                onClick={() => handleNavigation('/ingredients', 'ingredients')}
                disabled={isNavigating}
                className={`relative overflow-hidden border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed ${
                  buttonClicked === 'ingredients' ? 'scale-95' : ''
                }`}
                whileHover={{ scale: isNavigating ? 1 : 1.05 }}
                whileTap={{ scale: isNavigating ? 1 : 0.95 }}
              >
                <span className="flex items-center justify-center">
                  {isNavigating && buttonClicked === 'ingredients' ? (
                    <>
                      <Loader size={20} className="animate-spin mr-2" />
                      Loading...
                    </>
                  ) : (
                    'Explore Ingredients'
                  )}
                </span>
                
                {/* Click ripple effect */}
                {buttonClicked === 'ingredients' && (
                  <motion.div
                    className="absolute inset-0 bg-white/20 rounded-full"
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  />
                )}
              </motion.button>
            </motion.div>

            {/* Error retry section */}
            {retryCount > 0 && !isNavigating && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-red-500/20 rounded-lg border border-red-500/30"
              >
                <div className="flex items-center text-red-200">
                  <AlertCircle size={16} className="mr-2" />
                  <span className="text-sm">
                    Having trouble? 
                    <button
                      onClick={() => handleRetry('/assessment', 'assessment')}
                      className="ml-2 underline hover:no-underline"
                    >
                      Try Assessment
                    </button>
                    {' or '}
                    <button
                      onClick={() => handleRetry('/ingredients', 'ingredients')}
                      className="underline hover:no-underline"
                    >
                      Try Ingredients
                    </button>
                  </span>
                </div>
              </motion.div>
            )}

            <motion.div 
              className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <h2 className="text-2xl font-semibold mb-4 text-white drop-shadow-sm">
                Smart Skin Analysis
              </h2>
              <p className="text-neutral-100 leading-relaxed">
                Our AI-powered analysis helps you understand your skin's unique needs and create a personalized skincare routine that actually works.
              </p>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="hidden md:block relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div 
              className="relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              animate={{ 
                y: [0, -16, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.img
                src="https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Natural skincare products"
                className="w-full h-auto object-cover rounded-2xl"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8 }}
              />
              
              {/* Floating Product Cards */}
              <motion.div
                className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-success-500"></div>
                  <p className="text-sm font-medium text-neutral-800">Budget Under ₹500</p>
                </div>
              </motion.div>
              
              <motion.div
                className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                  <p className="text-sm font-medium text-neutral-800">Real Product Recommendations</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Decorative Elements */}
            <motion.div
              className="absolute -top-4 -right-4 w-24 h-24 bg-accent-500/20 rounded-full blur-2xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary-500/20 rounded-full blur-2xl"
              animate={{ scale: [1.2, 1, 1.2] }}
              transition={{ duration: 4, repeat: Infinity, delay: 2 }}
            />
          </motion.div>
        </div>
      </div>

      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#435B45]/50 pointer-events-none" />
    </div>
  );
};

export default Hero;