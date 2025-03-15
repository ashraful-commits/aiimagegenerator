import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const client = new OpenAI({
  baseURL: 'https://api.studio.nebius.com/v1/',
  apiKey: process.env.OPENAI_API_KEY, 
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const response = await client.images.generate({
      model: 'black-forest-labs/flux-dev',
      response_format: 'b64_json',
      prompt: prompt,
      size: '1024x1024',
      quality: 'standard',
      n: 1,
    });

    if (!response.data || !response.data[0]?.b64_json) {
      return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
    }

    return NextResponse.json({ imageUrl: response.data[0].b64_json });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}