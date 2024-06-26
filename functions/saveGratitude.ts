import { connectLambda, getStore } from "@netlify/blobs";

export async function handler(req, context) {
    connectLambda(req)
    const body = JSON.parse(req.body);

    const noteStore = getStore('note1');
    const previewStore = getStore('preview1');

    try {
        const id = body.id;
        const gratitude = body.gratitude;
        noteStore.setJSON(id, gratitude)
        let previewData = await previewStore.get('all', { type: 'json' });
        if (!previewData) {
            previewData = {}
        }
        const previewInp = {
            preview: gratitude.for,
            tag: gratitude.tag
        }
        previewData[id] = previewInp;
        previewStore.setJSON('all', previewData)

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "saved gratitude" })
        };
    } catch (e) {
        console.log(e)
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error saving gratitude" })
        };
    }
}