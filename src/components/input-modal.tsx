import { useState } from "react";
import { Gratitude } from "../App";

interface Props {
    closeModal: () => void;
    updateAllGratitudes: (newGratitude: Gratitude) => void;
}

const tagList = [
    {
        "name": "Family",
        "color": "#ADD8E6"
    },
    {
        "name": "Friends",
        "color": "#90EE90"
    },
    {
        "name": "Colleagues",
        "color": "#D3D3D3"
    },
    {
        "name": "Mentors",
        "color": "#E6E6FA"
    },
    {
        "name": "Strangers",
        "color": "#FFFFE0"
    },
    {
        "name": "Community Helpers",
        "color": "#FFB6C1"
    },
    {
        "name": "Nature/Environment",
        "color": "#AFEEEE"
    },
    {
        "name": "Personal Achievements",
        "color": "#FFDAB9"
    },
    {
        "name": "Random",
        "color": "#ccafee"
    }
]


const Modal = ({ closeModal, updateAllGratitudes }: Props) => {
    const [inp, setInp] = useState('');
    const [gratitudeFor, setGratitudeFor] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [err, setErr] = useState('');

    const saveGratitude = () => {
        if (!inp || !gratitudeFor) {
            setErr('Please complete the input to continue');
            return;
        } else {
            setErr('');
        }

        const date = new Date().toUTCString();
        const gratitude: Gratitude = {
            text: inp,
            for: gratitudeFor,
            tag: selectedTag !== '' ? selectedTag : 'Random',
            dateCreated: date,
            views: 0
        }

        // add to local state
        // send to storage
        updateAllGratitudes(gratitude);
    }

    const handleCloseModal = () => {
        setErr('');
        closeModal();
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={handleCloseModal}>&times;</span>
                <label htmlFor="gratitude">Gratitude for:</label>
                <input id="for" onChange={(e) => setGratitudeFor(e.target.value)}></input>
                <label htmlFor="gratitude">Add your message:</label>
                <textarea id="gratitude" rows={4} onChange={(e) => setInp(e.target.value)}></textarea>
                <label htmlFor="gratitude">Tag:</label>
                <div className="tag-container">
                    {tagList.map((tag) => (
                        <div
                            key={tag.name}
                            className={`tag ${selectedTag === tag.name ? 'selected-tag' : ''}`}
                            style={{ backgroundColor: tag.color }}
                            onClick={() => {
                                setSelectedTag(tag.name);
                            }}>
                            {tag.name}
                        </div>
                    ))}
                </div>
                {err && <p style={{ color: 'red' }}>{err}</p>}
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <button onClick={handleCloseModal} className='modal-button'>Close</button>
                    <button className='modal-button modal-submit' onClick={saveGratitude}>Submit</button>
                </div>
            </div>
        </div>
    );
}

export default Modal;
