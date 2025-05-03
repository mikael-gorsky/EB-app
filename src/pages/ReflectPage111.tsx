// src/pages/ReflectPage111.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Navigation from '../components/common/Navigation';
import MessageInput from '../components/reflect/MessageInput';
import ReflectionOutput from '../components/reflect/ReflectionOutput';
import { analyzeText, AnalysisType, AnalysisResult } from '../services/ai';
import { supabase } from '../utils/supabaseClient';
import { PageProps } from '../layouts/AppLayout';
import { useNavigate } from 'react-router-dom';

// Set the AI provider once at application startup
// This can be called elsewhere like in your main app initialization
// import { setAIProvider } from '../services/ai';
// setAIProvider('openai', { model: 'gpt-4.1-mini' });

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

const ErrorMessage = styled.div`
  background-color: #ffdddd;
  color: #ff0000;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  text-align: center;
`;

const AuthButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  margin: 10px 0;
  cursor: pointer;
  font-weight: 500;
`;

const ReflectPage111: React.FC<PageProps> = ({ 
  isDesktop = false,
  toggleMenu = () => {} 
}) => {
  const navigate = useNavigate();
  const [analysisType, setAnalysisType] = useState<AnalysisType>('style');
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is authenticated
    const fetchUserData = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    fetchUserData();
  }, []);

  const handleAttachmentAdd = (files: FileList) => {
    const newFiles = Array.from(files);
    setAttachments([...attachments, ...newFiles]);
  };
  
  const handleAttachmentRemove = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };
  
  const handleAnalyze = async (type: AnalysisType) => {
    if (!message && attachments.length === 0) return;
    
    // Check if user is authenticated
    if (!user) {
      setError('Please sign in to analyze messages');
      return;
    }
    
    setAnalysisType(type);
    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null); // Reset previous analysis
    
    try {
      // Save the message first
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .insert({
          content: message,
          user_id: user.id,
          message_type: type
        })
        .select()
        .single();
      
      if (messageError) {
        console.error('Error saving message:', messageError);
        throw new Error(`Failed to save message: ${messageError.message}`);
      }
      
      if (!messageData) {
        throw new Error('No message data returned from database');
      }
      
      // Call the analyze function from our modular AI service
      const analysisResult = await analyzeText(message, type);
      
      // Extract components from the result for database storage
      const { metrics, analysis: explanations, suggestions } = analysisResult;
      
      // Save the analysis result
      const { error: analysisError } = await supabase
        .from('analysis_results')
        .insert({
          message_id: messageData.id,
          metrics: metrics || {},
          explanations: explanations || {},
          suggestions: suggestions || []
        });
      
      if (analysisError) {
        console.error('Error saving analysis result:', analysisError);
        throw new Error(`Failed to save analysis: ${analysisError.message}`);
      }
      
      // Update the UI
      setAnalysis(analysisResult);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(`Analysis failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSignIn = () => {
    navigate('/auth');
  };

  const isButtonDisabled = isAnalyzing || (!message && attachments.length === 0) || !user;

  return (
    <PageContainer>
      {!isDesktop && <Navigation toggleMenu={toggleMenu} />}
      
      <ContentArea isDesktop={isDesktop}>
        {isDesktop && <DesktopHeader>Reflect: Analyze Your Communication</DesktopHeader>}
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        {!user && (
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <p>Please sign in to use the analysis features</p>
            <AuthButton onClick={handleSignIn}>Sign In / Create Account</AuthButton>
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