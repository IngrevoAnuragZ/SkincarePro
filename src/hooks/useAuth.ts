import { useState, useEffect } from 'react'
import { authService, type AuthState } from '../lib/auth'

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    loading: true
  })

  useEffect(() => {
    const unsubscribe = authService.subscribe(setAuthState)
    return unsubscribe
  }, [])

  return {
    ...authState,
    signUp: authService.signUp.bind(authService),
    signIn: authService.signIn.bind(authService),
    signOut: authService.signOut.bind(authService),
    resetPassword: authService.resetPassword.bind(authService),
    updatePassword: authService.updatePassword.bind(authService),
    updateProfile: authService.updateProfile.bind(authService),
    signInWithGoogle: authService.signInWithGoogle.bind(authService),
    isAuthenticated: authService.isAuthenticated.bind(authService)
  }
}