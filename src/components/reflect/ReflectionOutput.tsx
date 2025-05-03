// src/components/reflect/ReflectionOutput.tsx
import React from 'react';
import styled from 'styled-components';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { motion } from 'framer-motion';

const OutputContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.m};
  margin: ${({ theme }) => theme.spacing.m};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  overflow-y: auto;
  max-height: 60vh;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.s};
  text-transform: capitalize;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: ${({ theme }) => theme.spacing.m};
  margin-bottom: ${({ theme }) => theme.spacing.m};
`;

const MetricItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const MetricName = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
  text-transform: capitalize;
  font-size: ${({ theme }) => theme.fontSizes.small};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
`;

const AnalysisSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.m};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: ${({ theme }) => theme.spacing.m};
`;

const SectionTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.s};
`;

const AnalysisText = styled.p`
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.s};
  line-height: 1.5;
`;

const SuggestionsList = styled.ul`
  margin-left: ${({ theme }) => theme.spacing.m};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const SuggestionItem = styled.li`
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  line-height: 1.5;
`;

const AnalysisDetail = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.m};
`;

const AnalysisLabel = styled.h4`
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  text-transform: capitalize;
`;

const AnalysisDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
`;

type AnalysisType = 'style' | 'impact' | 'result';

interface ReflectionOutputProps {
  analysisType: AnalysisType;
  analysis: any;
  isLoading: boolean;
}

const LoadingAnimation = () => (
  <LoadingContainer>
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        opacity: [1, 0.8, 1],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <CircularProgressbar
        value={66}
        strokeWidth={5}
        styles={buildStyles({
          pathColor: '#5664d2',
          trailColor: '#e6e6e6',
        })}
      />
    </motion.div>
  </LoadingContainer>
);

const ReflectionOutput: React.FC<ReflectionOutputProps> = ({ analysisType, analysis, isLoading }) => {
  if (isLoading) {
    return (
      <OutputContainer>
        <Title>{analysisType} analysis</Title>
        <LoadingAnimation />
      </OutputContainer>
    );
  }

  if (!analysis) {
    return (
      <OutputContainer>
        <EmptyState>
          <h3>No analysis yet</h3>
          <p>Type a message and click one of the analysis buttons below</p>
        </EmptyState>
      </OutputContainer>
    );
  }

  // Extract metrics, detailed analysis, summary and suggestions if they exist
  const metrics = analysis.metrics || analysis;
  const detailedAnalysis = analysis.analysis || {};
  const summary = analysis.summary || '';
  const suggestions = analysis.suggestions || [];

  // Get the appropriate metric names based on analysis type
  const getMetricNames = () => {
    switch (analysisType) {
      case 'style':
        return Object.keys(metrics).filter(key => 
          ['clarity', 'conciseness', 'formality', 'engagement', 'complexity'].includes(key));
      case 'impact':
        return Object.keys(metrics).filter(key => 
          ['empathy', 'authority', 'persuasiveness', 'approachability', 'confidence'].includes(key));
      case 'result':
        return Object.keys(metrics).filter(key => 
          ['effectiveness', 'actionability', 'memorability', 'influence', 'audience_fit'].includes(key));
      default:
        return Object.keys(metrics);
    }
  };

  const metricNames = getMetricNames();

  return (
    <OutputContainer>
      <Title>{analysisType} analysis</Title>
      
      {/* Metrics visualization */}
      <MetricsGrid>
        {metricNames.map((metricName) => (
          <MetricItem key={metricName}>
            <div style={{ width: 60, height: 60 }}>
              <CircularProgressbar
                value={metrics[metricName] || 0}
                text={`${metrics[metricName] || 0}`}
                styles={buildStyles({
                  textSize: '30px',
                  pathColor: '#5664d2',
                  textColor: '#5664d2',
                  trailColor: '#e6e6e6',
                })}
              />
            </div>
            <MetricName>{metricName.replace('_', ' ')}</MetricName>
          </MetricItem>
        ))}
      </MetricsGrid>

      {/* Summary section */}
      {summary && (
        <AnalysisSection>
          <SectionTitle>Overall analysis</SectionTitle>
          <AnalysisText>{summary}</AnalysisText>
        </AnalysisSection>
      )}

      {/* Detailed analysis section */}
      {Object.keys(detailedAnalysis).length > 0 && (
        <AnalysisSection>
          <SectionTitle>Detailed analysis</SectionTitle>
          {metricNames.map((metricName) => (
            detailedAnalysis[metricName] && (
              <AnalysisDetail key={`detail-${metricName}`}>
                <AnalysisLabel>{metricName.replace('_', ' ')}</AnalysisLabel>
                <AnalysisDescription>{detailedAnalysis[metricName]}</AnalysisDescription>
              </AnalysisDetail>
            )
          ))}
        </AnalysisSection>
      )}

      {/* Suggestions section */}
      {suggestions.length > 0 && (
        <AnalysisSection>
          <SectionTitle>Suggestions for improvement</SectionTitle> 
          <SuggestionsList>
            {suggestions.map((suggestion: string, index: number) => (
              <SuggestionItem key={`suggestion-${index}`}>{suggestion}</SuggestionItem>
            ))}
          </SuggestionsList>
        </AnalysisSection>
      )}
    </OutputContainer>
  );
};

export default ReflectionOutput;