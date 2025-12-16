document.addEventListener("DOMContentLoaded", () => {

  // ===============================
  // QUESTION SETS
  // ===============================
  const questionSets = {
    1: [{ q: "Capital of France?", a: "Paris" }],
    2: [{ q: "What is the capital of Nepal?", a: "Kathmandu" }],
    3: [{ q: "What is the boiling point of water?", a: "100°C" }],
    4: [{ q: "What is the shortcut for copy?", a: "Ctrl + C" }],
    5: [{ q: "What does CPU stand for?", a: "Central Processing Unit" }]
  };

  let activeQuestions = [];
  let currentIndex = 0;
  let selectedHouse = null;
  let timerInterval = null;
  let timeLeft = 30;

  // ===============================
  // DOM ELEMENTS
  // ===============================
  const houseSelect    = document.getElementById("houseSelect");
  const questionBox    = document.getElementById("questionBox");
  const questionText   = document.getElementById("questionText");
  const answerText     = document.getElementById("answerText");
  const timerDisplay   = document.getElementById("timerDisplay");
  const scoringButtons = document.getElementById("scoringButtons");
  const generalImg     = document.getElementById("generalimg");

  const buzzer      = document.getElementById("buzzer");
  const tickSound   = document.getElementById("tickSound");
  const hurraySound = document.getElementById("hurraySound");

  // ===============================
  // SCORE FUNCTIONS
  // ===============================
  function getScores() {
    return JSON.parse(localStorage.getItem("houseScores")) || [
      { id: "red", score: 0 },
      { id: "blue", score: 0 },
      { id: "yellow", score: 0 },
      { id: "green", score: 0 }
    ];
  }

  function saveScores(data) {
    localStorage.setItem("houseScores", JSON.stringify(data));
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

  // ===============================
  // SHOW QUESTIONS
  // ===============================
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
      currentIndex = 0;
      btn.style.display = "none";

      generalImg.style.display = "none";
      questionBox.style.display = "block";
      showQuestion();

      houseSelect.style.display = "block";
    });
  });

  function showQuestion() {
    if (activeQuestions[currentIndex]) {
      questionText.textContent = activeQuestions[currentIndex].q;
      questionText.style.fontSize = "55px";
      answerText.textContent = "";
    }
  }

  // ===============================
  // HOUSE SELECTION
  // ===============================
  ["red", "blue", "yellow", "green"].forEach(house => {
    document.getElementById(house).addEventListener("click", () => chooseHouse(house));
  });

  function chooseHouse(houseId) {
    selectedHouse = houseId;
    houseSelect.style.display = "none";
    scoringButtons.style.display = "block";
    startTimer();
  }

  // ===============================
  // TIMER
  // ===============================
  function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 30;

    timerDisplay.textContent = timeLeft + "s";
    timerDisplay.style.backgroundColor = "#ffe680";
    timerDisplay.style.fontSize = "50px";

    stopAllSounds();

    timerInterval = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = timeLeft + "s";

      if (tickSound && timeLeft > 0) {
        try {
          tickSound.pause();
          tickSound.currentTime = 0;
          tickSound.play();
        } catch (_) {}
      }

      if (timeLeft <= 0) {
        clearInterval(timerInterval);

        // Stop ticking and any celebration sound
        [tickSound, hurraySound].forEach(sound => {
          if (sound) {
            sound.pause();
            sound.currentTime = 0;
          }
        });

       
        if (buzzer) {
          try {
            buzzer.pause();
            buzzer.currentTime = 0;
            buzzer.loop = false; 
            buzzer.play();
          } catch (_) {}
        }

        setTimeout(() => {
          if (buzzer) {
            buzzer.pause();
            buzzer.currentTime = 0;
          }
          handleWrong({ fromTimeout: true });
        }, 800);
      }
    }, 1000);
  }

  // ===============================
  // SCORING
  // ===============================
  document.getElementById("btnCorrect").addEventListener("click", () => handleCorrect());
  document.getElementById("btnWrong").addEventListener("click", () => handleWrong());

  function handleCorrect() {
    clearInterval(timerInterval);
    stopAllSounds();

    if (hurraySound) {
      try {
        hurraySound.pause();
        hurraySound.currentTime = 0;
        hurraySound.play();
      } catch (_) {}
    }

    updateScore(selectedHouse, 20);

    answerText.style.color = "green";
    answerText.textContent = "Answer: " + activeQuestions[currentIndex].a;
    answerText.style.fontSize = "50px";
    answerText.style.fontWeight = "bold";
  }

  // Accept an optional flag to avoid stopping sounds when called after buzzer timeout
  function handleWrong(opts = {}) {
    clearInterval(timerInterval);

    
    if (!opts.fromTimeout) {
      stopAllSounds();
    }

    updateScore(selectedHouse, -10);

    answerText.style.color = "red";
    answerText.textContent = "Answer: " + activeQuestions[currentIndex].a;
    answerText.style.fontSize = "50px";
    answerText.style.fontWeight = "bold";
  }

  // ===============================
  // RESET
  // ===============================
  function resetQuestionUI() {
    clearInterval(timerInterval);
    stopAllSounds();
    questionText.textContent = "";
    answerText.textContent = "";
    questionBox.style.display = "none";
    scoringButtons.style.display = "none";
    selectedHouse = null;
    generalImg.style.display = "block";
    setScoringButtonsEnabled(true);
  }

  function setScoringButtonsEnabled(state) {
    document.getElementById("btnCorrect").disabled = !state;
    document.getElementById("btnWrong").disabled = !state;
  }

  function stopAllSounds() {
    [tickSound, buzzer, hurraySound].forEach(sound => {
      if (sound) {
        try {
          sound.pause();
          sound.currentTime = 0;
          sound.loop = false;
        } catch (_) {}
      }
    });
  }

});
