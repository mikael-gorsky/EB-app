import React from 'react';
import styled from 'styled-components';

interface ModuleCardProps {
  title: string;
  bgColor: string;
  onClick?: () => void;
}

const Card = styled.div<{ bgColor: string }>`
  background: ${props => props.bgColor};
  border-radius: 10px;
  padding: 15px;
  margin: 10px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ModuleCard: React.FC<ModuleCardProps> = ({ title, bgColor, onClick }) => {
  return (
    <Card bgColor={bgColor} onClick={onClick}>
      {title}
    </Card>
  );
};

export default ModuleCard;