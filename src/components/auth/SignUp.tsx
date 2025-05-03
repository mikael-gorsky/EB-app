// src/components/auth/SignUp.tsx
import React, { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

interface SignUpProps {
  switchToSignIn: () => void;
  onCancel: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ switchToSignIn, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Register the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      
      if (authData?.user) {
        // 2. Add the user profile with username
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([{ 
            id: authData.user.id, 
            username,
            display_name: username 
          }]);

        if (profileError) throw profileError;
        
        alert('Registration successful!');
        switchToSignIn();
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred during sign up');
      console.error('Error during signup:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ color: '#38a3a5', textAlign: 'center', marginBottom: '20px' }}>Create an Account</h2>
      <form onSubmit={handleSignUp}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }} htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }} htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }} htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
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
          {loading ? 'Creating Account...' : 'Sign Up'}
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
        Already have an account?{' '}
        <a href="#" onClick={(e) => { e.preventDefault(); switchToSignIn(); }} style={{ color: '#38a3a5' }}>
          Sign In
        </a>
      </p>
    </div>
  );
};

export default SignUp;