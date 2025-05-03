// src/pages/ReflectPage111.tsx
import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import Navigation from '../components/common/Navigation';
import MessageInput from '../components/reflect/MessageInput';
import RadialGauge from '../components/common/RadialGauge';
import { analyzeText, AnalysisType, AnalysisResult } from '../services/ai';
import { supabase } from '../utils/supabaseClient';
import { PageProps } from '../layouts/AppLayout';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

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
    max-width: 1200px;
    margin: 0 auto;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    padding: 30px;
  `}
`;

const PageTitle = styled.h1`
  color: #333;
  font-size: 2rem;
  margin-bottom: 30px;
  text-transform: uppercase;
`;

const GaugesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 20px 0;
`;

const GaugeItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  width: 170px;
`;

const GaugeLabel = styled.div`
  margin-top: 10px;
  font-size: 1rem;
  color: #333;
  text-transform: capitalize;
`;

const AnalysisTextContainer = styled.div`
  flex: 1;
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 20px;
  margin: 20px 0;
`;

const InputContainer = styled.div`
  margin-top: 20px;
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  animation: spin 1s linear infinite;
`;

const LoadingText = styled.p`
  margin-top: 15px;
  color: #666;
  font-size: 1rem;
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
  
  // Use the AuthContext instead of a separate user state
  const { user, loading: authLoading } = useContext(AuthContext);
  
  // Create a ref to store the isDesktop value to prevent UI flicker during state changes
  const isDesktopRef = useRef(isDesktop);
  const [stableIsDesktop, setStableIsDesktop] = useState(isDesktop);
  
  // Update the isDesktop ref when the prop changes
  useEffect(() => {
    // Only update if there's a significant change to avoid flicker
    // This prevents temporary changes during re-renders
    if (isDesktop !== isDesktopRef.current && !isAnalyzing) {
      isDesktopRef.current = isDesktop;
      setStableIsDesktop(isDesktop);
    }
  }, [isDesktop, isAnalyzing]);
  
  // Force desktop/mobile detection on mount and window resize
  useEffect(() => {
    const checkScreenSize = () => {
      const newIsDesktop = window.innerWidth >= 1024;
      if (newIsDesktop !== isDesktopRef.current) {
        isDesktopRef.current = newIsDesktop;
        setStableIsDesktop(newIsDesktop);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
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
    
    setAnalysisType(type);
    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null); // Reset previous analysis
    
    try {
      // Save the message to the database if the user is logged in
      let messageId = null;
      
      if (user) {
        // Only save to database if user is logged in
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
          // Continue without saving - don't throw error
        } else if (messageData) {
          messageId = messageData.id;
        }
      }
      
      // Call the analyze function from our modular AI service
      const analysisResult = await analyzeText(message, type);
      
      // If user is logged in and we have a message ID, save the analysis result
      if (user && messageId) {
        const { metrics, analysis: explanations, suggestions } = analysisResult;
        
        // Save the analysis result
        const { error: analysisError } = await supabase
          .from('analysis_results')
          .insert({
            message_id: messageId,
            metrics: metrics || {},
            explanations: explanations || {},
            suggestions: suggestions || []
          });
        
        if (analysisError) {
          console.error('Error saving analysis result:', analysisError);
          // Continue without saving - don't throw error
        }
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

  const isButtonDisabled = isAnalyzing || (!message && attachments.length === 0);

  // Render different content based on the analysis state
  const renderAnalysisContent = () => {
    if (isAnalyzing) {
      return (
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Analyzing your message...</LoadingText>
        </LoadingContainer>
      );
    }

    if (!analysis) {
      return (
        <AnalysisTextContainer>
          <p>Enter your message and click one of the analysis buttons below to get started.</p>
        </AnalysisTextContainer>
      );
    }

    // Get metrics based on analysis type
    const getMetricKeys = () => {
      switch(analysisType) {
        case 'style':
          return ['clarity', 'conciseness', 'formality', 'engagement', 'complexity'];
        case 'impact':
          return ['empathy', 'authority', 'persuasiveness', 'approachability', 'confidence'];
        case 'result':
          return ['effectiveness', 'actionability', 'memorability', 'influence', 'audience_fit'];
        default:
          return [];
      }
    };

    const metricKeys = getMetricKeys();

    return (
      <>
        <GaugesContainer>
          {metricKeys.map(key => (
            <GaugeItem key={key}>
              <RadialGauge
                value={analysis.metrics[key] || 0}
                label=""
                animate={true}
                size={160}
              />
              <GaugeLabel>{key.replace('_', ' ')}</GaugeLabel>
            </GaugeItem>
          ))}
        </GaugesContainer>
        <AnalysisTextContainer>
          <h3>{analysisType.charAt(0).toUpperCase() + analysisType.slice(1)} Analysis</h3>
          <p>{analysis.summary}</p>
          {analysis.suggestions && analysis.suggestions.length > 0 && (
            <>
              <h4>Suggestions</h4>
              <ul>
                {analysis.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </>
          )}
        </AnalysisTextContainer>
      </>
    );
  };

  return (
    <PageContainer>
      {!stableIsDesktop && <Navigation toggleMenu={toggleMenu} isDesktop={stableIsDesktop} />}
      
      <ContentArea isDesktop={!!stableIsDesktop}>
        {stableIsDesktop && <PageTitle>REFLECT</PageTitle>}
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        {renderAnalysisContent()}
        
        <InputContainer>
          <MessageInput 
            value={message}
            onChange={setMessage}
            onAttach={handleAttachmentAdd}
            attachments={attachments}
            onAttachmentRemove={handleAttachmentRemove}
          />
        </InputContainer>
        
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
      
      {!stableIsDesktop && <Footer>HIT</Footer>}
    </PageContainer>
  );
};

export default ReflectPage111;