let timerInterval;
let timeLeft = 30;
let currentQuestionIndex = null;
let selectedHouse = null;

const buzzerSound = document.getElementById("buzzer");
const tickSound = document.getElementById("tickSound");
const hurraySound = document.getElementById("hurraySound");

// ===============================
// QUESTIONS
// ===============================
const questions = [
  { q: "What is your name?", a: "Your actual name", img: "https://via.placeholder.com/200" },
  { q: "Where do you live?", a: "Your location", img: "https://via.placeholder.com/200" },
  { q: "What is 2 + 2?", a: "4", img: "https://via.placeholder.com/200" },
  { q: "What is your favorite color?", a: "Any color", img: "https://via.placeholder.com/200" },
  { q: "Who is the CEO of Google?", a: "Sundar Pichai", img: "https://via.placeholder.com/200" },
  { q: "What is 10 + 5?", a: "15", img: "https://via.placeholder.com/200" }
];

// ===============================
// SCORE
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
    house.score = Math.max(0, house.score + delta);
  }
  saveScores(data);
}

// ===============================
// ELEMENTS
// ===============================
const buttonContainer = document.getElementById("buttonss");
const questionBox = document.getElementById("questionBox");
const houseSelect = document.getElementById("houseSelect");

// ===============================
// SHOW QUESTION NUMBERS
// ===============================
function showQuestion2() {
  buttonContainer.style.display = "inline-block";
  document.getElementById("showQn").style.display = "none";
  document.querySelectorAll("#buttonss button").forEach(btn => {
    btn.style.display = "inline-block";
  });
}
questionBox.style.fontSize = "55px";
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
// HOUSE SELECT
// ===============================
document.querySelectorAll("#houseSelect button").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedHouse = btn.id;
    houseSelect.style.display = "none";

    const q = questions[currentQuestionIndex];
    questionBox.innerHTML = `<div>${q.q}</div>`;
    document.getElementById("generalimg").style.display = "none";

    const img = document.createElement("img");
    img.src = q.img;
    img.className = "question-img";
    img.onclick = () => showImagePopup(img.src);

    questionBox.appendChild(img);
    questionBox.style.display = "block";

    startTimer();
    showAnswerButtons();
  });
});

// ===============================
// TIMER
// ===============================
function startTimer() {
  const timerText = document.getElementById("timerText");
  const timerBox = document.getElementById("timerBox");

  clearInterval(timerInterval);
  stopAllSounds();

  timerBox.style.display = "inline-block";
  timerBox.style.backgroundColor = "#ffe680";

  timerInterval = setInterval(() => {
    timeLeft--;
    timerText.textContent = timeLeft + "s";

    if (tickSound && timeLeft > 0) {
      tickSound.currentTime = 0;
      tickSound.play();
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      stopAllSounds();
      if (buzzerSound) buzzerSound.play();

      setTimeout(() => {
        alert("⏰ Time up!");
        disableAnswerButtons();
        showCorrectAnswer();
      }, 200);
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
  stopAllSounds();
  if (hurraySound) hurraySound.play();

  updateScore(selectedHouse, 10);

  setTimeout(() => {
    alert("✅ Correct! +10 points added to " + selectedHouse.toUpperCase());
    disableAnswerButtons();
    showCorrectAnswer();
  }, 200);
};

btnWrong.onclick = () => {
  clearInterval(timerInterval); 
  stopAllSounds();

  setTimeout(() => {
    alert("❌ Wrong! No points.");
    disableAnswerButtons();
    showCorrectAnswer();
  }, 200);
};

  questionBox.appendChild(document.createElement("br"));
  questionBox.appendChild(btnCorrect);
  questionBox.appendChild(btnWrong);
}

// ===============================
// HELPERS
// ===============================
function disableAnswerButtons() {
  document.querySelectorAll("#questionBox button").forEach(btn => btn.disabled = true);
}

function showCorrectAnswer() {
  if (document.getElementById("correctAnswerText")) return;

  document.getElementById("timerBox").style.display = "none";

  const p = document.createElement("p");
  p.id = "correctAnswerText";
  p.style.color = "green";
  p.style.fontSize = "40px";
  p.style.fontWeight = "bold";
  p.textContent = "Answer: " + questions[currentQuestionIndex].a;

  questionBox.appendChild(p);
}

function stopAllSounds() {
  [tickSound, buzzerSound, hurraySound].forEach(s => {
    if (s) {
      s.pause();
      s.currentTime = 0;
    }
  });
}

function showImagePopup(src) {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.background = "rgba(0,0,0,0.8)";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = "9999";

  const img = document.createElement("img");
  img.src = src;
  img.style.maxWidth = "80%";
  img.style.border = "5px solid white";
  img.style.borderRadius = "10px";

  overlay.onclick = () => overlay.remove();
  overlay.appendChild(img);
  document.body.appendChild(overlay);
}
