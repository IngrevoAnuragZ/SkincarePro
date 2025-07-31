import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Target, 
  Zap, 
  Award, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  Lock,
  Unlock,
  Gift,
  Crown,
  Flame
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  badge: string;
  points: number;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  deadline: string;
  progress: number;
  maxProgress: number;
  completed: boolean;
}

interface GamificationDashboardProps {
  userId: string;
  currentLevel: number;
  experiencePoints: number;
  achievements: Achievement[];
  challenges: Challenge[];
  streakCount: number;
  onChallengeComplete?: (challengeId: string) => void;
}

const GamificationDashboard: React.FC<GamificationDashboardProps> = ({
  userId,
  currentLevel,
  experiencePoints,
  achievements,
  challenges,
  streakCount,
  onChallengeComplete
}) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'achievements' | 'challenges'>('overview');
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  // Level progression calculation
  const levelThresholds = [0, 500, 1500, 3000, 5000, 8000];
  const currentLevelPoints = levelThresholds[currentLevel - 1] || 0;
  const nextLevelPoints = levelThresholds[currentLevel] || levelThresholds[levelThresholds.length - 1];
  const progressToNextLevel = ((experiencePoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;

  const levelTitles = [
    'Skincare Newbie',
    'Beauty Explorer', 
    'Glow Enthusiast',
    'Radiance Master',
    'Skin Guru'
  ];

  // Simulate level up detection
  useEffect(() => {
    if (progressToNextLevel >= 100 && currentLevel < levelTitles.length) {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 5000);
    }
  }, [progressToNextLevel, currentLevel]);

  // Simulate new achievement unlock
  useEffect(() => {
    const unlockedAchievements = achievements.filter(a => a.unlocked);
    if (unlockedAchievements.length > 0) {
      const latest = unlockedAchievements[unlockedAchievements.length - 1];
      setNewAchievement(latest);
      setTimeout(() => setNewAchievement(null), 4000);
    }
  }, [achievements]);

  const CircularProgress = ({ percentage, size = 120, strokeWidth = 8, color = "primary" }: {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
  }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const colorClasses = {
      primary: "stroke-primary-500",
      success: "stroke-success-500",
      warning: "stroke-warning-500",
      accent: "stroke-accent-500"
    };

    return (
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-neutral-200"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={colorClasses[color as keyof typeof colorClasses]}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span 
            className="text-2xl font-bold text-neutral-800"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {Math.round(percentage)}%
          </motion.span>
        </div>
      </div>
    );
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Level Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-3xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Level {currentLevel}</h3>
              <p className="text-primary-100 text-lg">{levelTitles[currentLevel - 1] || 'Skin Expert'}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{experiencePoints.toLocaleString()}</div>
              <div className="text-primary-100">XP Points</div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress to Level {currentLevel + 1}</span>
              <span>{Math.round(progressToNextLevel)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <motion.div 
                className="bg-white h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressToNextLevel, 100)}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
          </div>
          
          <div className="text-sm text-primary-100">
            {nextLevelPoints - experiencePoints > 0 
              ? `${(nextLevelPoints - experiencePoints).toLocaleString()} XP to next level`
              : 'Max level reached!'
            }
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/50"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-warning-500 to-warning-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Flame size={24} className="text-white" />
          </div>
          <div className="text-2xl font-bold text-neutral-900">{streakCount}</div>
          <div className="text-sm text-neutral-600">Day Streak</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/50"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Trophy size={24} className="text-white" />
          </div>
          <div className="text-2xl font-bold text-neutral-900">{achievements.filter(a => a.unlocked).length}</div>
          <div className="text-sm text-neutral-600">Achievements</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/50"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Target size={24} className="text-white" />
          </div>
          <div className="text-2xl font-bold text-neutral-900">{challenges.filter(c => c.completed).length}</div>
          <div className="text-sm text-neutral-600">Completed</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/50"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Crown size={24} className="text-white" />
          </div>
          <div className="text-2xl font-bold text-neutral-900">{currentLevel}</div>
          <div className="text-sm text-neutral-600">Current Level</div>
        </motion.div>
      </div>

      {/* Recent Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50"
      >
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Star size={24} className="text-warning-500 mr-2" />
          Recent Achievements
        </h3>
        <div className="space-y-3">
          {achievements.filter(a => a.unlocked).slice(-3).map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-center p-3 bg-gradient-to-r from-success-50 to-success-100 rounded-xl border border-success-200"
            >
              <div className="text-2xl mr-3">{achievement.badge}</div>
              <div className="flex-grow">
                <div className="font-semibold text-success-800">{achievement.title}</div>
                <div className="text-sm text-success-600">{achievement.description}</div>
              </div>
              <div className="text-success-700 font-bold">+{achievement.points} XP</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderAchievements = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {achievements.map((achievement, index) => (
        <motion.div
          key={achievement.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`relative overflow-hidden rounded-2xl p-6 shadow-lg border transition-all duration-300 ${
            achievement.unlocked
              ? 'bg-gradient-to-br from-success-50 to-success-100 border-success-200 hover:shadow-xl'
              : 'bg-white/60 border-neutral-200 hover:bg-white/80'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`text-4xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
              {achievement.badge}
            </div>
            <div className="flex items-center">
              {achievement.unlocked ? (
                <CheckCircle size={20} className="text-success-600" />
              ) : (
                <Lock size={20} className="text-neutral-400" />
              )}
            </div>
          </div>
          
          <h4 className={`font-bold text-lg mb-2 ${
            achievement.unlocked ? 'text-success-800' : 'text-neutral-600'
          }`}>
            {achievement.title}
          </h4>
          
          <p className={`text-sm mb-4 ${
            achievement.unlocked ? 'text-success-600' : 'text-neutral-500'
          }`}>
            {achievement.description}
          </p>
          
          {achievement.progress !== undefined && achievement.maxProgress && (
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress</span>
                <span>{achievement.progress}/{achievement.maxProgress}</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                />
              </div>
            </div>
          )}
          
          <div className={`flex items-center justify-between ${
            achievement.unlocked ? 'text-success-700' : 'text-neutral-500'
          }`}>
            <span className="font-bold">+{achievement.points} XP</span>
            {achievement.unlocked && (
              <span className="text-xs bg-success-200 text-success-800 px-2 py-1 rounded-full">
                Unlocked
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderChallenges = () => (
    <div className="space-y-6">
      {challenges.map((challenge, index) => (
        <motion.div
          key={challenge.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`rounded-2xl p-6 shadow-lg border transition-all duration-300 ${
            challenge.completed
              ? 'bg-gradient-to-r from-success-50 to-success-100 border-success-200'
              : 'bg-white/80 backdrop-blur-sm border-white/50 hover:shadow-xl'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-grow">
              <h4 className={`font-bold text-lg mb-2 ${
                challenge.completed ? 'text-success-800' : 'text-neutral-800'
              }`}>
                {challenge.title}
              </h4>
              <p className={`text-sm mb-3 ${
                challenge.completed ? 'text-success-600' : 'text-neutral-600'
              }`}>
                {challenge.description}
              </p>
            </div>
            <div className="ml-4 text-right">
              <div className={`font-bold ${
                challenge.completed ? 'text-success-700' : 'text-primary-600'
              }`}>
                +{challenge.points} XP
              </div>
              <div className="text-xs text-neutral-500">
                {new Date(challenge.deadline).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{challenge.progress}/{challenge.maxProgress}</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-3">
              <motion.div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  challenge.completed 
                    ? 'bg-gradient-to-r from-success-500 to-success-600'
                    : 'bg-gradient-to-r from-primary-500 to-accent-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${(challenge.progress / challenge.maxProgress) * 100}%` }}
                transition={{ duration: 1, delay: index * 0.2 }}
              />
            </div>
          </div>
          
          {challenge.completed ? (
            <div className="flex items-center text-success-600">
              <CheckCircle size={16} className="mr-2" />
              <span className="font-medium">Challenge Completed!</span>
            </div>
          ) : (
            <button
              onClick={() => onChallengeComplete?.(challenge.id)}
              className="w-full bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
            >
              Continue Challenge
            </button>
          )}
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Level Up Celebration */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-white rounded-3xl p-8 text-center max-w-md mx-auto shadow-2xl"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-warning-500 to-warning-600 rounded-full flex items-center justify-center"
              >
                <Crown size={40} className="text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Level Up! 🎉
              </h3>
              <p className="text-neutral-600 mb-4">
                Congratulations! You've reached Level {currentLevel + 1}
              </p>
              <p className="text-lg font-semibold text-primary-600">
                {levelTitles[currentLevel] || 'Skin Expert'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Achievement Notification */}
      <AnimatePresence>
        {newAchievement && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-24 right-6 z-40 bg-gradient-to-r from-success-500 to-success-600 text-white p-4 rounded-2xl shadow-xl max-w-sm"
          >
            <div className="flex items-center">
              <div className="text-2xl mr-3">{newAchievement.badge}</div>
              <div>
                <div className="font-bold">Achievement Unlocked!</div>
                <div className="text-sm opacity-90">{newAchievement.title}</div>
                <div className="text-xs opacity-75">+{newAchievement.points} XP</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-white/80 backdrop-blur-sm rounded-2xl p-1 mb-8 shadow-lg border border-white/50">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'achievements', label: 'Achievements', icon: Trophy },
          { id: 'challenges', label: 'Challenges', icon: Target }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSelectedTab(id as any)}
            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
              selectedTab === id
                ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                : 'text-neutral-600 hover:text-neutral-800 hover:bg-white/50'
            }`}
          >
            <Icon size={18} className="mr-2" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {selectedTab === 'overview' && renderOverview()}
          {selectedTab === 'achievements' && renderAchievements()}
          {selectedTab === 'challenges' && renderChallenges()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default GamificationDashboard;