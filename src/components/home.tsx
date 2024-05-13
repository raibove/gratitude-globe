import { useEffect, useState } from "react";
import { BASE_URL, Gratitude, PreviewData } from "../App";
import Modal from "./input-modal";
import PreviewCard from "./preview-card";
import { Bounce, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { Link } from "react-router-dom";

const Home = () => {
    const [showModal, setShowModal] = useState(false);
    const [allGratitudes, setAllGratitudes] = useState<Gratitude[]>([]);
    const [preview, setPreview] = useState<PreviewData>({})
    const [loading, setLoading] = useState(false);

    const loadPreview = async () => {
        setLoading(true)
        const resp = await fetch(`${BASE_URL}/.netlify/functions/loadPreview`, { method: 'GET' });
        if (!resp.ok) {
            toast.error('Error loading preview. PLease try againg', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            setLoading(false)
            return;
        }

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
        console.log(result);
        setPreview(JSON.parse(result));
    }

    useEffect(() => {
        loadPreview();
    }, [])

    const uploadGratitide = async (gratitude: Gratitude) => {
        const err = 'Some error in saving gratitude. Pls try after some time.';
        const id = uuidv4();

        try {
            toast.info('Saving your gratitude', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
            const payload = {
                gratitude: gratitude,
                id: id
            }

            const response: Response = await fetch(`${BASE_URL}/.netlify/functions/saveGratitude`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Specify that the content type is JSON
                },
                body: JSON.stringify(payload) // Convert the payload object to a JSON string
            });
            console.log(response.ok)
            if (!response.ok) {
                throw Error();
            }
            toast.success('Gratitude uploaded successfully', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            setAllGratitudes([gratitude, ...allGratitudes]);
            const newPrev = {
                preview: gratitude.for,
                tag: gratitude.tag
            }
            setPreview({ ...preview, [id]: newPrev });
        } catch (error) {
            toast.error(err, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            console.error('Error submitting form:', error);
        }
    }

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const updateAllGratitudes = async (newGratitude: Gratitude) => {
        setShowModal(false);
        await uploadGratitide(newGratitude);
    }

    return (
        <>
            <div style={{ margin: '30px' }}>
                <div className='prompt-container'>
                    <h2 className='gratitude-prompt'>Take a moment to reflect on the people or things that have made a positive impact on your life.</h2>
                    <button onClick={openModal}>Spread some gratitude</button>
                </div>
                {loading ?
                    <p>Loading...</p> :
                    <>
                        <h2 style={{ marginTop: '20px', marginBottom: 0, padding: 0 }}>Some Gratitude left by others:</h2>
                        <div className='preview-card-con'>
                            {Object.keys(preview).map((key) => (
                                <div key={key}>
                                    <Link to={key}>
                                        <PreviewCard previewTitle={preview[key].preview} tag={preview[key].tag} />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </>}
            </div>
            {showModal && <Modal closeModal={closeModal} updateAllGratitudes={updateAllGratitudes} />}
        </>
    )
}

export default Home;