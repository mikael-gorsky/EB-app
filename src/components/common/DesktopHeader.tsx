// src/components/common/DesktopHeader.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { supabase } from '../../utils/supabaseClient';

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
  padding: 15px 30px;
  border-bottom: 1px solid #eee;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.div`
  color: #38a3a5;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
`;

const Username = styled.span`
  margin-left: 10px;
  color: #666;
  font-size: 0.9rem;
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
    background-color: ${({ active }) => active ? '#38a3a5' : 'transparent'};
  }
`;

const NavLink = styled.a<{ active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 15px;
  color: ${({ active }) => active ? '#38a3a5' : '#333'};
  font-weight: ${({ active }) => active ? 'bold' : 'normal'};
  text-decoration: none;
  transition: color 0.2s;
  
  &:hover {
    color: #38a3a5;
  }
`;

const SubNav = styled.div`
  display: flex;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 0 30px;
  border-bottom: 1px solid #eee;
`;

const SubNavList = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SubNavItem = styled.li<{ active?: boolean }>`
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${({ active }) => active ? '#38a3a5' : 'transparent'};
  }
`;

const SubNavLink = styled.a<{ active?: boolean }>`
  display: block;
  padding: 10px 15px;
  color: ${({ active }) => active ? '#38a3a5' : '#666'};
  font-weight: ${({ active }) => active ? 'bold' : 'normal'};
  text-decoration: none;
  
  &:hover {
    color: #38a3a5;
  }
`;

interface DesktopHeaderProps {
  username?: string;
}

const DesktopHeader: React.FC<DesktopHeaderProps> = ({ 
  username = 'username'
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get main section from URL
  const path = location.pathname;
  const mainSection = path.split('/')[1] || '';
  
  // Get sub section from URL if it exists
  const subSection = path.split('/')[2] || '';
  
  // Handle navigation
  const handleNavigate = (to: string) => {
    navigate(to);
  };
  
  // Get sub navigation based on main section
  const getSubNavigation = () => {
    if (mainSection === 'grow') {
      return (
        <SubNav>
          <SubNavList>
            <SubNavItem active={!subSection || subSection === 'learn'}>
              <SubNavLink 
                href="#" 
                active={!subSection || subSection === 'learn'}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate('/grow/learn');
                }}
              >
                Learn
              </SubNavLink>
            </SubNavItem>
            <SubNavItem active={subSection === 'play'}>
              <SubNavLink 
                href="#" 
                active={subSection === 'play'}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate('/grow/play');
                }}
              >
                Play
              </SubNavLink>
            </SubNavItem>
            <SubNavItem active={subSection === 'test'}>
              <SubNavLink 
                href="#" 
                active={subSection === 'test'}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate('/grow/test');
                }}
              >
                Test
              </SubNavLink>
            </SubNavItem>
          </SubNavList>
        </SubNav>
      );
    }
    
    if (mainSection === 'settings') {
      return (
        <SubNav>
          <SubNavList>
            <SubNavItem active={!subSection || subSection === 'data'}>
              <SubNavLink 
                href="#" 
                active={!subSection || subSection === 'data'}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate('/settings/data');
                }}
              >
                Data Management
              </SubNavLink>
            </SubNavItem>
            <SubNavItem active={subSection === 'notifications'}>
              <SubNavLink 
                href="#" 
                active={subSection === 'notifications'}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate('/settings/notifications');
                }}
              >
                Notifications
              </SubNavLink>
            </SubNavItem>
            <SubNavItem active={subSection === 'privacy'}>
              <SubNavLink 
                href="#" 
                active={subSection === 'privacy'}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate('/settings/privacy');
                }}
              >
                Privacy
              </SubNavLink>
            </SubNavItem>
            <SubNavItem active={subSection === 'language'}>
              <SubNavLink 
                href="#" 
                active={subSection === 'language'}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate('/settings/language');
                }}
              >
                Language
              </SubNavLink>
            </SubNavItem>
            <SubNavItem active={subSection === 'theme'}>
              <SubNavLink 
                href="#" 
                active={subSection === 'theme'}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate('/settings/theme');
                }}
              >
                Theme
              </SubNavLink>
            </SubNavItem>
            <SubNavItem active={subSection === 'integrations'}>
              <SubNavLink 
                href="#" 
                active={subSection === 'integrations'}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate('/settings/integrations');
                }}
              >
                Integrations
              </SubNavLink>
            </SubNavItem>
          </SubNavList>
        </SubNav>
      );
    }
    
    return null;
  };
  
  return (
    <HeaderContainer>
      <TopBar>
        <LogoSection>
          <Logo onClick={() => handleNavigate('/')}>EmotiBot</Logo>
          <Username>{username}</Username>
        </LogoSection>
      </TopBar>
      
      <MainNav>
        <NavList>
          <NavItem active={mainSection === 'reflect111'}>
            <NavLink 
              href="#" 
              active={mainSection === 'reflect111'}
              onClick={(e) => {
                e.preventDefault();
                handleNavigate('/reflect111');
              }}
            >
              Reflect
            </NavLink>
          </NavItem>
          <NavItem active={mainSection === 'grow'}>
            <NavLink 
              href="#" 
              active={mainSection === 'grow'}
              onClick={(e) => {
                e.preventDefault();
                handleNavigate('/grow');
              }}
            >
              Grow
            </NavLink>
          </NavItem>
          <NavItem active={mainSection === 'user'}>
            <NavLink 
              href="#" 
              active={mainSection === 'user'}
              onClick={(e) => {
                e.preventDefault();
                handleNavigate('/user');
              }}
            >
              User
            </NavLink>
          </NavItem>
          <NavItem active={mainSection === 'settings'}>
            <NavLink 
              href="#" 
              active={mainSection === 'settings'}
              onClick={(e) => {
                e.preventDefault();
                handleNavigate('/settings');
              }}
            >
              Settings
            </NavLink>
          </NavItem>
          <NavItem active={mainSection === 'premium'}>
            <NavLink 
              href="#" 
              active={mainSection === 'premium'}
              onClick={(e) => {
                e.preventDefault();
                handleNavigate('/premium');
              }}
            >
              Premium
            </NavLink>
          </NavItem>
          <NavItem active={mainSection === 'about'}>
            <NavLink 
              href="#" 
              active={mainSection === 'about'}
              onClick={(e) => {
                e.preventDefault();
                handleNavigate('/about');
              }}
            >
              About
            </NavLink>
          </NavItem>
        </NavList>
      </MainNav>
      
      {getSubNavigation()}
    </HeaderContainer>
  );
};

export default DesktopHeader;