import { getStore } from "@netlify/blobs";
import { v4 as uuidv4 } from 'uuid';

const siteID = 'f78e5d38-3d21-4ec3-a98d-e0b3ee90843c';

export async function handler(req, context) {
    const body = JSON.parse(req.body);
    const id = uuidv4();
    
    const noteStore = getStore({ name: 'note', siteID: siteID, token: token });
    const previewStore = getStore({name: 'preview', siteID: siteID, token: token});

    try {
        const gratitude = body.gratitude;
        noteStore.setJSON(id, gratitude)
        let previewData = await previewStore.get('all', {type: 'json'});
        if(!previewData){
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
    } catch (e){
        console.log(e)
        return {
          statusCode: 500,
          body: JSON.stringify({ message: "Error saving gratitude" })
        };  
    }
}