// src/pages/GrowPage.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import Navigation from '../components/common/Navigation';
import { PageProps } from '../layouts/AppLayout';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.main};
  display: flex;
  flex-direction: column;
`;

const ContentArea = styled.div<{ isDesktop: boolean }>`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const PageTitle = styled.h1`
  color: #333;
  font-size: 2rem;
  margin-bottom: 30px;
  text-transform: uppercase;
`;

const SectionTitle = styled.h2`
  color: #38a3a5;
  font-size: 2rem;
  margin: 30px 0 15px 0;
`;

const ModulesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 10px;
`;

const ModuleCard = styled.div<{ bgColor: string }>`
  background: ${props => props.bgColor};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
  padding: 20px;
  text-align: center;
  color: black;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Footer = styled.div`
  text-align: center;
  padding: 10px;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;
  font-size: 1.2rem;
`;

interface Module {
  id: string;
  title: string;
  bgColor: string;
}

interface GrowPageProps extends PageProps {
  subpage?: string;
}

const GrowPage: React.FC<GrowPageProps> = ({
  isDesktop = false,
  toggleMenu = () => {},
  subpage
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSubpage, setActiveSubpage] = useState('learn');
  
  // Determine if we're on the main grow page or a sub-section
  const isMainGrowPage = location.pathname === '/grow';
  
  useEffect(() => {
    // Only redirect if not on the main grow page
    if (!isMainGrowPage) {
      // Determine active subpage from URL if not provided as prop
      if (!subpage) {
        const path = location.pathname.split('/');
        if (path.length > 2 && ['learn', 'play', 'test'].includes(path[2])) {
          setActiveSubpage(path[2]);
        } else {
          // Only redirect if we're not on a module page
          const isModulePage = path.length > 2 && !['learn', 'play', 'test'].includes(path[2]);
          if (!isModulePage) {
            // Default to 'learn' and update URL
            navigate('/grow/learn', { replace: true });
          }
        }
      } else {
        setActiveSubpage(subpage);
      }
    }
  }, [location, navigate, subpage, isMainGrowPage]);
  
  // Module data for different sections
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
    navigate(`/grow/${moduleId}`);
  };

  const renderModules = () => {
    if (!isMainGrowPage && !isDesktop) {
      // If we're on a sub-page in mobile view, only show the modules for that section
      switch (activeSubpage) {
        case 'learn':
          return (
            <>
              <SectionTitle>Learn</SectionTitle>
              <ModulesGrid>
                {learnModules.map(module => (
                  <ModuleCard
                    key={module.id}
                    bgColor={module.bgColor}
                    onClick={() => handleModuleClick(module.id)}
                  >
                    {module.title}
                  </ModuleCard>
                ))}
              </ModulesGrid>
            </>
          );
        case 'play':
          return (
            <>
              <SectionTitle>Play</SectionTitle>
              <ModulesGrid>
                {playModules.map(module => (
                  <ModuleCard
                    key={module.id}
                    bgColor={module.bgColor}
                    onClick={() => handleModuleClick(module.id)}
                  >
                    {module.title}
                  </ModuleCard>
                ))}
              </ModulesGrid>
            </>
          );
        case 'test':
          return (
            <>
              <SectionTitle>Test</SectionTitle>
              <ModulesGrid>
                {testModules.map(module => (
                  <ModuleCard
                    key={module.id}
                    bgColor={module.bgColor}
                    onClick={() => handleModuleClick(module.id)}
                  >
                    {module.title}
                  </ModuleCard>
                ))}
              </ModulesGrid>
            </>
          );
        default:
          return null;
      }
    } else {
      // On the main page or desktop view, show all sections
      return (
        <>
          <SectionTitle>Learn</SectionTitle>
          <ModulesGrid>
            {learnModules.map(module => (
              <ModuleCard
                key={module.id}
                bgColor={module.bgColor}
                onClick={() => handleModuleClick(module.id)}
              >
                {module.title}
              </ModuleCard>
            ))}
          </ModulesGrid>
          
          <SectionTitle>Play</SectionTitle>
          <ModulesGrid>
            {playModules.map(module => (
              <ModuleCard
                key={module.id}
                bgColor={module.bgColor}
                onClick={() => handleModuleClick(module.id)}
              >
                {module.title}
              </ModuleCard>
            ))}
          </ModulesGrid>
          
          <SectionTitle>Test</SectionTitle>
          <ModulesGrid>
            {testModules.map(module => (
              <ModuleCard
                key={module.id}
                bgColor={module.bgColor}
                onClick={() => handleModuleClick(module.id)}
              >
                {module.title}
              </ModuleCard>
            ))}
          </ModulesGrid>
        </>
      );
    }
  };

  return (
    <PageContainer>
      {!isDesktop && <Navigation toggleMenu={toggleMenu} isDesktop={isDesktop} />}
      
      <ContentArea isDesktop={!!isDesktop}>
        {isDesktop && <PageTitle>GROW</PageTitle>}
        
        {renderModules()}
      </ContentArea>
      
      {!isDesktop && <Footer>HIT</Footer>}
    </PageContainer>
  );
};

export default GrowPage;