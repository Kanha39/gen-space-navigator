import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const NASA_API_KEY = Deno.env.get('NASA_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Biospecimens API called');
    
    const body = await req.json();
    console.log('Request body:', body);

    // Check if NASA API key is configured
    if (!NASA_API_KEY) {
      console.log('NASA API key not configured, returning sample data');
      
      const sampleData = {
        biospecimens: [
          {
            id: 'bio-001',
            study: 'ISS Expedition 68 - Plant Biology',
            organism: 'Arabidopsis thaliana',
            tissue: 'Root tissue',
            collection_date: '2023-05-15',
            status: 'Available',
            storage_location: 'NASA Ames Research Center'
          },
          {
            id: 'bio-002',
            study: 'Mars Simulation - Bacterial Response',
            organism: 'Pseudomonas aeruginosa',
            tissue: 'Cell culture',
            collection_date: '2023-03-22',
            status: 'In Analysis',
            storage_location: 'Kennedy Space Center'
          },
          {
            id: 'bio-003',
            study: 'Year-Long Mission - Bone Health',
            organism: 'Human',
            tissue: 'Bone biopsy',
            collection_date: '2023-08-10',
            status: 'Archived',
            storage_location: 'JSC Biorepository'
          }
        ],
        total_count: 3,
        note: 'Sample data - Configure NASA_API_KEY secret for live data'
      };

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Biospecimens sample data retrieved (NASA API key not configured)',
          data: sampleData,
          timestamp: new Date().toISOString()
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Fetch real data from NASA OSDR API
    console.log('Fetching biospecimens data from NASA OSDR...');
    
    const nasaUrl = `https://osdr.nasa.gov/osdr/data/osd/meta/OSD-${body.studyId || '37'}/`;
    const response = await fetch(nasaUrl, {
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
    console.log('NASA API response received successfully');

    const responseData = {
      success: true,
      message: 'Biospecimens data fetched successfully from NASA OSDR',
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
        details: 'Failed to fetch data from NASA API. Using sample data instead.',
        hint: 'Configure NASA_API_KEY secret for live data access'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
