import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import { Resend } from 'npm:resend@2.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, subject, notes, burnPlanHtml, costSummaryHtml } = await req.json();

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { 
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .notes {
              margin: 20px 0;
              padding: 15px;
              background-color: #f8f9fa;
              border-left: 4px solid #4a5568;
              border-radius: 4px;
            }
            table { 
              border-collapse: collapse; 
              width: 100%;
              margin: 20px 0;
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 12px 8px; 
              text-align: left; 
            }
            th { 
              background-color: #f8f9fa;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          ${notes ? `
            <div class="notes">
              <h3>Additional Notes:</h3>
              <p>${notes.replace(/\n/g, '<br>')}</p>
            </div>
          ` : ''}
          ${burnPlanHtml}
          ${costSummaryHtml}
        </body>
      </html>
    `;

    await resend.emails.send({
      from: 'noreply@yourdomain.com',
      to: email,
      subject: subject,
      html: emailHtml,
    });

    return new Response(
      JSON.stringify({ message: 'Email sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});