import { getStore } from "@netlify/blobs";

export async function handler(req, context) {
  const previewStore = getStore({ name: 'preview' });

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