// src/AperoPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AperoPage.css'; // Assurez-vous que les styles sont importés

function AperoPage() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/'); // Redirection vers la page principale (App.js)
  };

  return (
    <div className="apero-page-container">
      <div className="apero-page-header">
        <h2>Vous êtes sur la page DE l'apéro !</h2> 
        <button className="button-choix" onClick={() => navigate('/defi')}>
          Défi
        </button>
        <br/>
        <button className="button-choix" onClick={() => navigate('/quizz')}>
            Quizz
        </button>
      </div>
      <button className="apero-page-button" onClick={handleButtonClick}>
        Retourner à la page principale
      </button>
    </div>
  );
}

export default AperoPage;
