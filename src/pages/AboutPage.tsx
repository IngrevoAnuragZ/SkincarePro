import React from 'react';
import { motion } from 'framer-motion';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-8">About Ingrevo</h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-neutral-600 mb-8 leading-relaxed">
                Founded by Anurag and Kavya, Ingrevo was born from a simple yet powerful mission: to help you make informed skincare decisions without wasting money on products that don't work for your unique skin.
              </p>

              <div className="bg-white rounded-2xl p-8 shadow-md mb-12">
                <h2 className="text-2xl font-semibold mb-6">Our Mission</h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="h-6 w-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0 mt-1 mr-4">1</span>
                    <p>Provide safe, science-backed skincare recommendations</p>
                  </li>
                  <li className="flex items-start">
                    <span className="h-6 w-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0 mt-1 mr-4">2</span>
                    <p>Create awareness about ingredient safety and effectiveness</p>
                  </li>
                  <li className="flex items-start">
                    <span className="h-6 w-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0 mt-1 mr-4">3</span>
                    <p>Eliminate guesswork from your skincare routine</p>
                  </li>
                  <li className="flex items-start">
                    <span className="h-6 w-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0 mt-1 mr-4">4</span>
                    <p>Empower you with knowledge to make better choices</p>
                  </li>
                </ul>
              </div>

              <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-6">Why Ingrevo Exists</h2>
                <p className="text-neutral-600 mb-6">
                  After witnessing countless people struggle with expensive skincare products that failed to deliver results, I realized there was a critical gap in accessible, personalized skincare education. Ingrevo bridges that gap by analyzing ingredients and creating customized routines based on your specific skin needs.
                </p>
              </div>

              <div className="bg-primary-50 rounded-2xl p-8 border border-primary-100">
                <h2 className="text-2xl font-semibold mb-4">Our Promise</h2>
                <p className="text-neutral-700">
                  Every recommendation is backed by ingredient science, tailored to your skin concerns, and focused on delivering real results without breaking your budget.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;