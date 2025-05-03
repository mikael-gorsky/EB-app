// src/layouts/AppLayout.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import HamburgerMenu from '../components/common/HamburgerMenu';
import DesktopHeader from '../components/common/DesktopHeader';

// Define shared props that can be passed to any page component
export interface PageProps {
  isDesktop?: boolean;
  toggleMenu?: () => void;
}

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Content = styled.div<{ isDesktop?: boolean }>`
  flex: 1;
  background-color: ${props => props.isDesktop ? '#f5f5f5' : 'transparent'};
  padding: ${props => props.isDesktop ? '20px' : '0'};
`;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  
  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      const isDesktopValue = window.innerWidth >= 1024;
      console.log(`Screen width: ${window.innerWidth}, isDesktop: ${isDesktopValue}`);
      setIsDesktop(isDesktopValue);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  // Clone children with isDesktop prop
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      console.log(`Cloning child with isDesktop=${isDesktop}`);
      // Use type assertion to solve TypeScript error
      return React.cloneElement(child as any, { 
        isDesktop,
        toggleMenu
      });
    }
    return child;
  });
  
  return (
    <LayoutContainer>
      {/* Desktop Header - only shown on larger screens */}
      {isDesktop && <DesktopHeader />}
      
      {/* Content area */}
      <Content isDesktop={isDesktop}>
        {childrenWithProps}
        
        {/* Mobile menu */}
        {!isDesktop && (
          <HamburgerMenu 
            isOpen={menuOpen} 
            onClose={() => setMenuOpen(false)} 
          />
        )}
      </Content>
    </LayoutContainer>
  );
};

export default AppLayout;