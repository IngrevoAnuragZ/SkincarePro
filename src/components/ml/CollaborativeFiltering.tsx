import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Star, ThumbsUp, Eye, Sparkles } from 'lucide-react';

interface SimilarUser {
  userId: string;
  similarity: number;
  profile: {
    skinType: string;
    age: number;
    concerns: string[];
    climate: string;
  };
  successfulProducts: string[];
  routineSuccess: number;
  improvementRate: number;
}

interface CollaborativeRecommendation {
  ingredient: string;
  ingredientName: string;
  collaborativeScore: number;
  userCount: number;
  avgSuccessRate: number;
  reasoning: string[];
  similarUsers: SimilarUser[];
}

interface CollaborativeFilteringProps {
  userId: string;
  userProfile: any;
  recommendations: CollaborativeRecommendation[];
  onIngredientSelect?: (ingredient: string) => void;
}

const CollaborativeFiltering: React.FC<CollaborativeFilteringProps> = ({
  userId,
  userProfile,
  recommendations,
  onIngredientSelect
}) => {
  const [selectedRecommendation, setSelectedRecommendation] = useState<CollaborativeRecommendation | null>(null);
  const [showSimilarUsers, setShowSimilarUsers] = useState(false);

  const formatIngredientName = (ingredient: string) => {
    return ingredient.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getSuccessColor = (rate: number) => {
    if (rate >= 0.8) return 'text-success-600 bg-success-100';
    if (rate >= 0.6) return 'text-warning-600 bg-warning-100';
    return 'text-error-600 bg-error-100';
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 0.8) return 'text-success-600';
    if (similarity >= 0.6) return 'text-warning-600';
    return 'text-primary-600';
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mr-4">
          <Users size={24} className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            Users Like You Recommend
          </h2>
          <p className="text-neutral-600">Based on {recommendations.length} similar users with your skin profile</p>
        </div>
      </div>

      {/* Collaborative Recommendations Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {recommendations.map((rec, index) => (
          <motion.div
            key={rec.ingredient}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-gradient-to-br from-white to-neutral-50 rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedRecommendation(rec)}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-bold text-lg text-neutral-800">
                {formatIngredientName(rec.ingredient)}
              </h3>
              <div className="flex items-center text-sm text-primary-600">
                <Users size={16} className="mr-1" />
                {rec.userCount}
              </div>
            </div>

            {/* Collaborative Score */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-neutral-600">Community Score</span>
                <span className="text-sm font-bold text-primary-600">
                  {Math.round(rec.collaborativeScore * 100)}%
                </span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <motion.div 
                  className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${rec.collaborativeScore * 100}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              </div>
            </div>

            {/* Success Rate */}
            <div className="mb-4">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSuccessColor(rec.avgSuccessRate)}`}>
                <Star size={14} className="mr-1" />
                {Math.round(rec.avgSuccessRate * 100)}% success rate
              </div>
            </div>

            {/* Top Reasoning */}
            <div className="text-sm text-neutral-600 mb-4">
              {rec.reasoning[0]}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onIngredientSelect?.(rec.ingredient);
              }}
              className="w-full bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
            >
              View Details
            </button>
          </motion.div>
        ))}
      </div>

      {/* Similar Users Section */}
      <div className="border-t border-neutral-200 pt-8">
        <button
          onClick={() => setShowSimilarUsers(!showSimilarUsers)}
          className="flex items-center justify-between w-full mb-6 text-left"
        >
          <h3 className="text-xl font-bold text-neutral-800">
            Your Skin Twins ({recommendations.reduce((acc, rec) => acc + rec.userCount, 0)} users)
          </h3>
          <motion.div
            animate={{ rotate: showSimilarUsers ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <TrendingUp size={20} className="text-primary-500" />
          </motion.div>
        </button>

        {showSimilarUsers && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {recommendations.slice(0, 3).map((rec) => 
              rec.similarUsers.map((user, index) => (
                <motion.div
                  key={`${rec.ingredient}-${user.userId}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-r from-neutral-50 to-white rounded-xl p-4 border border-neutral-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">
                          {user.userId.slice(-2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-neutral-800">Similar User</div>
                        <div className={`text-sm font-medium ${getSimilarityColor(user.similarity)}`}>
                          {Math.round(user.similarity * 100)}% match
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-neutral-600">Success Rate</div>
                      <div className={`text-sm font-bold ${getSuccessColor(user.improvementRate)}`}>
                        {Math.round(user.improvementRate * 100)}%
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-neutral-500">Skin Type:</span>
                      <span className="ml-2 font-medium capitalize">{user.profile.skinType}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Age:</span>
                      <span className="ml-2 font-medium">{user.profile.age}s</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Climate:</span>
                      <span className="ml-2 font-medium capitalize">{user.profile.climate.replace('_', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Concerns:</span>
                      <span className="ml-2 font-medium">{user.profile.concerns.slice(0, 2).join(', ')}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-neutral-100">
                    <div className="text-xs text-neutral-500 mb-2">Successful Products:</div>
                    <div className="flex flex-wrap gap-1">
                      {user.successfulProducts.slice(0, 3).map((product) => (
                        <span
                          key={product}
                          className="inline-block bg-success-100 text-success-700 text-xs px-2 py-1 rounded-full"
                        >
                          {formatIngredientName(product)}
                        </span>
                      ))}
                      {user.successfulProducts.length > 3 && (
                        <span className="inline-block bg-neutral-100 text-neutral-600 text-xs px-2 py-1 rounded-full">
                          +{user.successfulProducts.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </div>

      {/* Detailed Recommendation Modal */}
      {selectedRecommendation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedRecommendation(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                {formatIngredientName(selectedRecommendation.ingredient)}
              </h2>
              <button
                onClick={() => setSelectedRecommendation(null)}
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Community Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-primary-50 rounded-xl">
                  <div className="text-2xl font-bold text-primary-600">{selectedRecommendation.userCount}</div>
                  <div className="text-sm text-primary-700">Similar Users</div>
                </div>
                <div className="text-center p-4 bg-success-50 rounded-xl">
                  <div className="text-2xl font-bold text-success-600">
                    {Math.round(selectedRecommendation.avgSuccessRate * 100)}%
                  </div>
                  <div className="text-sm text-success-700">Success Rate</div>
                </div>
                <div className="text-center p-4 bg-accent-50 rounded-xl">
                  <div className="text-2xl font-bold text-accent-600">
                    {Math.round(selectedRecommendation.collaborativeScore * 100)}%
                  </div>
                  <div className="text-sm text-accent-700">Match Score</div>
                </div>
              </div>

              {/* Reasoning */}
              <div>
                <h3 className="font-bold text-lg mb-3 flex items-center">
                  <Sparkles size={20} className="text-primary-500 mr-2" />
                  Why Users Like You Love This
                </h3>
                <div className="space-y-2">
                  {selectedRecommendation.reasoning.map((reason, index) => (
                    <div key={index} className="flex items-start p-3 bg-neutral-50 rounded-lg">
                      <ThumbsUp size={16} className="text-success-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-neutral-700">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Similar Users */}
              <div>
                <h3 className="font-bold text-lg mb-3 flex items-center">
                  <Users size={20} className="text-primary-500 mr-2" />
                  Users With Similar Profiles
                </h3>
                <div className="space-y-3">
                  {selectedRecommendation.similarUsers.slice(0, 3).map((user, index) => (
                    <div key={user.userId} className="p-4 bg-gradient-to-r from-neutral-50 to-white rounded-xl border border-neutral-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white font-bold text-xs">
                              {user.userId.slice(-2).toUpperCase()}
                            </span>
                          </div>
                          <span className={`font-medium ${getSimilarityColor(user.similarity)}`}>
                            {Math.round(user.similarity * 100)}% similar
                          </span>
                        </div>
                        <span className={`text-sm font-medium ${getSuccessColor(user.improvementRate)}`}>
                          {Math.round(user.improvementRate * 100)}% improvement
                        </span>
                      </div>
                      <div className="text-sm text-neutral-600">
                        {user.profile.skinType} skin • {user.profile.age}s • {user.profile.climate.replace('_', ' ')} climate
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  onIngredientSelect?.(selectedRecommendation.ingredient);
                  setSelectedRecommendation(null);
                }}
                className="w-full bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
              >
                Add to My Routine
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default CollaborativeFiltering;