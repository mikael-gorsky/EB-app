// src/services/ai/analyzeText.ts
// Main function used by the application

import { AnalysisType, AnalysisResult } from './types';
import { getCurrentProvider } from './config';
import { getPromptTemplate, formatPrompt } from './prompts';

export const analyzeText = async (message: string, type: AnalysisType): Promise<AnalysisResult> => {
  try {
    console.log(`Analyzing text with type: ${type}`);
    
    const provider = getCurrentProvider();
    console.log(`Using provider: ${provider.name}`);
    
    // Check if provider is available
    const available = await provider.isAvailable();
    if (!available) {
      throw new Error(`AI provider ${provider.name} is not available`);
    }
    
    return await provider.analyze(message, type);
  } catch (error: any) {
    console.error('Error analyzing text:', error.message || error);
    throw error;
  }
};

