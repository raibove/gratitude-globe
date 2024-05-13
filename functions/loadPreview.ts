import { connectLambda, getStore } from "@netlify/blobs";

export async function handler(req, context) {
  connectLambda(req)
  const previewStore = getStore('preview');

  try {
    let previewData = await previewStore.get('all', { type: 'json' });
    return {
      statusCode: 200,
      body: JSON.stringify(previewData),
      headers: {
        'Cache-Control': 'public, max-age=100, must-revalidate',
      }
    };
  } catch (e) {
    console.log(e)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error saving gratitude" })
    };
  }
}