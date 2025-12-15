let timerInterval;
let timeLeft = 30;
let currentQuestionIndex = null;
let selectedHouse = null;
let passList = [];
let passIndex = 0;

const houses = ["red", "blue", "yellow", "green"];

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

function getScores() {
  return JSON.parse(localStorage.getItem("houseScores")) || [
    { id: "red", name: "RED", score: 0 },
    { id: "blue", name: "BLUE", score: 0 },
    { id: "yellow", name: "YELLOW", score: 0 },
    { id: "green", name: "GREEN", score: 0 }
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

const buttonContainer = document.getElementById("buttonss");
const houseSelect = document.getElementById("houseSelect");
const questionBox = document.getElementById("questionBox");

function showQuestion2() {
  buttonContainer.style.display = "inline-block";
  document.getElementById("showQn").style.display = "none";
  document.querySelectorAll("#buttonss button").forEach(b => b.style.display = "inline-block");
}
document.getElementById("showQn").addEventListener("click", showQuestion2);

questions.forEach((q, i) => {
  const btn = document.createElement("button");
  btn.textContent = i + 1;
  btn.className = "quiz-btn";
  btn.style.display = "none";
  btn.style.width = "50px";

  btn.onclick = function () {
    currentQuestionIndex = i;
    passList = [];
    passIndex = 0;
    clearInterval(timerInterval);
    this.remove();
    houseSelect.style.display = "block";
  };
  buttonContainer.appendChild(btn);
});

document.querySelectorAll("#houseSelect button").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedHouse = btn.id;
    houseSelect.style.display = "none";
    questionBox.style.display = "block";

    // Reset question UI
    questionBox.innerHTML = `<div><h2>${questions[currentQuestionIndex].q}</h2></div>`;
    showAnswerButtons();

    // Timer logic: 30s first attempt, 10s after passes
    timeLeft = passIndex === 0 ? 30 : 10;
    startTimer();

    // Track which houses are still available
    passList = houses.filter(h => h !== selectedHouse);
  });
});

function showQuestion() {
  questionBox.innerHTML = `<div><h2>${questions[currentQuestionIndex].q}</h2></div>`;
}

function startTimer() {
  const timerText = document.getElementById("timerText");
  const timerBox = document.getElementById("timerBox");
  timerBox.style.display = "inline-block";
  timerBox.style.backgroundColor = "#ffe680";
  clearInterval(timerInterval);

  timerText.textContent = timeLeft + "s";

  timerInterval = setInterval(() => {
    timeLeft--;
    timerText.textContent = timeLeft + "s";
    if (timeLeft <= 5) timerBox.style.backgroundColor = "#ff6868";
    else if (timeLeft <= 10) timerBox.style.backgroundColor = "#ffd966";

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      wrongPressed();
    }
  }, 1000);
}

function showAnswerButtons() {
  const c = document.createElement("button");
  const w = document.createElement("button");

  c.textContent = "Correct";
  w.textContent = "Wrong";
  c.className = "quiz-btn";
  w.className = "quiz-btn";

  c.onclick = correctPressed;
  w.onclick = wrongPressed;

  questionBox.appendChild(document.createElement("br"));
  questionBox.appendChild(c);
  questionBox.appendChild(w);
}

function correctPressed() {
  clearInterval(timerInterval);
  if (passIndex === 0) updateScore(selectedHouse, 10);
  else updateScore(selectedHouse, 5);
  disableButtons();
  showCorrectAnswer();
  alert(passIndex === 0 ? "Correct! +10 points" : "Correct! +5 points");
}

function wrongPressed() {
  clearInterval(timerInterval);
  disableButtons();

  if (passIndex >= 3) {
    alert("All houses failed. Showing answer.");
    showCorrectAnswer();
    return;
  }

  passIndex++;
  alert("Choose a house to pass the question.");

  // Show house selection again
  houseSelect.style.display = "block";
  questionBox.style.display = "none"; // hide question until house is chosen
}

function disableButtons() {
  document.querySelectorAll("#questionBox button").forEach(b => b.disabled = true);
}

function showCorrectAnswer() {
  if (document.getElementById("correctAnswerText")) return;
  const p = document.createElement("p");
  p.id = "correctAnswerText";
  p.style.color = "green";
  p.style.fontWeight = "bold";
  p.style.fontSize = "25px";
  timerBox.style.display = "none";
  p.textContent = "Answer: " + questions[currentQuestionIndex].a;
  questionBox.appendChild(p);
}

document.getElementById("dsply").addEventListener("click", () => {
  if (currentQuestionIndex !== null) showCorrectAnswer();
});
