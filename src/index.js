import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import AperoPage from './AperoPage';  // Importez votre nouvelle page
import Defi from './Defi';
import Quizz from './Quizz';

// Obtenez l'élément DOM où l'application sera montée
const container = document.getElementById('root');

// Créez un root pour l'application avec la nouvelle API React 18
const root = createRoot(container);

root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/heure-apero" element={<AperoPage />} />
      <Route path="/defi" element={<Defi />} />
      <Route path="/quizz" element={<Quizz />} />
    </Routes>
  </Router>
);
