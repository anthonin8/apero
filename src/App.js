import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import './App.css';

// Set the root element for the modal
Modal.setAppElement('#root');

function App() {
  const [nextAperoHour, setNextAperoHour] = useState(18);
  const [nextAperoMinute, setNextAperoMinute] = useState(0);
  const [secondAperoHour, setSecondAperoHour] = useState(11);
  const [secondAperoMinute, setSecondAperoMinute] = useState(0);
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(18, 0, 11, 0).nextTimeLeft);
  const [isAperoTime, setIsAperoTime] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const timerRef = useRef(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateCounter = () => {
      const { nextTimeLeft, nextTargetHour, nextTargetMinute } = calculateTimeLeft(nextAperoHour, nextAperoMinute, secondAperoHour, secondAperoMinute);
      setTimeLeft(nextTimeLeft);

      if (nextTimeLeft.hours === 0 && nextTimeLeft.minutes === 0 && nextTimeLeft.seconds === 0) {
        console.log('Heure d\'apéro!');
        setIsAperoTime(true);
        setIsVideoPlaying(true);
        if (videoRef.current) {
          console.log('Lecture de la vidéo');
          videoRef.current.play();
          clearInterval(timerRef.current); // Arrête le compteur
        }
      }
    };

    timerRef.current = setInterval(updateCounter, 1000);

    return () => clearInterval(timerRef.current);
  }, [nextAperoHour, nextAperoMinute, secondAperoHour, secondAperoMinute]);

  useEffect(() => {
    if (isAperoTime && videoRef.current) {
      videoRef.current.play();
    }
  }, [isAperoTime]);

  function calculateTimeLeft(firstHour, firstMinute, secondHour, secondMinute) {
    const now = new Date();

    const nextAperoTime = new Date();
    nextAperoTime.setHours(firstHour, firstMinute, 0, 0);
    if (now > nextAperoTime) {
      nextAperoTime.setDate(nextAperoTime.getDate() + 1);
    }

    const secondAperoTime = new Date();
    secondAperoTime.setHours(secondHour, secondMinute, 0, 0);
    if (now > secondAperoTime) {
      secondAperoTime.setDate(secondAperoTime.getDate() + 1);
    }

    const nextDifference = nextAperoTime - now;
    const secondDifference = secondAperoTime - now;

    const isNextAperoCloser = nextDifference <= secondDifference;

    const closestDifference = isNextAperoCloser ? nextDifference : secondDifference;

    return {
      nextTimeLeft: {
        hours: Math.floor((closestDifference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((closestDifference / 1000 / 60) % 60),
        seconds: Math.floor((closestDifference / 1000) % 60),
      },
      nextTargetHour: isNextAperoCloser ? firstHour : secondHour,
      nextTargetMinute: isNextAperoCloser ? firstMinute : secondMinute,
    };
  }

  const handleVideoEnded = () => {
    console.log('Vidéo terminée');
    setIsAperoTime(false);
    setIsVideoPlaying(false);
    setShowAlert(true);
  };

  const handleStopVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; // Reset the video
      setIsAperoTime(false);
      setIsVideoPlaying(false);
      setShowAlert(true);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleSave = () => {
    const firstHour = parseInt(document.getElementById('firstHour').value);
    const firstMinute = parseInt(document.getElementById('firstMinute').value);
    const secondHour = parseInt(document.getElementById('secondHour').value);
    const secondMinute = parseInt(document.getElementById('secondMinute').value);

    setNextAperoHour(firstHour);
    setNextAperoMinute(firstMinute);
    setSecondAperoHour(secondHour);
    setSecondAperoMinute(secondMinute);

    closeModal();
  };

  const handleAlertYes = () => {
    navigate('/heure-apero');
  };

  const handleAlertNo = () => {
    setShowAlert(false);
    const { nextTargetHour, nextTargetMinute } = calculateTimeLeft(nextAperoHour, nextAperoMinute, secondAperoHour, secondAperoMinute);
    setNextAperoHour(nextTargetHour);
    setNextAperoMinute(nextTargetMinute);

    timerRef.current = setInterval(() => {
      const { nextTimeLeft, nextTargetHour, nextTargetMinute } = calculateTimeLeft(nextAperoHour, nextAperoMinute, secondAperoHour, secondAperoMinute);
      setTimeLeft(nextTimeLeft);
    }, 1000);
  };

  return (
    <div className="App">
      <header className="App-header">
        {!isVideoPlaying && (
          <div className="counter">
            {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
          </div>
        )}

        {isAperoTime && (
          <div className="video-container">
            <video ref={videoRef} onEnded={handleVideoEnded} width="600" controls>
              <source src="apero.mp4" type="video/mp4" />
            </video>
            <button className="buzzer-button" onClick={handleStopVideo}>
              &#128165;
            </button>
          </div>
        )}

        {!isVideoPlaying && (
          <button className={`apero-button ${isVideoPlaying ? 'hidden' : ''}`} onClick={openModal}>
            Heure d'apéro
          </button>
        )}
      </header>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal">
        <button onClick={closeModal} className="close-button">&times;</button>
        <h2>Définir les heures d'apéro</h2>
        <div>
          <label>Première heure : </label>
          <input id="firstHour" type="number" min="0" max="23" defaultValue={nextAperoHour} />h
          <input id="firstMinute" type="number" min="0" max="59" defaultValue={nextAperoMinute} />m
        </div>
        <div>
          <label>Deuxième heure : </label>
          <input id="secondHour" type="number" min="0" max="23" defaultValue={secondAperoHour} />h
          <input id="secondMinute" type="number" min="0" max="59" defaultValue={secondAperoMinute} />m
        </div>
        <button onClick={handleSave}>Enregistrer</button>
      </Modal>

      {showAlert && (
        <div className="alert-box">
          <p>Prêt pour l'apero ?</p>
          <button onClick={handleAlertYes}>Oui</button>
          <button onClick={handleAlertNo}>Non</button>
        </div>
      )}
    </div>
  );
}

export default App;
