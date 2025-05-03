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

const Content = styled.div`
  flex: 1;
`;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  
  // Determine active page based on route
  const getActivePage = () => {
    if (location.pathname.includes('/reflect')) return 'reflect';
    if (location.pathname.includes('/grow')) return 'grow';
    if (location.pathname.includes('/history')) return 'history';
    if (location.pathname.includes('/analysis')) return 'history';
    return '';
  };
  
  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
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
      {isDesktop && <DesktopHeader activePage={getActivePage()} />}
      
      {/* Content area */}
      <Content>
        {childrenWithProps}
        
        {/* Mobile menu */}
        <HamburgerMenu 
          isOpen={menuOpen} 
          onClose={() => setMenuOpen(false)} 
        />
      </Content>
    </LayoutContainer>
  );
};

export default AppLayout;