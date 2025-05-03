// src/pages/ReflectPage.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import Navigation from '../components/common/Navigation';
import MessageInput from '../components/reflect/MessageInput';
import ReflectionOutput from '../components/reflect/ReflectionOutput';

const PageContainer = styled.div`
  min-height: 100vh;
  max-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.main};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const LogoContainer = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.s} 0;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontSizes.large};
  margin-top: auto; /* Push to bottom */
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.s};
  margin: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.m} 
          ${({ theme }) => theme.spacing.m};
`;

const AnalysisButton = styled.button<{active?: boolean}>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.s};
  background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.background.card};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  color: ${props => props.active ? props.theme.colors.background.card : props.theme.colors.primary};
  font-weight: bold;
  text-transform: uppercase;
  min-width: 80px;
  font-size: 14px;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background-color: ${props => props.active ? 
      props.theme.colors.primary : 
      props.theme.colors.secondary};
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

// Example analysis data - this would come from the backend API in the future
const exampleAnalysis = {
  style: {
    clarity: 75,
    conciseness: 60,
    formality: 45,
    engagement: 80,
    complexity: 30
  },
  impact: {
    empathy: 65,
    authority: 40,
    persuasiveness: 70,
    approachability: 85,
    confidence: 55
  },
  result: {
    effectiveness: 72,
    actionability: 68,
    memorability: 58,
    influence: 63,
    audience_fit: 77
  }
};

const ReflectPage: React.FC = () => {
  const [analysisType, setAnalysisType] = useState<'style' | 'impact' | 'result'>('style');
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleAttachmentAdd = (files: FileList) => {
    const newFiles = Array.from(files);
    setAttachments([...attachments, ...newFiles]);
  };
  
  const handleAttachmentRemove = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };
  
  const handleAnalyze = (type: 'style' | 'impact' | 'result') => {
    if (!message && attachments.length === 0) return;
    
    setAnalysisType(type);
    setIsAnalyzing(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setAnalysis(exampleAnalysis[type]);
      setIsAnalyzing(false);
    }, 1500);
  };

  const isButtonDisabled = isAnalyzing || (!message && attachments.length === 0);

  return (
    <PageContainer>
      <Navigation />
      <ContentArea>
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
        
        {/* Analyze buttons moved below the input */}
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
      
      {/* Logo moved to the bottom */}
      <LogoContainer>HiT</LogoContainer>
    </PageContainer>
  );
};

export default ReflectPage;