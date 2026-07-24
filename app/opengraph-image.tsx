import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const alt =
  'jonny.design — Jonny, founding designer and head of design at Supabase';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';
export const runtime = 'nodejs';

export default async function OpenGraphImage() {
  const fontBuffer = await readFile(
    join(process.cwd(), 'public/fonts/ABCOracle-Light-Trial.woff')
  );
  const fontData = fontBuffer.buffer.slice(
    fontBuffer.byteOffset,
    fontBuffer.byteOffset + fontBuffer.byteLength
  ) as ArrayBuffer;

  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          width: '100%',
          height: '100%',
          background: '#f7f7f4',
          color: '#26251e',
          fontFamily: 'ABC Oracle',
          fontSize: 28,
          fontWeight: 300,
          letterSpacing: '-0.01em',
          lineHeight: 1.4,
        }}
      >
        <div
            style={{
              position: 'absolute',
              left: 390,
              top: 190,
              display: 'flex',
              width: 420,
              flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              position: 'relative',
              display: 'flex',
              width: 44,
              height: 42,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 6,
                top: 0,
                width: 32,
                height: 24,
                border: '1.5px solid rgba(38, 37, 30, 0.52)',
                background: '#f7f7f4',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 10,
                top: 18,
                width: 24,
                height: 24,
                border: '1.5px solid rgba(38, 37, 30, 0.52)',
                background: '#f7f7f4',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 6,
                top: 12,
                width: 32,
                height: 24,
                border: '1.5px solid rgba(38, 37, 30, 0.78)',
                background: '#f7f7f4',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 2,
                top: 6,
                width: 40,
                height: 24,
                border: '1.5px solid #26251e',
                background: '#f7f7f4',
              }}
            />
          </div>

          <div style={{ display: 'flex', marginTop: 44 }}>
            hello, i&apos;m jonny
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: 16,
            }}
          >
            <div style={{ display: 'flex' }}>
              founding designer at supabase
            </div>
            <div style={{ display: 'flex', color: '#787670' }}>
              currently head of design
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'ABC Oracle',
          data: fontData,
          weight: 300,
          style: 'normal',
        },
      ],
    }
  );
}
