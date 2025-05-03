// src/components/common/DesktopHeader.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { supabase } from '../../utils/supabaseClient';
import packageInfo from '../../../package.json';

const HeaderContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 30px;
  border-bottom: 1px solid #eee;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: bold;
  cursor: pointer;
`;

const AppVersion = styled.span`
  margin-left: 10px;
  color: #888;
  font-size: 0.8rem;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
`;

const UserName = styled.div`
  font-weight: 500;
`;

const AuthButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const MainNav = styled.nav`
  display: flex;
  justify-content: center;
  padding: 0 30px;
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li<{ active?: boolean }>`
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: ${({ theme, active }) => active ? theme.colors.primary : 'transparent'};
  }
`;

const NavLink = styled.a<{ active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 15px;
  color: ${({ theme, active }) => active ? theme.colors.primary : theme.colors.text.primary};
  font-weight: ${({ active }) => active ? 'bold' : 'normal'};
  text-decoration: none;
  transition: color 0.2s;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const NavItemEmoji = styled.span`
  margin-right: 8px;
  font-size: 1.2rem;
`;

interface DesktopHeaderProps {
  activePage?: string;
}

const DesktopHeader: React.FC<DesktopHeaderProps> = ({ activePage = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const version = packageInfo.version || '0.2.0';
  
  // Fetch user data on component mount
  React.useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const { data } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (data) {
          setProfile(data);
        }
      }
    };
    
    fetchUserData();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (profile?.display_name) {
      return profile.display_name.substring(0, 1).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 1).toUpperCase();
    }
    return '?';
  };
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };
  
  // Navigation items - exactly as specified
  const navItems = [
    { id: 'reflect', label: 'Reflect', path: '/reflect111', emoji: '💭' },
    { id: 'grow', label: 'Grow', path: '/grow', emoji: '🌱' },
    { id: 'history', label: 'History', path: '/history', emoji: '📊' },
    { id: 'profile', label: 'User Profile', path: '/profile', emoji: '👤' },
    { id: 'settings', label: 'Settings', path: '/settings', emoji: '⚙️' },
    { id: 'premium', label: 'Premium', path: '/premium', emoji: '✨' },
    { id: 'help', label: 'Help', path: '/help', emoji: '❓' },
    { id: 'about', label: 'About', path: '/about', emoji: 'ℹ️' }
  ];
  
  // Check if menu item is active
  const isActive = (id: string) => {
    if (id === 'reflect' && location.pathname.includes('/reflect')) return true;
    if (id === 'grow' && location.pathname.includes('/grow')) return true;
    if (id === 'history' && (location.pathname.includes('/history') || location.pathname.includes('/analysis'))) return true;
    if (id === 'profile' && location.pathname.includes('/profile')) return true;
    if (id === 'settings' && location.pathname.includes('/settings')) return true;
    if (id === 'premium' && location.pathname.includes('/premium')) return true;
    if (id === 'help' && location.pathname.includes('/help')) return true;
    if (id === 'about' && location.pathname.includes('/about')) return true;
    return false;
  };
  
  return (
    <HeaderContainer>
      <TopBar>
        <LogoSection>
          <Logo onClick={() => navigate('/')}>EmotiBot</Logo>
          <AppVersion>v{version}</AppVersion>
        </LogoSection>
        
        <UserSection>
          {user ? (
            <UserInfo>
              <UserName>
                {profile?.display_name || profile?.username || user.email}
              </UserName>
              <UserAvatar>{getUserInitials()}</UserAvatar>
              <AuthButton onClick={handleSignOut}>Sign Out</AuthButton>
            </UserInfo>
          ) : (
            <AuthButton onClick={() => navigate('/auth')}>Sign In</AuthButton>
          )}
        </UserSection>
      </TopBar>
      
      <MainNav>
        <NavList>
          {navItems.map(item => (
            <NavItem key={item.id} active={isActive(item.id)}>
              <NavLink 
                href="#" 
                active={isActive(item.id)}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.path);
                }}
              >
                <NavItemEmoji>{item.emoji}</NavItemEmoji>
                {item.label}
              </NavLink>
            </NavItem>
          ))}
        </NavList>
      </MainNav>
    </HeaderContainer>
  );
};

export default DesktopHeader;