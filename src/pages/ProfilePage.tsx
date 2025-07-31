import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Calendar, Save, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/common/Button'
import LoadingSpinner from '../components/common/LoadingSpinner'

interface ProfileFormData {
  full_name: string
  age_range: string
  phone_number?: string
  lifestyle?: string
  skin_goals?: string[]
  notification_preferences: {
    email: boolean
    sms: boolean
    routine_reminders: boolean
    product_updates: boolean
  }
}

const ProfilePage: React.FC = () => {
  const { user, profile, updateProfile, loading } = useAuth()
  const [isUpdating, setIsUpdating] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm<ProfileFormData>({
    defaultValues: {
      full_name: profile?.full_name || '',
      age_range: profile?.age_range || '',
      phone_number: profile?.phone_number || '',
      lifestyle: profile?.lifestyle || '',
      skin_goals: profile?.skin_goals || [],
      notification_preferences: profile?.notification_preferences || {
        email: true,
        sms: false,
        routine_reminders: true,
        product_updates: true
      }
    }
  })

  const onSubmit = async (data: ProfileFormData) => {
    setIsUpdating(true)

    try {
      const { error } = await updateProfile(data)

      if (error) {
        toast.error('Failed to update profile')
        return
      }

      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsUpdating(false)
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading profile..." />
  }

  const skinGoalOptions = [
    'Clear acne',
    'Reduce wrinkles',
    'Even skin tone',
    'Hydrate skin',
    'Minimize pores',
    'Brighten complexion',
    'Reduce dark spots',
    'Improve texture'
  ]

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Link
              to="/dashboard"
              className="inline-flex items-center text-primary-600 hover:text-primary-500 mb-4"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Dashboard
            </Link>
            
            <h1 className="text-3xl font-bold text-neutral-900">Profile Settings</h1>
            <p className="text-neutral-600 mt-1">
              Manage your account information and preferences
            </p>
          </motion.div>

          {/* Profile Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Account Information */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Account Information</h2>
                
                {/* Email (Read-only) */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-neutral-400" />
                    </div>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="input pl-10 bg-neutral-50 text-neutral-500 cursor-not-allowed"
                    />
                  </div>
                  <p className="mt-1 text-xs text-neutral-500">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>

                {/* Full Name */}
                <div className="mb-4">
                  <label htmlFor="full_name" className="block text-sm font-medium text-neutral-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-neutral-400" />
                    </div>
                    <input
                      {...register('full_name', { 
                        required: 'Full name is required',
                        minLength: { value: 2, message: 'Name must be at least 2 characters' }
                      })}
                      type="text"
                      className="input pl-10"
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.full_name && (
                    <p className="mt-1 text-sm text-error-600">{errors.full_name.message}</p>
                  )}
                </div>

                {/* Age Range */}
                <div className="mb-4">
                  <label htmlFor="age_range" className="block text-sm font-medium text-neutral-700 mb-1">
                    Age Range
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={18} className="text-neutral-400" />
                    </div>
                    <select
                      {...register('age_range', { required: 'Age range is required' })}
                      className="input pl-10"
                    >
                      <option value="">Select your age range</option>
                      <option value="18-25">18-25 years</option>
                      <option value="26-35">26-35 years</option>
                      <option value="36-45">36-45 years</option>
                      <option value="46-55">46-55 years</option>
                      <option value="55+">55+ years</option>
                    </select>
                  </div>
                  {errors.age_range && (
                    <p className="mt-1 text-sm text-error-600">{errors.age_range.message}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="mb-4">
                  <label htmlFor="phone_number" className="block text-sm font-medium text-neutral-700 mb-1">
                    Phone Number <span className="text-neutral-400">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={18} className="text-neutral-400" />
                    </div>
                    <input
                      {...register('phone_number')}
                      type="tel"
                      className="input pl-10"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                {/* Lifestyle */}
                <div>
                  <label htmlFor="lifestyle" className="block text-sm font-medium text-neutral-700 mb-1">
                    Lifestyle
                  </label>
                  <select
                    {...register('lifestyle')}
                    className="input"
                  >
                    <option value="">Select your lifestyle</option>
                    <option value="office-indoor">Office Worker (Mostly Indoors)</option>
                    <option value="outdoor-active">Outdoor Worker/Very Active</option>
                    <option value="mixed-environment">Mixed Indoor/Outdoor</option>
                    <option value="student">Student</option>
                    <option value="work-from-home">Work from Home</option>
                  </select>
                </div>
              </div>

              {/* Skin Goals */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Skin Goals</h2>
                <p className="text-sm text-neutral-600 mb-4">
                  Select your main skincare goals (you can choose multiple)
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  {skinGoalOptions.map((goal) => (
                    <label
                      key={goal}
                      className="flex items-center p-3 rounded-lg border border-neutral-200 hover:border-primary-200 cursor-pointer"
                    >
                      <input
                        {...register('skin_goals')}
                        type="checkbox"
                        value={goal}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded mr-3"
                      />
                      <span className="text-sm">{goal}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notification Preferences */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
                
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 rounded-lg border border-neutral-200">
                    <div>
                      <span className="font-medium">Email Notifications</span>
                      <p className="text-sm text-neutral-600">Receive updates and tips via email</p>
                    </div>
                    <input
                      {...register('notification_preferences.email')}
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 rounded-lg border border-neutral-200">
                    <div>
                      <span className="font-medium">SMS Notifications</span>
                      <p className="text-sm text-neutral-600">Receive routine reminders via SMS</p>
                    </div>
                    <input
                      {...register('notification_preferences.sms')}
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 rounded-lg border border-neutral-200">
                    <div>
                      <span className="font-medium">Routine Reminders</span>
                      <p className="text-sm text-neutral-600">Get reminded about your skincare routine</p>
                    </div>
                    <input
                      {...register('notification_preferences.routine_reminders')}
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 rounded-lg border border-neutral-200">
                    <div>
                      <span className="font-medium">Product Updates</span>
                      <p className="text-sm text-neutral-600">Learn about new products and ingredients</p>
                    </div>
                    <input
                      {...register('notification_preferences.product_updates')}
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                    />
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-neutral-200">
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  isLoading={isUpdating}
                  disabled={isUpdating || !isDirty}
                  icon={<Save size={18} />}
                  iconPosition="left"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage