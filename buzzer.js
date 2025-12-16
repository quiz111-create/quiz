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

  
  const buzzer      = document.getElementById("buzzer");      // <audio id="buzzer" src="buzzer.mp3" preload="auto"></audio>
  const tickSound   = document.getElementById("tickSound");   // <audio id="tickSound" src="tick.mp3" preload="auto"></audio>
  const hurraySound = document.getElementById("hurraySound"); // <audio id="hurraySound" src="hurray.mp3" preload="auto"></audio>

 
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

  
  ["red", "blue", "yellow", "green"].forEach(house => {
    document.getElementById(house).addEventListener("click", () => chooseHouse(house));
  });

  function chooseHouse(houseId) {
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

   
    stopAllSounds();

    timerInterval = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = timeLeft + "s";

      // 🔊 Play tick every second
      if (tickSound && timeLeft > 0) {
        tickSound.pause();
        tickSound.currentTime = 0;
        tickSound.play().catch(() => {});
      }

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        stopAllSounds();

        if (buzzer) {
          buzzer.pause();
          buzzer.currentTime = 0;
          buzzer.play().catch(() => {});
        }

        handleWrong();
      }
    }, 1000);
  }

  
  document.getElementById("btnCorrect").addEventListener("click", handleCorrect);
  document.getElementById("btnWrong").addEventListener("click", handleWrong);

  function handleCorrect() {
    clearInterval(timerInterval);
    stopAllSounds();

    if (hurraySound) {
      hurraySound.pause();
      hurraySound.currentTime = 0;
      hurraySound.play().catch(() => {});
    }

    updateScore(selectedHouse, 20);

    answerText.style.color = "green";
    answerText.textContent = "Answer: " + activeQuestions[0].a;
    answerText.style.fontSize = "30px";
    answerText.style.fontWeight = "bold";

    setScoringButtonsEnabled(false);
    setTimeout(resetQuestionUI, 60000);
  }

  function handleWrong() {
    clearInterval(timerInterval);
    stopAllSounds();

    updateScore(selectedHouse, -10);

    answerText.style.color = "red";
    answerText.textContent = "Answer: " + activeQuestions[0].a;
    answerText.style.fontSize = "30px";
    answerText.style.fontWeight = "bold";

    setScoringButtonsEnabled(false);
    setTimeout(resetQuestionUI, 60000);
  }

 
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
        sound.pause();
        sound.currentTime = 0;
      }
    });
  }

});
