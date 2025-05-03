// src/services/ai/types.ts
// Type definitions for the AI service

export type AnalysisType = 'style' | 'impact' | 'result';

export interface AnalysisResult {
  metrics: Record<string, number>;
  analysis: Record<string, string>;
  summary: string;
  suggestions: string[];
}

export interface AIProvider {
  analyze(message: string, type: AnalysisType): Promise<AnalysisResult>;
  name: string;
  isAvailable(): Promise<boolean>;
}
