import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { filename: string } }
) {
  // Use Promise.resolve to await the params object which is a Next.js 15+ requirement
  const resolvedParams = await Promise.resolve(params);
  
  const html = `
    <!DOCTYPE html>
    <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pratinjau Dokumen - ${resolvedParams.filename}</title>
        <style>
          body { 
            font-family: 'Inter', system-ui, -apple-system, sans-serif; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            height: 100vh; 
            background: #f3f4f6; 
            margin: 0; 
          }
          .doc-container { 
            background: white; 
            padding: 40px; 
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05); 
            border-radius: 12px; 
            text-align: center; 
            max-width: 600px; 
            width: 90%; 
            border-top: 6px solid #0ea5e9;
          }
          h1 { color: #111827; font-size: 1.5rem; margin-bottom: 1rem; word-break: break-all; }
          p { color: #4b5563; line-height: 1.6; }
          .badge {
            display: inline-block;
            background-color: #dcfce7;
            color: #166534;
            padding: 6px 12px;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 600;
            margin-top: 1rem;
          }
          .icon {
            font-size: 3rem;
            margin-bottom: 1rem;
          }
        </style>
      </head>
      <body>
        <div class="doc-container">
          <div class="icon">📄</div>
          <h1>${resolvedParams.filename}</h1>
          <p>Ini adalah halaman pratinjau dokumen simulasi. Dalam lingkungan produksi, halaman ini akan menampilkan file PDF asli (seperti STR Dokter atau SIA Apotek) yang diunggah oleh pendaftar.</p>
          <div class="badge">✓ Terverifikasi Otomatis oleh Sistem</div>
        </div>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
