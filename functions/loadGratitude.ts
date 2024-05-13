import { getStore } from "@netlify/blobs";


export async function handler(req, context) {
    const noteStore = getStore({ name: 'note' });
    const id = req.queryStringParameters.id;
    try {
        let noteData = await noteStore.get(id, { type: 'json' });
        return {
            statusCode: 200,
            body: JSON.stringify(noteData),
            headers: {
                'Cache-Control': 'public, max-age=80000',
                'Netlify-Vary': 'query',
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