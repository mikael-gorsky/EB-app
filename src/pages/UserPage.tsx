// src/pages/UserPage.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { PageProps } from '../layouts/AppLayout';

const Container = styled.div<{ isDesktop: boolean }>`
  padding: 20px;
  min-height: 100vh;
  
  ${props => props.isDesktop && `
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  `}
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 30px;
  text-transform: uppercase;
`;

const Section = styled.div`
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 20px;
`;

const UserInfo = styled.div`
  margin-bottom: 20px;
`;

const InfoRow = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const InfoLabel = styled.div`
  width: 150px;
  font-weight: bold;
  color: #666;
`;

const InfoValue = styled.div`
  flex: 1;
  color: #333;
`;

const Button = styled.button`
  background-color: #38a3a5;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  margin-right: 10px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: #2c8385;
  }
`;

const LogoutButton = styled(Button)`
  background-color: #e74c3c;
  
  &:hover {
    background-color: #c0392b;
  }
`;

const AuthPrompt = styled.div`
  text-align: center;
  padding: 40px 20px;
`;

const UserPage: React.FC<PageProps> = ({ isDesktop = false }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (!error && data) {
          setProfile(data);
        } else {
          console.error('Error fetching profile:', error);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSignIn = () => {
    navigate('/auth');
  };

  const handleViewHistory = () => {
    navigate('/history');
  };

  return (
    <Container isDesktop={!!isDesktop}>
      <Title>User Profile</Title>
      
      {loading ? (
        <div>Loading...</div>
      ) : user ? (
        <>
          <Section>
            <SectionTitle>Personal Settings</SectionTitle>
            <UserInfo>
              <InfoRow>
                <InfoLabel>Username:</InfoLabel>
                <InfoValue>{profile?.username || 'Not set'}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Display Name:</InfoLabel>
                <InfoValue>{profile?.display_name || profile?.username || 'Not set'}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Email:</InfoLabel>
                <InfoValue>{user.email}</InfoValue>
              </InfoRow>
            </UserInfo>
          </Section>
          
          <Section>
            <SectionTitle>History</SectionTitle>
            <p>View your analysis history to track your progress over time.</p>
            <Button onClick={handleViewHistory}>View History</Button>
          </Section>
          
          <Section>
            <SectionTitle>Account Actions</SectionTitle>
            <LogoutButton onClick={handleSignOut}>Log Out</LogoutButton>
          </Section>
        </>
      ) : (
        <AuthPrompt>
          <p>You need to sign in to view and manage your profile.</p>
          <Button onClick={handleSignIn}>Sign In</Button>
        </AuthPrompt>
      )}
    </Container>
  );
};

export default UserPage;