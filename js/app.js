import Quiz from "./Quiz.js";
import Question from "./question.js";

//running an iffy?
const App = (function() {
  // cache the DOM
  const quizEl = document.querySelector(".quiz");
  const quizquestionEl = document.querySelector(".quiz__question");
  const trackerEl = document.querySelector(".quiz__tracker");
  const taglineEl = document.querySelector(".quiz__tagline");
  const choicesEl = document.querySelector(".quiz__choices");
  const progressInnerEl = document.querySelector(".progress__inner");
  const nextButtonEl = document.querySelector(".next");
  const restartButtonEl = document.querySelector(".restart");

  const q1 = new Question (
    "When parked, you need to be at least XX feet away from fire hydrants?",
    ["2 feet", "77 feet", "10 feet", "15 feet"], 2
  )

  const q2 = new Question (
    "When parked uphill, you should turn your car wheels which way",
    ["straight", "away from the curb", "toward the curb", "doesn't matter"], 2
  )

  const q3 = new Question (
    "When parallel parking, the car must not be more than how many inches away from the curb?",
    ["20", "1", "120", "12"], 3
  )

  const q4 = new Question (
    "What is the percent of blood alcohol to be considered drunk",
    ["0.8", ".10", ".9", "0.08"], 3
  )

  const q5 = new Question (
    "What does a flashing amber light mean?",
    ["Proceed with caution", "STOP", "Reverse", "Wave for the camera"], 0
  )
  const quiz = new Quiz([q1, q2, q3, q4, q5]);

  const listeners = _ => {
    nextButtonEl.addEventListener("click", function(){
      const selectedRadioElem = document.querySelector('input[name="choice"]:checked');
      if (selectedRadioElem){
        const key = Number(selectedRadioElem.getAttribute("data-order"));
        quiz.guess(key);
        renderAll();
      }
    })

    restartButtonEl.addEventListener("click", function(){
      quiz.reset();
      renderAll();
      nextButtonEl.style.opacity = 1;
      setValue(taglineEl,  `Pick an option below`);
      
    })
    
  }

  const setValue= (elem, value) => {
      elem.innerHTML = value;
    }
    
 

  const renderQuestion = _ => {
    const question = quiz.getCurrentQuestion().question;
      setValue(quizquestionEl, question)
    }

  
  const renderChoicesElements = _ => {
      let markup = "";
      const currentChoices = quiz.getCurrentQuestion().choices;
      currentChoices.forEach((elem, index) => {
        markup +=   `
          <li class="quiz__choice">
            <input type="radio" name="choice" class="quiz__input" id="choice${index}" data-order="${index}" >
            <label for="choice${index}" class="quiz__label">
              <i></i>
              <span>${elem}<span>
            </label>
          </li>
        `
      });
      setValue(choicesEl, markup);
      
    }
  
    const renderTracker = _ => {
      const index = quiz.currentIndex;
      setValue(trackerEl, `${index+1} of ${quiz.questions.length}`)
    }
    
    const getPercentage = (num1, num2) => {
      return Math.round((num1/num2) * 100);
    }

    const launch = (width, maxPercent) =>  {
      let loadingBar = setInterval(function() {
        if (width > maxPercent) {
          clearInterval(loadingBar)
        } else {
          width++;
          progressInnerEl.style.width = width + "%";
        }
      }, 3)
    }


    const renderProgress =_ => {
      // 1. width in %
      const currentWidth = getPercentage(quiz.currentIndex, quiz.questions.length)
      // 2. create func launch(0, width)
      console.log(currentWidth);
      launch(0, currentWidth);
    }
    
    const renderEndScreen = _ => {
      setValue(quizquestionEl, `Great Job!`);
      setValue(taglineEl,  `Complete!`);
      setValue(trackerEl, `You scored: ${getPercentage(quiz.score, quiz.questions.length)}%`);
      nextButtonEl.style.opacity = 0;
    }

    const renderAll = _ => {
      if (quiz.hasEnded()) {
        renderEndScreen();
      } else {
        renderQuestion();
        renderChoicesElements()
        renderTracker();
        renderProgress();
      }
    }

    return {
      renderAll: renderAll,
      listeners: listeners
    }
})();

App.renderAll();
App.listeners();