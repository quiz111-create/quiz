// ===============================
// GLOBAL STATE
// ===============================
let timerInterval = null;
let timeLeft = 30;
let currentQuestionIndex = null;
let selectedHouse = null;
let passList = [];
let passIndex = 0;

const houses = ["red", "blue", "yellow", "green"];

// ===============================
// SOUNDS
// ===============================
const buzzer = document.getElementById("buzzer");
const tickSound = document.getElementById("tickSound");
const hurraySound = document.getElementById("hurraySound");

// ===============================
// QUESTIONS
// ===============================
const questions = [
  { q: "What is your name?", a: "Your actual name" },
  { q: "Where do you live?", a: "Your location" },
  { q: "What is 2 + 2?", a: "4" },
  { q: "What is your favorite color?", a: "Any color" },
  { q: "Who is the CEO of Google?", a: "Sundar Pichai" },
  { q: "What is your hobby?", a: "Your hobby" },
  { q: "What is your age?", a: "Your age" },
  { q: "What is your dream job?", a: "Your dream job" }
];

// ===============================
// SCORE STORAGE
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
  const h = data.find(x => x.id === houseId);
  if (h) h.score += delta;
  saveScores(data);
}

// ===============================
// DOM ELEMENTS
// ===============================
const buttonContainer = document.getElementById("buttonss");
const houseSelect = document.getElementById("houseSelect");
const questionBox = document.getElementById("questionBox");
const timerBox = document.getElementById("timerBox");
const timerText = document.getElementById("timerText");

// ===============================
// SHOW QUESTION NUMBERS
// ===============================
function showQuestion2() {
  buttonContainer.style.display = "inline-block";
  document.getElementById("showQn").style.display = "none";
  document.querySelectorAll("#buttonss button").forEach(b => {
    b.style.display = "inline-block";
  });
}
questionBox.style.fontSize = "55px";
document.getElementById("showQn").addEventListener("click", showQuestion2);

// ===============================
// CREATE QUESTION BUTTONS
// ===============================
questions.forEach((q, i) => {
  const btn = document.createElement("button");
  btn.textContent = i + 1;
  btn.className = "quiz-btn";
  btn.style.display = "none";

  btn.onclick = function () {
    currentQuestionIndex = i;
    passIndex = 0;
    selectedHouse = null;

    clearInterval(timerInterval);
    this.remove();

    houseSelect.style.display = "block";
    questionBox.style.display = "none";
  };

  buttonContainer.appendChild(btn);
});

// ===============================
// HOUSE SELECTION
// ===============================
document.querySelectorAll("#houseSelect button").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedHouse = btn.id;
    houseSelect.style.display = "none";

    questionBox.style.display = "block";
    questionBox.innerHTML = `<div>${questions[currentQuestionIndex].q}</div>`;
  
    showAnswerButtons();

    // ⏱ timer duration based on pass
    if (passIndex === 0) timeLeft = 30;
    else if (passIndex === 1) timeLeft = 15;
    else timeLeft = 10;

    startTimer();
  });
});

// ===============================
// TIMER (FIXED)
// ===============================
// ===============================
// TIMER (buzzer only when timer ends)
// ===============================
function startTimer() {
  clearInterval(timerInterval);

  timerBox.style.display = "inline-block";
  timerBox.style.backgroundColor = "#ffe680";
  timerText.textContent = `⏳ ${timeLeft}s`;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerText.textContent = `⏳ ${timeLeft}s`;

    if (tickSound && timeLeft > 0) {
      tickSound.currentTime = 0;
      tickSound.play();
    }

    if (timeLeft <= 5) timerBox.style.backgroundColor = "#ff6868";
    else if (timeLeft <= 10) timerBox.style.backgroundColor = "#ffd966";

    if (timeLeft <= 0) {
      clearInterval(timerInterval);

      if (tickSound) {
        tickSound.pause();
        tickSound.currentTime = 0;
      }

      // 🔔 buzzer plays immediately when time finishe

      handleTimeout();
    }
  }, 1000);
}
function handleTimeout() {
  disableButtons();

  if (passIndex >= 3) {
    // 🔔 buzzer before alert
    if (buzzer) {
      buzzer.currentTime = 0;
      buzzer.play();
    }

    alert("⏰ All houses failed!");
    showCorrectAnswer();
    return;
  }

  passIndex++;

  // 🔔 buzzer before alert
  if (buzzer) {
    buzzer.currentTime = 0;
    buzzer.play();
  }
  alert("⏰ Time up! Passing question.");

  houseSelect.style.display = "block";
  questionBox.style.display = "none";
}



// ===============================
// ANSWER BUTTONS
// ===============================
function showAnswerButtons() {
  const c = document.createElement("button");
  const w = document.createElement("button");

  c.textContent = "Correct";
  w.textContent = "Wrong";

  c.className = "btns";
  w.className = "btns";

  c.onclick = correctPressed;
  w.onclick = wrongPressed;

  questionBox.appendChild(document.createElement("br"));
  questionBox.appendChild(c);
  questionBox.appendChild(w);
}

// ===============================
// CORRECT
// ===============================
function correctPressed() {
  clearInterval(timerInterval);

  if (tickSound) {
    tickSound.pause();
    tickSound.currentTime = 0;
  }

  if (hurraySound) {
    hurraySound.currentTime = 0;
    hurraySound.play();
  }

  updateScore(selectedHouse, passIndex === 0 ? 10 : 5);
  disableButtons();
  showCorrectAnswer();

  alert(passIndex === 0 ? "✅ Correct! +10 points" : "✅ Correct! +5 points");
}

// ===============================
// WRONG
// ===============================
function wrongPressed() {
  clearInterval(timerInterval);

  if (tickSound) {
    tickSound.pause();
    tickSound.currentTime = 0;
  }

  disableButtons();

  if (passIndex >= 3) {
    alert("❌ All houses failed!");
    showCorrectAnswer();
    return;
  }

  passIndex++;
  alert("❌ Wrong! Passing question.");

  houseSelect.style.display = "block";
  questionBox.style.display = "none";
}

// ===============================
// HELPERS
// ===============================
function disableButtons() {
  document.querySelectorAll("#questionBox button").forEach(b => {
    b.disabled = true;
  });
}

function showCorrectAnswer() {
  if (document.getElementById("correctAnswerText")) return;

  timerBox.style.display = "none";

  const p = document.createElement("p");
  p.id = "correctAnswerText";
  p.style.color = "green";
  p.style.fontWeight = "bold";
  p.style.fontSize = "40px";
  p.textContent = "Answer: " + questions[currentQuestionIndex].a;

  questionBox.appendChild(p);
}


document.getElementById("dsply").addEventListener("click", () => {
  if (currentQuestionIndex !== null) showCorrectAnswer();
});
