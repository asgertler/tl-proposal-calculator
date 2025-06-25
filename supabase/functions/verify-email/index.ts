import { Resend } from 'npm:resend@2.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify API key is present
    const apiKey = Deno.env.get('RESEND_API_KEY');
    if (!apiKey) {
      throw new Error('Missing Resend API key');
    }

    const { email } = await req.json();

    // Test the API key with a simple validation request
    const response = await resend.emails.send({
      from: 'test@yourdomain.com',
      to: email,
      subject: 'API Key Verification Test',
      html: '<p>This email confirms that your Resend API key is working correctly.</p>',
    });

    if (!response.id) {
      throw new Error('Invalid API key or API response');
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'API key verified successfully',
        data: response,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Email verification error:', error);

    let errorMessage = 'Failed to verify email configuration';
    let statusCode = 400;

    // Check for specific error types
    if (error.message.includes('API key')) {
      errorMessage = 'Invalid or missing API key';
      statusCode = 401;
    } else if (error.message.includes('rate limit')) {
      errorMessage = 'Rate limit exceeded';
      statusCode = 429;
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        details: error.response || error.message,
      }),
      {
        status: statusCode,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
