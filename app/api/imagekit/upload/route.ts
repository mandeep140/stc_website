import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string;
    const folder = formData.get('folder') as string || '/images';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || '';

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64File = buffer.toString('base64');

    // Upload to ImageKit
    const uploadFormData = new FormData();
    uploadFormData.append('file', base64File);
    uploadFormData.append('fileName', fileName);
    uploadFormData.append('folder', folder);

    const auth = Buffer.from(`${privateKey}:`).toString('base64');

    const response = await fetch(`https://upload.imagekit.io/api/v1/files/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
      },
      body: uploadFormData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.message || 'Upload failed' }, { status: response.status });
    }

    return NextResponse.json({
      url: data.url,
      fileId: data.fileId,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
