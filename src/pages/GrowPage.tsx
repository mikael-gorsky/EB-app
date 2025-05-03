// src/pages/GrowPage.tsx
import React from 'react';
import styled from 'styled-components';
import Navigation from '../components/common/Navigation';
import CategorySection from '../components/grow/CategorySection';
import { PageProps } from '../layouts/AppLayout';

const PageContainer = styled.div<{ isDesktop?: boolean }>`
  min-height: 100vh;
  max-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.main};
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
  
  @media (min-width: 1024px) {
    padding: ${props => props.isDesktop ? '20px' : '0'};
  }
`;

const LogoContainer = styled.div<{ isDesktop?: boolean }>`
  text-align: center;
  margin: ${({ theme }) => theme.spacing.xs} 0;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontSizes.large};
  
  @media (min-width: 1024px) {
    display: ${props => props.isDesktop ? 'none' : 'block'};
  }
`;

const ContentContainer = styled.div<{ isDesktop?: boolean }>`
  flex: 1;
  overflow-y: auto;
  padding: 0 ${({ theme }) => theme.spacing.s};
  
  @media (min-width: 1024px) {
    max-width: ${props => props.isDesktop ? '1200px' : 'none'};
    margin: ${props => props.isDesktop ? '0 auto' : '0'};
    padding: ${props => props.isDesktop ? '20px' : '0'};
    background-color: ${props => props.isDesktop ? 'white' : 'transparent'};
    border-radius: ${props => props.isDesktop ? '10px' : '0'};
    box-shadow: ${props => props.isDesktop ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none'};
  }
`;

const DesktopHeader = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.5rem;
  display: none;
  
  @media (min-width: 1024px) {
    display: block;
  }
`;

// Updated to include the PageProps interface
const GrowPage: React.FC<PageProps> = ({
  isDesktop = false,
  toggleMenu = () => {}
}) => {
  const learnModules = [
    { id: 'ei', title: 'Emotional Intelligence', bgColor: 'linear-gradient(135deg, #00bcd4, #2196f3)' },
    { id: 'nvc', title: 'Non-violent Communication', bgColor: 'linear-gradient(135deg, #ffb0ed, #ff99cc)' },
    { id: 'cb', title: 'Cognitive Biases', bgColor: 'linear-gradient(135deg, #8860d0, #5e60ce)' },
    { id: 'de', title: 'De-escalation', bgColor: 'linear-gradient(135deg, #ff5e62, #ff9966)' },
    { id: 'lf', title: 'Logical Fallacies', bgColor: 'linear-gradient(135deg, #8a5a44, #c89b7b)' },
    { id: 'al', title: 'Active Listening', bgColor: 'linear-gradient(135deg, #43cea2, #85ffbd)' },
  ];

  const playModules = [
    { id: 'cf', title: 'Constructive Feedback', bgColor: 'linear-gradient(135deg, #d4fc79, #96e6a1)' },
    { id: 'ra', title: 'Replying to Agression', bgColor: 'linear-gradient(135deg, #f6d365, #fda085)' },
    { id: 'hm', title: 'Handling Miscommunication', bgColor: 'linear-gradient(135deg, #ff9a9e, #fad0c4)' },
    { id: 'co', title: 'Convincing Others', bgColor: 'linear-gradient(135deg, #89f7fe, #66a6ff)' },
  ];

  const testModules = [
    { id: 'knowledge', title: 'Knowledge', bgColor: 'linear-gradient(135deg, #ff7e5f, #feb47b)' },
    { id: 'skills', title: 'Skills', bgColor: 'linear-gradient(135deg, #0f0c29, #302b63)' },
  ];

  const handleModuleClick = (moduleId: string) => {
    console.log(`Module clicked: ${moduleId}`);
  };

  return (
    <PageContainer isDesktop={isDesktop}>
      {!isDesktop && <Navigation toggleMenu={toggleMenu} isDesktop={isDesktop} />}
      
      <ContentContainer isDesktop={isDesktop}>
        {isDesktop && <DesktopHeader>Grow: Develop Your Communication Skills</DesktopHeader>}
        
        <CategorySection 
          title="Learn" 
          modules={learnModules} 
          onModuleClick={handleModuleClick}
        />
        <CategorySection 
          title="Play" 
          modules={playModules} 
          onModuleClick={handleModuleClick}
        />
        <CategorySection 
          title="Test" 
          modules={testModules} 
          onModuleClick={handleModuleClick}
        />
      </ContentContainer>
      
      {!isDesktop && <LogoContainer isDesktop={isDesktop}>HIT</LogoContainer>}
    </PageContainer>
  );
};

export default GrowPage;