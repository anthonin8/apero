import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Quizz.css';

// Les questions du quiz avec leurs options
const allQuestions = [
  {
    question: "Quel est l'ingrédient principal du mojito ?",
    options: [
      { image: '/images/rhum.jpg', text: 'Rhum', isCorrect: true },
      { image: '/images/vodka.jpg', text: 'Vodka', isCorrect: false },
      { image: '/images/tequila.jpg', text: 'Tequila', isCorrect: false },
      { image: '/images/gin.jpg', text: 'Gin', isCorrect: false },
    ],
  },
  {
    question: "Quelle est la principale différence entre le champagne et le prosecco ?",
    options: [
      { image: '/images/raisins.jpg', text: 'Le type de raisin utilisé', isCorrect: true },
      { image: '/images/region.jpg', text: 'La région de production', isCorrect: true },
      { image: '/images/bulles.jpg', text: 'La taille des bulles', isCorrect: false },
      { image: '/images/methode.jpg', text: 'La méthode de fermentation', isCorrect: false },
    ],
  },
  {
    question: "Quel alcool est utilisé pour préparer un martini classique ?",
    options: [
      { image: '/images/gin.jpg', text: 'Gin', isCorrect: true },
      { image: '/images/rhum.jpg', text: 'Rhum', isCorrect: false },
      { image: '/images/vodka.jpg', text: 'Vodka', isCorrect: false },
      { image: '/images/whisky.jpg', text: 'Whisky', isCorrect: false },
    ],
  },
  {
    question: "Quelle liqueur donne au cocktail Margarita son goût caractéristique ?",
    options: [
      { image: '/images/tequila.jpg', text: 'Tequila', isCorrect: true },
      { image: '/images/cointreau.jpg', text: 'Cointreau', isCorrect: false },
      { image: '/images/vodka.jpg', text: 'Vodka', isCorrect: false },
      { image: '/images/whisky.jpg', text: 'Whisky', isCorrect: false },
    ],
  },
  {
    question: "Lequel de ces cocktails est traditionnellement garni d'une cerise ?",
    options: [
      { image: '/images/martini.jpg', text: 'Martini', isCorrect: true },
      { image: '/images/margarita.jpg', text: 'Margarita', isCorrect: false },
      { image: '/images/cuba_libre.jpg', text: 'Cuba Libre', isCorrect: false },
      { image: '/images/caipirinha.jpg', text: 'Caipirinha', isCorrect: false },
    ],
  },
  {
    question: "Quel vin est principalement utilisé pour faire un kir ?",
    options: [
      { image: '/images/vin_blanc.jpg', text: 'Vin blanc sec', isCorrect: true },
      { image: '/images/vin_rouge.jpg', text: 'Vin rouge', isCorrect: false },
      { image: '/images/champagne.jpg', text: 'Champagne', isCorrect: false },
      { image: '/images/rosé.jpg', text: 'Vin rosé', isCorrect: false },
    ],
  },
  {
    question: "Quel ingrédient n'est pas utilisé dans un Negroni ?",
    options: [
      { image: '/images/gin.jpg', text: 'Gin', isCorrect: false },
      { image: '/images/campari.jpg', text: 'Campari', isCorrect: false },
      { image: '/images/whisky.jpg', text: 'Whisky', isCorrect: true },
      { image: '/images/vermouth.jpg', text: 'Vermouth', isCorrect: false },
    ],
  },
  {
    question: "Quel cocktail est fait avec de la menthe fraîche, du sucre, du citron vert, du rhum blanc, et de l'eau gazeuse ?",
    options: [
      { image: '/images/mojito.jpg', text: 'Mojito', isCorrect: true },
      { image: '/images/caipirinha.jpg', text: 'Caipirinha', isCorrect: false },
      { image: '/images/daïquiri.jpg', text: 'Daïquiri', isCorrect: false },
      { image: '/images/pina_colada.jpg', text: 'Pina colada', isCorrect: false },
    ],
  },
  {
    question: "Le Pimm's Cup est une boisson originaire de quel pays ?",
    options: [
      { image: '/images/uk.jpg', text: 'Royaume-Uni', isCorrect: true },
      { image: '/images/france.jpg', text: 'France', isCorrect: false },
      { image: '/images/usa.jpg', text: 'États-Unis', isCorrect: false },
      { image: '/images/italie.jpg', text: 'Italie', isCorrect: false },
    ],
  },
  {
    question: "Quel type d'alcool est la base du cocktail Bloody Mary ?",
    options: [
      { image: '/images/vodka.jpg', text: 'Vodka', isCorrect: true },
      { image: '/images/tequila.jpg', text: 'Tequila', isCorrect: false },
      { image: '/images/gin.jpg', text: 'Gin', isCorrect: false },
      { image: '/images/whisky.jpg', text: 'Whisky', isCorrect: false },
    ],
  },
  {
    question: "Quel ingrédient est ajouté au champagne pour faire un Kir Royal ?",
    options: [
      { image: '/images/creme_de_cassis.jpg', text: 'Crème de cassis', isCorrect: true },
      { image: '/images/vermouth.jpg', text: 'Vermouth', isCorrect: false },
      { image: '/images/cointreau.jpg', text: 'Cointreau', isCorrect: false },
      { image: '/images/curacao.jpg', text: 'Curaçao', isCorrect: false },
    ],
  },
  {
    question : "Quelle est la garniture traditionnelle d'un plateau d'antipasti italien lors de l'apéro ?",
    options: [
      {image: '/images/olives_et_charcuterie.jpg', text: 'Olives et charcuterie', isCorrect: true},
      {image: '/images/sushis.jpg', text: 'Sushis', isCorrect: false},
      {image: '/images/chips_et_salsa.jpg', text: 'Chips et salsa', isCorrect: false},
      {image: '/images/tzatziki_et_pita.jpg', text: 'Tzatziki et pita', isCorrect: false},
    ],
  },
  {
    question : "Quelle boisson est souvent consommée avec des tapas en Espagne pendant l'apéro ?",
    options: [
      {image: '/images/sangria.jpg', text: 'Sangria', isCorrect: true},
      {image: '/images/mojito.jpg', text: 'Mojito', isCorrect: false},
      {image: '/images/pina_colada.jpg', text: 'Piña Colada', isCorrect: false},
      {image: '/images/martini.jpg', text: 'Martini', isCorrect: false},
    ],
  },
  {
    question : "Quel fromage est souvent servi avec des noix et du miel lors d'un apéro en France ?",
    options: [
      {image: '/images/Fromages_de_chevre.jpg', text: 'Chèvre', isCorrect: true},
      {image: '/images/saint_nectaire.jpg', text: 'saint nectaire', isCorrect: false},
      {image: '/images/saint_vergeron.jpg', text: 'saint vergeron', isCorrect: false},
      {image: '/images/emmental.jpg', text: 'Emmental', isCorrect: false},
    ],
  },
  {
    question : 'Quel apéritif à base de vin est traditionnellement consommé en France avant le dîner ?',
    options: [
      {image: '/images/vermouth.jpg', text: 'Vermouth', isCorrect: false},
      {image: '/images/porto.jpg', text: 'Porto', isCorrect: false},
      {image: '/images/ricard.jpg', text: 'Ricard', isCorrect: true},
      {image: '/images/spritz.jpg', text: 'Spritz', isCorrect: false},
    ],
  },
  {
    question : "Quelle est la boisson apéritive traditionnelle au Japon ?",
    options: [
      {image: '/images/sake.jpg', text: 'Saké', isCorrect: true},
      {image: '/images/soju.jpg', text: 'Soju', isCorrect: false},
      {image: '/images/nihonshu.jpg', text: 'Nihonshu', isCorrect: false},
      {image: '/images/whisky japonais.jpg', text: 'Whisky japonais', isCorrect: false},
    ],
  },
  {
    question : "Quel ingrédient est essentiel pour préparer une bonne bruschetta italienne pour l'apéro ?",
    options: [
      {image: '/images/tomate.jpg', text: 'Tomates fraîches', isCorrect:true},
      {image: '/images/fromage_bleu.jpg', text: 'Fromage bleu', isCorrect: false},
      {image: '/images/chorizo.jpg', text: 'Chorizo', isCorrect: false},
      {image: '/images/saumon_fume.jpg', text: 'Saumon fumé', isCorrect: false},
    ],
  },
  {
    question : 'Quelle boisson apéritive non alcoolisée est souvent servie avec des tapas en Espagne ?',
    options: [
      {image: '/images/agua-de-valencia.jpg', text: 'Agua de Valencia', isCorrect: false},
      {image: '/images/horchata.jpg', text: 'Horchata', isCorrect: true},
      {image: '/images/limonade.jpg', text: 'Limonade', isCorrect: false},
      {image: '/images/cidre.jpg', text: 'Cidre', isCorrect: false},
    ],
  },
  {
    question : "Quel est le nom de l'apéritif à base de vin que l'on trouve principalement dans la région de Jerez en Espagne, et qui est connu pour ses notes de noix et de fruits secs ?",
    options: [
      {image: '/images/amontillado.jpg', text: 'Amontillado ', isCorrect: true},
      {image: '/images/oloroso.jpg', text: 'Oloroso', isCorrect: false},
      {image: '/images/manzanilla.jpg', text: 'Manzanilla', isCorrect: false},
      {image: '/images/Fino.jpg', text: 'Fino', isCorrect: false},
    ],
  },
  {
    question : "Quel est le nom du plat traditionnel russe, souvent servi dans les régions de Sibérie, qui consiste en un mélange fermenté de poissons crus, généralement du saumon ou de l'omble chevalier, mélangé avec des céréales comme le sarrasin, et qui est souvent consommé pendant les grandes fêtes et les occasions spéciales ?",
    options: [
      {image: '/images/rassolnik.jpg', text: 'Rassolnik', isCorrect: false},
      {image: '/images/ukha.jpg', text: 'Ukha', isCorrect: false},
      {image: '/images/kholodets.jpg', text: 'Kholodets', isCorrect: false},
      {image: '/images/koryushka.jpg', text: 'Koryushka ', isCorrect: true},
    ],
  },
];



