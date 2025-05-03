// supabase/functions/hello-emotibot/index.ts
// CORRECTED VERSION - 2024-04-21

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { load } from 'https://deno.land/std@0.205.0/dotenv/mod.ts'; // Load .env file
import OpenAI from 'https://deno.land/x/openai@v4.24.0/mod.ts'; // OpenAI SDK

console.log(`Function "hello-emotibot" starting up...`);

// --- Load environment variables from .env file ---
// NOTE: This is primarily for local development convenience.
// For deployed functions, use Supabase dashboard secrets.
try {
    await load({ export: true }); // Makes vars available via Deno.env.get()
    console.log("Attempted to load .env file.");
} catch (error) {
    console.warn("Could not load .env file (this is normal if deployed):", error.message);
}

// --- Get OpenAI API Key from Environment ---
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
let openai: OpenAI | null = null;

// --- Initialize OpenAI Client ---
if (!openAIApiKey) {
  console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  console.error("!!! CRITICAL: OPENAI_API_KEY environment variable not found !!!");
  console.error("!!! Check .env file or Supabase secrets. LLM calls will fail. !!!");
  console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
} else {
  try {
    openai = new OpenAI({ apiKey: openAIApiKey });
    console.log("OpenAI client initialized successfully.");
  } catch (error) {
     console.error("Error initializing OpenAI client:", error);
     openai = null; // Ensure client is null if init fails
  }
}

// --- Main Request Handler ---
serve(async (req: Request) => {
  // Define CORS headers for all responses
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // Restrict in production
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // --- 1. Handle CORS Preflight ---
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // --- 2. Check if OpenAI client is ready ---
  if (!openai) {
    console.error("OpenAI client is not available. Cannot process LLM request.");
    return new Response(JSON.stringify({ error: 'LLM service is not configured correctly on the server.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // --- 3. Verify Request Method and Get Input Data ---
  let prompt = "";
  try {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed. Please use POST.' }), {
            status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
    }
    const body = await req.json();
    if (!body.prompt || typeof body.prompt !== 'string' || body.prompt.trim() === '') {
        throw new Error("Missing or invalid 'prompt' (string) in request body");
    }
    prompt = body.prompt;
    console.log(`Received prompt: "${prompt}"`);
  } catch (error) {
    console.error("Error processing request body:", error.message);
    // Send back specific error message if available
    return new Response(JSON.stringify({ error: error.message || 'Invalid JSON request body' }), {
      status: 400, // Bad Request
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // --- 4. Call OpenAI API ---
  let llmResponseContent = "Error: Failed to get response from LLM."; // Default error message
  try {
    console.log("Calling OpenAI API...");
    const completion = await openai.chat.completions.create({
      messages: [
        // Optional: Add a system message if needed
        // { role: "system", content: "You are EmotiBot..." },
        { role: 'user', content: prompt }
      ],
      model: 'gpt-4.1-mini', // Or 'gpt-4' etc.
    });

    llmResponseContent = completion.choices[0]?.message?.content?.trim() || "[LLM returned empty content]";
    console.log("Received LLM response successfully.");

  } catch (error) {
    console.error('Error during OpenAI API call:', error);
    // Don't send detailed error back to client, just indicate failure
    return new Response(JSON.stringify({ error: 'An error occurred while communicating with the LLM service.' }), {
      status: 502, // Bad Gateway (problem talking to upstream service)
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // --- 5. Return Successful Response ---
  const responsePayload = {
    message: "Successfully processed prompt via Edge Function.",
    received_prompt: prompt,
    llm_response: llmResponseContent,
  };

  console.log("Sending successful response back to client.");
  return new Response(
    JSON.stringify(responsePayload),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200, // OK
    }
  );
});