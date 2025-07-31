import React from 'react';
import { ClipboardCheck, Search, BarChart, Calendar } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <ClipboardCheck size={40} className="text-white" />,
      title: "Complete Your Skin Profile",
      description: "Answer a few questions about your skin type, concerns, and goals to create your personalized profile."
    },
    {
      icon: <Search size={40} className="text-white" />,
      title: "Analyze Product Ingredients",
      description: "Scan or input ingredients from your skincare products to check their safety and compatibility with your skin."
    },
    {
      icon: <BarChart size={40} className="text-white" />,
      title: "Get Personalized Insights",
      description: "Receive detailed analysis of each ingredient and understand how it affects your specific skin type."
    },
    {
      icon: <Calendar size={40} className="text-white" />,
      title: "Build Your Ideal Routine",
      description: "Create a customized morning and evening skincare routine with products that work together harmoniously."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How Ingrevo Works for You</h2>
          <p className="text-lg text-neutral-600">
            Four simple steps to transform your skincare routine and achieve healthier, happier skin.
          </p>
        </div>

        <div className="relative">
          {/* Connection Line (Desktop Only) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-primary-200 -translate-y-1/2 z-0"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="mb-6 relative">
                  <div className="h-20 w-20 rounded-full bg-primary-500 flex items-center justify-center shadow-lg mb-2">
                    {step.icon}
                    <span className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white border-2 border-primary-500 flex items-center justify-center text-primary-600 font-bold">
                      {index + 1}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-neutral-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <a href="/assessment" className="btn btn-primary">
            Start Your Skin Assessment
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;