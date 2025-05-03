// src/pages/ReflectPage111.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Navigation from '../components/common/Navigation';
import MessageInput from '../components/reflect/MessageInput';
import RadialGauge from '../components/common/RadialGauge';
import { analyzeText, AnalysisType, AnalysisResult } from '../services/ai';
import { supabase } from '../utils/supabaseClient';
import { PageProps } from '../layouts/AppLayout';
import { useNavigate } from 'react-router-dom';

console.log('======= UPDATED REFLECT PAGE LOADED =======');

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

const AuthButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  margin: 10px 0;
  cursor: pointer;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

// New styled components for analysis output
const AnalysisPanel = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  margin: 10px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  animation: fadeIn 0.4s ease-out;
`;

const AnalysisHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
`;

const AnalysisTitle = styled.h2`
  font-size: 1.3rem;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
`;

const GaugesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const DetailSection = styled.div`
  margin-bottom: 15px;
`;

const DetailHeader = styled.div<{ expanded: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: ${props => props.expanded ? '#f5f5f5' : 'white'};
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const DetailTitle = styled.h3`
  font-size: 1.1rem;
  margin: 0;
  color: #333;
`;

const DetailContent = styled.div`
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 0 0 6px 6px;
  margin-top: 2px;
  
  @keyframes expandDown {
    from { opacity: 0; max-height: 0; }
    to { opacity: 1; max-height: 500px; }
  }
  
  animation: expandDown 0.3s ease-out;
  overflow: hidden;
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

interface ExpandableSectionProps {
  title: string;
  children: React.ReactNode;
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({ title, children }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <DetailSection>
      <DetailHeader 
        expanded={expanded}
        onClick={() => setExpanded(!expanded)}
      >
        <DetailTitle>{title}</DetailTitle>
        <span>{expanded ? '▲' : '▼'}</span>
      </DetailHeader>
      
      {expanded && (
        <DetailContent>
          {children}
        </DetailContent>
      )}
    </DetailSection>
  );
};

const getMetricKeys = (type: AnalysisType) => {
  switch(type) {
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

const AnalysisOutput: React.FC<{
  type: AnalysisType;
  data: AnalysisResult | null;
  isLoading: boolean;
}> = ({ type, data, isLoading }) => {
  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Analyzing your message...</LoadingText>
      </LoadingContainer>
    );
  }
  
  if (!data) {
    return null;
  }
  
  const metricKeys = getMetricKeys(type);
  const { metrics, analysis = {}, summary = '', suggestions = [] } = data;
  
  return (
    <AnalysisPanel>
      <AnalysisHeader>
        <AnalysisTitle>{type.charAt(0).toUpperCase() + type.slice(1)} Analysis</AnalysisTitle>
      </AnalysisHeader>
      
      <GaugesContainer>
        {metricKeys.map(key => (
          <RadialGauge
            key={key}
            value={metrics[key] || 0}
            label={key.replace('_', ' ')}
            animate={true}
          />
        ))}
      </GaugesContainer>
      
      {summary && (
        <ExpandableSection title="Summary">
          <p>{summary}</p>
        </ExpandableSection>
      )}
      
      <ExpandableSection title="Detailed Analysis">
        {metricKeys.map(key => (
          analysis[key] && (
            <div key={key} style={{ marginBottom: '15px' }}>
              <h4 style={{ 
                margin: '0 0 5px 0', 
                color: '#333', 
                fontSize: '1rem',
                textTransform: 'capitalize'
              }}>
                {key.replace('_', ' ')}
              </h4>
              <p style={{ margin: 0, color: '#555' }}>{analysis[key]}</p>
            </div>
          )
        ))}
      </ExpandableSection>
      
      {suggestions.length > 0 && (
        <ExpandableSection title="Suggestions for Improvement">
          <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
            {suggestions.map((suggestion, index) => (
              <li key={index} style={{ margin: '5px 0' }}>{suggestion}</li>
            ))}
          </ul>
        </ExpandableSection>
      )}
    </AnalysisPanel>
  );
};

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
      {/* Add this test div here to confirm the component is loaded */}
      <div style={{ background: 'red', padding: '20px', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
        UPDATED COMPONENT LOADED - TEST INDICATOR
      </div>
      
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
        
        <AnalysisOutput 
          type={analysisType}
          data={analysis}
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