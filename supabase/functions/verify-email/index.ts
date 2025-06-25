/// <reference types="https://esm.sh/v135/resend@2.0.0/index.d.ts" />

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { Resend } from 'https://esm.sh/resend@2.0.0';

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Load API key securely from Supabase Edge secret
    const apiKey = Deno.env.get('RESEND_API_KEY');
    if (!apiKey) throw new Error('Missing RESEND_API_KEY');

    const { email } = await req.json();
    if (!email) throw new Error('Missing email in request body');

    const resend = new Resend(apiKey);

    const response = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Test Email from Supabase',
      html: '<p>This is a test email from Supabase + Resend.</p>',
    });

    // Validate response
    if (!response.id) {
      throw new Error('Email failed to send. No ID returned.');
    }

    return new Response(
      JSON.stringify({ success: true, data: response }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err: any) {
    console.error('verify-email error:', err);
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message || 'Unknown error',
        raw: err,
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
