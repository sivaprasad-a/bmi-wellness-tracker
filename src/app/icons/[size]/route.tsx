import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';
export const dynamicParams = false;

const VARIANTS: Record<string, { size: number; maskable: boolean }> = {
  '180': { size: 180, maskable: false },
  '192': { size: 192, maskable: false },
  '512': { size: 512, maskable: false },
  'maskable-512': { size: 512, maskable: true },
};

export function generateStaticParams() {
  return Object.keys(VARIANTS).map((size) => ({ size }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ size: string }> }) {
  const { size: key } = await params;
  const variant = VARIANTS[key];
  if (!variant) return new Response('Not found', { status: 404 });
  const { size, maskable } = variant;
  const inner = maskable ? size * 0.62 : size * 0.86;

  return new ImageResponse(
    (
      <div
        style={{
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: maskable ? '#0F7657' : 'transparent',
        }}
      >
        <div
          style={{
            width: inner,
            height: inner,
            borderRadius: maskable ? inner / 2 : inner * 0.24,
            background: 'linear-gradient(135deg, #12a374 0%, #0F7657 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          <div style={{ fontSize: inner * 0.34, fontWeight: 800, letterSpacing: -inner * 0.01 }}>BMI</div>
          <div
            style={{
              marginTop: inner * 0.04,
              width: inner * 0.56,
              height: inner * 0.06,
              borderRadius: inner * 0.03,
              background: 'linear-gradient(90deg, #60a5fa, #4ade80, #facc15, #f87171)',
            }}
          />
        </div>
      </div>
    ),
    { width: size, height: size },
  );
}
