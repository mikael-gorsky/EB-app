// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';

// Define the context type
type AuthContextType = {
  user: any | null;
  loading: boolean;
  signIn: () => void;
  signUp: () => void;
  signOut: () => void;
};

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  signIn: () => {},
  signUp: () => {},
  signOut: () => {}
});

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // Simplified functions that don't use Supabase
  const signIn = () => {
    console.log('Sign in called');
  };

  const signUp = () => {
    console.log('Sign up called');
  };

  const signOut = () => {
    console.log('Sign out called');
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut
  };

  console.log('AuthProvider rendering', value);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};