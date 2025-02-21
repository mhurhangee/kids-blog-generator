import { mastra } from '@/mastra';

// Allow streaming responses up to 5 minutes
export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    const maxRetries = 1;
    let attempt = 0;
    let lastError;

    while (attempt < maxRetries) {
      try {
        const result = await mastra
          .getAgent("blogPublisherAgent")
          .generate(`Write a blog post about ${topic}. Return only the final edited child-friendly copy.`);

        console.log('Blog publisher result:', result.text);

        return Response.json({
          message: result.text,
        });
      } catch (error) {
        lastError = error;
        attempt++;
        if (attempt < maxRetries) {
          // Wait for 1 second before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    console.error('Blog publisher error after retries:', lastError);
    return Response.json(
      { error: 'Failed to generate blog post. Please try again.' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Blog publisher request error:', error);
    return Response.json(
      { error: 'Invalid request or server error' },
      { status: 400 }
    );
  }
}