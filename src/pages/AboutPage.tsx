// src/pages/AboutPage.tsx
import React from 'react';
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

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 30px;
  text-transform: uppercase;
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

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
`;

const Tab = styled.div<{ active: boolean }>`
  padding: 10px 20px;
  cursor: pointer;
  color: ${props => props.active ? '#38a3a5' : '#666'};
  border-bottom: ${props => props.active ? '3px solid #38a3a5' : 'none'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  
  &:hover {
    color: #38a3a5;
  }
`;

const AboutPage: React.FC<PageProps> = ({ isDesktop = false }) => {
  const [activeTab, setActiveTab] = React.useState('about');
  
  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <Section>
            <Paragraph>
              EmotiBot was developed by initiative of HIT leadership as part of research on AI in societies.
              The project aims to improve communication by providing AI-powered analysis of text, helping users
              understand the emotional impact and effectiveness of their messages.
            </Paragraph>
            <Paragraph>
              The application uses advanced natural language processing to evaluate text along multiple dimensions
              including style, emotional impact, and potential results. By providing detailed feedback and
              actionable suggestions, EmotiBot helps users develop stronger communication skills for both
              personal and professional contexts.
            </Paragraph>
            <Paragraph>
              Our mission is to create a tool that not only analyzes text but serves as a learning platform
              to develop better communication habits and emotional intelligence.
            </Paragraph>
            <Paragraph>
              This project is part of ongoing research into how AI can help improve human communication and
              social interaction in digital environments.
            </Paragraph>
          </Section>
        );
      case 'help':
        return (
          <Section>
            <SectionTitle>How to use EmotiBot:</SectionTitle>
            <Paragraph>
              <strong>Reflect Feature:</strong><br/>
              Enter your text in the message box and click one of the analysis buttons:
            </Paragraph>
            <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
              <li><strong>Style:</strong> Analyzes clarity, conciseness, formality, engagement, and complexity</li>
              <li><strong>Impact:</strong> Measures empathy, authority, persuasiveness, approachability, and confidence</li>
              <li><strong>Result:</strong> Evaluates effectiveness, actionability, memorability, influence, and audience fit</li>
            </ul>
            <Paragraph>
              Each analysis provides numerical scores, detailed explanations, an overall summary, and
              actionable suggestions for improvement.
            </Paragraph>
            <SectionTitle>Grow Feature:</SectionTitle>
            <Paragraph>
              The Grow section provides learning modules in three categories:
            </Paragraph>
            <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
              <li><strong>Learn:</strong> Educational modules about communication principles</li>
              <li><strong>Play:</strong> Interactive exercises to practice skills</li>
              <li><strong>Test:</strong> Assessments to evaluate your progress</li>
            </ul>
            <Paragraph>
              Click on any module to begin and track your progress over time in the History section.
            </Paragraph>
          </Section>
        );
      default:
        return (
          <Section>
            <Paragraph>
              EmotiBot was developed by initiative of HIT leadership as part of research on AI in societies.
              The project aims to improve communication by providing AI-powered analysis of text.
            </Paragraph>
          </Section>
        );
    }
  };
  
  return (
    <Container isDesktop={!!isDesktop}>
      <Title>About</Title>
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'about'} 
          onClick={() => setActiveTab('about')}
        >
          About
        </Tab>
        <Tab 
          active={activeTab === 'help'} 
          onClick={() => setActiveTab('help')}
        >
          Help
        </Tab>
      </TabsContainer>
      
      {renderContent()}
      
      <Section>
        <SectionTitle>Credits</SectionTitle>
        <Paragraph>
          HIT - Holon Institute of Technology<br />
          Copyright © 2024
        </Paragraph>
      </Section>
    </Container>
  );
};

export default AboutPage;