import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Youtube, Mail, Phone } from 'lucide-react';
import Logo from '../common/Logo';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-white">
      <div className="container mx-auto px-4 pt-12 pb-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="flex flex-col space-y-4">
            <Logo height={40} className="text-white" />
            <p className="text-neutral-300 mt-4 max-w-xs">
              Decoding skincare ingredients for healthier skin choices tailored for Indian consumers.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-neutral-300 hover:text-primary-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-neutral-300 hover:text-primary-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-neutral-300 hover:text-primary-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-neutral-300 hover:text-primary-400 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-primary-300">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/ingredients" className="text-neutral-300 hover:text-white transition-colors">
                  Ingredient Database
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-neutral-300 hover:text-white transition-colors">
                  Skincare Blog
                </Link>
              </li>
              <li>
                <Link to="/education" className="text-neutral-300 hover:text-white transition-colors">
                  Skincare Education
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-neutral-300 hover:text-white transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-primary-300">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-neutral-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-neutral-300 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-neutral-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-neutral-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-primary-300">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail size={20} className="text-neutral-300 mt-1 flex-shrink-0" />
                <span className="text-neutral-300">support@ingrevo.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone size={20} className="text-neutral-300 mt-1 flex-shrink-0" />
                <span className="text-neutral-300">+91 99999 88888</span>
              </li>
              <li className="mt-6">
                <Link to="/contact" className="btn btn-outline border-primary-400 text-primary-400 hover:bg-primary-900">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-700">
          <div className="flex flex-col md:flex-row md:justify-between items-center">
            <p className="text-neutral-400 text-sm">
              © {currentYear} Ingrevo. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6 text-sm text-neutral-400">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link to="/accessibility" className="hover:text-white transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;