import { evaluateCode } from './evaluate';

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle OPTIONS request (CORS preflight)
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Route handling
  if (path === '/api/evaluate' && request.method === 'POST') {
    return handleEvaluate(request, context, corsHeaders);
  }

  // Default response for unmatched routes
  return new Response('Not found', {
    status: 404,
    headers: corsHeaders,
  });
}

async function handleEvaluate(request, context, corsHeaders) {
  try {
    const body = await request.json();
    const { code, lessonId, output } = body;

    if (!code) {
      return new Response(
        JSON.stringify({ error: true, message: 'Code is required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Get API key from environment variable
    const apiKey = context.env.REQUESTY_API_KEY;
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ 
          error: true, 
          message: 'API key is not configured. Please set the REQUESTY_API_KEY environment variable.' 
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Evaluate the code
    const evaluation = await evaluateCode(code, lessonId, output, apiKey);

    return new Response(JSON.stringify(evaluation), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: true,
        message: `Error processing request: ${error.message}`,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
}