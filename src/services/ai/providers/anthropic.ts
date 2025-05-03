// src/services/ai/providers/anthropic.ts
// Anthropic provider implementation

import { AIProvider, AnalysisType, AnalysisResult } from '../types';
import { getPromptTemplate, formatPrompt } from '../prompts';
import { supabase } from '../../../utils/supabaseClient';

export class AnthropicProvider implements AIProvider {
  name = 'Anthropic';
  private model = 'claude-3-5-sonnet';
  
  async isAvailable(): Promise<boolean> {
    try {
      // You could implement a simple ping test here
      return true;
    } catch (error) {
      console.error('Anthropic availability check failed:', error);
      return false;
    }
  }
  
  setModel(model: string): void {
    this.model = model;
    console.log(`Anthropic model set to: ${model}`);
  }
  
  async analyze(message: string, type: AnalysisType): Promise<AnalysisResult> {
    // Get the appropriate prompt template
    const template = getPromptTemplate(type);
    const prompt = formatPrompt(template, message);
    
    try {
      // Call a different Edge Function for Anthropic
      // You'll need to create this function in Supabase
      const { data, error } = await supabase.functions.invoke('analyze-text-anthropic', {
        body: { message, type, model: this.model, promptOverride: prompt }
      });
      
      if (error) throw error;
      
      return data as AnalysisResult;
    } catch (error: any) {
      console.error('Anthropic analysis error:', error);
      throw error;
    }
  }
}