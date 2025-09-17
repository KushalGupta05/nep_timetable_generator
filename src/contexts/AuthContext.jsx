import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase?.auth?.getSession()
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchUserProfile(session?.user?.id)
      }
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase?.auth?.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchUserProfile(session?.user?.id)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription?.unsubscribe();
  }, [])

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single()

      if (error && error?.code !== 'PGRST116') {
        throw error
      }

      setProfile(data || null)
    } catch (error) {
      console.error('Error fetching profile:', error?.message)
      setProfile(null)
    }
  }

  const signUp = async (email, password, userData = {}) => {
    try {
      const { data, error } = await supabase?.auth?.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase?.auth?.signOut()
      if (error) throw error
      setProfile(null)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No authenticated user')

      const { data, error } = await supabase?.from('user_profiles')?.update(updates)?.eq('id', user?.id)?.select()?.single()

      if (error) throw error
      
      setProfile(data)
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    fetchUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}