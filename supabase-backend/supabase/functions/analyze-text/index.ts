// supabase-backend/supabase/functions/analyze-text/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { OpenAI } from 'https://esm.sh/openai@4.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Create a debug object to track execution
  const debugInfo = {
    steps: [],
    errors: [],
    timestamps: {
      start: new Date().toISOString(),
    },
    request: {
      method: req.method,
      headers: Object.fromEntries(req.headers.entries()),
    },
  };

  try {
    // Add debug step
    debugInfo.steps.push('Starting request processing');
    
    // Get the request body
    let requestBody;
    try {
      requestBody = await req.json();
      debugInfo.steps.push('Successfully parsed request body');
      debugInfo.request.body = requestBody;
    } catch (e) {
      debugInfo.errors.push(`Failed to parse request body: ${e.message}`);
      throw new Error(`Invalid request body: ${e.message}`);
    }
    
    const { message, type } = requestBody;
    
    // Validate input
    if (!message) {
      debugInfo.errors.push('Missing message in request');
      throw new Error('Message is required');
    }
    
    if (!type || !['style', 'impact', 'result'].includes(type)) {
      debugInfo.errors.push(`Invalid analysis type: ${type}`);
      throw new Error('Type must be one of: style, impact, result');
    }
    
    debugInfo.steps.push('Input validation passed');
    
    // Initialize OpenAI
    const openAIKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIKey) {
      debugInfo.errors.push('Missing OpenAI API key');
      throw new Error('Server configuration error: Missing OpenAI API key');
    }
    
    debugInfo.steps.push('OpenAI API key found');
    
    const openAI = new OpenAI({
      apiKey: openAIKey,
    });
    
    debugInfo.steps.push('OpenAI client initialized');

    // Prepare prompt based on analysis type
    let prompt = '';
    if (type === 'style') {
      prompt = `Analyze the style of this text: "${message}" 
                Return a JSON object with:
                1. "metrics" object with numerical scores for: clarity, conciseness, formality, engagement, and complexity on a scale of 0-100.
                2. "analysis" object with detailed text explanations for each metric.
                3. "summary" string with an overall analysis of the text style.
                4. "suggestions" array with 2-3 specific, actionable suggestions to improve the style -- YOU MUST GIVE SUGGESTIONS IN THE SAME LANGUAGE THAT THE TEXT YOU ANALYZE.`;
    } else if (type === 'impact') {
      prompt = `Analyze the emotional impact of this text: "${message}" 
                Return a JSON object with:
                1. "metrics" object with numerical scores for: empathy, authority, persuasiveness, approachability, and confidence on a scale of 0-100.
                2. "analysis" object with detailed text explanations for each metric.
                3. "summary" string with an overall analysis of the emotional impact.
                4. "suggestions" array with 2-3 specific, actionable suggestions to improve the emotional impact -- YOU MUST GIVE SUGGESTIONS IN THE SAME LANGUAGE THAT THE TEXT YOU ANALYZE.`;
    } else if (type === 'result') {
      prompt = `Analyze the potential results of this message: "${message}" 
                Return a JSON object with:
                1. "metrics" object with numerical scores for: effectiveness, actionability, memorability, influence, and audience_fit on a scale of 0-100.
                2. "analysis" object with detailed text explanations for each metric.
                3. "summary" string with an overall prediction of the message's results.
                4. "suggestions" array with 2-3 specific, actionable suggestions to improve the results -- YOU MUST GIVE SUGGESTIONS IN THE SAME LANGUAGE THAT THE TEXT YOU ANALYZE.`;
    }
    
    debugInfo.steps.push('Prompt prepared');
    debugInfo.prompt = prompt;

    // Call OpenAI API
    let completion;
    debugInfo.timestamps.openai_start = new Date().toISOString();
    
    try {
      completion = await openAI.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages: [
          { role: 'system', content: 'You are an AI assistant that analyzes text and provides both metrics and detailed explanations and YOU MUST GIVE SUGGESTIONS IN THE SAME LANGUAGE THAT THE TEXT YOU ANALYZE.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' }
      });
      
      debugInfo.steps.push('OpenAI API call successful');
      debugInfo.timestamps.openai_end = new Date().toISOString();
    } catch (e) {
      debugInfo.errors.push(`OpenAI API error: ${e.message}`);
      debugInfo.timestamps.openai_error = new Date().toISOString();
      throw new Error(`Analysis service error: ${e.message}`);
    }

    // Parse the response
    let analysisResult;
    try {
      analysisResult = JSON.parse(completion.choices[0].message.content);
      debugInfo.steps.push('Successfully parsed OpenAI response as JSON');
    } catch (e) {
      debugInfo.errors.push(`Failed to parse OpenAI response: ${e.message}`);
      debugInfo.openai_response = completion?.choices[0]?.message?.content;
      throw new Error(`Invalid response format from analysis service: ${e.message}`);
    }
    
    // Validate the response structure
    if (!analysisResult.metrics) {
      analysisResult.metrics = {}; // Ensure metrics exists
      debugInfo.steps.push('Added missing metrics object to response');
    }
    
    debugInfo.steps.push('Analysis completed successfully');
    debugInfo.timestamps.end = new Date().toISOString();

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    // Add final error information
    debugInfo.errors.push(`Final error: ${error.message}`);
    debugInfo.stack = error.stack;
    debugInfo.timestamps.error = new Date().toISOString();
    
    console.error('Error in analyze-text function:', error);
    console.error('Debug information:', JSON.stringify(debugInfo, null, 2));
    
    return new Response(JSON.stringify({ 
      error: error.message,
      debug: debugInfo,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});