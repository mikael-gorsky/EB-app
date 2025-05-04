// src/services/ai/prompts.ts
// Prompt template manager

import { AnalysisType } from './types';

// Updated prompt templates for new structure
const promptTemplates: Record<AnalysisType, string> = {
  style: `Analyze the style (clarity and tone) of this text: "{message}" 
          Return a JSON object with:
          1. "metrics" object with numerical scores for: clearness, emotion, focus, respect, and warmth on a scale of 0-100.
          2. "analysis" object with detailed text explanations for each metric.
          3. "summary" string with an overall analysis of the text style.
          4. "suggestions" array with 2-3 specific, actionable suggestions to improve the style -- YOU MUST GIVE SUGGESTIONS IN THE SAME LANGUAGE THAT THE TEXT YOU ANALYZE.`,
  
  impact: `Analyze the impact (connection and influence) of this text: "{message}" 
           Return a JSON object with:
           1. "metrics" object with numerical scores for: empathy, inspiration, authority, persuasiveness, and sincerity on a scale of 0-100.
           2. "analysis" object with detailed text explanations for each metric.
           3. "summary" string with an overall analysis of the emotional impact.
           4. "suggestions" array with 2-3 specific, actionable suggestions to improve the impact -- YOU MUST GIVE SUGGESTIONS IN THE SAME LANGUAGE THAT THE TEXT YOU ANALYZE.`,
  
  outcome: `Analyze the potential outcome (outcome and action) of this message: "{message}" 
           Return a JSON object with:
           1. "metrics" object with numerical scores for: effectiveness, actionability, memorability, solution, and influence on a scale of 0-100.
           2. "analysis" object with detailed text explanations for each metric.
           3. "summary" string with an overall prediction of the message's outcomes.
           4. "suggestions" array with 2-3 specific, actionable suggestions to improve the outcomes -- YOU MUST GIVE SUGGESTIONS IN THE SAME LANGUAGE THAT THE TEXT YOU ANALYZE.`
};

export const getPromptTemplate = (type: AnalysisType): string => {
  return promptTemplates[type] || promptTemplates.style;
};

export const setPromptTemplate = (type: AnalysisType, template: string): void => {
  promptTemplates[type] = template;
};

export const formatPrompt = (template: string, message: string): string => {
  return template.replace('{message}', message);
};