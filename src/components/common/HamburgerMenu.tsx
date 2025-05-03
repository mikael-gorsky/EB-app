// src/components/common/HamburgerMenu.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
// Import package.json to get the version
import packageInfo from '../../../package.json';
// Import auth components
import UserProfileSection from '../auth/UserProfileSection';
import { supabase } from '../../utils/supabaseClient';

interface MenuProps {
  isOpen: boolean;
}

const MenuOverlay = styled.div<MenuProps>`
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: ${props => props.isOpen ? '280px' : '0'};
  background-color: white;
  box-shadow: ${props => props.isOpen ? '-5px 0 15px rgba(0, 0, 0, 0.1)' : 'none'};
  transition: width 0.3s ease;
  overflow: hidden;
  z-index: 1000;
  font-family: 'Montserrat', sans-serif;
`;

const MenuContent = styled.div`
  padding: 20px;
  width: 280px;
  overflow-y: auto;
  height: 100%;
`;

const AppInfo = styled.div`
  padding-bottom: 15px;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
`;

const AppName = styled.h2`
  margin: 0;
  color: #38a3a5;
  font-size: 1.5rem;
`;

const AppVersion = styled.p`
  margin: 5px 0 0;
  color: #888;
  font-size: 0.9rem;
`;

const MenuItem = styled.div`
  padding: 12px 0;
  color: #333;
  font-size: 1.1rem;
  cursor: pointer;
  transition: color 0.2s;
  
  &:hover {
    color: #38a3a5;
  }
`;

const MenuItemEmoji = styled.span`
  margin-right: 8px;
  font-size: 1.2rem;
`;

const SubMenuItem = styled.div<{ disabled?: boolean }>`
  padding: 10px 0 10px 20px;
  color: ${props => props.disabled ? '#aaa' : '#555'};
  font-size: 1rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: color 0.2s;
  
  &:hover {
    color: ${props => props.disabled ? '#aaa' : '#38a3a5'};
  }
`;

const SectionDivider = styled.div`
  height: 1px;
  background-color: #eee;
  margin: 15px 0;
`;

const GreyedButton = styled.button`
  background-color: #f0f0f0;
  color: #aaa;
  border: 1px solid #ddd;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-top: 5px;
  cursor: not-allowed;
`;

const ActionButton = styled.button`
  background-color: #38a3a5;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-top: 10px;
  cursor: pointer;
  
  &:hover {
    background-color: #2c8385;
  }
`;

const ThemeToggle = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
`;

const ToggleLabel = styled.span`
  font-size: 0.9rem;
  margin-right: 10px;
  color: #555;
`;

const ToggleSwitch = styled.div<{ isOn: boolean }>`
  position: relative;
  width: 40px;
  height: 20px;
  background-color: #ccc;
  border-radius: 10px;
  cursor: pointer;
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.isOn ? '22px' : '2px'};
    width: 16px;
    height: 16px;
    background-color: white;
    border-radius: 50%;
    transition: all 0.3s;
  }
`;

const LanguageSelect = styled.select`
  margin-top: 5px;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  width: 100%;
  max-width: 200px;
`;

const DetailText = styled.p`
  font-size: 0.85rem;
  color: #666;
  margin-top: 5px;
  line-height: 1.4;
`;

// Styled container for profile content
const ProfileContent = styled.div`
  padding: 15px 0 15px 20px;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProfileItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #555;
`;

const ProfileLabel = styled.span`
  font-weight: 500;
  width: 100px;
`;

const ProfileValue = styled.span`
  color: #333;
