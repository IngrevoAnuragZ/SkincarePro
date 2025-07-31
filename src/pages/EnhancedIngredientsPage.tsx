import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, X, Loader, Database, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EnhancedIngredientCard from '../components/ingredients/EnhancedIngredientCard';
import IngredientScanner from '../components/ingredients/IngredientScanner';
import { ingredientsService, type Ingredient } from '../lib/supabase';

type SafetyFilter = 'all' | 'safe' | 'caution' | 'unsafe';
type CategoryFilter = string | null;
type SkinTypeFilter = string | null;

const EnhancedIngredientsPage: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [safetyFilter, setSafetyFilter] = useState<SafetyFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>(null);
  const [skinTypeFilter, setSkinTypeFilter] = useState<SkinTypeFilter>(null);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  // Load ingredients from Supabase
  useEffect(() => {
    loadIngredients();
  }, []);

  const loadIngredients = async () => {
    try {
      setLoading(true);
      const data = await ingredientsService.getAll();
      setIngredients(data);
    } catch (err) {
      setError('Failed to load ingredients. Please try again.');
      console.error('Error loading ingredients:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories and skin types for filters
  const { uniqueCategories, uniqueSkinTypes } = useMemo(() => {
    const categories = new Set<string>();
    const skinTypes = new Set<string>();
    
    ingredients.forEach(ingredient => {
      if (ingredient.category) {
        categories.add(ingredient.category);
      }
      if (ingredient.skin_types) {
        ingredient.skin_types.forEach(type => skinTypes.add(type));
      }
    });
    
    return {
      uniqueCategories: Array.from(categories).sort(),
      uniqueSkinTypes: Array.from(skinTypes).sort()
    };
  }, [ingredients]);

  // Filter ingredients based on search term and filters
  const filteredIngredients = useMemo(() => {
    return ingredients.filter(ingredient => {
      // Search filter
      const matchesSearch = 
        searchTerm === '' || 
        ingredient.ingredient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ingredient.inci_name && ingredient.inci_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (ingredient.function && ingredient.function.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (ingredient.natural_sources && ingredient.natural_sources.some(source => 
          source.toLowerCase().includes(searchTerm.toLowerCase())
        ));

      // Safety filter
      const matchesSafety = 
        safetyFilter === 'all' || 
        ingredient.safety_level === safetyFilter;

      // Category filter
      const matchesCategory = 
        !categoryFilter || 
        ingredient.category === categoryFilter;

      // Skin type filter
      const matchesSkinType = 
        !skinTypeFilter || 
        (ingredient.skin_types && ingredient.skin_types.includes(skinTypeFilter)) ||
        (ingredient.skin_types && ingredient.skin_types.includes('all'));

      return matchesSearch && matchesSafety && matchesCategory && matchesSkinType;
    });
  }, [ingredients, searchTerm, safetyFilter, categoryFilter, skinTypeFilter]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearFilters = () => {
    setSafetyFilter('all');
    setCategoryFilter(null);
    setSkinTypeFilter(null);
  };

  const toggleFilterMenu = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen);
  };

  const activeFiltersCount = [
    safetyFilter !== 'all',
    categoryFilter !== null,
    skinTypeFilter !== null
  ].filter(Boolean).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-accent-50/30 pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-center py-20">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center"
              >
                <Loader size={32} className="text-white" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Loading Ingredients Database
              </h3>
              <p className="text-neutral-600">50+ ingredients with natural sources & compatibility data</p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-accent-50/30 pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-16 h-16 mx-auto bg-error-100 rounded-full flex items-center justify-center mb-4">
                <Database size={24} className="text-error-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Failed to Load Ingredients</h2>
              <p className="text-neutral-600 mb-6">{error}</p>
              <button
                onClick={loadIngredients}
                className="btn btn-primary bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600"
              >
                Try Again
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-accent-50/30 pt-24 pb-16">
      {/* Ingredient Scanner */}
      <IngredientScanner />
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles size={32} className="text-primary-500 mr-3" />
                </motion.div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  Enhanced Ingredient Database
                </h1>
              </div>
              <p className="text-neutral-600 mb-4 text-lg">
                Explore our comprehensive database of 50+ skincare ingredients with natural sources, compatibility information, and safety ratings.
              </p>
              <motion.div 
                className="inline-flex items-center bg-white/80 backdrop-blur-sm text-primary-700 rounded-full px-6 py-3 text-sm font-medium shadow-lg border border-white/50"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Database size={16} className="mr-2" />
                {ingredients.length} ingredients • Live database • Real-time updates
              </motion.div>
            </div>
          </motion.div>

          {/* Search and Filter Section */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={20} className="text-neutral-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search ingredients, natural sources, or functions..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white/50 bg-white/80 backdrop-blur-sm text-neutral-800 placeholder-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 shadow-lg"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              
              <button
                onClick={toggleFilterMenu}
                className="md:hidden btn btn-outline flex items-center relative bg-white/80 backdrop-blur-sm border-white/50 hover:bg-white/90"
              >
                <Filter size={18} className="mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              
              {/* Desktop Filters */}
              <div className="hidden md:flex space-x-3">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-3 flex items-center">
                  <span className="text-sm font-medium text-neutral-500 mr-3">Safety:</span>
                  <div className="flex space-x-1">
                    {['all', 'safe', 'caution', 'unsafe'].map((level) => (
                      <button
                        key={level}
                        className={`px-3 py-2 rounded-full text-sm capitalize transition-all duration-200 ${
                          safetyFilter === level
                            ? level === 'safe' ? 'bg-success-100 text-success-700 shadow-md'
                            : level === 'caution' ? 'bg-warning-100 text-warning-700 shadow-md'
                            : level === 'unsafe' ? 'bg-error-100 text-error-700 shadow-md'
                            : 'bg-primary-100 text-primary-700 shadow-md'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                        onClick={() => setSafetyFilter(level as SafetyFilter)}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-3 flex items-center">
                  <span className="text-sm font-medium text-neutral-500 mr-3">Category:</span>
                  <select
                    className="text-sm bg-white/90 rounded-xl px-3 py-2 text-neutral-600 border border-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    value={categoryFilter || ''}
                    onChange={(e) => setCategoryFilter(e.target.value || null)}
                  >
                    <option value="">All Categories</option>
                    {uniqueCategories.map((category) => (
                      <option key={category} value={category} className="capitalize">
                        {category.replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-3 flex items-center">
                  <span className="text-sm font-medium text-neutral-500 mr-3">Skin Type:</span>
                  <select
                    className="text-sm bg-white/90 rounded-xl px-3 py-2 text-neutral-600 border border-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    value={skinTypeFilter || ''}
                    onChange={(e) => setSkinTypeFilter(e.target.value || null)}
                  >
                    <option value="">All Skin Types</option>
                    {uniqueSkinTypes.map((skinType) => (
                      <option key={skinType} value={skinType} className="capitalize">
                        {skinType}
                      </option>
                    ))}
                  </select>
                </div>
                
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center text-sm text-neutral-500 hover:text-neutral-700 px-3 py-2 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 hover:bg-white/90 transition-colors"
                  >
                    <X size={16} className="mr-1" />
                    Clear
                  </button>
                )}
              </div>
            </div>
            
            {/* Mobile Filter Menu */}
            <AnimatePresence>
              {isFilterMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="md:hidden mt-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 overflow-hidden"
                >
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500 mb-3">Safety Level</h3>
                      <div className="flex flex-wrap gap-2">
                        {['all', 'safe', 'caution', 'unsafe'].map((level) => (
                          <button
                            key={level}
                            className={`px-4 py-2 rounded-full text-sm capitalize transition-all duration-200 ${
                              safetyFilter === level
                                ? level === 'safe' ? 'bg-success-100 text-success-700'
                                : level === 'caution' ? 'bg-warning-100 text-warning-700'
                                : level === 'unsafe' ? 'bg-error-100 text-error-700'
                                : 'bg-primary-100 text-primary-700'
                                : 'bg-neutral-100 text-neutral-600'
                            }`}
                            onClick={() => setSafetyFilter(level as SafetyFilter)}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500 mb-3">Category</h3>
                      <select
                        className="w-full px-4 py-3 rounded-xl border border-white/50 bg-white/90 text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        value={categoryFilter || ''}
                        onChange={(e) => setCategoryFilter(e.target.value || null)}
                      >
                        <option value="">All Categories</option>
                        {uniqueCategories.map((category) => (
                          <option key={category} value={category} className="capitalize">
                            {category.replace('-', ' ')}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-neutral-500 mb-3">Skin Type</h3>
                      <select
                        className="w-full px-4 py-3 rounded-xl border border-white/50 bg-white/90 text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        value={skinTypeFilter || ''}
                        onChange={(e) => setSkinTypeFilter(e.target.value || null)}
                      >
                        <option value="">All Skin Types</option>
                        {uniqueSkinTypes.map((skinType) => (
                          <option key={skinType} value={skinType} className="capitalize">
                            {skinType}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-8 pt-6 border-t border-neutral-200">
                    <button
                      onClick={clearFilters}
                      className="text-neutral-500 hover:text-neutral-700 transition-colors"
                    >
                      Clear All
                    </button>
                    
                    <button
                      onClick={toggleFilterMenu}
                      className="btn btn-primary bg-gradient-to-r from-primary-500 to-accent-500"
                    >
                      Apply Filters
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          {/* Applied Filters */}
          {activeFiltersCount > 0 && (
            <motion.div 
              className="flex flex-wrap gap-2 mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {safetyFilter !== 'all' && (
                <div className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium shadow-lg ${
                  safetyFilter === 'safe' ? 'bg-success-100 text-success-700 border border-success-200'
                  : safetyFilter === 'caution' ? 'bg-warning-100 text-warning-700 border border-warning-200'
                  : 'bg-error-100 text-error-700 border border-error-200'
                }`}>
                  <span>Safety: {safetyFilter.charAt(0).toUpperCase() + safetyFilter.slice(1)}</span>
                  <button 
                    onClick={() => setSafetyFilter('all')}
                    className="ml-2 focus:outline-none hover:scale-110 transition-transform"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              
              {categoryFilter && (
                <div className="inline-flex items-center bg-primary-100 text-primary-700 rounded-full px-4 py-2 text-sm font-medium border border-primary-200 shadow-lg">
                  <span>Category: {categoryFilter.replace('-', ' ')}</span>
                  <button 
                    onClick={() => setCategoryFilter(null)}
                    className="ml-2 focus:outline-none hover:scale-110 transition-transform"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {skinTypeFilter && (
                <div className="inline-flex items-center bg-accent-100 text-accent-700 rounded-full px-4 py-2 text-sm font-medium border border-accent-200 shadow-lg">
                  <span>Skin Type: {skinTypeFilter}</span>
                  <button 
                    onClick={() => setSkinTypeFilter(null)}
                    className="ml-2 focus:outline-none hover:scale-110 transition-transform"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </motion.div>
          )}
          
          {/* Results Count */}
          <motion.p 
            className="text-neutral-500 mb-6 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            Showing <span className="font-semibold text-primary-600">{filteredIngredients.length}</span> of <span className="font-semibold">{ingredients.length}</span> ingredients
          </motion.p>
          
          {/* Ingredients Grid */}
          {filteredIngredients.length > 0 ? (
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {filteredIngredients.map((ingredient, index) => (
                <motion.div
                  key={ingredient.ingredient_id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <EnhancedIngredientCard
                    ingredient={ingredient}
                    onClick={() => {/* Navigate to ingredient detail */}}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center mb-6">
                <Search size={32} className="text-neutral-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-neutral-800">No ingredients found</h3>
              <p className="text-neutral-500 mb-6 max-w-md mx-auto">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="btn btn-outline bg-white/80 backdrop-blur-sm border-white/50 hover:bg-white/90"
                >
                  Clear All Filters
                </button>
              )}
            </motion.div>
          )}

          {/* Database Info */}
          <motion.div 
            className="mt-20 bg-gradient-to-r from-primary-50 via-white to-accent-50 rounded-3xl p-8 border border-primary-100 shadow-xl backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-start">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mr-4 flex-shrink-0">
                <Database size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  Enhanced Database Features
                </h3>
                <p className="text-neutral-600 mb-4 leading-relaxed">
                  This comprehensive ingredient database includes 50+ skincare ingredients with detailed information:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <ul className="text-sm text-neutral-600 space-y-2">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                      Natural food sources with visual icons
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                      Ingredient compatibility and interaction warnings
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                      Safety ratings based on scientific evidence
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                      Optimal usage times and concentration ranges
                    </li>
                  </ul>
                  <ul className="text-sm text-neutral-600 space-y-2">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-accent-500 rounded-full mr-3"></div>
                      Skin type suitability recommendations
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-accent-500 rounded-full mr-3"></div>
                      Animated interactions and smooth transitions
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-accent-500 rounded-full mr-3"></div>
                      Real-time search and filtering
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-accent-500 rounded-full mr-3"></div>
                      Mobile-optimized responsive design
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedIngredientsPage;