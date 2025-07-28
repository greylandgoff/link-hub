// QR Code generation for Cloudflare Pages Function
export async function onRequest(context) {
  const { request } = context;
  
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }
  
  if (request.method === 'POST') {
    try {
      const { url } = await request.json();
      
      if (!url) {
        return new Response(JSON.stringify({ 
          error: 'URL is required' 
        }), {
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      // Use QR Server API as a reliable external service for QR generation
      // This matches the server-side implementation's configuration
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/` + 
        `?size=512x512` +
        `&margin=2` +
        `&bgcolor=FFFFFF` +
        `&color=000000` +
        `&ecc=M` +
        `&data=${encodeURIComponent(url)}`;
      
      console.log('Generating QR code for:', url);
      
      // Fetch the QR code image
      const qrResponse = await fetch(qrApiUrl);
      
      if (!qrResponse.ok) {
        throw new Error(`QR API returned ${qrResponse.status}: ${qrResponse.statusText}`);
      }
      
      const qrImageBuffer = await qrResponse.arrayBuffer();
      
      console.log('QR code generated successfully, size:', qrImageBuffer.byteLength);
      
      return new Response(qrImageBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=3600',
          'Content-Disposition': 'inline; filename="qr-code.png"'
        }
      });
    } catch (error) {
      console.error('QR code generation error:', error);
      return new Response(JSON.stringify({ 
        error: 'Failed to generate QR code',
        details: error.message
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }
  
  return new Response('Method not allowed', { 
    status: 405,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  });
}