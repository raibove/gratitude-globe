import './App.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/home';
import Note from './components/note';

export interface Gratitude {
  for: string;
  text: string;
  tag: string;
  dateCreated: string;
  views: number;
}

export interface PreviewData {
  [key: string]: {
    preview: string;
    tag: string;
  };
}

export const BASE_URL = 'https://gratitude-globe.netlify.app'

function App() {
  return (
    <Router>
      <div className='header-con'>
        <Link to='/'>
          <h1 className='header-title'>Gratitude Globe</h1>
        </Link>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:id" element={<Note />} />
      </Routes>
      <ToastContainer />
    </Router>
  )
}

export default App
