import React, { useState, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import IngredientCard from '../components/ingredients/IngredientCard';
import { ingredients } from '../data/ingredients';

type SafetyFilter = 'all' | 'safe' | 'caution' | 'unsafe';
type BenefitFilter = string | null;

const IngredientsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [safetyFilter, setSafetyFilter] = useState<SafetyFilter>('all');
  const [benefitFilter, setBenefitFilter] = useState<BenefitFilter>(null);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  
  // Get unique benefits from all ingredients
  const uniqueBenefits = useMemo(() => {
    const benefits = new Set<string>();
    ingredients.forEach(ingredient => {
      ingredient.benefits.forEach(benefit => {
        benefits.add(benefit);
      });
    });
    return Array.from(benefits).sort();
  }, []);
  
  // Filter ingredients based on search term and filters
  const filteredIngredients = useMemo(() => {
    return ingredients.filter(ingredient => {
      // Search filter
      const matchesSearch = 
        searchTerm === '' || 
        ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ingredient.alternativeNames.some(name => 
          name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      // Safety filter
      const matchesSafety = 
        safetyFilter === 'all' || 
        ingredient.safetyLevel === safetyFilter;
      
      // Benefit filter
      const matchesBenefit = 
        !benefitFilter || 
        ingredient.benefits.some(benefit => benefit === benefitFilter);
      
      return matchesSearch && matchesSafety && matchesBenefit;
    });
  }, [searchTerm, safetyFilter, benefitFilter]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleSafetyFilterChange = (filter: SafetyFilter) => {
    setSafetyFilter(filter);
  };
  
  const handleBenefitFilterChange = (benefit: string | null) => {
    setBenefitFilter(benefit);
  };
  
  const clearFilters = () => {
    setSafetyFilter('all');
    setBenefitFilter(null);
  };
  
  const toggleFilterMenu = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen);
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Ingredient Database</h1>
          <p className="text-neutral-600 mb-8">
            Search our comprehensive database of skincare ingredients to understand their benefits, safety, and suitability for your skin type.
          </p>
        
          {/* Search and Filter Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={20} className="text-neutral-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search ingredients..."
                  className="input pl-10"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              
              <button
                onClick={toggleFilterMenu}
                className="md:hidden btn btn-outline flex items-center"
              >
                <Filter size={18} className="mr-2" />
                Filters
              </button>
              
              {/* Desktop Filters */}
              <div className="hidden md:flex space-x-2">
                <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-2 flex items-center">
                  <span className="text-sm font-medium text-neutral-500 mr-2">Safety:</span>
                  <div className="flex space-x-1">
                    <button
                      className={`px-3 py-1 rounded-full text-sm ${
                        safetyFilter === 'all' 
                          ? 'bg-primary-100 text-primary-700' 
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                      onClick={() => handleSafetyFilterChange('all')}
                    >
                      All
                    </button>
                    <button
                      className={`px-3 py-1 rounded-full text-sm ${
                        safetyFilter === 'safe' 
                          ? 'bg-success-100 text-success-700' 
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                      onClick={() => handleSafetyFilterChange('safe')}
                    >
                      Safe
                    </button>
                    <button
                      className={`px-3 py-1 rounded-full text-sm ${
                        safetyFilter === 'caution' 
                          ? 'bg-warning-100 text-warning-700' 
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                      onClick={() => handleSafetyFilterChange('caution')}
                    >
                      Caution
                    </button>
                    <button
                      className={`px-3 py-1 rounded-full text-sm ${
                        safetyFilter === 'unsafe' 
                          ? 'bg-error-100 text-error-700' 
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                      onClick={() => handleSafetyFilterChange('unsafe')}
                    >
                      Unsafe
                    </button>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-2 flex items-center">
                  <span className="text-sm font-medium text-neutral-500 mr-2">Benefits:</span>
                  <select
                    className="text-sm bg-neutral-100 rounded-full px-3 py-1 text-neutral-600 border-none focus:outline-none focus:ring-1 focus:ring-primary-500"
                    value={benefitFilter || ''}
                    onChange={(e) => handleBenefitFilterChange(e.target.value || null)}
                  >
                    <option value="">All Benefits</option>
                    {uniqueBenefits.map((benefit) => (
                      <option key={benefit} value={benefit}>
                        {benefit}
                      </option>
                    ))}
                  </select>
                </div>
                
                {(safetyFilter !== 'all' || benefitFilter !== null) && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center text-sm text-neutral-500 hover:text-neutral-700"
                  >
                    <X size={16} className="mr-1" />
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
            
            {/* Mobile Filter Menu */}
            {isFilterMenuOpen && (
              <div className="md:hidden mt-4 bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-neutral-500 mb-2">Safety Level</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className={`px-3 py-1 rounded-full text-sm ${
                        safetyFilter === 'all' 
                          ? 'bg-primary-100 text-primary-700' 
                          : 'bg-neutral-100 text-neutral-600'
                      }`}
                      onClick={() => handleSafetyFilterChange('all')}
                    >
                      All
                    </button>
                    <button
                      className={`px-3 py-1 rounded-full text-sm ${
                        safetyFilter === 'safe' 
                          ? 'bg-success-100 text-success-700' 
                          : 'bg-neutral-100 text-neutral-600'
                      }`}
                      onClick={() => handleSafetyFilterChange('safe')}
                    >
                      Safe
                    </button>
                    <button
                      className={`px-3 py-1 rounded-full text-sm ${
                        safetyFilter === 'caution' 
                          ? 'bg-warning-100 text-warning-700' 
                          : 'bg-neutral-100 text-neutral-600'
                      }`}
                      onClick={() => handleSafetyFilterChange('caution')}
                    >
                      Caution
                    </button>
                    <button
                      className={`px-3 py-1 rounded-full text-sm ${
                        safetyFilter === 'unsafe' 
                          ? 'bg-error-100 text-error-700' 
                          : 'bg-neutral-100 text-neutral-600'
                      }`}
                      onClick={() => handleSafetyFilterChange('unsafe')}
                    >
                      Unsafe
                    </button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-neutral-500 mb-2">Benefits For</h3>
                  <select
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    value={benefitFilter || ''}
                    onChange={(e) => handleBenefitFilterChange(e.target.value || null)}
                  >
                    <option value="">All Benefits</option>
                    {uniqueBenefits.map((benefit) => (
                      <option key={benefit} value={benefit}>
                        {benefit}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex justify-between">
                  <button
                    onClick={clearFilters}
                    className="text-neutral-500"
                  >
                    Clear All
                  </button>
                  
                  <button
                    onClick={toggleFilterMenu}
                    className="btn btn-primary btn-sm"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Applied Filters */}
          {(safetyFilter !== 'all' || benefitFilter !== null) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {safetyFilter !== 'all' && (
                <div className={`inline-flex items-center rounded-full px-3 py-1 text-sm ${
                  safetyFilter === 'safe' 
                    ? 'bg-success-100 text-success-700' 
                    : safetyFilter === 'caution'
                    ? 'bg-warning-100 text-warning-700'
                    : 'bg-error-100 text-error-700'
                }`}>
                  <span>Safety: {safetyFilter.charAt(0).toUpperCase() + safetyFilter.slice(1)}</span>
                  <button 
                    onClick={() => handleSafetyFilterChange('all')}
                    className="ml-1 focus:outline-none"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              
              {benefitFilter && (
                <div className="inline-flex items-center bg-primary-100 text-primary-700 rounded-full px-3 py-1 text-sm">
                  <span>Benefit: {benefitFilter}</span>
                  <button 
                    onClick={() => handleBenefitFilterChange(null)}
                    className="ml-1 focus:outline-none"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              
              <button
                onClick={clearFilters}
                className="inline-flex items-center bg-neutral-100 text-neutral-600 rounded-full px-3 py-1 text-sm hover:bg-neutral-200"
              >
                Clear All
              </button>
            </div>
          )}
          
          {/* Results Count */}
          <p className="text-neutral-500 mb-6">
            Showing {filteredIngredients.length} {filteredIngredients.length === 1 ? 'ingredient' : 'ingredients'}
          </p>
          
          {/* Ingredients Grid */}
          {filteredIngredients.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIngredients.map((ingredient) => (
                <IngredientCard
                  key={ingredient.id}
                  name={ingredient.name}
                  alternativeName={ingredient.alternativeNames[0]}
                  description={ingredient.description}
                  safetyLevel={ingredient.safetyLevel}
                  benefitsFor={ingredient.benefits}
                  concerns={ingredient.concerns}
                  onClick={() => {/* Navigate to ingredient detail */}}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                <Search size={24} className="text-neutral-400" />
              </div>
              <h3 className="text-lg font-semibold mb-1">No ingredients found</h3>
              <p className="text-neutral-500">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IngredientsPage;