import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ModuleCard from './ModuleCard';

interface Module {
  id: string;
  title: string;
  bgColor: string;
}

interface CategorySectionProps {
  title: string;
  modules: Module[];
  onModuleClick: (moduleId: string) => void;
}

const SectionContainer = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  color: #38a3a5;
  font-size: 1.5rem;
  margin-left: 15px;
  font-weight: 500;
`;

const ModulesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 0 5px;
`;

const CategorySection: React.FC<CategorySectionProps> = ({ title, modules, onModuleClick }) => {
  const navigate = useNavigate();

  const handleModuleClick = (moduleId: string) => {
    navigate(`/grow/${moduleId}`);
  };

  return (
    <SectionContainer>
      <SectionTitle>{title}</SectionTitle>
      <ModulesGrid>
        {modules.map(module => (
          <ModuleCard
            key={module.id}
            title={module.title}
            bgColor={module.bgColor}
            onClick={() => handleModuleClick(module.id)}
          />
        ))}
      </ModulesGrid>
    </SectionContainer>
  );
};

export default CategorySection;