// src/pages/GrowModuleDetailPage.tsx
import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { PageProps } from '../layouts/AppLayout';

const Container = styled.div<{ isDesktop: boolean }>`
  padding: 20px;
  min-height: 100vh;
  
  ${props => props.isDesktop && `
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  `}
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #38a3a5;
`;

const Title = styled.h1`
  margin-left: 15px;
  font-size: 2rem;
  color: #333;
`;

const Content = styled.div<{ isDesktop?: boolean }>`
  background: white;
  border-radius: 10px;
  padding: 20px;
  min-height: 300px;
  margin-top: 20px;
  
  ${props => !props.isDesktop && `
    background: #f9f9f9;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  `}
`;

const Section = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 20px;
`;

const Paragraph = styled.p`
  color: #666;
  margin-bottom: 15px;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  background-color: #38a3a5;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: #2c8385;
  }
`;

// This component will be used when a module is selected
const GrowModuleDetailPage: React.FC<PageProps> = ({ isDesktop = false }) => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine which section (learn/play/test) we're in
  const pathSegments = location.pathname.split('/');
  const growSection = pathSegments.length > 2 ? pathSegments[2] : 'learn';
  
  // Track if we're in mobile view for responsive design
  const isMobileView = window.innerWidth < 1024;

  // Redirect to the appropriate section if needed
  useEffect(() => {
    if (moduleId && !['learn', 'play', 'test'].includes(moduleId)) {
      // If we have a moduleId but it's not one of the section names,
      // we're viewing a specific module, so no redirect needed
      return;
    }
    
    // If no valid moduleId, make sure we're on a learn/play/test route
    if (!moduleId || ['learn', 'play', 'test'].includes(moduleId)) {
      navigate(`/grow/${moduleId || 'learn'}`);
    }
  }, [moduleId, navigate]);

  // This would be replaced with actual module data fetching
  const getModuleTitle = (id: string): string => {
    const modules: Record<string, string> = {
      'ei': 'Emotional Intelligence',
      'nvc': 'Non-violent Communication',
      'cb': 'Cognitive Biases',
      'de': 'De-escalation',
      'lf': 'Logical Fallacies',
      'al': 'Active Listening',
      'cf': 'Constructive Feedback',
      'ra': 'Replying to Agression',
      'hm': 'Handling Miscommunication',
      'co': 'Convincing Others',
      'knowledge': 'Knowledge Test',
      'skills': 'Skills Assessment',
      // Add sections as modules
      'learn': 'Learn',
      'play': 'Play',
      'test': 'Test'
    };
    return modules[id || ''] || 'Module';
  };

  const generateModuleContent = (id: string, section: string) => {
    // Special case for section pages
    if (['learn', 'play', 'test'].includes(id)) {
      return (
        <Section>
          <SectionTitle>Welcome to the {id.charAt(0).toUpperCase() + id.slice(1)} section</SectionTitle>
          <Paragraph>
            This section contains modules to help you {id === 'learn' ? 'understand the principles of effective communication' : 
              id === 'play' ? 'practice your communication skills in simulated scenarios' : 
              'assess your knowledge and abilities'}.
          </Paragraph>
          <Paragraph>
            Select a module from the grid to begin.
          </Paragraph>
          <ButtonGroup>
            <Button onClick={() => navigate('/grow')}>Back to Modules</Button>
          </ButtonGroup>
        </Section>
      );
    }
    
    // Content based on section and module
    if (section === 'learn') {
      switch (id) {
        case 'ei':
          return (
            <>
              <Section>
                <SectionTitle>What is Emotional Intelligence?</SectionTitle>
                <Paragraph>
                  Emotional intelligence (EI) is the ability to recognize, understand, and manage our own emotions,
                  as well as recognize, understand, and influence the emotions of others. In practical terms, this
                  means being aware that emotions can drive our behavior and impact people (positively and negatively),
                  and learning how to manage those emotions – both our own and others – especially when we are under pressure.
                </Paragraph>
                <Paragraph>
                  The four main components of emotional intelligence are:
                  1. Self-awareness – knowing what you're feeling and why
                  2. Self-management – controlling impulsive feelings and behaviors
                  3. Social awareness – understanding and empathizing with others
                  4. Relationship management – communicating clearly and influencing others positively
                </Paragraph>
              </Section>
              <Section>
                <SectionTitle>Why is Emotional Intelligence Important in Communication?</SectionTitle>
                <Paragraph>
                  In text-based communication, where tone and non-verbal cues are absent, emotional intelligence
                  becomes even more crucial. It helps you:
                  
                  - Craft messages that convey the intended emotional tone
                  - Anticipate how your words might be interpreted by the recipient
                  - Recognize when emotions might be influencing your message in unhelpful ways
                  - Respond appropriately to emotionally charged messages from others
                </Paragraph>
              </Section>
              <ButtonGroup>
                <Button>Start Practice</Button>
                <Button>Take Assessment</Button>
              </ButtonGroup>
            </>
          );
        case 'nvc':
          return (
            <>
              <Section>
                <SectionTitle>Non-violent Communication Principles</SectionTitle>
                <Paragraph>
                  Non-violent Communication (NVC) is an approach to communication based on principles of nonviolence
                  and empathy. It is founded on the idea that all human beings have the capacity for compassion and
                  only resort to violence or behavior that harms others when they don't recognize more effective
                  strategies for meeting needs.
                </Paragraph>
                <Paragraph>
                  The four components of NVC are:
                  1. Observation – describing what is seen or heard without judgment or evaluation
                  2. Feelings – identifying and expressing emotions without blaming others
                  3. Needs – connecting with the universal human needs that are or are not being met
                  4. Request – making specific, doable requests rather than demands
                </Paragraph>
              </Section>
              <Section>
                <SectionTitle>Applying NVC in Digital Communication</SectionTitle>
                <Paragraph>
                  In text messages, emails, and social media, NVC helps prevent misunderstandings and conflicts by:
                  
                  - Expressing observations clearly without interpretation
                  - Naming your feelings directly rather than implying them
                  - Connecting those feelings to your needs
                  - Making clear requests instead of demands or hints
                </Paragraph>
              </Section>
              <ButtonGroup>
                <Button>Try Examples</Button>
                <Button>Practice NVC Rephrasing</Button>
              </ButtonGroup>
            </>
          );
        default:
          return (
            <Section>
              <Paragraph>
                Module content for "{getModuleTitle(id)}" in the Learn section will be displayed here.
              </Paragraph>
              <Paragraph>
                This is where the learning materials, educational content, and explanations would appear.
              </Paragraph>
            </Section>
          );
      }
    }
    
    else if (section === 'play') {
      switch (id) {
        case 'cf':
          return (
            <>
              <Section>
                <SectionTitle>Constructive Feedback Practice</SectionTitle>
                <Paragraph>
                  Learning to give feedback that is both honest and helpful is an essential communication skill.
                  This module will help you practice formulating feedback that is specific, actionable, and delivered
                  with empathy.
                </Paragraph>
              </Section>
              <Section>
                <SectionTitle>Interactive Scenarios</SectionTitle>
                <Paragraph>
                  Work through realistic workplace and personal scenarios where you'll need to provide constructive feedback.
                  Each scenario will present a situation and ask you to compose your feedback, then analyze how effective
                  your approach would be.
                </Paragraph>
              </Section>
              <ButtonGroup>
                <Button>Start Practice Scenarios</Button>
                <Button>View Feedback Guidelines</Button>
              </ButtonGroup>
            </>
          );
        default:
          return (
            <Section>
              <Paragraph>
                Module content for "{getModuleTitle(id)}" in the Play section will be displayed here.
              </Paragraph>
              <Paragraph>
                This is where interactive exercises and practice scenarios would appear.
              </Paragraph>
            </Section>
          );
      }
    }
    
    else if (section === 'test') {
      switch (id) {
        case 'knowledge':
          return (
            <>
              <Section>
                <SectionTitle>Communication Knowledge Assessment</SectionTitle>
                <Paragraph>
                  This assessment will test your understanding of communication principles, emotional intelligence,
                  and effective messaging techniques. It consists of multiple-choice questions and short scenarios
                  to analyze.
                </Paragraph>
              </Section>
              <Section>
                <SectionTitle>Assessment Details</SectionTitle>
                <Paragraph>
                  - 20 questions total
                  - Approximately 15 minutes to complete
                  - Results will be saved to your profile
                  - You can retake the assessment to track improvement
                </Paragraph>
              </Section>
              <ButtonGroup>
                <Button>Begin Assessment</Button>
                <Button>Review Study Materials</Button>
              </ButtonGroup>
            </>
          );
        default:
          return (
            <Section>
              <Paragraph>
                Module content for "{getModuleTitle(id)}" in the Test section will be displayed here.
              </Paragraph>
              <Paragraph>
                This is where assessments and knowledge checks would appear.
              </Paragraph>
            </Section>
          );
      }
    }
    
    // Default content
    return (
      <Section>
        <Paragraph>
          Module content for "{getModuleTitle(id)}" will be displayed here.
        </Paragraph>
        <Paragraph>
          This is where the learning materials, simulations, or tests would appear based on the selected module.
        </Paragraph>
      </Section>
    );
  };

  // Determine which section we're in
  const determineSection = (): string => {
    if (pathSegments.includes('play')) return 'play';
    if (pathSegments.includes('test')) return 'test';
    return 'learn';
  };

  const section = determineSection();
  const finalIsDesktop = isMobileView ? false : isDesktop;

  return (
    <Container isDesktop={!!finalIsDesktop}>
      <Header>
        <BackButton onClick={() => navigate('/grow')}>←</BackButton>
        <Title>{getModuleTitle(moduleId || '')}</Title>
      </Header>
      <Content isDesktop={finalIsDesktop}>
        {generateModuleContent(moduleId || '', section)}
      </Content>
    </Container>
  );
};

export default GrowModuleDetailPage;