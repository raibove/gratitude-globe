import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL, Gratitude } from "../App";

const Note = () => {
    let { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [note, setNote] = useState<Gratitude | null>(null);

    const fetchNote = async () => {
        setLoading(true);

        const resp = await fetch(`${BASE_URL}/.netlify/functions/loadGratitude?id=${id}`, { method: 'GET' });
        const reader = resp.body?.getReader()
        if (!reader) {
            setLoading(false)
            return;
        }

        const decoder = new TextDecoder('utf-8');
        let chunk = await reader.read();
        let result = '';

        while (!chunk.done) {
            const data = decoder.decode(chunk.value, { stream: true });
            result += data;
            chunk = await reader.read();
        }
        setLoading(false);
        const nt = JSON.parse(result);
        const date = new Date(nt.dateCreated);
        const formattedDate = date.toLocaleDateString('en-US',  { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
        console.log(formattedDate, nt)
        nt.dateCreated = formattedDate;
        setNote(nt);
    }
    useEffect(() => {
        fetchNote();
    }, [])

    return (
        <div>
            {loading && <p>Loading...</p>}
            {note && (
                <div className="note-con">
                    <p className="note-for">{note.for}</p>
                    <p className="note-text">{note.text}</p>
                    <p>Date added: {note.dateCreated}</p>
                </div>
            )}
        </div>
    )
}

export default Note;