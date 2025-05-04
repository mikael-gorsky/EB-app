// src/config/analysisConfig.ts
export const analysisConfig = {
  types: {
    style: {
      title: 'Style (Clarity and Tone)',
      description: 'How your message is composed and presented',
      metrics: [
        { id: 'clearness', label: 'Clearness', description: 'How easy it is to understand the message' },
        { id: 'emotion', label: 'Emotion', description: 'The emotional tone and sentiment of the message' },
        { id: 'focus', label: 'Focus', description: 'How well the message stays on topic' },
        { id: 'respect', label: 'Respect', description: 'How polite and considerate the message appears' },
        { id: 'warmth', label: 'Warmth', description: 'The level of friendliness and approachability' }
      ]
    },
    impact: {
      title: 'Impact (Connection and Influence)',
      description: 'How your message affects the reader',
      metrics: [
        { id: 'empathy', label: 'Empathy', description: 'How well the message relates to the reader\'s situation' },
        { id: 'inspiration', label: 'Inspiration', description: 'How motivating or uplifting the message is' },
        { id: 'authority', label: 'Authority', description: 'How confident and knowledgeable the author appears' },
        { id: 'persuasiveness', label: 'Persuasiveness', description: 'How likely the message is to change someone\'s mind' },
        { id: 'sincerity', label: 'Sincerity', description: 'How authentic and genuine the message comes across' }
      ]
    },
    outcome: {
      title: 'Outcome (Outcome and Action)',
      description: 'The expected results of your message',
      metrics: [
        { id: 'effectiveness', label: 'Effectiveness', description: 'How well the message achieves its intended purpose' },
        { id: 'actionability', label: 'Actionability', description: 'How clear the next steps are to the reader' },
        { id: 'memorability', label: 'Memorability', description: 'How likely the message is to be remembered' },
        { id: 'solution', label: 'Solution', description: 'How well the message addresses a problem or need' },
        { id: 'influence', label: 'Influence', description: 'The degree of impact on the reader\'s future decisions' }
      ]
    }
  }
};

// Helper functions to make working with the config easier
export const getAnalysisTypeInfo = (type: string) => {
  return analysisConfig.types[type as keyof typeof analysisConfig.types] || null;
};

export const getMetricsForType = (type: string) => {
  const typeInfo = getAnalysisTypeInfo(type);
  return typeInfo ? typeInfo.metrics : [];
};

export const getMetricIds = (type: string) => {
  return getMetricsForType(type).map(metric => metric.id);
};