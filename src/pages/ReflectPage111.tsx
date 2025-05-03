// src/pages/ReflectPage111.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import Navigation from '../components/common/Navigation';
import MessageInput from '../components/reflect/MessageInput';
import ReflectionOutput from '../components/reflect/ReflectionOutput';
import { supabase } from '../services/supabase';
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
  
  ${props => props.isDesktop && `
    max-width: 800px;
    margin: 0 auto;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  `}
`;

const DesktopHeader = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.5rem;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
  
  @media (min-width: 1024px) {
    justify-content: flex-start;
    gap: 15px;
  }
`;

const AnalysisButton = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  background-color: ${props => props.active ? props.theme.colors.primary : 'white'};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 4px;
  color: ${props => props.active ? 'white' : props.theme.colors.primary};
  font-weight: bold;
  text-transform: uppercase;
  min-width: 80px;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Footer = styled.div`
  text-align: center;
  padding: 10px;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;
  font-size: 1.2rem;
`;

const ReflectPage111: React.FC<PageProps> = ({ 
  isDesktop = false,
  toggleMenu = () => {} 
}) => {
  const [analysisType, setAnalysisType] = useState<'style' | 'impact' | 'result'>('style');
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAttachmentAdd = (files: FileList) => {
    const newFiles = Array.from(files);
    setAttachments([...attachments, ...newFiles]);
  };
  
  const handleAttachmentRemove = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };
  
  const handleAnalyze = async (type: 'style' | 'impact' | 'result') => {
    // Your existing implementation
  };

  const isButtonDisabled = isAnalyzing || (!message && attachments.length === 0);

  return (
    <PageContainer>
      {!isDesktop && <Navigation toggleMenu={toggleMenu} />}
      
      <ContentArea isDesktop={isDesktop}>
        {isDesktop && <DesktopHeader>Reflect: Analyze Your Communication</DesktopHeader>}
        
        {error && (
          <div style={{ 
            backgroundColor: '#ffdddd', 
            color: '#ff0000', 
            padding: '10px', 
            margin: '10px', 
            borderRadius: '4px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        
        <ReflectionOutput 
          analysisType={analysisType}
          analysis={analysis}
          isLoading={isAnalyzing}
        />
        
        <MessageInput 
          value={message}
          onChange={setMessage}
          onAttach={handleAttachmentAdd}
          attachments={attachments}
          onAttachmentRemove={handleAttachmentRemove}
        />
        
        <ButtonsContainer>
          <AnalysisButton 
            active={analysisType === 'style'} 
            onClick={() => handleAnalyze('style')}
            disabled={isButtonDisabled}
          >
            Style
          </AnalysisButton>
          <AnalysisButton 
            active={analysisType === 'impact'} 
            onClick={() => handleAnalyze('impact')}
            disabled={isButtonDisabled}
          >
            Impact
          </AnalysisButton>
          <AnalysisButton 
            active={analysisType === 'result'} 
            onClick={() => handleAnalyze('result')}
            disabled={isButtonDisabled}
          >
            Result
          </AnalysisButton>
        </ButtonsContainer>
      </ContentArea>
      
      {!isDesktop && <Footer>HIT</Footer>}
    </PageContainer>
  );
};

export default ReflectPage111;