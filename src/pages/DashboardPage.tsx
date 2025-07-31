import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Calendar, 
  BarChart3, 
  Heart, 
  Settings, 
  LogOut,
  Edit,
  Star,
  TrendingUp,
  Clock,
  Award,
  Trophy,
  Target,
  Zap,
  CheckCircle
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { assessmentService, type UserAssessment } from '../lib/supabase'
import Button from '../components/common/Button'
import LoadingSpinner from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const DashboardPage: React.FC = () => {
  const { user, profile, signOut, loading } = useAuth()
  const [assessments, setAssessments] = useState<UserAssessment[]>([])
  const [loadingAssessments, setLoadingAssessments] = useState(true)
  const [testCounter, setTestCounter] = useState(0)
  const [showMilestone, setShowMilestone] = useState(false)
  const [milestoneNumber, setMilestoneNumber] = useState(0)
  const [progress, setProgress] = useState({
    overall: 0,
    profileCompleteness: 0,
    routineAdherence: 0,
    skinImprovement: 0,
    goalAchievement: 0
  })

  useEffect(() => {
    if (user) {
      loadUserAssessments()
      calculateProgress()
    }
  }, [user])

  const loadUserAssessments = async () => {
    if (!user) return

    try {
      const userAssessments = await assessmentService.getByUserId(user.id)
      setAssessments(userAssessments)
      const newTestCount = userAssessments.length
      
      // Check for milestone achievement
      const milestones = [1, 5, 10, 15, 20, 25, 30]
      if (milestones.includes(newTestCount) && newTestCount > testCounter) {
        setMilestoneNumber(newTestCount)
        setShowMilestone(true)
        setTimeout(() => setShowMilestone(false), 5000)
      }
      
      setTestCounter(newTestCount)
    } catch (error) {
      console.error('Error loading assessments:', error)
    } finally {
      setLoadingAssessments(false)
    }
  }

  const calculateProgress = () => {
    // Profile completeness (20%)
    const profileFields = [profile?.full_name, profile?.age_range, profile?.phone_number, profile?.skin_goals?.length]
    const completedFields = profileFields.filter(field => field).length
    const profileCompleteness = (completedFields / profileFields.length) * 100

    // Mock data for other metrics (in real app, these would come from user activity)
    const routineAdherence = Math.min(100, 45 + (testCounter * 5)) // Increases with more tests
    const skinImprovement = Math.min(100, 30 + (testCounter * 8)) // Increases with more tests
    const goalAchievement = Math.min(100, 25 + (testCounter * 6)) // Increases with more tests

    // Calculate overall progress
    const overall = Math.round(
      (profileCompleteness * 0.2) +
      (routineAdherence * 0.3) +
      (skinImprovement * 0.3) +
      (goalAchievement * 0.2)
    )

    setProgress({
      overall,
      profileCompleteness: Math.round(profileCompleteness),
      routineAdherence,
      skinImprovement,
      goalAchievement
    })
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out successfully')
    } catch (error) {
      toast.error('Error signing out')
    }
  }

  const CircularProgress = ({ percentage, size = 120, strokeWidth = 8, color = "primary" }: {
    percentage: number
    size?: number
    strokeWidth?: number
    color?: string
  }) => {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    const colorClasses = {
      primary: "stroke-primary-500",
      success: "stroke-success-500",
      warning: "stroke-warning-500",
      accent: "stroke-accent-500"
    }

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
            {percentage}%
          </motion.span>
        </div>
      </div>
    )
  }

  if (loading) {
    return <LoadingSpinner text="Loading your dashboard..." />
  }

  const latestAssessment = assessments[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-accent-50/30 pt-24 pb-16">
      {/* Milestone Celebration Modal */}
      <AnimatePresence>
        {showMilestone && (
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
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center"
              >
                <Trophy size={40} className="text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Milestone Achieved! 🎉
              </h3>
              <p className="text-neutral-600 mb-4">
                You've completed {milestoneNumber} skin assessment{milestoneNumber > 1 ? 's' : ''}!
              </p>
              <Button
                onClick={() => setShowMilestone(false)}
                variant="primary"
                className="bg-gradient-to-r from-primary-500 to-accent-500"
              >
                Continue Journey
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-4xl font-bold text-neutral-900 mb-2">
                  Welcome back, {profile?.full_name || user?.email?.split('@')[0]}! ✨
                </h1>
                <p className="text-neutral-600 text-lg">
                  Here's your personalized skincare dashboard
                </p>
              </div>
              
              <div className="mt-4 md:mt-0 flex space-x-3">
                <Button
                  variant="outline"
                  icon={<Settings size={18} />}
                  onClick={() => window.location.href = '/profile'}
                  className="backdrop-blur-sm bg-white/80 border-white/50 hover:bg-white/90"
                >
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  icon={<LogOut size={18} />}
                  onClick={handleSignOut}
                  className="text-neutral-600 hover:text-neutral-800"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {/* Dynamic Test Counter Card */}
            <motion.div 
              className="relative overflow-hidden bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white shadow-xl"
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-primary-100 text-sm font-medium">Tests Completed</p>
                    <motion.p 
                      className="text-3xl font-bold"
                      key={testCounter}
                      initial={{ scale: 1.2, color: "#fbbf24" }}
                      animate={{ scale: 1, color: "#ffffff" }}
                      transition={{ duration: 0.5 }}
                    >
                      {testCounter}
                    </motion.p>
                  </div>
                  <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <BarChart3 size={24} />
                  </div>
                </div>
                <div className="flex items-center">
                  <TrendingUp size={16} className="mr-1" />
                  <span className="text-sm text-primary-100">
                    {testCounter === 0 ? 'Take your first test!' : 
                     testCounter < 5 ? 'Keep going!' : 
                     testCounter < 10 ? 'Great progress!' : 'Skincare expert!'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Dynamic Routine Streak */}
            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Routine Streak</p>
                  <p className="text-3xl font-bold text-neutral-900">{Math.min(30, testCounter * 2)} days</p>
                </div>
                <div className="h-12 w-12 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Award size={24} className="text-white" />
                </div>
              </div>
              <div className="mt-2 flex items-center">
                <Zap size={16} className="text-success-500 mr-1" />
                <span className="text-sm text-success-600 font-medium">
                  {testCounter === 0 ? 'Start your journey!' : 'On fire!'}
                </span>
              </div>
            </motion.div>

            {/* Dynamic Favorites */}
            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Favorites</p>
                  <p className="text-3xl font-bold text-neutral-900">{Math.min(50, testCounter * 3 + 5)}</p>
                </div>
                <div className="h-12 w-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Heart size={24} className="text-white" />
                </div>
              </div>
              <div className="mt-2 flex items-center">
                <Star size={16} className="text-accent-500 mr-1" />
                <span className="text-sm text-accent-600 font-medium">Curated</span>
              </div>
            </motion.div>

            {/* Dynamic Overall Progress */}
            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Overall Progress</p>
                  <p className="text-3xl font-bold text-neutral-900">{progress.overall}%</p>
                </div>
                <div className="h-12 w-12 bg-gradient-to-br from-warning-500 to-warning-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Target size={24} className="text-white" />
                </div>
              </div>
              <div className="mt-2 flex items-center">
                <TrendingUp size={16} className="text-warning-500 mr-1" />
                <span className="text-sm text-warning-600 font-medium">
                  {progress.overall < 25 ? 'Getting started' :
                   progress.overall < 50 ? 'Making progress' :
                   progress.overall < 75 ? 'Doing great' : 'Almost there!'}
                </span>
              </div>
            </motion.div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Enhanced Progress Tracking System */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50"
              >
                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  Your Skin Journey Progress
                </h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Overall Progress Circle */}
                  <div className="text-center">
                    <CircularProgress percentage={progress.overall} size={140} color="primary" />
                    <h3 className="text-lg font-semibold mt-4 mb-2">Overall Progress</h3>
                    <p className="text-neutral-600 text-sm">Your complete skincare journey</p>
                  </div>

                  {/* Progress Breakdown */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-700">Profile Completeness</span>
                      <span className="text-sm font-bold text-primary-600">{progress.profileCompleteness}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <motion.div 
                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress.profileCompleteness}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-700">Routine Adherence</span>
                      <span className="text-sm font-bold text-success-600">{progress.routineAdherence}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <motion.div 
                        className="bg-gradient-to-r from-success-500 to-success-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress.routineAdherence}%` }}
                        transition={{ duration: 1, delay: 0.7 }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-700">Skin Improvement</span>
                      <span className="text-sm font-bold text-accent-600">{progress.skinImprovement}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <motion.div 
                        className="bg-gradient-to-r from-accent-500 to-accent-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress.skinImprovement}%` }}
                        transition={{ duration: 1, delay: 0.9 }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-700">Goal Achievement</span>
                      <span className="text-sm font-bold text-warning-600">{progress.goalAchievement}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <motion.div 
                        className="bg-gradient-to-r from-warning-500 to-warning-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress.goalAchievement}%` }}
                        transition={{ duration: 1, delay: 1.1 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Latest Assessment */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                    Latest Skin Assessment
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Edit size={16} />}
                    onClick={() => window.location.href = '/assessment'}
                    className="backdrop-blur-sm bg-white/80 border-white/50 hover:bg-white/90"
                  >
                    Retake
                  </Button>
                </div>

                {loadingAssessments ? (
                  <LoadingSpinner size={32} text="Loading assessment..." />
                ) : latestAssessment ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-4">
                        <p className="text-sm font-medium text-primary-700 mb-1">Skin Type</p>
                        <p className="text-xl font-bold text-primary-800 capitalize">{latestAssessment.skin_type}</p>
                      </div>
                      <div className="bg-gradient-to-br from-accent-50 to-accent-100 rounded-2xl p-4">
                        <p className="text-sm font-medium text-accent-700 mb-1">Age Range</p>
                        <p className="text-xl font-bold text-accent-800">{latestAssessment.age_range}</p>
                      </div>
                    </div>

                    {latestAssessment.skin_concerns && latestAssessment.skin_concerns.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-neutral-600 mb-3">Main Concerns</p>
                        <div className="flex flex-wrap gap-2">
                          {latestAssessment.skin_concerns.slice(0, 4).map((concern, index) => (
                            <motion.span
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className="inline-block bg-gradient-to-r from-primary-100 to-accent-100 text-primary-700 rounded-full px-4 py-2 text-sm font-medium capitalize border border-primary-200"
                            >
                              {concern.replace('-', ' ')}
                            </motion.span>
                          ))}
                          {latestAssessment.skin_concerns.length > 4 && (
                            <span className="inline-block bg-neutral-100 text-neutral-600 rounded-full px-4 py-2 text-sm border border-neutral-200">
                              +{latestAssessment.skin_concerns.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t border-neutral-100">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-neutral-500">
                          Completed on {new Date(latestAssessment.assessment_date || '').toLocaleDateString()}
                        </p>
                        <div className="flex items-center text-success-600">
                          <CheckCircle size={16} className="mr-1" />
                          <span className="text-sm font-medium">Complete</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center">
                      <BarChart3 size={40} className="text-primary-600" />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-3">No assessments yet</h3>
                    <p className="text-neutral-600 mb-6">
                      Take your first skin assessment to get personalized recommendations
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => window.location.href = '/assessment'}
                      className="bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600"
                    >
                      Start Assessment
                    </Button>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Profile Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50"
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <User size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900">{profile?.full_name || 'User'}</h3>
                  <p className="text-neutral-600">{user?.email}</p>
                  {profile?.age_range && (
                    <p className="text-sm text-neutral-500 mt-1">{profile.age_range} years old</p>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-neutral-100">
                  <Button
                    variant="outline"
                    fullWidth
                    icon={<Edit size={18} />}
                    onClick={() => window.location.href = '/profile'}
                    className="backdrop-blur-sm bg-white/80 border-white/50 hover:bg-white/90"
                  >
                    Edit Profile
                  </Button>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50"
              >
                <h3 className="text-lg font-bold text-neutral-900 mb-4">Quick Actions</h3>
                
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    fullWidth
                    icon={<BarChart3 size={18} />}
                    onClick={() => window.location.href = '/assessment'}
                    className="backdrop-blur-sm bg-white/80 border-white/50 hover:bg-white/90 justify-start"
                  >
                    Take Assessment
                  </Button>
                  
                  <Button
                    variant="outline"
                    fullWidth
                    icon={<Calendar size={18} />}
                    onClick={() => window.location.href = '/routine'}
                    className="backdrop-blur-sm bg-white/80 border-white/50 hover:bg-white/90 justify-start"
                  >
                    View Routines
                  </Button>
                  
                  <Button
                    variant="outline"
                    fullWidth
                    icon={<Star size={18} />}
                    onClick={() => window.location.href = '/ingredients'}
                    className="backdrop-blur-sm bg-white/80 border-white/50 hover:bg-white/90 justify-start"
                  >
                    Browse Ingredients
                  </Button>
                </div>
              </motion.div>

              {/* Daily Tip */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-gradient-to-br from-primary-50 via-white to-accent-50 rounded-3xl p-6 border border-primary-100 shadow-xl"
              >
                <h3 className="text-lg font-bold mb-3 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  💡 Today's Tip
                </h3>
                <p className="text-neutral-700 text-sm leading-relaxed">
                  Remember to apply sunscreen 15-30 minutes before going outside for maximum protection. 
                  Reapply every 2-3 hours, especially if you're spending time outdoors.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage