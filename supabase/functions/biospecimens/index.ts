import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const NASA_API_KEY = Deno.env.get('NASA_API_KEY');
const NASA_API_URL = 'https://osdr.nasa.gov/osdr/data/osd/files/';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Biospecimens API called');
    
    const body = await req.json();
    console.log('Request body:', body);

    // Fetch real data from NASA OSDR API
    console.log('Fetching biospecimens data from NASA...');
    
    const response = await fetch(`${NASA_API_URL}?key=${NASA_API_KEY}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      console.error('NASA API error:', response.status, response.statusText);
      throw new Error(`NASA API returned ${response.status}: ${response.statusText}`);
    }

    const nasaData = await response.json();
    console.log('NASA API response received:', nasaData);

    const responseData = {
      success: true,
      message: 'Biospecimens data fetched successfully from NASA',
      data: nasaData,
      metadata: {
        source: 'NASA Open Science Data Repository',
        timestamp: new Date().toISOString(),
        requestBody: body
      }
    };

    return new Response(
      JSON.stringify(responseData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in biospecimens function:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        details: 'Failed to fetch data from NASA API. Please check API key and endpoint.'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
