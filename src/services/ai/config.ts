// src/services/ai/config.ts
// Configuration service for the AI providers

import { AIProvider } from './types';
import { OpenAIProvider } from './providers/openai';
import { AnthropicProvider } from './providers/anthropic';
// import { GoogleProvider } from './providers/google';

// Default provider
let currentProvider: AIProvider = new OpenAIProvider();

// Available providers
const providers = {
  openai: new OpenAIProvider(),
  anthropic: new AnthropicProvider(),
  // google: new GoogleProvider(),
};

export const setAIProvider = (providerName: string, options?: any): boolean => {
  if (providerName in providers) {
    currentProvider = providers[providerName as keyof typeof providers];
    
    // Apply any provider-specific options
    if (options && 'model' in options) {
      (currentProvider as any).setModel(options.model);
    }
    
    console.log(`AI provider set to: ${currentProvider.name}`);
    return true;
  }
  
  console.error(`Provider ${providerName} not available`);
  return false;
};

export const getCurrentProvider = (): AIProvider => {
  return currentProvider;
};

