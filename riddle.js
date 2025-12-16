let timerInterval;
let timeLeft = 30;
let currentQuestionIndex = null;
let selectedHouse = null;

// 🔊 Sounds
const tickSound = document.getElementById("tickSound");
const buzzer = document.getElementById("buzzer");
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
  { q: "Which country do you like?", a: "Any country" },
  { q: "What is 10 + 5?", a: "15" },
  { q: "What is your dream job?", a: "Your dream job" },
  { q: "Which language do you speak?", a: "Your language" },
  { q: "What is your favorite food?", a: "Your favorite food" },
  { q: "What is the capital of India?", a: "New Delhi" },
  { q: "What year is it?", a: "2025" },
  { q: "What is your favorite movie?", a: "Your favorite movie" },
  { q: "What is your age?", a: "Your age" },
  { q: "What is your favorite sport?", a: "Your favorite sport" }
];

// ===============================
// SCORE STORAGE
// ===============================
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
// DOM ELEMENTS
// ===============================
const buttonContainer = document.getElementById("buttonss");
const questionBox = document.getElementById("questionBox");
const houseSelect = document.getElementById("houseSelect");
const timerBox = document.getElementById("timerBox");
const timerText = document.getElementById("timerText");

// ===============================
// SHOW QUESTION BUTTONS
// ===============================
function showQuestion2() {
  buttonContainer.style.display = "inline-block";
  document.getElementById("showQn").style.display = "none";
  document.querySelectorAll("#buttonss button").forEach(btn => {
    btn.style.display = "inline-block";
  });
}
questionBox.style.fontSize = "55px";
document.getElementById("showQn").addEventListener("click", showQuestion2);

// ===============================
// CREATE QUESTION BUTTONS
// ===============================
questions.forEach((q, index) => {
  const btn = document.createElement("button");
  btn.textContent = index + 1;
  btn.className = "quiz-btn";
  btn.style.display = "none";

  btn.onclick = function () {
    currentQuestionIndex = index;
    this.remove();

    clearInterval(timerInterval);
    timeLeft = 30;

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

    questionBox.innerHTML = `<div>${questions[currentQuestionIndex].q}</div>`;
    questionBox.style.display = "block";

    startTimer();
    showAnswerButtons();
  });
});

// ===============================
// TIMER WITH SOUND
// ===============================
function startTimer() {
  timerBox.style.display = "inline-block";
  timerBox.style.backgroundColor = "#ffe680";
  timerText.textContent = `${timeLeft}s`;

  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    timeLeft--;
    timerText.textContent = `${timeLeft}s`;

    // ⏱ Tick sound
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

      // 🔊 Buzzer BEFORE alert
      if (buzzer) {
        buzzer.currentTime = 0;
        buzzer.play();
      }

      setTimeout(() => {
        alert("⏰ Time up!");
        disableAnswerButtons();
        showCorrectAnswer();
        timerBox.style.display = "none";
      }, 400);
    }
  }, 1000);
}

// ===============================
// ANSWER BUTTONS
// ===============================
function showAnswerButtons() {
  const btnCorrect = document.createElement("button");
  const btnWrong = document.createElement("button");

  btnCorrect.textContent = "Correct";
  btnWrong.textContent = "Wrong";


  btnCorrect.className = btnWrong.className = "btns";

  btnCorrect.onclick = () => {
    clearInterval(timerInterval);

    if (tickSound) {
      tickSound.pause();
      tickSound.currentTime = 0;
    }

    if (hurraySound) {
      hurraySound.currentTime = 0;
      hurraySound.play();
    }

    if (selectedHouse) updateScore(selectedHouse, 10);

    disableAnswerButtons();
    showCorrectAnswer();
    timerBox.style.display = "none";

    setTimeout(() => {
      alert("✅ Correct! +10 points added to " + selectedHouse.toUpperCase() + " house.");
    }, 300);
  };

  btnWrong.onclick = () => {
    clearInterval(timerInterval);

    if (tickSound) {
      tickSound.pause();
      tickSound.currentTime = 0;
    }

  

    disableAnswerButtons();
    showCorrectAnswer();
    timerBox.style.display = "none";

    setTimeout(() => {
      alert("❌ Wrong! No points.");
    }, 300);
  };

  questionBox.appendChild(document.createElement("br"));
  questionBox.appendChild(btnCorrect);
  questionBox.appendChild(btnWrong);
}

// ===============================
// HELPERS
// ===============================
function disableAnswerButtons() {
  document.querySelectorAll("#questionBox button").forEach(btn => {
    btn.disabled = true;
  });
}

function showCorrectAnswer() {
  if (document.getElementById("correctAnswerText")) return;

  const answerText = document.createElement("p");
  answerText.id = "correctAnswerText";
  answerText.style.color = "green";
  answerText.style.fontWeight = "bold";
  answerText.style.fontSize = "40px";
  answerText.textContent = "Answer: " + questions[currentQuestionIndex].a;

  questionBox.appendChild(answerText);
}

// ===============================
// DISPLAY ANSWER BUTTON
// ===============================
document.getElementById("dsply").addEventListener("click", () => {
  if (currentQuestionIndex !== null) showCorrectAnswer();
});
