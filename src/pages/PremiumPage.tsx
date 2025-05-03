// src/pages/PremiumPage.tsx
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

const Content = styled.div`
  color: #f44336;
  font-size: 1.2rem;
  margin-bottom: 30px;
`;

const Description = styled.p`
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
`;

const FeatureList = styled.ul`
  margin: 20px 0;
  padding-left: 20px;
`;

const FeatureItem = styled.li`
  margin-bottom: 10px;
  color: #333;
`;

const ContactButton = styled.button`
  background-color: #38a3a5;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 20px;
  
  &:hover {
    background-color: #2c8385;
  }
`;

const PremiumPage: React.FC<PageProps> = ({ isDesktop = false }) => {
  return (
    <Container isDesktop={!!isDesktop}>
      <Title>Premium</Title>
      
      <Content>
        MANY NICE WORDS ABOUT PREMIUM SUBSCRIPTION THAT WILL BE AVAILABLE SOMETIME
      </Content>
      
      <Description>
        EmotiBot Premium offers enhanced capabilities for advanced communication analytics and learning.
        Upgrade to access exclusive features designed for professional and intensive use.
      </Description>
      
      <FeatureList>
        <FeatureItem>Advanced analytics with deeper insights and metrics</FeatureItem>
        <FeatureItem>Unlimited message analysis without daily restrictions</FeatureItem>
        <FeatureItem>Personalized improvement recommendations tailored to your communication style</FeatureItem>
        <FeatureItem>Priority access to new features and updates</FeatureItem>
        <FeatureItem>Enhanced privacy options for sensitive communications</FeatureItem>
        <FeatureItem>Advanced progress tracking and detailed reports</FeatureItem>
      </FeatureList>
      
      <Description>
        Premium features are currently in development and will be available soon.
        Contact us to learn more about our plans and get early access when available.
      </Description>
      
      <ContactButton>Contact Us</ContactButton>
    </Container>
  );
};

export default PremiumPage;