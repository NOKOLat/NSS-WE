import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Plane from './Pages/Plane.tsx';
import Multicopter from './Pages/Multicopter.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Plane />} />
        <Route path="/marcop" element={<Multicopter />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
