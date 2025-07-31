import React from 'react';
import Hero from '../components/home/Hero';
import FeatureSection from '../components/home/FeatureSection';
import HowItWorks from '../components/home/HowItWorks';
import TestimonialSection from '../components/home/TestimonialSection';

const HomePage: React.FC = () => {
  return (
    <div>
      <Hero />
      <FeatureSection />
      <HowItWorks />
      <TestimonialSection />
      
      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Skincare Routine?</h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of Indian users who have discovered their perfect skincare ingredients with Ingrevo
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <a href="/assessment" className="btn bg-white text-primary-600 hover:bg-neutral-100">
                Start Your Analysis
              </a>
              <a href="/ingredients" className="btn border-2 border-white text-white hover:bg-white/10">
                Explore Ingredient Database
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;