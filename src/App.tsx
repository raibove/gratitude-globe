import { useState } from 'react'
import './App.css'
import PreviewCard from './components/preview-card'
import Modal from './components/input-modal';

export interface Gratitude{
  for: string;
  text: string;
  tag: string;
  dateCreated: string;
  views: number;
}

function App() {
  const [showModal, setShowModal] = useState(false);
  const [allGratitudes, setAllGratitudes] = useState<Gratitude[]>([]);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const updateAllGratitudes = (newGratitude: Gratitude)=>{
    setAllGratitudes([newGratitude, ...allGratitudes]);
    setShowModal(false);
  }


  return (
    <>
      <div className='header-con'>
        <h1 className='header-title'>Gratitude Globe</h1>
      </div>
      <div style={{margin: '30px'}}>
        <div className='prompt-container'>
          <h2 className='gratitude-prompt'>Take a moment to reflect on the people or things that have made a positive impact on your life.</h2>
          <button onClick={openModal}>Spread some gratitude</button>
        </div>
        <h2 style={{marginTop: '20px', marginBottom: 0, padding: 0}}>Some Gratitude left by others:</h2>
        <div className='preview-card-con'>
          {allGratitudes.map((gratitude)=>(
            <div key={gratitude.text}>
              <PreviewCard previewTitle={gratitude.for} tag={gratitude.tag}/>
            </div>
          ))}
        </div>
      </div>
      {showModal && <Modal closeModal={closeModal} updateAllGratitudes={updateAllGratitudes}/>}
    </>
  )
}

export default App
