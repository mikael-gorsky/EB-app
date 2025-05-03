// src/services/analysis.ts
import { supabase } from './supabase';

export const analyzeText = async (message: string, type: 'style' | 'impact' | 'result') => {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-text', {
      body: { message, type }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error analyzing text:', error);
    throw error;
  }
};

export const saveAnalysisResult = async (messageId: string, type: string, metrics: any) => {
  try {
    const { error } = await supabase
      .from('analysis_results')
      .insert({
        message_id: messageId,
        type,
        metrics
      });
      
    if (error) throw error;
  } catch (error) {
    console.error('Error saving analysis result:', error);
    throw error;
  }
};