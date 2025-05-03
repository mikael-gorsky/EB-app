// src/components/auth/UserProfileSection.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import SignIn from './SignIn';
import SignUp from './SignUp';

interface UserProfileSectionProps {
  onClose: () => void;
}

const UserProfileSection: React.FC<UserProfileSectionProps> = ({ onClose }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'profile' | 'signIn' | 'signUp'>('profile');

  useEffect(() => {
    console.log("UserProfileSection mounted");
    
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Session fetched:", session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("Auth state changed:", session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for:", userId);
      setLoading(true);
      
      // Get user profile
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("Profile fetch error:", error);
        throw error;
      }
      
      console.log("Profile fetched:", data);
      
      // Get user email
      const { data: { user } } = await supabase.auth.getUser();
      
      if (data) {
        setProfile({
          ...data,
          email: user?.email || ''
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setView('profile');
  };

  const handleSignInClick = () => {
    setView('signIn');
  };

  const handleSignUpClick = () => {
    setView('signUp');
  };

  const handleSignInSuccess = () => {
    setView('profile');
  };

  const handleCancel = () => {
    setView('profile');
  };

  console.log("UserProfileSection rendering. View:", view, "User:", user);

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (view === 'signIn') {
    return (
      <div style={{ padding: '20px' }}>
        <SignIn 
          switchToSignUp={handleSignUpClick} 
          onCancel={handleCancel}
          onSignInSuccess={handleSignInSuccess}
        />
      </div>
    );
  }

  if (view === 'signUp') {
    return (
      <div style={{ padding: '20px' }}>
        <SignUp 
          switchToSignIn={handleSignInClick} 
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {user ? (
        <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
          <h2 style={{ color: '#38a3a5', fontSize: '1.5rem', marginBottom: '15px' }}>Your Profile</h2>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold', marginRight: '10px' }}>Username:</span>
              <span>{profile?.username || 'Not set'}</span>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold', marginRight: '10px' }}>Display Name:</span>
              <span>{profile?.display_name || 'Not set'}</span>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold', marginRight: '10px' }}>Email:</span>
              <span>{profile?.email || 'Not available'}</span>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            style={{ 
              padding: '10px 15px', 
              backgroundColor: '#e74c3c', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer', 
              fontWeight: 500, 
              marginRight: '10px' 
            }}
          >
            Sign Out
          </button>
          <button 
            onClick={onClose}
            style={{ 
              padding: '10px 15px', 
              backgroundColor: '#ccc', 
              color: 'black', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer', 
              fontWeight: 500 
            }}
          >
            Close
          </button>
        </div>
      ) : (
        <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
          <h2 style={{ color: '#38a3a5', fontSize: '1.5rem', marginBottom: '15px' }}>User Profile</h2>
          <p>You are not currently signed in.</p>
          <button 
            onClick={handleSignInClick}
            style={{ 
              padding: '10px 15px', 
              backgroundColor: '#38a3a5', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer', 
              fontWeight: 500, 
              marginRight: '10px' 
            }}
          >
            Sign In
          </button>
          <button 
            onClick={handleSignUpClick}
            style={{ 
              padding: '10px 15px', 
              backgroundColor: '#38a3a5', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer', 
              fontWeight: 500, 
              marginRight: '10px' 
            }}
          >
            Create Account
          </button>
          <button 
            onClick={onClose}
            style={{ 
              padding: '10px 15px', 
              backgroundColor: '#ccc', 
              color: 'black', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer', 
              fontWeight: 500, 
              marginTop: '10px', 
              display: 'block' 
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfileSection;