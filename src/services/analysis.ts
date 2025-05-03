// src/services/analysis.ts
import { supabase } from '../utils/supabaseClient';

export const analyzeText = async (message: string, type: 'style' | 'impact' | 'result') => {
  try {
    console.log(`Calling analyze-text function with message: ${message.substring(0, 30)}... and type: ${type}`);
    
    const { data, error } = await supabase.functions.invoke('analyze-text', {
      body: { message, type }
    });
    
    if (error) {
      console.error('Error from analyze-text function:', error);
      throw error;
    }
    
    console.log('Analysis result received:', data);
    return data;
  } catch (error: any) {
    console.error('Error analyzing text:', error.message || error);
    throw error;
  }
};

export const saveAnalysisResult = async (messageId: string, type: string, metrics: any) => {
  try {
    console.log(`Saving analysis result for message: ${messageId}, type: ${type}`);
    
    const { error } = await supabase
      .from('analysis_results')
      .insert({
        message_id: messageId,
        type,
        metrics
      });
      
    if (error) {
      console.error('Error saving analysis result:', error);
      throw error;
    }
    
    console.log('Analysis result saved successfully');
    return true;
  } catch (error: any) {
    console.error('Error saving analysis result:', error.message || error);
    throw error;
  }
};