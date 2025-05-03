// src/pages/LandingPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import hitLogo from '../assets/hit-logo.png'; // Update path as needed

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.main};
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
`;

const MobileContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.l};
  text-align: center;
  
  @media (min-width: 1024px) {
    display: none;
  }
`;

const DesktopContent = styled.div`
  display: none;
  
  @media (min-width: 1024px) {
    display: flex;
    flex: 1;
    height: 100vh;
  }
`;

const HeroLogo = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.l};
  
  img {
    height: 70px;
  }
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.m};
  color: ${({ theme }) => theme.colors.primary};
`;

const IntroText = styled.p`
  font-size: 1rem;
  margin-bottom: ${({ theme }) => theme.spacing.m};
  color: ${({ theme }) => theme.colors.text.primary};
  max-width: 340px;
`;

const HebrewText = styled.p`
  font-size: 1rem;
  margin-bottom: ${({ theme }) => theme.spacing.l};
  color: ${({ theme }) => theme.colors.text.primary};
  max-width: 340px;
  direction: rtl;
  font-weight: 500;
`;

const ButtonsContainer = styled.div`
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.m};
  margin-bottom: ${({ theme }) => theme.spacing.l};
`;

const NavButton = styled.button<{variant?: string}>`
  width: 100%;
  background-color: ${({ theme, variant }) => 
    variant === 'primary' ? theme.colors.primary : theme.colors.primaryDark};
  color: white;
  padding: ${({ theme }) => theme.spacing.m};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: 1.25rem;
  font-weight: 500;
  border: none;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ButtonSubtext = styled.span`
  font-size: 0.875rem;
  font-weight: normal;
  margin-top: 4px;
  opacity: 0.9;
`;

const FeaturesCard = styled.div`
  width: 100%;
  max-width: 320px;
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.m};
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const CardTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.s};
  color: ${({ theme }) => theme.colors.primary};
  text-align: left;
`;

const FeaturesList = styled.ul`
  list-style-type: none;
  padding: 0;
  text-align: left;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.s};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 0.95rem;
`;

const CheckMark = styled.span`
  margin-right: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.primary};
`;

// Desktop components
const DesktopLeftPanel = styled.div`
  flex: 1;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
`;

const DesktopRightPanel = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.primary};
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  color: white;
`;

const DesktopTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.colors.primary};
`;

const DesktopSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 30px;
  max-width: 700px;
  line-height: 1.5;
`;

const DesktopHebrewText = styled.p`
  font-size: 1.25rem;
  margin-bottom: 40px;
  max-width: 700px;
  line-height: 1.5;
  direction: rtl;
  text-align: right;
  font-weight: 500;
`;

const DesktopDescription = styled.p`
  font-size: 1.1rem;
  margin-bottom: 30px;
  max-width: 700px;
  line-height: 1.6;
`;

const DesktopButtons = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 30px;
`;

const DesktopButton = styled.button<{ primary?: boolean }>`
  background-color: ${props => props.primary ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.primary ? 'white' : props.theme.colors.primary};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  padding: 12px 30px;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const DesktopFeature = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 40px;
`;

const FeatureIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 20px;
  flex-shrink: 0;
`;

const FeatureContent = styled.div`
  flex: 1;
`;

const FeatureTitle = styled.h3`
  margin: 0 0 10px;
  font-size: 1.25rem;
`;

const FeatureDescription = styled.p`
  margin: 0;
  opacity: 0.9;
  font-size: 1rem;
  line-height: 1.5;
