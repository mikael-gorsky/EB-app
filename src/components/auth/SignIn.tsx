// src/components/auth/SignIn.tsx
import React, { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

interface SignInProps {
  switchToSignUp: () => void;
  onCancel: () => void;
  onSignInSuccess: () => void;
}

const SignIn: React.FC<SignInProps> = ({ switchToSignUp, onCancel, onSignInSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      onSignInSuccess();
    } catch (error: any) {
      setError(error.message || 'Failed to sign in');
      console.error('Error during sign in:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', backgroundColor: 'white', borderRadius: '10px' }}>
      <h2 style={{ color: '#38a3a5', textAlign: 'center', marginBottom: '20px' }}>Sign In</h2>
      <form onSubmit={handleSignIn}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px' }}
          />
        </div>
        
        {error && <p style={{ color: '#e74c3c', fontSize: '14px' }}>{error}</p>}
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '12px', 
            backgroundColor: '#38a3a5', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            fontSize: '16px', 
            cursor: 'pointer', 
            fontWeight: 500, 
            marginTop: '10px' 
          }}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
        
        <button 
          type="button" 
          onClick={onCancel}
          style={{ 
            width: '100%', 
            padding: '12px', 
            backgroundColor: '#ccc', 
            color: 'black', 
            border: 'none', 
            borderRadius: '5px', 
            fontSize: '16px', 
            cursor: 'pointer', 
            fontWeight: 500, 
            marginTop: '10px' 
          }}
        >
          Cancel
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
        Don't have an account?{' '}
        <a href="#" onClick={(e) => { e.preventDefault(); switchToSignUp(); }} style={{ color: '#38a3a5' }}>
          Sign Up
        </a>
      </p>
    </div>
  );
};

export default SignIn;