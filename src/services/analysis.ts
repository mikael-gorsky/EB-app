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

// Note: We don't need a separate saveAnalysisResult function as we're handling
// that directly in the ReflectPage111.tsx component now