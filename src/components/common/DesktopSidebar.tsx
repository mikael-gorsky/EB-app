// src/components/common/DesktopSidebar.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { supabase } from '../../utils/supabaseClient';

// Get the package info - adjust the import path as needed
const packageInfo = { version: '0.2.0' }; // Placeholder - replace with actual import

const SidebarContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: white;
`;

const LogoSection = styled.div`
  padding: 20px;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
  text-align: center;
`;

const AppName = styled.h1`
  color: #38a3a5;
  margin: 0;
  font-size: 1.5rem;
`;

const AppVersion = styled.p`
  margin: 5px 0 0;
  color: #888;
  font-size: 0.8rem;
`;

const UserSection = styled.div`
  padding: 15px 20px;
  background-color: #f9f9f9;
  margin-bottom: 15px;
`;

const UserSectionTitle = styled.h2`
  color: #38a3a5;
  font-size: 1.1rem;
  margin: 0 0 10px 0;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 15px;
`;

const ProfileItem = styled.div`
  display: flex;
  font-size: 0.9rem;
`;

const ProfileLabel = styled.span`
  font-weight: 500;
  width: 100px;
  color: #666;
`;

const ProfileValue = styled.span`
  color: #333;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    secondary?: boolean;
  }
  
  const Button = styled.button<ButtonProps>`
    background-color: #38a3a5;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 0.9rem;
    cursor: pointer;
    
    &:hover {
      background-color: #2d8a8c;
    }
    
    ${props => props.secondary && `
      background-color: #4a6fa5;
      
      &:hover {
        background-color: #3c5d8c;
      }
    `}
  `;

const NavSection = styled.div`
  margin-bottom: 20px;
`;

const NavSectionTitle = styled.h3`
  color: #666;
  font-size: 0.8rem;
  text-transform: uppercase;
  margin: 0 0 5px 20px;
  font-weight: 500;
`;

const NavItem = styled.div<{ active?: boolean }>`
  padding: 12px 20px;
  display: flex;
  align-items: center;
  color: ${props => props.active ? '#38a3a5' : '#333'};
  font-weight: ${props => props.active ? '500' : 'normal'};
  background-color: ${props => props.active ? '#f0f8f8' : 'transparent'};
  border-left: ${props => props.active ? '4px solid #38a3a5' : '4px solid transparent'};
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? '#f0f8f8' : '#f5f5f5'};
  }
`;

const NavItemIcon = styled.span`
  margin-right: 10px;
  font-size: 1.2rem;
`;

const MenuSection = styled.div`
  margin-bottom: 5px;
`;

const MenuSectionHeader = styled.div<{ expandable?: boolean }>`
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #333;
  cursor: ${props => props.expandable ? 'pointer' : 'default'};
  font-weight: 500;
  
  &:hover {
    background-color: ${props => props.expandable ? '#f5f5f5' : 'transparent'};
  }
`;

const MenuSectionContent = styled.div`
  padding: 0;
`;

const MenuItem = styled.div<{ disabled?: boolean }>`
  padding: 10px 20px 10px 30px;
  color: ${props => props.disabled ? '#aaa' : '#555'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  
  &:hover {
    background-color: ${props => props.disabled ? 'transparent' : '#f5f5f5'};
  }
`;

const MenuItemIcon = styled.span`
  margin-right: 10px;
  font-size: 1rem;
`;

const FooterSection = styled.div`
  margin-top: auto;
  padding: 15px 20px;
  font-size: 0.8rem;
  color: #888;
  text-align: center;
  border-top: 1px solid #eee;
`;

const DesktopSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const version = packageInfo.version;
  
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Check which page is active
  const isReflectActive = location.pathname.includes('/reflect');
  const isGrowActive = location.pathname.includes('/grow');
  const isHistoryActive = location.pathname.includes('/history');
  
  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
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
  
  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };
  
  const fetchUserProfile = async (userId: string) => {
    try {
      // Get user profile from the database
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      // Get user email from auth
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
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  
  // Render user profile section
  const renderUserSection = () => {
    if (loading) {
      return <p>Loading profile...</p>;
    }
    
    if (user && profile) {
      return (
        <>
          <UserSectionTitle>User Profile</UserSectionTitle>
          <ProfileInfo>
            <ProfileItem>
              <ProfileLabel>Username:</ProfileLabel>
              <ProfileValue>{profile.username || 'Not set'}</ProfileValue>
            </ProfileItem>
            <ProfileItem>
              <ProfileLabel>Display:</ProfileLabel>
              <ProfileValue>{profile.display_name || 'Not set'}</ProfileValue>
            </ProfileItem>
            <ProfileItem>
              <ProfileLabel>Email:</ProfileLabel>
              <ProfileValue>{profile.email || 'Not available'}</ProfileValue>
            </ProfileItem>
          </ProfileInfo>
          
          <ButtonGroup>
            <Button onClick={handleSignOut}>Sign Out</Button>
            <Button 
              secondary 
              onClick={() => handleNavigation('/history')}
            >
              View History
            </Button>
          </ButtonGroup>
        </>
      );
    }
    
    return (
      <>
        <UserSectionTitle>Not Signed In</UserSectionTitle>
        <p>Sign in to save your analysis history and track your progress.</p>
        <ButtonGroup>
          <Button onClick={() => handleNavigation('/auth?view=signIn')}>
            Sign In
          </Button>
          <Button 
            secondary
            onClick={() => handleNavigation('/auth?view=signUp')}
          >
            Create Account
          </Button>
        </ButtonGroup>
      </>
    );
  };
  
  return (
    <SidebarContainer>
      <LogoSection>
        <AppName>EmotiBot</AppName>
        <AppVersion>Version {version}</AppVersion>
      </LogoSection>
      
      <UserSection>
        {renderUserSection()}
      </UserSection>
      
      <NavSection>
        <NavSectionTitle>Main Navigation</NavSectionTitle>
        <NavItem 
          active={isReflectActive}
          onClick={() => handleNavigation('/reflect111')}
        >
          <NavItemIcon>💭</NavItemIcon>
          Reflect
        </NavItem>
        <NavItem 
          active={isGrowActive}
          onClick={() => handleNavigation('/grow')}
        >
          <NavItemIcon>🌱</NavItemIcon>
          Grow
        </NavItem>
        <NavItem 
          active={isHistoryActive}
          onClick={() => handleNavigation('/history')}
        >
          <NavItemIcon>📊</NavItemIcon>
          History
        </NavItem>
      </NavSection>
      
      <MenuSection>
        <MenuSectionHeader 
          expandable
          onClick={() => toggleSection('reports')}
        >
          <div>
            <NavItemIcon>📈</NavItemIcon>
            Reports
          </div>
          <span>{expandedSections.reports ? '▲' : '▼'}</span>
        </MenuSectionHeader>
        
        {expandedSections.reports && (
          <MenuSectionContent>
            <MenuItem onClick={() => handleNavigation('/history')}>
              <MenuItemIcon>📋</MenuItemIcon>
              History
            </MenuItem>
            <MenuItem disabled>
              <MenuItemIcon>📊</MenuItemIcon>
              Reflect Reports
            </MenuItem>
            <MenuItem disabled>
              <MenuItemIcon>📈</MenuItemIcon>
              Grow Reports
            </MenuItem>
          </MenuSectionContent>
        )}
      </MenuSection>
      
      <MenuSection>
        <MenuSectionHeader 
          expandable
          onClick={() => toggleSection('settings')}
        >
          <div>
            <NavItemIcon>⚙️</NavItemIcon>
            Settings
          </div>
          <span>{expandedSections.settings ? '▲' : '▼'}</span>
        </MenuSectionHeader>
        
        {expandedSections.settings && (
          <MenuSectionContent>
            <MenuItem disabled>
              <MenuItemIcon>🗄️</MenuItemIcon>
              Data Management
            </MenuItem>
            <MenuItem disabled>
              <MenuItemIcon>🔔</MenuItemIcon>
              Notifications
            </MenuItem>
            <MenuItem disabled>
              <MenuItemIcon>🔒</MenuItemIcon>
              Privacy
            </MenuItem>
            <MenuItem>
              <MenuItemIcon>🌐</MenuItemIcon>
              Language
            </MenuItem>
            <MenuItem>
              <MenuItemIcon>🎨</MenuItemIcon>
              Theme
            </MenuItem>
          </MenuSectionContent>
        )}
      </MenuSection>
      
      <MenuSection>
        <MenuSectionHeader 
          expandable
          onClick={() => toggleSection('premium')}
        >
          <div>
            <NavItemIcon>✨</NavItemIcon>
            Premium Features
          </div>
          <span>{expandedSections.premium ? '▲' : '▼'}</span>
        </MenuSectionHeader>
        
        {expandedSections.premium && (
          <MenuSectionContent>
            <p style={{ padding: '0 20px', fontSize: '0.9rem', color: '#666' }}>
              Contact us to learn about premium features including advanced analytics, 
              unlimited message analysis, and personalized improvement recommendations.
            </p>
          </MenuSectionContent>
        )}
      </MenuSection>
      
      <MenuSection>
        <MenuSectionHeader 
          expandable
          onClick={() => toggleSection('about')}
        >
          <div>
            <NavItemIcon>ℹ️</NavItemIcon>
            About
          </div>
          <span>{expandedSections.about ? '▲' : '▼'}</span>
        </MenuSectionHeader>
        
        {expandedSections.about && (
          <MenuSectionContent>
            <p style={{ padding: '0 20px', fontSize: '0.9rem', color: '#666' }}>
              EmotiBot was developed by initiative of HIT leadership as part of research on AI in societies. 
              The project aims to improve communication by providing AI-powered analysis of text.
            </p>
          </MenuSectionContent>
        )}
      </MenuSection>
      
      <MenuSection>
        <MenuSectionHeader 
          expandable
          onClick={() => toggleSection('help')}
        >
          <div>
            <NavItemIcon>❓</NavItemIcon>
            Help
          </div>
          <span>{expandedSections.help ? '▲' : '▼'}</span>
        </MenuSectionHeader>
      </MenuSection>
      
      <FooterSection>
        HIT - Holon Institute of Technology<br />
        Copyright © 2024
      </FooterSection>
    </SidebarContainer>
  );
};

export default DesktopSidebar;