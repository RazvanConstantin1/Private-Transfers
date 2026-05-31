import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') ?? 'VOLTLANE';
  const subtitle =
    searchParams.get('subtitle') ?? 'Premium Electric Transfers Across Romania';

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0A0A0B',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '80px',
          color: '#F5F4F0',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 48,
          }}
        >
          <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-1px' }}>
            VOLT
          </span>
          <div
            style={{
              width: 10,
              height: 10,
              background: '#7EFFA1',
              borderRadius: '50%',
            }}
          />
          <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-1px' }}>
            LANE
          </span>
        </div>
        <h1
          style={{
            fontSize: title.length > 50 ? 56 : 72,
            lineHeight: 1.0,
            margin: 0,
            maxWidth: 1000,
            fontWeight: 300,
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: 28,
            color: '#A8A8B0',
            marginTop: 32,
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 48,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              background: '#7EFFA1',
              borderRadius: '50%',
            }}
          />
          <span style={{ fontSize: 18, color: '#7EFFA1', letterSpacing: '2px' }}>
            ELECTRIC · FIXED PRICE · ENGLISH DRIVER
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
