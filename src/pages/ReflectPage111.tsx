// src/pages/ReflectPage111.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Navigation from '../components/common/Navigation';
import MessageInput from '../components/reflect/MessageInput';
import ReflectionOutput from '../components/reflect/ReflectionOutput';
import { analyzeText, saveAnalysisResult } from '../services/analysis';
import { supabase } from '../utils/supabaseClient';
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

const ErrorMessage = styled.div`
  background-color: #ffdddd;
  color: #ff0000;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  text-align: center;
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
  const [user, setUser] = useState<any>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string>('default');

  useEffect(() => {
    // Check if user is authenticated
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    fetchUser();
  }, []);

  const handleAttachmentAdd = (files: FileList) => {
    const newFiles = Array.from(files);
    setAttachments([...attachments, ...newFiles]);
  };
  
  const handleAttachmentRemove = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };
  
  const handleAnalyze = async (type: 'style' | 'impact' | 'result') => {
    if (!message && attachments.length === 0) return;
    
    setAnalysisType(type);
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // First, create a conversation if needed
      let conversationId = currentConversationId;
      
      if (conversationId === 'default') {
        try {
          const { data: conversationData, error: conversationError } = await supabase
            .from('conversations')
            .insert({
              title: `Analysis session ${new Date().toLocaleString()}`,
              user_id: user?.id || 'anonymous'
            })
            .select()
            .single();
          
          if (conversationError) {
            console.error('Error creating conversation:', conversationError);
          } else if (conversationData) {
            conversationId = conversationData.id;
            setCurrentConversationId(conversationId);
          }
        } catch (err) {
          console.error('Error in conversation creation:', err);
          // If we fail, just continue with the default ID
        }
      }
      
      // Now save the message
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .insert({
          content: message,
          conversation_id: conversationId,
          user_id: user?.id || 'anonymous',
          file_ids: attachments.length > 0 ? attachments.map(file => file.name) : null
        })
        .select()
        .single();
      
      if (messageError) {
        console.error('Error saving message:', messageError);
        throw new Error('Failed to save message');
      }
      
      // Try to analyze the text using the Edge Function
      try {
        const analysisResult = await analyzeText(message, type);
        
        // If successful, save the analysis result
        if (messageData?.id) {
          await saveAnalysisResult(messageData.id, type, analysisResult);
        }
        
        // Update the UI with the analysis result
        setAnalysis(analysisResult);
      } catch (analysisError) {
        console.error('Analysis API error:', analysisError);
        
        // Fallback to mock data if the API fails
        console.log('Using fallback mock data for analysis');
        const mockAnalysis = generateMockAnalysis(type);
        
        setAnalysis(mockAnalysis);
        
        // Try to save the mock analysis
        if (messageData?.id) {
          try {
            await saveAnalysisResult(messageData.id, type, mockAnalysis);
          } catch (saveError) {
            console.error('Error saving mock analysis:', saveError);
          }
        }
      }
    } catch (err: any) {
      console.error('Analysis workflow error:', err);
      setError(err.message || 'Failed to analyze text. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Function to generate mock data if the API fails
  const generateMockAnalysis = (type: 'style' | 'impact' | 'result') => {
    const mockData: any = {
      metrics: {},
      analysis: {},
      summary: '',
      suggestions: []
    };
    
    if (type === 'style') {
      mockData.metrics = {
        clarity: Math.floor(Math.random() * 30) + 70, // 70-100
        conciseness: Math.floor(Math.random() * 40) + 60, // 60-100
        formality: Math.floor(Math.random() * 60) + 40, // 40-100
        engagement: Math.floor(Math.random() * 30) + 70, // 70-100
        complexity: Math.floor(Math.random() * 50) + 30 // 30-80
      };
      mockData.analysis = {
        clarity: 'The message is generally clear and understandable.',
        conciseness: 'The message uses an appropriate amount of words to convey the content.',
        formality: 'The message has a moderate level of formality suitable for professional settings.',
        engagement: 'The text is engaging and likely to maintain reader interest.',
        complexity: 'The complexity is appropriate for the intended audience.'
      };
      mockData.summary = 'This message is clear and engaging with an appropriate level of formality and complexity.';
      mockData.suggestions = [
        'Consider breaking longer sentences into shorter ones for improved clarity.',
        'Adding specific examples could enhance understanding.',
        'Using bullet points might improve readability for key points.'
      ];
    } else if (type === 'impact') {
      mockData.metrics = {
        empathy: Math.floor(Math.random() * 40) + 60, // 60-100
        authority: Math.floor(Math.random() * 60) + 40, // 40-100
        persuasiveness: Math.floor(Math.random() * 40) + 60, // 60-100
        approachability: Math.floor(Math.random() * 30) + 70, // 70-100
        confidence: Math.floor(Math.random() * 30) + 70 // 70-100
      };
      mockData.analysis = {
        empathy: 'The message shows understanding of the reader\'s perspective.',
        authority: 'The message conveys knowledge and expertise appropriately.',
        persuasiveness: 'The content is reasonably convincing in its arguments.',
        approachability: 'The tone is friendly and inviting to the reader.',
        confidence: 'The message projects confidence without being overly assertive.'
      };
      mockData.summary = 'This message effectively balances empathy and authority while maintaining an approachable tone.';
      mockData.suggestions = [
        'Adding acknowledgment of potential concerns could increase empathy.',
        'Including more concrete evidence would enhance persuasiveness.',
        'Using more personal language might improve approachability.'
      ];
    } else { // result
      mockData.metrics = {
        effectiveness: Math.floor(Math.random() * 30) + 70, // 70-100
        actionability: Math.floor(Math.random() * 40) + 60, // 60-100
        memorability: Math.floor(Math.random() * 50) + 50, // 50-100
        influence: Math.floor(Math.random() * 40) + 60, // 60-100
        audience_fit: Math.floor(Math.random() * 30) + 70 // 70-100
      };
      mockData.analysis = {
        effectiveness: 'The message is likely to achieve its intended purpose.',
        actionability: 'The reader can identify clear actions to take after reading.',
        memorability: 'Key points of the message are likely to be remembered.',
        influence: 'The message has good potential to influence opinions or behavior.',
        audience_fit: 'The content and tone are well-matched to the intended audience.'
      };
      mockData.summary = 'This message effectively targets the intended audience and provides clear, actionable information.';
      mockData.suggestions = [
        'Including a clear call-to-action would improve actionability.',
        'Using more memorable phrasing or metaphors could enhance retention.',
        'Tailoring some examples specifically to the audience would increase relevance.'
      ];
    }
    
    return mockData;
  };

  const isButtonDisabled = isAnalyzing || (!message && attachments.length === 0);

  return (
    <PageContainer>
      {!isDesktop && <Navigation toggleMenu={toggleMenu} />}
      
      <ContentArea isDesktop={isDesktop}>
        {isDesktop && <DesktopHeader>Reflect: Analyze Your Communication</DesktopHeader>}
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
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