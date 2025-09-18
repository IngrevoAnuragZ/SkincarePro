import { supabase } from './supabase'
import type { User, Session, AuthError } from '@supabase/supabase-js'

export interface SignUpData {
  email: string
  password: string
  fullName: string
  ageRange: string
  phoneNumber?: string
}

export interface SignInData {
  email: string
  password: string
  rememberMe?: boolean
}

export interface UserProfile {
  user_id: string
  full_name: string
  age_range: string
  phone_number?: string
  skin_goals?: string[]
  lifestyle?: string
  notification_preferences?: {
    email: boolean
    sms: boolean
    routine_reminders: boolean
    product_updates: boolean
  }
  created_at?: string
  updated_at?: string
}

export interface AuthState {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  loading: boolean
}

class AuthService {
  private listeners: ((state: AuthState) => void)[] = []
  private currentState: AuthState = {
    user: null,
    session: null,
    profile: null,
    loading: true
  }

  constructor() {
    this.initialize()
  }

  private async initialize() {
    try {
      // Get initial session
      const { data: { session }, error } = await supabase.auth.getSession().catch(() => ({
        data: { session: null },
        error: null
      }))
      
      if (error) {
        console.error('Error getting session:', error)
        this.updateState({ loading: false })
        return
      }

      if (session?.user) {
        const profile = await this.fetchUserProfile(session.user.id)
        this.updateState({
          user: session.user,
          session,
          profile,
          loading: false
        })
      } else {
        this.updateState({ loading: false })
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        if (session?.user) {
          const profile = await this.fetchUserProfile(session.user.id)
          this.updateState({
            user: session.user,
            session,
            profile,
            loading: false
          })
        } else {
          this.updateState({
            user: null,
            session: null,
            profile: null,
            loading: false
          })
        }
      })
    } catch (error) {
      console.error('Auth initialization error:', error)
      this.updateState({ loading: false })
    }
  }

  private updateState(updates: Partial<AuthState>) {
    this.currentState = { ...this.currentState, ...updates }
    this.listeners.forEach(listener => listener(this.currentState))
  }

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener)
    // Immediately call with current state
    listener(this.currentState)
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  getState(): AuthState {
    return this.currentState
  }

  async signUp(data: SignUpData): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      this.updateState({ loading: true })

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            age_range: data.ageRange,
            phone_number: data.phoneNumber
          }
        }
      })

      if (authError) {
        this.updateState({ loading: false })
        return { user: null, error: authError }
      }

      if (authData.user) {
        // Create user profile
        await this.createUserProfile({
          user_id: authData.user.id,
          full_name: data.fullName,
          age_range: data.ageRange,
          phone_number: data.phoneNumber,
          notification_preferences: {
            email: true,
            sms: false,
            routine_reminders: true,
            product_updates: true
          }
        })
      }

      this.updateState({ loading: false })
      return { user: authData.user, error: null }
    } catch (error) {
      this.updateState({ loading: false })
      return { user: null, error: error as AuthError }
    }
  }

  async signIn(data: SignInData): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      this.updateState({ loading: true })

      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      })

      this.updateState({ loading: false })

      if (error) {
        return { user: null, error }
      }

      return { user: authData.user, error: null }
    } catch (error) {
      this.updateState({ loading: false })
      return { user: null, error: error as AuthError }
    }
  }

  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      this.updateState({ loading: true })
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  async updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })
      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  async updateProfile(updates: Partial<UserProfile>): Promise<{ profile: UserProfile | null; error: any }> {
    try {
      if (!this.currentState.user) {
        return { profile: null, error: new Error('No authenticated user') }
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('user_id', this.currentState.user.id)
        .select()
        .single()

      if (error) {
        return { profile: null, error }
      }

      const updatedProfile = data as UserProfile
      this.updateState({ profile: updatedProfile })
      return { profile: updatedProfile, error: null }
    } catch (error) {
      return { profile: null, error }
    }
  }

  private async createUserProfile(profile: UserProfile): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert(profile)
        .select()
        .single()

      if (error) {
        console.error('Error creating user profile:', error)
        return null
      }

      return data as UserProfile
    } catch (error) {
      console.error('Error creating user profile:', error)
      return null
    }
  }

  private async fetchUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return null
      }

      return data as UserProfile
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  async signInWithGoogle(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })
      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.currentState.user
  }

  getCurrentUser(): User | null {
    return this.currentState.user
  }

  getCurrentProfile(): UserProfile | null {
    return this.currentState.profile
  }

  isLoading(): boolean {
    return this.currentState.loading
  }
}

export const authService = new AuthService()

// Password validation utility
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Password strength calculator
export const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
  let score = 0
  
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[a-z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1
  
  if (score <= 2) {
    return { score, label: 'Weak', color: 'text-error-600' }
  } else if (score <= 4) {
    return { score, label: 'Medium', color: 'text-warning-600' }
  } else {
    return { score, label: 'Strong', color: 'text-success-600' }
  }
}