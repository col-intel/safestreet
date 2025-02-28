import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Get query parameters with defaults
    const title = searchParams.get('title') || 'Rua Segura Porto';
    const description = searchParams.get('description') || 'Plataforma cidadã para segurança viária no Porto';
    const type = searchParams.get('type') || 'default';
    
    // Generate the image
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#0f172a',
            backgroundImage: 'radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1e293b 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            padding: '80px 40px',
            textAlign: 'center',
            position: 'relative',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Border */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              right: '20px',
              bottom: '20px',
              border: '2px dashed #3b82f6',
              borderRadius: '10px',
              zIndex: 0,
            }}
          />
          
          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
              padding: '0 40px',
            }}
          >
            {/* Logo */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                backgroundColor: '#1e293b',
                marginBottom: '40px',
              }}
            >
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="#0f172a"
                />
              </svg>
            </div>
            
            {/* Title */}
            <h1
              style={{
                fontSize: '60px',
                fontWeight: 'bold',
                color: 'white',
                margin: '0 0 20px 0',
                lineHeight: 1.2,
              }}
            >
              {title}
            </h1>
            
            {/* Description */}
            <p
              style={{
                fontSize: '30px',
                color: '#94a3b8',
                margin: 0,
                maxWidth: '800px',
              }}
            >
              {description}
            </p>
          </div>
          
          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 'calc(100% - 80px)',
            }}
          >
            <p
              style={{
                fontSize: '24px',
                color: '#3b82f6',
                margin: 0,
              }}
            >
              www.ruasegura.pt
            </p>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Error generating image', { status: 500 });
  }
} 