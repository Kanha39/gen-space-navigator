import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reportText } = await req.json();
    
    if (!reportText) {
      return new Response(
        JSON.stringify({ error: 'Report text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Editing report with OpenAI...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert scientific editor specializing in space biology research reports for NASA Space Apps Challenge.

Your task is to refine the report into a clear, professional, well-structured version suitable for judges.

Edit for:
- Clarity and academic tone
- Smooth transitions and concise language
- Proper formatting (headings, bullet lists, numbered points)
- Consistent terminology
- Preservation of all facts and data

CRITICAL: Do NOT remove any factual information, data, or statistics. Only enhance readability and professional presentation.

Return the edited report in the same format as the input (preserve HTML structure if present).`
          },
          {
            role: 'user',
            content: reportText
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to edit report with AI' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const editedText = data.choices[0].message.content;

    console.log('Report edited successfully');

    return new Response(
      JSON.stringify({ editedText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in edit-report function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
