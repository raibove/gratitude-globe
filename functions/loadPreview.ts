import { getStore } from "@netlify/blobs";

const siteID = 'f78e5d38-3d21-4ec3-a98d-e0b3ee90843c';

export async function handler(req, context) {
    const previewStore = getStore({name: 'preview', siteID: siteID, token: token});

    try {
        let previewData = await previewStore.get('all', {type: 'json'});
        return {
            statusCode: 200,
            body: JSON.stringify(previewData)
          };  
    } catch (e){
        console.log(e)
        return {
          statusCode: 500,
          body: JSON.stringify({ message: "Error saving gratitude" })
        };  
    }
}