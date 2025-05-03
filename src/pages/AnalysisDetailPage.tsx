// src/pages/AnalysisDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { supabase } from '../utils/supabaseClient';

interface AnalysisData {
  id: string;
  created_at: string;
  content: string;
  type: string;
  metrics: {
    [key: string]: number;
  };
  analysis: {
    [key: string]: string;
  };
  suggestions?: {
    [key: string]: string;
  };
}

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
`;

const HeaderContainer = styled.div`
  background-color: white;
  padding: 15px 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #38a3a5;
  margin-right: 15px;
`;

const PageTitle = styled.h1`
  color: #38a3a5;
  font-size: 1.5rem;
  margin: 0;
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 0 20px;
`;

const MessageCard = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const MessageTitle = styled.h2`
  font-size: 1.2rem;
  color: #333;
  margin: 0;
`;

const MessageDate = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const MessageContent = styled.div`
  color: #333;
  font-size: 1rem;
  line-height: 1.5;
  white-space: pre-wrap;
`;

const MetricsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const MetricCard = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const MetricTitle = styled.h3`
  font-size: 1rem;
  color: #333;
  margin: 10px 0 0;
  text-align: center;
`;

const ProgressContainer = styled.div`
  width: 80px;
  height: 80px;
  margin: 10px auto;
`;

const AnalysisSection = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  color: #38a3a5;
  margin: 0 0 15px;
`;

const AnalysisItem = styled.div`
  margin-bottom: 20px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const AnalysisItemTitle = styled.h3`
  font-size: 1rem;
  color: #333;
  margin: 0 0 5px;
`;

const AnalysisItemContent = styled.p`
  color: #555;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 20px;
  color: #e74c3c;
  background-color: #fde2e2;
  border-radius: 10px;
  margin: 20px 0;
`;

const AnalysisDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchAnalysisData();
    }
  }, [id]);

  const fetchAnalysisData = async () => {
    try {
      setLoading(true);
      
      // Fetch the analysis result with its related message
      const { data, error } = await supabase
        .from('analysis_results')
        .select(`
          id,
          created_at,
          metrics,
          message_id
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
  
      // Now fetch the related message
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .select('content, message_type')
        .eq('id', data.message_id)
        .single();
      
      if (messageError) throw messageError;
      
      // Format the data for display
      const formattedData = {
        id: data.id,
        created_at: data.created_at,
        content: messageData?.content || 'No content available',
        type: messageData?.message_type || 'Unknown',
        metrics: data.metrics?.metrics || {},
        analysis: data.metrics?.analysis || {},
        suggestions: data.metrics?.suggestions || {},
      };
      
      setAnalysisData(formattedData);
    } catch (error) {
      console.error('Error fetching analysis:', error);
      setError('Failed to load analysis details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getColorForMetric = (value: number) => {
    if (value >= 80) return '#4caf50';
    if (value >= 60) return '#8bc34a';
    if (value >= 40) return '#ffeb3b';
    if (value >= 20) return '#ff9800';
    return '#f44336';
  };

  return (
    <PageContainer>
      <HeaderContainer>
        <BackButton onClick={() => navigate('/history')}>←</BackButton>
        <PageTitle>Analysis Details</PageTitle>
      </HeaderContainer>
      <ContentContainer>
        {loading ? (
          <LoadingState>Loading analysis details...</LoadingState>
        ) : error ? (
          <ErrorState>{error}</ErrorState>
        ) : analysisData ? (
          <>
            <MessageCard>
              <MessageHeader>
                <MessageTitle>Original Message</MessageTitle>
                <MessageDate>{formatDate(analysisData.created_at)}</MessageDate>
              </MessageHeader>
              <MessageContent>{analysisData.content}</MessageContent>
            </MessageCard>
            
            <SectionTitle>Metrics</SectionTitle>
            <MetricsContainer>
              {Object.entries(analysisData.metrics).map(([key, value]) => (
                <MetricCard key={key}>
                  <ProgressContainer>
                    <CircularProgressbar
                      value={value}
                      text={`${value}%`}
                      styles={buildStyles({
                        textSize: '30px',
                        pathColor: getColorForMetric(value),
                        textColor: '#333',
                        trailColor: '#f5f5f5',
                      })}
                    />
                  </ProgressContainer>
                  <MetricTitle>{key.charAt(0).toUpperCase() + key.slice(1)}</MetricTitle>
                </MetricCard>
              ))}
            </MetricsContainer>
            
            <AnalysisSection>
              <SectionTitle>Explanations</SectionTitle>
              {Object.entries(analysisData.analysis).map(([key, explanation]) => (
                <AnalysisItem key={key}>
                  <AnalysisItemTitle>{key.charAt(0).toUpperCase() + key.slice(1)}</AnalysisItemTitle>
                  <AnalysisItemContent>{explanation}</AnalysisItemContent>
                </AnalysisItem>
              ))}
            </AnalysisSection>
            
            {analysisData.suggestions && Object.keys(analysisData.suggestions).length > 0 && (
              <AnalysisSection>
                <SectionTitle>Improvement Suggestions</SectionTitle>
                {Object.entries(analysisData.suggestions).map(([key, suggestion]) => (
                  <AnalysisItem key={key}>
                    <AnalysisItemTitle>{key.charAt(0).toUpperCase() + key.slice(1)}</AnalysisItemTitle>
                    <AnalysisItemContent>{suggestion}</AnalysisItemContent>
                  </AnalysisItem>
                ))}
              </AnalysisSection>
            )}
          </>
        ) : (
          <ErrorState>Analysis not found</ErrorState>
        )}
      </ContentContainer>
    </PageContainer>
  );
};

export default AnalysisDetailPage;