`;

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onClose }) => {
  // Get version from package.json
  const version = packageInfo.version || '1.0.0';
  const navigate = useNavigate();
  
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [language, setLanguage] = useState<string>('en');
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);
  
  // Auth related states
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthOptions, setShowAuthOptions] = useState(false);
  
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
      // Close user profile section after signing out
      toggleItem('userProfile');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const toggleItem = (item: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
    
    // Reset auth options when toggling user profile
    if (item === 'userProfile') {
      setShowAuthOptions(false);
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };
  
  // Function to show auth options
  const showAuthSection = () => {
    setShowAuthOptions(true);
  };
  
  // Function to navigate to history page
  const goToHistory = () => {
    onClose(); // Close the menu
    navigate('/history'); // Navigate to history page
  };
  
  // Function to navigate to sign in/sign up
  const goToAuth = (authType: 'signIn' | 'signUp') => {
    onClose(); // Close the menu
    navigate('/auth', { state: { initialView: authType } }); // Navigate to auth page with initial view
  };
  
  const renderUserProfileContent = () => {
    if (loading) {
      return <DetailText>Loading user information...</DetailText>;
    }
    
    if (user && profile) {
      return (
        <ProfileContent>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#38a3a5' }}>
            Your Profile
          </h3>
          <ProfileInfo>
            <ProfileItem>
              <ProfileLabel>Username:</ProfileLabel>
              <ProfileValue>{profile.username || 'Not set'}</ProfileValue>
            </ProfileItem>
            <ProfileItem>
              <ProfileLabel>Display Name:</ProfileLabel>
              <ProfileValue>{profile.display_name || 'Not set'}</ProfileValue>
            </ProfileItem>
            <ProfileItem>
              <ProfileLabel>Email:</ProfileLabel>
              <ProfileValue>{profile.email || 'Not available'}</ProfileValue>
            </ProfileItem>
          </ProfileInfo>
          <ActionButton onClick={handleSignOut}>Sign Out</ActionButton>
          <ActionButton 
            onClick={goToHistory}
            style={{ marginLeft: '10px', backgroundColor: '#4a6fa5' }}
          >
            View History
          </ActionButton>
        </ProfileContent>
      );
    }
    
    return showAuthOptions ? (
      <ProfileContent>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#38a3a5' }}>
          Authentication
        </h3>
        <ActionButton onClick={() => goToAuth('signIn')}>Sign In</ActionButton>
        <ActionButton 
          onClick={() => goToAuth('signUp')}
          style={{ marginLeft: '10px', backgroundColor: '#4a6fa5' }}
        >
          Create Account
        </ActionButton>
      </ProfileContent>
    ) : (
      <DetailText style={{ padding: '10px 0 10px 20px' }}>
        <p>You are not currently signed in.</p>
        <ActionButton onClick={showAuthSection}>Sign In/Create Account</ActionButton>
      </DetailText>
    );
  };
  
  return (
    <>
      {isOpen && (
        <div 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'rgba(0,0,0,0.3)', 
            zIndex: 999 
          }}
          onClick={onClose}
        />
      )}
      
      <MenuOverlay isOpen={isOpen}>
        <MenuContent>
          <AppInfo>
            <AppName>EmotiBot</AppName>
            <AppVersion>Version {version}</AppVersion>
          </AppInfo>
          
          {/* User Profile Section */}
          <MenuItem onClick={() => toggleItem('userProfile')}>
            <MenuItemEmoji>👤</MenuItemEmoji>
            User Profile {expandedItems.userProfile ? '▲' : '▼'}
          </MenuItem>
          {expandedItems.userProfile && renderUserProfileContent()}
          
          {/* Reports Section */}
          <MenuItem onClick={() => toggleItem('reports')}>
            <MenuItemEmoji>📊</MenuItemEmoji>
            Reports {expandedItems.reports ? '▲' : '▼'}
          </MenuItem>
          {expandedItems.reports && (
            <>
              <SubMenuItem onClick={goToHistory}>
                History
                <DetailText>
                  View your past analyses and track your improvement over time.
                </DetailText>
              </SubMenuItem>
              <SubMenuItem disabled>
                Reflect Reports
                <DetailText>
                  This feature would allow you to view a history of your text analyses and track your improvement over time.
                </DetailText>
                <GreyedButton disabled>View Reports</GreyedButton>
              </SubMenuItem>
              <SubMenuItem disabled>
                Grow Reports
                <DetailText>
                  This feature would provide insights into your progress through the learning modules and skill development.
                </DetailText>
                <GreyedButton disabled>View Reports</GreyedButton>
              </SubMenuItem>
            </>
          )}
          
          {/* App Settings Section */}
          <MenuItem onClick={() => toggleItem('appSettings')}>
            <MenuItemEmoji>⚙️</MenuItemEmoji>
            App Settings {expandedItems.appSettings ? '▲' : '▼'}
          </MenuItem>
          {expandedItems.appSettings && (
            <>
              <SubMenuItem disabled>
                Data Management
                <DetailText>
                  Manage your data including options to remove all user data or transfer it to another platform.
                </DetailText>
                <GreyedButton disabled>Remove Data</GreyedButton>
                <GreyedButton style={{ marginLeft: '5px' }} disabled>Transfer Data</GreyedButton>
              </SubMenuItem>
              
              <SubMenuItem disabled>
                Notifications
                <DetailText>
                  Configure notification preferences for analysis results and learning reminders.
                </DetailText>
              </SubMenuItem>
              
              <SubMenuItem disabled>
                Privacy
                <DetailText>
                  Manage privacy settings and control how your data is used within the application.
                </DetailText>
                <GreyedButton disabled>Update Settings</GreyedButton>
              </SubMenuItem>
              
              <SubMenuItem>
                Language
                <DetailText>
                  This setting only relates to the language of analysis and language of "grow" activities.
                </DetailText>
                <LanguageSelect value={language} onChange={handleLanguageChange}>
                  <option value="en">English</option>
                  <option value="he">Hebrew</option>
                </LanguageSelect>
              </SubMenuItem>
              
              <SubMenuItem>
                Theme
                <ThemeToggle>
                  <ToggleLabel>Light</ToggleLabel>
                  <ToggleSwitch isOn={isDarkTheme} onClick={toggleTheme} />
                  <ToggleLabel style={{ marginLeft: '10px' }}>Dark</ToggleLabel>
                </ThemeToggle>
              </SubMenuItem>
              
              <SubMenuItem disabled>
                Integrations
                <DetailText>
                  Safely connect with your social media accounts or use "share" in iOS to analyze messages in a low-friction way.
                </DetailText>
                <GreyedButton disabled>Proceed</GreyedButton>
              </SubMenuItem>
            </>
          )}
          
          <MenuItem onClick={() => toggleItem('premium')}>
            <MenuItemEmoji>✨</MenuItemEmoji>
            Premium Features
          </MenuItem>
          {expandedItems.premium && (
            <DetailText style={{ padding: '0 0 0 20px' }}>
              Contact us to learn about premium features including advanced analytics, 
              unlimited message analysis, and personalized improvement recommendations.
            </DetailText>
          )}
          
          <MenuItem onClick={() => toggleItem('about')}>
            <MenuItemEmoji>ℹ️</MenuItemEmoji>
            About
          </MenuItem>
          {expandedItems.about && (
            <DetailText style={{ padding: '0 0 0 20px' }}>
              EmotiBot was developed by initiative of HIT leadership as part of research on AI in societies. 
              The project aims to improve communication by providing AI-powered analysis of text, helping users 
              understand the emotional impact and effectiveness of their messages.
              <br /><br />
              The application uses advanced natural language processing to evaluate text along multiple dimensions 
              including style, emotional impact, and potential results. By providing detailed feedback and 
              actionable suggestions, EmotiBot helps users develop stronger communication skills for both 
              personal and professional contexts.
            </DetailText>
          )}
          
          <SectionDivider />
          
          <MenuItem onClick={() => toggleItem('help')}>
            <MenuItemEmoji>❓</MenuItemEmoji>
            Help
          </MenuItem>
          {expandedItems.help && (
            <DetailText style={{ padding: '0 0 0 20px' }}>
              <strong>How to use EmotiBot:</strong><br /><br />
              
              <strong>Reflect Feature:</strong><br />
              Enter your text in the message box and click one of the analysis buttons:<br />
              - <strong>Style:</strong> Analyzes clarity, conciseness, formality, engagement, and complexity<br />
              - <strong>Impact:</strong> Measures empathy, authority, persuasiveness, approachability, and confidence<br />
              - <strong>Result:</strong> Evaluates effectiveness, actionability, memorability, influence, and audience fit<br /><br />
              
              Each analysis provides numerical scores, detailed explanations, an overall summary, and 
              actionable suggestions for improvement.
            </DetailText>
          )}
          
          <MenuItem onClick={() => toggleItem('feedback')}>
            <MenuItemEmoji>📝</MenuItemEmoji>
            Feedback
          </MenuItem>
          {expandedItems.feedback && (
            <DetailText style={{ padding: '0 0 0 20px' }}>
              We value your input! Your feedback helps us improve EmotiBot.
              This feature will allow you to submit comments, report issues, or request new features.
            </DetailText>
          )}
        </MenuContent>
      </MenuOverlay>
    </>
  );
};

export default HamburgerMenu;