import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
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
  font-size: 1.5rem;
  color: #333;
`;

const Content = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  min-height: 300px;
`;

// This component will be used when a module is selected
const GrowModuleDetailPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();

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
    };
    return modules[id || ''] || 'Module';
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/grow')}>←</BackButton>
        <Title>{getModuleTitle(moduleId || '')}</Title>
      </Header>
      <Content>
        <p>Module content will be displayed here.</p>
        <p>This is where the learning materials, simulations, or tests would appear based on the selected module.</p>
      </Content>
    </Container>
  );
};

export default GrowModuleDetailPage;