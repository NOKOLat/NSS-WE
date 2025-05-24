import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Ippann from './Pages/Plane.tsx';
import Marcop from './Pages/Marti_copter.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Ippann />} />
        <Route path="/marcop" element={<Marcop />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
