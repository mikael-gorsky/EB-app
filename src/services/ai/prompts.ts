// src/services/ai/prompts.ts
// Prompt template manager

import { AnalysisType } from './types';

// Default prompt templates
const promptTemplates: Record<AnalysisType, string> = {
  style: `Analyze the style of this text: "{message}" 
          Return a JSON object with:
          1. "metrics" object with numerical scores for: clarity, conciseness, formality, engagement, and complexity on a scale of 0-100.
          2. "analysis" object with detailed text explanations for each metric.
          3. "summary" string with an overall analysis of the text style.
          4. "suggestions" array with 2-3 specific, actionable suggestions to improve the style -- YOU MUST GIVE SUGGESTIONS IN THE SAME LANGUAGE THAT THE TEXT YOU ANALYZE.`,
  
  impact: `Analyze the emotional impact of this text: "{message}" 
           Return a JSON object with:
           1. "metrics" object with numerical scores for: empathy, authority, persuasiveness, approachability, and confidence on a scale of 0-100.
           2. "analysis" object with detailed text explanations for each metric.
           3. "summary" string with an overall analysis of the emotional impact.
           4. "suggestions" array with 2-3 specific, actionable suggestions to improve the emotional impact -- YOU MUST GIVE SUGGESTIONS IN THE SAME LANGUAGE THAT THE TEXT YOU ANALYZE.`,
  
  result: `Analyze the potential results of this message: "{message}" 
           Return a JSON object with:
           1. "metrics" object with numerical scores for: effectiveness, actionability, memorability, influence, and audience_fit on a scale of 0-100.
           2. "analysis" object with detailed text explanations for each metric.
           3. "summary" string with an overall prediction of the message's results.
           4. "suggestions" array with 2-3 specific, actionable suggestions to improve the results -- YOU MUST GIVE SUGGESTIONS IN THE SAME LANGUAGE THAT THE TEXT YOU ANALYZE.`
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