`;

const ProjectInfo = styled.div`
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #eee;
`;

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isDesktop, setIsDesktop] = useState(false);
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  return (
    <PageContainer>
      {/* Mobile version */}
      <MobileContent>
        <HeroLogo>
          <img src={hitLogo} alt="Holon Institute of Technology" />
        </HeroLogo>
        
        <Title>EmotiBot</Title>
        
        <IntroText>
          AI-powered text analysis for better communication, enhancing your emotional intelligence and digital interactions.
        </IntroText>
        
        <HebrewText>
          ניתוח טקסט בכוח בינה מלאכותית לתקשורת טובה יותר, לשיפור האינטליגנציה הרגשית והאינטראקציות הדיגיטליות שלך.
        </HebrewText>
        
        <ButtonsContainer>
          <NavButton 
            variant="primary"
            onClick={() => navigate('/reflect111')}
          >
            REFLECT
            <ButtonSubtext>Analyze your communication</ButtonSubtext>
          </NavButton>
          
          <NavButton 
            onClick={() => navigate('/grow')}
          >
            GROW
            <ButtonSubtext>Develop better skills</ButtonSubtext>
          </NavButton>
        </ButtonsContainer>
        
        <FeaturesCard>
          <CardTitle>EmotiBot helps you:</CardTitle>
          <FeaturesList>
            <FeatureItem>
              <CheckMark>✓</CheckMark>
              <span>Understand how your text is perceived</span>
            </FeatureItem>
            <FeatureItem>
              <CheckMark>✓</CheckMark>
              <span>Improve emotional impact of messages</span>
            </FeatureItem>
            <FeatureItem>
              <CheckMark>✓</CheckMark>
              <span>Reduce misunderstandings and conflicts</span>
            </FeatureItem>
            <FeatureItem>
              <CheckMark>✓</CheckMark>
              <span>Build stronger digital relationships</span>
            </FeatureItem>
          </FeaturesList>
        </FeaturesCard>
      </MobileContent>
      
      {/* Desktop version */}
      <DesktopContent>
        <DesktopLeftPanel>
          <img 
            src={hitLogo} 
            alt="Holon Institute of Technology" 
            style={{ height: '70px', marginBottom: '40px' }} 
          />
          
          <DesktopTitle>EmotiBot</DesktopTitle>
          
          <DesktopSubtitle>
            AI-powered text analysis for better communication, enhancing your emotional intelligence and digital interactions.
          </DesktopSubtitle>
          
          <DesktopHebrewText>
            ניתוח טקסט בכוח בינה מלאכותית לתקשורת טובה יותר, לשיפור האינטליגנציה הרגשית והאינטראקציות הדיגיטליות שלך.
          </DesktopHebrewText>
          
          <DesktopDescription>
            EmotiBot uses advanced AI algorithms to analyze your text communications across multiple dimensions. By evaluating factors like clarity, empathy, persuasiveness, and emotional impact, EmotiBot helps you understand how your words will be perceived by others before you send them.
          </DesktopDescription>
          
          <DesktopDescription>
            Whether you're crafting important emails, preparing for difficult conversations, or simply looking to improve your communication skills, EmotiBot provides the insights and feedback you need to communicate more effectively.
          </DesktopDescription>
          
          <DesktopButtons>
            <DesktopButton primary onClick={() => navigate('/reflect111')}>
              Start Reflecting
            </DesktopButton>
            <DesktopButton onClick={() => navigate('/grow')}>
              Grow Your Skills
            </DesktopButton>
          </DesktopButtons>
          
          <ProjectInfo>
            <h3>About This Project</h3>
            <p>
              EmotiBot was developed by initiative of HIT leadership as part of research on AI in societies. The project explores how AI can help improve human communication and emotional intelligence in digital interactions.
            </p>
          </ProjectInfo>
        </DesktopLeftPanel>
        
        <DesktopRightPanel>
          <DesktopFeature>
            <FeatureIcon>✨</FeatureIcon>
            <FeatureContent>
              <FeatureTitle>Understand Message Impact</FeatureTitle>
              <FeatureDescription>
                Analyze how your text will be perceived by others before sending. Get detailed insights into the emotional tone, authority, and persuasiveness of your messages to ensure they have the impact you intend.
              </FeatureDescription>
            </FeatureContent>
          </DesktopFeature>
          
          <DesktopFeature>
            <FeatureIcon>🔍</FeatureIcon>
            <FeatureContent>
              <FeatureTitle>Improve Communication Style</FeatureTitle>
              <FeatureDescription>
                Evaluate and enhance your writing style, formality, and engagement. Get actionable feedback on clarity, conciseness, and complexity to make your communication more effective across different contexts and audiences.
              </FeatureDescription>
            </FeatureContent>
          </DesktopFeature>
          
          <DesktopFeature>
            <FeatureIcon>📊</FeatureIcon>
            <FeatureContent>
              <FeatureTitle>Track Your Progress</FeatureTitle>
              <FeatureDescription>
                Monitor your improvement over time with detailed analytics. See how your communication skills develop across different metrics and identify areas for continued growth and improvement through personalized reports and comparisons.
              </FeatureDescription>
            </FeatureContent>
          </DesktopFeature>
          
          <DesktopFeature>
            <FeatureIcon>🧠</FeatureIcon>
            <FeatureContent>
              <FeatureTitle>Learn Communication Skills</FeatureTitle>
              <FeatureDescription>
                Build stronger digital relationships with AI-guided learning modules. Access practical exercises and tutorials covering emotional intelligence, non-violent communication, de-escalation techniques, active listening, and more.
              </FeatureDescription>
            </FeatureContent>
          </DesktopFeature>
        </DesktopRightPanel>
      </DesktopContent>
    </PageContainer>
  );
};

export default LandingPage;