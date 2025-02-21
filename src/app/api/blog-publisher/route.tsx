import { mastra } from '@/mastra';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { topic } = await req.json();

  const result = await mastra
    .getAgent("blogPublisherAgent")
    .generate(`Write a blog post about ${topic}. Return only the final edited child-friendly copy.`);

  console.log('Blog publisher result:', result.text);

  return Response.json({
    message: result.text,
  });
}