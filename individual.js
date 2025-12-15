let timerInterval;
let timeLeft = 30;
let currentQuestionIndex = null;
let selectedHouse = null;

// Questions
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

// --- DOM elements ---
const buttonContainer = document.getElementById("buttonss");
const questionBox = document.getElementById("questionBox");
const houseSelect = document.getElementById("houseSelect");

// Show question buttons
function showQuestion2() {
  buttonContainer.style.display = "inline-block";
  document.getElementById("showQn").style.display = "none";
  document.querySelectorAll("#buttonss button").forEach(btn => {
    btn.style.display = "inline-block";
  });
}
questionBox.style.fontSize = "40px";
document.getElementById("showQn").addEventListener("click", showQuestion2);

// Create question buttons
// Create question buttons
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

    // show house selection first (do NOT show question yet)
    houseSelect.style.display = "block";
    questionBox.style.display = "none"; // hide until house chosen
  };

  buttonContainer.appendChild(btn);
});

// House selection
document.querySelectorAll("#houseSelect button").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedHouse = btn.id; // red, blue, yellow, green
    houseSelect.style.display = "none";

    // ✅ Now show the question after house is chosen
    questionBox.innerHTML = `<div>${questions[currentQuestionIndex].q}</div>`;
    questionBox.style.display = "block";

    startTimer();
    showAnswerButtons();
  });
});

// Timer
function startTimer() {
  const timerText = document.getElementById("timerText");
  const timerBox = document.getElementById("timerBox");
  timerBox.style.display = "inline-block";
  timerBox.style.backgroundColor = "#ffe680";

  timerInterval = setInterval(() => {
    timeLeft--;
    timerText.textContent = `${timeLeft}s`;

    if (timeLeft <= 5) timerBox.style.backgroundColor = "#ff6868";
    else if (timeLeft <= 10) timerBox.style.backgroundColor = "#ffd966";

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      alert("⏰ Time up!");
      disableAnswerButtons();
      showCorrectAnswer();
    }
  }, 1000);
}

// Show Correct/Wrong buttons
function showAnswerButtons() {
  const btnCorrect = document.createElement("button");
  const btnWrong = document.createElement("button");

  btnCorrect.textContent = "Correct";
  btnWrong.textContent = "Wrong";
  btnCorrect.style.height = "50px";
btnWrong.style.height = "50px";
btnCorrect.style.width = "150px";
btnWrong.style.width = "150px";
  btnCorrect.className = "quiz-btn";
  btnWrong.className = "quiz-btn";

  btnCorrect.onclick = () => {
    if (selectedHouse) {
      updateScore(selectedHouse, 10); // give selected house 10 points
    }
    disableAnswerButtons();
    showCorrectAnswer();
    alert("✅ Correct! +10 points added to " + selectedHouse.toUpperCase() + " house.");
   clearInterval(timerInterval);
    timeLeft = 30;
    timerBox.style.display="none";

  };


  btnWrong.onclick = () => {
    disableAnswerButtons();
    showCorrectAnswer();
    alert("❌ Wrong! No points.");
     clearInterval(timerInterval);
    timeLeft = 30;
    timerBox.style.display="none";

    
  };

  questionBox.appendChild(document.createElement("br"));
  questionBox.appendChild(btnCorrect);
  questionBox.appendChild(btnWrong);
}

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
  answerText.style.fontSize = "30px";
  answerText.textContent = "Answer: " + questions[currentQuestionIndex].a;
  questionBox.appendChild(answerText);
}

// Display Answer button
document.getElementById("dsply").addEventListener("click", () => {
  if (currentQuestionIndex !== null) {
    showCorrectAnswer();
  }
});
