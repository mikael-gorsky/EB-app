// src/components/common/Navigation.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.l} ${({ theme }) => theme.spacing.l} 0;
  font-weight: bold;
`;

const NavTab = styled.div<{active: boolean}>`
  padding: ${({ theme }) => theme.spacing.s} ${({ theme }) => theme.spacing.l};
  text-align: center;
  width: 50%;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  border-bottom: ${props => props.active ? `3px solid ${props.theme.colors.primary}` : 'none'};
`;

const MenuButton = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

interface NavigationProps {
  toggleMenu?: () => void;
  isDesktop?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ 
  toggleMenu = () => {},
  isDesktop = false
}) => {
  const location = useLocation();
  const isReflectActive = location.pathname.includes('/reflect');
  const isGrowActive = location.pathname.includes('/grow');
  
  if (isDesktop) {
    return null;
  }
  
  return (
    <NavContainer>
      <div style={{ display: 'flex', width: '80%' }}>
        <NavTab active={isReflectActive}>
          <Link to="/reflect111" style={{ textDecoration: 'none', color: 'black' }}>
            REFLECT
          </Link>
        </NavTab>
        <NavTab active={isGrowActive}>
          <Link to="/grow" style={{ textDecoration: 'none', color: 'black' }}>
            GROW
          </Link>
        </NavTab>
      </div>
      <MenuButton onClick={toggleMenu}>
        <span>≡</span>
      </MenuButton>
    </NavContainer>
  );
};

export default Navigation;