document.addEventListener("DOMContentLoaded", () => {
  //add question here //
  const questionSets = {
    1: [{ q: "Capital of France?", a: "Paris" }],
    2: [{ q: "What is the capital of Nepal?", a: "Kathmandu" }],
    3: [{ q: "What is the boiling point of water?", a: "100°C" }],
    4: [{ q: "What is the shortcut for copy?", a: "Ctrl + C" }],
    5: [{ q: "What does CPU stand for?", a: "Central Processing Unit" }]
  };

  let activeQuestions = [];
  let selectedHouse = null;
  let timerInterval = null;
  let timeLeft = 30;

  const houseSelect    = document.getElementById("houseSelect");
  const questionBox    = document.getElementById("questionBox");
  const questionText   = document.getElementById("questionText");
  const answerText     = document.getElementById("answerText");
  const timerDisplay   = document.getElementById("timerDisplay");
  const scoringButtons = document.getElementById("scoringButtons");
  const generalImg     = document.getElementById("generalimg");

 
  function getScores() {
    return JSON.parse(localStorage.getItem("houseScores")) || [
      { id: "red", name: "RED", color: "red", score: 0 },
      { id: "blue", name: "BLUE", color: "blue", score: 0 },
      { id: "yellow", name: "YELLOW", color: "yellow", score: 0 },
      { id: "green", name: "GREEN", color: "green", score: 0 }
    ];
  }

  function saveScores(data) {
    localStorage.setItem("houseScores", JSON.stringify(data));
  }


  document.getElementById("showQn").addEventListener("click", () => {
    document.getElementById("showQn").style.display = "none";
    document.querySelectorAll(".startBtn").forEach(btn => {
      btn.style.display = "inline-block";
    });
  });

  
  document.querySelectorAll(".startBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const setId = btn.getAttribute("data-set");
      activeQuestions = questionSets[setId];
      btn.style.display = "none";         

     
      generalImg.style.display = "none";
      questionBox.style.display = "block";
      questionText.textContent = activeQuestions[0].q;
      questionText.style.fontSize = "40px";
      answerText.textContent = ""; 

      
      houseSelect.style.display = "block"; 
    });
  });

 
  const houseButtons = {
    red:    document.getElementById("red"),
    blue:   document.getElementById("blue"),
    yellow: document.getElementById("yellow"),
    green:  document.getElementById("green"),
  };

  Object.entries(houseButtons).forEach(([id, el]) => {
    el.addEventListener("click", () => chooseHouse(id));
  });

  function chooseHouse(houseId) {
    if (!activeQuestions.length) return;
    selectedHouse = houseId;
    houseSelect.style.display = "none";


    scoringButtons.style.display = "block";

    startTimer();
  }

  
  function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 30;
    timerDisplay.textContent = timeLeft + "s";
    timerDisplay.style.backgroundColor = "#ffe680";
    timerDisplay.style.fontSize = "35px";

    timerInterval = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = timeLeft + "s";
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        handleWrong();
      }
    }, 1000);
  }

  
  document.getElementById("btnCorrect").addEventListener("click", handleCorrect);
  document.getElementById("btnWrong").addEventListener("click", handleWrong);

 function handleCorrect() {
  clearInterval(timerInterval);   // ⬅️ Stop timer
  timeLeft = 30;

  updateScore(selectedHouse, +20);
  alert("+20 points added to " + selectedHouse.toUpperCase() + " house!");

  answerText.style.color = "green";
  answerText.textContent = "Answer: " + activeQuestions[0].a;
  answerText.style.fontSize = "30px";
  answerText.style.fontWeight = "bold";

  setScoringButtonsEnabled(false);
  setTimeout(resetQuestionUI, 3000);
}

function handleWrong() {
  clearInterval(timerInterval);   
  timeLeft = 30;

  updateScore(selectedHouse, -10);
  alert("-10 points deducted from " + selectedHouse.toUpperCase() + " house!");

  answerText.style.color = "red";
  answerText.textContent = "Answer: " + activeQuestions[0].a;
  answerText.style.fontSize = "30px";
  answerText.style.fontWeight = "bold";

  setScoringButtonsEnabled(false);
  setTimeout(resetQuestionUI, 3000);
}


  function resetQuestionUI() {
    clearInterval(timerInterval);
    questionText.textContent = "";
    answerText.textContent = "";
    questionBox.style.display = "none";
    scoringButtons.style.display = "none";
    selectedHouse = null;
    generalImg.style.display = "block";
    setScoringButtonsEnabled(true);
  }


  function updateScore(houseId, delta) {
    const data = getScores();
    const house = data.find(h => h.id === houseId);
    if (house) {
      house.score += delta;
      if (house.score < 0) house.score = 0; 
    }
    saveScores(data);
  }
});
answerText.style.color = "green";
answerText.textContent = "Answer: " + activeQuestions[0].a;
