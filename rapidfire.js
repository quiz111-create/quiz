document.addEventListener("DOMContentLoaded", () => {

  // ----------------------------
  // QUESTION SETS
  // ----------------------------

  const questions1 = [
    { q: "Capital of France?", a: "Paris" },
    { q: "2 + 2 = ?", a: "4" },
    { q: "Color of sky?", a: "Blue" },
    { q: "Who wrote Hamlet?", a: "Shakespeare" },
    { q: "H2O is?", a: "Water" },
    { q: "Fastest land animal?", a: "Cheetah" },
    { q: "Largest planet?", a: "Jupiter" },
    { q: "HTML stands for?", a: "HyperText Markup Language" },
    { q: "Speed of light?", a: "299,792 km/s" },
    { q: "Python is a ___?", a: "Programming language" }
  ];

  const questions2 = [
    { q: "What is the capital of Nepal?", a: "Kathmandu" },
    { q: "Tallest mountain in the world?", a: "Mount Everest" },
    { q: "Which ocean is the largest?", a: "Pacific Ocean" },
    { q: "Which river is longest?", a: "Nile" },
    { q: "Which country has the most population?", a: "China" },
    { q: "Which continent is Australia in?", a: "Australia" },
    { q: "Which layer protects Earth from UV?", a: "Ozone layer" },
    { q: "Which gas do plants absorb?", a: "Carbon dioxide" },
    { q: "Which biome is the Amazon?", a: "Rainforest" },
    { q: "Which planet is closest to the sun?", a: "Mercury" }
  ];

  const questions3 = [
    { q: "What is the boiling point of water?", a: "100°C" },
    { q: "Which organ pumps blood?", a: "Heart" },
    { q: "What is the chemical symbol for gold?", a: "Au" },
    { q: "Which vitamin comes from sunlight?", a: "Vitamin D" },
    { q: "Which part of the plant makes food?", a: "Leaf" },
    { q: "What is the hardest natural substance?", a: "Diamond" },
    { q: "Which gas do humans breathe in?", a: "Oxygen" },
    { q: "What is the center of an atom?", a: "Nucleus" },
    { q: "Which planet has rings?", a: "Saturn" },
    { q: "What is the unit of force?", a: "Newton" }
  ];

  const questions4 = [
    { q: "What does CPU stand for?", a: "Central Processing Unit" },
    { q: "Who founded Microsoft?", a: "Bill Gates" },
    { q: "What is the shortcut for copy?", a: "Ctrl + C" },
    { q: "Which device stores data?", a: "Hard drive" },
    { q: "What does AI stand for?", a: "Artificial Intelligence" },
    { q: "Which company makes iPhones?", a: "Apple" },
    { q: "What is the full form of USB?", a: "Universal Serial Bus" },
    { q: "What is the brain of the computer?", a: "CPU" },
    { q: "Which language is used for web?", a: "HTML" },
    { q: "What is the full form of Wi-Fi?", a: "Wireless Fidelity" }
  ];

  let current = 0;
  let activeQuestions = [];
  let selectedHouse = null;

  const questionBox = document.getElementById("questionBox");
  const questionText = document.getElementById("questionText");
  const answerPanel = document.getElementById("answerPanel");
  const leftAnswers = document.getElementById("leftAnswers");
  const rightAnswers = document.getElementById("rightAnswers");
  const houseSelect = document.getElementById("houseSelect");

  let timerInterval = null;
  let timeLeft = 60;
  const timerDisplay = document.getElementById("timerDisplay");

  function startSetTimer() {
    clearInterval(timerInterval);
    timeLeft = 60;

    timerDisplay.textContent = `${timeLeft}s`;

    timerInterval = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = `${timeLeft}s`;
      timerDisplay.style.backgroundColor = "#ffe680";
      timerDisplay.style.fontSize = "28px";
      timerDisplay.style.fontWeight = "bold";
      timerDisplay.style.textAlign = "center";

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        autoFinishSet();
      }
    }, 1000);
  }

  function autoFinishSet() {
    questionBox.style.display = "none";
    showAnswers();
  }

  const qButtons = document.querySelectorAll("#questionList button, #questionList .qbtn");

  qButtons.forEach(btn => {
    btn.style.background = "#4d5cff";
    btn.style.color = "white";
    btn.style.padding = "10px 15px";
    btn.style.borderRadius = "10px";
    btn.style.margin = "5px";
    btn.style.border = "none";
    btn.style.cursor = "pointer";
    btn.style.fontWeight = "600";
  });

  function startRound(questionsSet) {
    houseSelect.style.display = "block";
    activeQuestions = questionsSet;
    current = 0;
    answerPanel.style.display = "none";
  }

  window.chooseHouse = function(houseId) {
    selectedHouse = houseId;
    houseSelect.style.display = "none";
    questionBox.style.display = "block";

    startSetTimer();
    showQuestion();
  };

  function showQuestion() {
    questionText.textContent = activeQuestions[current].q;
    document.getElementById("generalimg").style.display = "none";
  }

  document.getElementById("Next").addEventListener("click", () => {
    current++;

    if (current < activeQuestions.length) {
      showQuestion();
    } else {
      clearInterval(timerInterval);
      questionBox.style.display = "none";
      showAnswers();
    }
  });

  // -----------------------------
  // UPDATED ANSWER DISPLAY (SCROLLABLE)
  // -----------------------------
  function showAnswers() {
    answerPanel.style.display = "block";
    answerPanel.style.height = "550px";
    answerPanel.style.alignItems = "center";
    answerPanel.style.overflowY = "auto";   // ⭐ MAKE SCROLLABLE

    leftAnswers.innerHTML = "";
    leftAnswers.style.textAlign = "left";
    leftAnswers.style.fontSize = "20px";

    rightAnswers.innerHTML = "";
    rightAnswers.style.textAlign = "left";
    rightAnswers.style.fontSize = "20px";

    activeQuestions.forEach((item, index) => {
      const li = document.createElement("li");

      li.innerHTML = `<strong>${index + 1}. ${item.q}</strong><br>👉 ${item.a}<br><br>`;

      if (index < 5) leftAnswers.appendChild(li);
      else rightAnswers.appendChild(li);
    });

    const scoreInput = document.createElement("div");
    scoreInput.innerHTML = `
      <p id="sco">Enter number of correct answers:</p>
      <input type="number" id="correctCount" min="0" max="${activeQuestions.length}"><br><br>
      <button onclick="submitScore()" id="sub">Submit Score</button>
    `;
    answerPanel.appendChild(scoreInput);
  }

  window.submitScore = function () {
    const correctCount = parseInt(document.getElementById("correctCount").value, 10) || 0;
    const points = correctCount * 10;

    answerPanel.style.display = "none";

    let data = JSON.parse(localStorage.getItem("houseScores")) || [
      { id: "red", name: "RED", color: "red", score: 0 },
      { id: "blue", name: "BLUE", color: "blue", score: 0 },
      { id: "yellow", name: "YELLOW", color: "yellow", score: 0 },
      { id: "green", name: "GREEN", color: "green", score: 0 }
    ];

    data = data.map(h => {
      if (h.id === selectedHouse) h.score += points;
      return h;
    });

    localStorage.setItem("houseScores", JSON.stringify(data));
    alert(`Added ${points} points to ${selectedHouse.toUpperCase()}!`);
  };

  const startBtn = document.getElementById("startBtn");
  startBtn.addEventListener("click", () => {
    startBtn.style.display = "none";
    startRound(questions1);
  });

  const startBtn1 = document.getElementById("startBtn1");
  startBtn1.addEventListener("click", () => {
    startBtn1.style.display = "none";
    startRound(questions2);
  });

  const startBtn2 = document.getElementById("startBtn2");
  startBtn2.addEventListener("click", () => {
    startBtn2.style.display = "none";
    startRound(questions3);
  });

  const startBtn3 = document.getElementById("startBtn3");
  startBtn3.addEventListener("click", () => {
    startBtn3.style.display = "none";
    startRound(questions4);
  });

});
