import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Defi.css';

const drinkOptions = [
  { type: 'Verre', image: '/images/alcool.jpg' },
  { type: 'Bière en canette', image: '/images/biere.png' },
  { type: 'Shooter', image: '/images/shooters.jpg' },
];

function Defi() {
  const [showModal, setShowModal] = useState(true);
  const [numPeople, setNumPeople] = useState('');
  const [names, setNames] = useState([]);
  const [currentPerson, setCurrentPerson] = useState(0);
  const [drinks, setDrinks] = useState({});
  const [showDrinkModal, setShowDrinkModal] = useState(false);
  const [timers, setTimers] = useState({});
  const [currentTimer, setCurrentTimer] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showEndGameDialog, setShowEndGameDialog] = useState(false);
  const [gameResults, setGameResults] = useState(null);
  const [isGameFinished, setIsGameFinished] = useState(false);

  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleKeyPress = (event, submitAction) => {
    if (event.key === 'Enter') {
      submitAction();
    }
  };

  const handleNumPeopleChange = (event) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setNumPeople(value);
    }
  };

  const handleNumPeopleSubmit = () => {
    if (numPeople > 0) {
      setShowModal(false);
      setNames(new Array(Number(numPeople)).fill(''));
    } else {
      alert('Veuillez entrer un nombre valide.');
    }
  };

  const handleNameChange = (index, event) => {
    const newNames = [...names];
    newNames[index] = event.target.value;
    setNames(newNames);
  };

  const handleNameSubmit = () => {
    if (names[currentPerson]) {
      setShowDrinkModal(true);
    } else {
      alert('Veuillez entrer un prénom.');
    }
  };

  const handleDrinkSelect = (drinkType) => {
    const newDrinks = { ...drinks, [names[currentPerson]]: drinkType };
    setDrinks(newDrinks);

    if (currentPerson < names.length - 1) {
      setCurrentPerson(currentPerson + 1);
    } else {
      setCurrentPerson(names.length); // force le flux à se terminer
    }
    setShowDrinkModal(false); // ferme la modale
  };

  const handleStartTimer = (name) => {
    setCurrentTimer({ name, start: Date.now() });
  };

  useEffect(() => {
    if (currentTimer) {
      const interval = setInterval(() => {
        setElapsedTime((Date.now() - currentTimer.start) / 1000);
      }, 100);

      return () => clearInterval(interval);
    }
  }, [currentTimer]);

  const handleStopTimer = () => {
    const elapsed = (Date.now() - currentTimer.start) / 1000;
    const newTimers = { ...timers };
    if (!newTimers[currentTimer.name]) {
      newTimers[currentTimer.name] = [];
    }
    newTimers[currentTimer.name].push(elapsed);
    setTimers(newTimers);
    setCurrentTimer(null);
    setElapsedTime(0);
  };

  const handleBackButtonClick = () => {
    navigate('/Heure-Apero');
  };

  const handleEndGameClick = () => {
    setShowEndGameDialog(true);
  };

  const handleEndGameResponse = (response) => {
    if (response === 'yes') {
      calculateResults();
      setIsGameFinished(true);
    } else {
      setShowEndGameDialog(false);
    }
  };

  const calculateResults = () => {
    let mostDrinks = 0;
    let fastestTime = Infinity;
    let mostDrinksPerson = '';
    let fastestPerson = '';

    for (const [name, times] of Object.entries(timers)) {
      if (times.length > mostDrinks) {
        mostDrinks = times.length;
        mostDrinksPerson = name;
      }
      const minTime = Math.min(...times);
      if (minTime < fastestTime) {
        fastestTime = minTime;
        fastestPerson = name;
      }
    }

    const winner = mostDrinksPerson === fastestPerson ? mostDrinksPerson : null;
    setGameResults({ mostDrinksPerson, fastestPerson, winner });
    setShowEndGameDialog(false);
  };

  const handleRestartGame = () => {
    setShowModal(true);
    setNumPeople('');
    setNames([]);
    setCurrentPerson(0);
    setDrinks({});
    setShowDrinkModal(false);
    setTimers({});
    setCurrentTimer(null);
    setElapsedTime(0);
    setShowEndGameDialog(false);
    setGameResults(null);
    setIsGameFinished(false);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [showModal, showDrinkModal]);

  useEffect(() => {
    if (currentPerson >= names.length && Object.keys(drinks).length === names.length) {
      setShowDrinkModal(false); // Ferme la modale des boissons une fois toutes les boissons sélectionnées
    }
  }, [currentPerson, names.length, drinks]);

  return (
    <div className="defi-container">
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ color: 'black' }}>Combien de personnes prennent l'apéro ?</h2>
            <input
              type="number"
              value={numPeople}
              onChange={handleNumPeopleChange}
              onKeyPress={(e) => handleKeyPress(e, handleNumPeopleSubmit)}
              placeholder="Nombre de personnes"
              ref={inputRef}
            />
            <button onClick={handleNumPeopleSubmit}>Soumettre</button>
          </div>
        </div>
      )}

      {!showModal && names.length > 0 && currentPerson < names.length && !showDrinkModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ color: 'black' }}>Entrez le prénom de la personne {currentPerson + 1}</h2>
            <input
              type="text"
              value={names[currentPerson]}
              onChange={(event) => handleNameChange(currentPerson, event)}
              onKeyPress={(e) => handleKeyPress(e, handleNameSubmit)}
              placeholder="Prénom"
            />
            <button onClick={handleNameSubmit}>Soumettre</button>
          </div>
        </div>
      )}

      {showDrinkModal && currentPerson < names.length && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ color: 'black' }}>Choisissez une boisson pour {names[currentPerson]}</h2>
            <div className="drink-options">
              {drinkOptions.map((option) => (
                <div
                  key={option.type}
                  className="drink-option"
                  onClick={() => handleDrinkSelect(option.type)}
                >
                  <img src={option.image} alt={option.type} />
                  <p>{option.type}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showEndGameDialog && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ color: 'black' }}>Fin du jeu</h2>
            <p style={{ color: 'black' }}>Voulez-vous terminer le jeu ?</p>
            <div>
              <button onClick={() => handleEndGameResponse('yes')}>Oui</button>
              <button onClick={() => handleEndGameResponse('no')}>Non</button>
            </div>
          </div>
        </div>
      )}

      <div className="page-content">
        <div className="names-grid">
          {names.map((name, index) => (
            <div
              key={index}
              className={`name-item ${
                gameResults
                  ? gameResults.winner === name
                    ? 'winner'
                    : 'loser'
                  : ''
              }`}
            >
              <h2 style={{ color: 'white' }}>{name}</h2>
              <hr />
              <p style={{ color: 'white' }}>{drinks[name]}</p>
              {timers[name] && (
                <ul>
                  {timers[name].map((time, i) => (
                    <li key={i} style={{ color: 'white' }}>
                      Temps {i + 1}: {time.toFixed(2)}s
                    </li>
                  ))}
                </ul>
              )}
              {!gameResults && (
                <>
                  {currentTimer && currentTimer.name === name ? (
                    <div className="timer">
                      <p>{elapsedTime.toFixed(1)}s</p>
                      <button
                        className="timer-button stop-button"
                        onClick={handleStopTimer}
                      >
                        Stop
                      </button>
                    </div>
                  ) : (
                    <button
                      className="timer-button start-button"
                      onClick={() => handleStartTimer(name)}
                    >
                      <img
                        src="/images/timer.png"
                        alt="Chronométrer"
                        style={{ width: '50px', height: '50px' }}
                      />
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        {!gameResults && (
          <button className="end-game-button" onClick={handleEndGameClick}>
            Jeu terminé
          </button>
        )}
        {gameResults && (
          <button className="restart-game-button" onClick={handleRestartGame}>
            Relancer le jeu
          </button>
        )}
        
        <div className="apero-page-container">
          <div className="apero-page-header"></div>
          <button className="apero-page-button" onClick={() => navigate('/heure-apero')}>
            Retour
          </button>
        </div>
      </div>
    </div>
  );
}

export default Defi;
