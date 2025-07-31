import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Priya Singh",
    location: "Mumbai",
    image: "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 5,
    text: "I've struggled with understanding skincare labels for years. Ingrevo has completely changed how I shop for products. Now I know exactly what works for my oily, acne-prone skin and what to avoid."
  },
  {
    id: 2,
    name: "Rahul Mehta",
    location: "Delhi",
    image: "https://images.pexels.com/photos/1270076/pexels-photo-1270076.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 5,
    text: "As someone with sensitive skin, finding the right products has always been challenging. The ingredient analysis feature helped me identify exactly what was causing my irritation. Highly recommend!"
  },
  {
    id: 3,
    name: "Aisha Patel",
    location: "Bangalore",
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 4,
    text: "The personalized routine builder is amazing! It suggested affordable alternatives to expensive products I was using, and my skin actually looks better now. Perfect for budget-conscious skincare lovers."
  },
  {
    id: 4,
    name: "Vikram Joshi",
    location: "Chennai",
    image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 5,
    text: "Being a guy new to skincare, I was completely lost. Ingrevo's simple explanations and personalized recommendations made it easy to build a routine that actually works for me."
  }
];

const TestimonialSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  return (
    <section className="py-20 bg-primary-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by Indian Skincare Enthusiasts</h2>
          <p className="text-lg text-neutral-600">
            Hear from users who transformed their skincare routines with Ingrevo.
          </p>
        </div>

        {/* Mobile Testimonial Slider */}
        <div className="md:hidden">
          <div className="relative px-4">
            <div className="card">
              <div className="flex items-start mb-4">
                <img
                  src={testimonials[currentSlide].image}
                  alt={testimonials[currentSlide].name}
                  className="h-16 w-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-semibold text-lg">{testimonials[currentSlide].name}</h3>
                  <p className="text-neutral-500 text-sm">{testimonials[currentSlide].location}</p>
                  <div className="flex mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < testimonials[currentSlide].rating ? "text-warning-400 fill-warning-400" : "text-neutral-300"}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-neutral-600 italic">"{testimonials[currentSlide].text}"</p>
            </div>

            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-0 -translate-y-1/2 h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center text-primary-500 hover:bg-primary-50"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-0 -translate-y-1/2 h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center text-primary-500 hover:bg-primary-50"
            >
              <ChevronRight size={20} />
            </button>
            
            <div className="flex justify-center space-x-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2.5 w-2.5 rounded-full ${currentSlide === index ? 'bg-primary-500' : 'bg-primary-200'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Testimonial Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="card h-full flex flex-col">
              <div className="flex items-start mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="h-14 w-14 rounded-full object-cover mr-3"
                />
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-neutral-500 text-sm">{testimonial.location}</p>
                  <div className="flex mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < testimonial.rating ? "text-warning-400 fill-warning-400" : "text-neutral-300"}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-neutral-600 italic text-sm flex-grow">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;