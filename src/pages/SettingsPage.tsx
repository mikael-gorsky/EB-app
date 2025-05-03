// src/pages/SettingsPage.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
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

const Description = styled.p`
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
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
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 200px;
  font-size: 1rem;
  color: #333;
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 15px;
`;

const ToggleLabel = styled.span`
  margin-right: 10px;
  color: #666;
`;

const Toggle = styled.div<{ isActive: boolean }>`
  position: relative;
  width: 50px;
  height: 26px;
  background-color: ${props => props.isActive ? '#38a3a5' : '#ccc'};
  border-radius: 13px;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${props => props.isActive ? '27px' : '3px'};
    width: 20px;
    height: 20px;
    background-color: white;
    border-radius: 50%;
    transition: left 0.3s;
  }
`;

const SettingsPage: React.FC<PageProps> = ({ isDesktop = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [language, setLanguage] = useState('en');
  const [darkMode, setDarkMode] = useState(false);
  
  // Get current section from URL
  const path = location.pathname.split('/');
  const section = path.length > 2 ? path[2] : 'data';
  
  const renderContent = () => {
    switch (section) {
      case 'data':
        return (
          <Section>
            <SectionTitle>Data Management</SectionTitle>
            <Description>
              You can manage your data stored in EmotiBot, including removing all your data or transferring it to another platform.
              These features are planned for future implementation.
            </Description>
            <ButtonGroup>
              <Button disabled>Remove All User's Data</Button>
              <Button disabled>Transfer User's Data</Button>
            </ButtonGroup>
          </Section>
        );
      case 'notifications':
        return (
          <Section>
            <SectionTitle>Notifications</SectionTitle>
            <Description>
              Notification settings will allow you to configure how and when you receive alerts about analysis results and learning reminders.
              This feature is planned for future implementation.
            </Description>
            <Button disabled>Configure Notifications</Button>
          </Section>
        );
      case 'privacy':
        return (
          <Section>
            <SectionTitle>Privacy</SectionTitle>
            <Description>
              Privacy settings allow you to control how your data is used within the application and what information is shared with our AI systems.
              More granular privacy controls are planned for future implementation.
            </Description>
            <Button disabled>Update Privacy Settings</Button>
          </Section>
        );
      case 'language':
        return (
          <Section>
            <SectionTitle>Language</SectionTitle>
            <Description>
              This setting only relates to the language of analysis and the language of "grow" activities.
              It does not change the interface language.
            </Description>
            <div>
              <Select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="he">Hebrew</option>
              </Select>
            </div>
          </Section>
        );
      case 'theme':
        return (
          <Section>
            <SectionTitle>Theme</SectionTitle>
            <Description>
              Choose between light and dark mode for the application interface.
            </Description>
            <ToggleContainer>
              <ToggleLabel>Light</ToggleLabel>
              <Toggle 
                isActive={darkMode}
                onClick={() => setDarkMode(!darkMode)}
              />
              <ToggleLabel style={{ marginLeft: '10px' }}>Dark</ToggleLabel>
            </ToggleContainer>
          </Section>
        );
      case 'integrations':
        return (
          <Section>
            <SectionTitle>Integrations</SectionTitle>
            <Description>
              Safely connect with your social media accounts or use "share" in iOS to analyze messages in a low-friction way.
              These integrations are planned for future implementation and will follow strict privacy and security protocols.
            </Description>
            <Button disabled>Proceed</Button>
          </Section>
        );
      default:
        return (
          <Section>
            <SectionTitle>Data Management</SectionTitle>
            <Description>
              You can manage your data stored in EmotiBot, including removing all your data or transferring it to another platform.
              These features are planned for future implementation.
            </Description>
            <ButtonGroup>
              <Button disabled>Remove All User's Data</Button>
              <Button disabled>Transfer User's Data</Button>
            </ButtonGroup>
          </Section>
        );
    }
  };
  
  return (
    <Container isDesktop={!!isDesktop}>
      <Title>Settings: {section.charAt(0).toUpperCase() + section.slice(1).replace('_', ' ')}</Title>
      {renderContent()}
    </Container>
  );
};

export default SettingsPage;