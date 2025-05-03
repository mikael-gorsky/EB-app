// src/components/auth/Auth.tsx
import React, { useState } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';

const Auth: React.FC = () => {
  const [authView, setAuthView] = useState<'signIn' | 'signUp'>('signIn');

  const handleCancel = () => {
    // Handle cancel operation (this would typically navigate back or close a modal)
    console.log('Cancel operation');
  };

  const handleSignInSuccess = () => {
    // Handle successful sign in
    console.log('Signed in successfully');
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: '#f5f5f5' 
    }}>
      <div style={{ 
        fontSize: '32px', 
        fontWeight: 'bold', 
        color: '#38a3a5', 
        marginBottom: '30px' 
      }}>
        EmotiBot
      </div>
      {authView === 'signIn' ? (
        <SignIn 
          switchToSignUp={() => setAuthView('signUp')}
          onCancel={handleCancel}
          onSignInSuccess={handleSignInSuccess}
        />
      ) : (
        <SignUp 
          switchToSignIn={() => setAuthView('signIn')}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default Auth;