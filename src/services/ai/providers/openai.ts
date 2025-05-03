// src/services/ai/providers/openai.ts
// OpenAI provider implementation

import { AIProvider, AnalysisType, AnalysisResult } from '../types';
import { getPromptTemplate, formatPrompt } from '../prompts';
import { supabase } from '../../../utils/supabaseClient';

export class OpenAIProvider implements AIProvider {
  name = 'OpenAI';
  private model = 'gpt-4.1-mini';
  
  async isAvailable(): Promise<boolean> {
    try {
      // You could implement a simple ping test here
      return true;
    } catch (error) {
      console.error('OpenAI availability check failed:', error);
      return false;
    }
  }
  
  setModel(model: string): void {
    this.model = model;
    console.log(`OpenAI model set to: ${model}`);
  }
  
  async analyze(message: string, type: AnalysisType): Promise<AnalysisResult> {
    // Get the appropriate prompt template
    const template = getPromptTemplate(type);
    const prompt = formatPrompt(template, message);
    
    try {
      // Call the Edge Function
      const { data, error } = await supabase.functions.invoke('analyze-text', {
        body: { message, type, model: this.model, promptOverride: prompt }
      });
      
      if (error) throw error;
      
      return data as AnalysisResult;
    } catch (error: any) {
      console.error('OpenAI analysis error:', error);
      throw error;
    }
  }
}