function Quizz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showScore, setShowScore] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Mélange les questions et en sélectionne 20 max
    const shuffledQuestions = allQuestions.sort(() => 0.5 - Math.random());
    setQuestions(shuffledQuestions.slice(0, 20));
  }, []);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleValidationClick = () => {
    if (selectedOption) {
      if (selectedOption.isCorrect) {
        setScore(score + 1);
      }

      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
        setSelectedOption(null);
      } else {
        setShowScore(true);
      }
    } else {
      alert('Veuillez sélectionner une option.');
    }
  };

  const handleGoBackClick = () => {
    navigate('/heure-apero');
  };

  // Nouvelle fonction pour relancer le quiz
  const handleRestartClick = () => {
    setScore(0);
    setCurrentQuestion(0);
    setSelectedOption(null);
    setShowScore(false);

    // Re-mélange les questions pour un nouveau quiz
    const shuffledQuestions = allQuestions.sort(() => 0.5 - Math.random());
    setQuestions(shuffledQuestions.slice(0, 20));
  };

  // Assurer que les questions existent avant d'essayer d'y accéder
  if (questions.length === 0) {
    return <div>Chargement des questions...</div>;
  }

  return (
    <div className="quizz-container">
      {showScore ? (
        <div className="score-section">
          <p>Vous avez marqué {score} sur {questions.length} !</p>
          <p>Merci d'avoir participé à notre quiz !</p>
          <button onClick={handleRestartClick} className="validate-button">
            Recommencer le quiz
          </button>
        </div>
      ) : (
        <>
          <div className="question-section">
            <div className="question-text">
              {questions[currentQuestion].question}
            </div>
          </div>
          <div className="answer-section">
            {questions[currentQuestion].options.map((option, index) => (
              <div
                key={index}
                className={`option ${selectedOption === option ? 'selected' : ''}`}
                onClick={() => handleOptionClick(option)}
              >
                <img src={option.image} alt={option.text} />
                <p>{option.text}</p>
              </div>
            ))}
          </div>
          <button onClick={handleValidationClick} className="validate-button">
            Valider
          </button>
        </>
      )}
      
      <button className="button-go-back" onClick={handleGoBackClick}>
        Retour à l'accueil
      </button>
    </div>
  );
}

export default Quizz;