import { useEffect, useState } from 'react'
import './App.css'
import PreviewCard from './components/preview-card'
import Modal from './components/input-modal';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, Bounce, toast } from 'react-toastify';

export interface Gratitude {
  for: string;
  text: string;
  tag: string;
  dateCreated: string;
  views: number;
}

interface PreviewData {
  [key: string]: {
    preview: string;
    tag: string;
  };
}

function App() {
  const [showModal, setShowModal] = useState(false);
  const [allGratitudes, setAllGratitudes] = useState<Gratitude[]>([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<PreviewData>({})


  const loadPreview = async () => {
    setLoading(true)
    const resp = await fetch('http://localhost:8888/.netlify/functions/loadPreview', { method: 'GET' });
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

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const uploadGratitide = async (gratitude: Gratitude) => {
    const err = 'Some error in saving gratitude. Pls try after some time.';

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
        gratitude: gratitude
      }


      const response: Response = await fetch('http://localhost:8888/.netlify/functions/saveGratitude', {
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
      else {
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
      }
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

  const updateAllGratitudes = async (newGratitude: Gratitude) => {
    setShowModal(false);
    await uploadGratitide(newGratitude);
  }


  return (
    <>
      <div className='header-con'>
        <h1 className='header-title'>Gratitude Globe</h1>
      </div>
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
                  <PreviewCard previewTitle={preview[key].preview} tag={preview[key].tag} />
                </div>
              ))}
            </div>
          </>}
      </div>
      <ToastContainer />
      {showModal && <Modal closeModal={closeModal} updateAllGratitudes={updateAllGratitudes} />}
    </>
  )
}

export default App
