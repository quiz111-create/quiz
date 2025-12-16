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
    { q: "Chemical symbol for gold?", a: "Au" },
    { q: "Vitamin from sunlight?", a: "Vitamin D" },
    { q: "Plant part that makes food?", a: "Leaf" },
    { q: "Hardest natural substance?", a: "Diamond" },
    { q: "Gas humans breathe in?", a: "Oxygen" },
    { q: "Center of atom?", a: "Nucleus" },
    { q: "Planet with rings?", a: "Saturn" },
    { q: "Unit of force?", a: "Newton" }
  ];

  const questions4 = [
    { q: "CPU stands for?", a: "Central Processing Unit" },
    { q: "Founder of Microsoft?", a: "Bill Gates" },
    { q: "Shortcut for copy?", a: "Ctrl + C" },
    { q: "Device that stores data?", a: "Hard drive" },
    { q: "AI stands for?", a: "Artificial Intelligence" },
    { q: "Company that makes iPhone?", a: "Apple" },
    { q: "USB full form?", a: "Universal Serial Bus" },
    { q: "Brain of computer?", a: "CPU" },
    { q: "Language for web?", a: "HTML" },
    { q: "Wi-Fi full form?", a: "Wireless Fidelity" }
  ];

  // ----------------------------
  // STATE
  // ----------------------------
  let current = 0;
  let activeQuestions = [];
  let selectedHouse = null;

  let timerInterval = null;
  let timeLeft = 60;

  // ----------------------------
  // DOM
  // ----------------------------
  const questionBox = document.getElementById("questionBox");
  const questionText = document.getElementById("questionText");
  const answerPanel = document.getElementById("answerPanel");
  const leftAnswers = document.getElementById("leftAnswers");
  const rightAnswers = document.getElementById("rightAnswers");
  const houseSelect = document.getElementById("houseSelect");
  const timerDisplay = document.getElementById("timerDisplay");

  const buzzer = document.getElementById("buzzer");
  const tickSound = document.getElementById("tickSound");

  // ----------------------------
  // TIMER (FIXED TICK SOUND)
  // ----------------------------
  function startSetTimer() {
    clearInterval(timerInterval);
    timeLeft = 60;

    if (tickSound) {
      tickSound.pause();
      tickSound.currentTime = 0;
    }

    timerDisplay.textContent = `${timeLeft}s`;
    timerDisplay.style.background = "#ffe680";
    timerDisplay.style.fontSize = "40px";
    timerDisplay.style.fontWeight = "bold";
    timerDisplay.style.textAlign = "center";

    timerInterval = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = `${timeLeft}s`;

      // ✅ tick continues even after NEXT
      if (tickSound && timeLeft > 0) {
        tickSound.currentTime = 0;
        tickSound.play().catch(() => {});
      }

      if (timeLeft <= 0) {
        clearInterval(timerInterval);

        if (tickSound) {
          tickSound.pause();
          tickSound.currentTime = 0;
        }

        if (buzzer) {
          buzzer.currentTime = 0;
          buzzer.play();
        }

        autoFinishSet();
      }
    }, 1000);
  }

  function autoFinishSet() {
    questionBox.style.display = "none";
    showAnswers();
  }

  // ----------------------------
  // ROUND LOGIC
  // ----------------------------
  function startRound(set) {
    activeQuestions = set;
    current = 0;
    houseSelect.style.display = "block";
    answerPanel.style.display = "none";
  }

  window.chooseHouse = function (houseId) {
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

 
  function showAnswers() {
    answerPanel.style.display = "block";
    answerPanel.style.height = "700px";
    answerPanel.style.overflowY = "auto";
    answerPanel.style.fontWeight = "bold";

    leftAnswers.innerHTML = "";
    rightAnswers.innerHTML = "";

    activeQuestions.forEach((item, i) => {
      const li = document.createElement("li");
      li.innerHTML = `<p style="font-size:30px;"><strong>${i + 1}. ${item.q}</strong><br>👉 ${item.a}<p><br><br>`;
      (i < 5 ? leftAnswers : rightAnswers).appendChild(li);
    });

    answerPanel.innerHTML += `
      <p style="font-size:30px">Enter number of correct answers:</p>
      <input type="number" id="correctCount" min="0" max="${activeQuestions.length}">
      <br><br>
      <button id="subs" onclick="submitScore()">Submit Score</button>
    `;
  }

  window.submitScore = function () {
    const correct = parseInt(document.getElementById("correctCount").value) || 0;
    const points = correct * 10;

    let data = JSON.parse(localStorage.getItem("houseScores")) || [
      { id: "red", score: 0 },
      { id: "blue", score: 0 },
      { id: "yellow", score: 0 },
      { id: "green", score: 0 }
    ];

    data.forEach(h => {
      if (h.id === selectedHouse) h.score += points;
    });

    localStorage.setItem("houseScores", JSON.stringify(data));
    alert(`✅ ${points} points added to ${selectedHouse.toUpperCase()}`);
  };

  // ----------------------------
  // START BUTTONS
  // ----------------------------
 document.getElementById("startBtn").onclick = () => {
    startRound(questions1);
   startBtn.style.display="none";}
  document.getElementById("startBtn1").onclick = () => {startRound(questions2);
   startBtn1.style.display="none";}
  document.getElementById("startBtn2").onclick = () =>{ startRound(questions3)
   startBtn2.style.display="none";};
  document.getElementById("startBtn3").onclick = () =>{ startRound(questions4)
   startBtn3.style.display="none";};

});
