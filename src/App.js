import React, { lazy, Suspense } from 'react'
import './css/App.css'
import './css/Footer.css'
import './css/BgTop.css'
import './css/qr.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './Navbar';
import Home from './Home/Home';
import Restaurant from './Restaurant/Restaurants';
import Menus from './Menu/Menus';
import ScrollToTop from './ScrollToTop';
import Qr from './qr/Qr';
import QrNew from './qrNew/QrNew'
import AiWebEditor from './_new/ai-web-editor'
import releaseNotes from './_new/releaseNotesData'

const Pedidos = lazy(() => import('./_new/pedidos/Pedidos'))

function App() {
  console.log('Made by Lukasz Maraj')
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <div className="App">
        <ScrollToTop />
        <Routes>
          <Route exact path='/' element={<><Navbar /><Home /></>} />
          <Route exact path='/restaurant' element={<><Navbar /><Restaurant /></>} />
          <Route exact path='/menu' element={<><Navbar /><Menus /></>} />
          <Route exact path='/pedidos' element={<><Navbar /><Suspense fallback={null}><Pedidos /></Suspense></>} />
          <Route exact path='/qr' element={<><Qr /></>} />
          <Route exact path='/qr-new' element={<><QrNew /></>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <AiWebEditor changes={releaseNotes} versionsUrl='/versiones.json' />
      </div>
    </BrowserRouter>
  );
}

export default App;
