let timerInterval;
let timeLeft = 30;
let currentQuestionIndex = null;
let selectedHouse = null;

// Questions (only first 6 will be used)
const questions = [
  { q: "What is your name?", a: "Your actual name", img: "https://tse4.mm.bing.net/th/id/OIF.glHbjpPHyrqeP1YjaosQfQ?rs=1&pid=ImgDetMain&o=7&rm=3" },
  { q: "Where do you live?", a: "Your location", img: "https://via.placeholder.com/200" },
  { q: "What is 2 + 2?", a: "4", img: "https://via.placeholder.com/200" },
  { q: "What is your favorite color?", a: "Any color", img: "https://via.placeholder.com/200" },
  { q: "Who is the CEO of Google?", a: "Sundar Pichai", img: "https://via.placeholder.com/200" },
  { q: "What is 10 + 5?", a: "15", img: "https://via.placeholder.com/200" }
];

// --- Score handling ---
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
document.getElementById("showQn").addEventListener("click", showQuestion2);

// Create question buttons (only 6)
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

  // ✅ Show house selection first
  houseSelect.style.display = "block";
  questionBox.style.display = "none"; // hide question until house is picked
};
  buttonContainer.appendChild(btn);
});

// House selection
document.querySelectorAll("#houseSelect button").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedHouse = btn.id;
    houseSelect.style.display = "none";

    // ✅ Now show question and image
    const q = questions[currentQuestionIndex];
    questionBox.innerHTML = `<div><h2>${q.q}<h2></div>`;
    document.getElementById("generalimg").style.display = "none";

    const img = document.createElement("img");
    img.src = q.img;
    img.className = "question-img";
    img.style.cursor = "pointer";
    img.style.marginTop = "10px";
    img.onclick = () => showImagePopup(img.src);

    questionBox.appendChild(img);
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

  btnCorrect.className = "quiz-btn";
  btnWrong.className = "quiz-btn";

  btnCorrect.onclick = () => {
    if (selectedHouse) {
      updateScore(selectedHouse, 10); // give selected house 10 points
    }
    disableAnswerButtons();
    showCorrectAnswer();
    alert("✅ Correct! +10 points added to " + selectedHouse.toUpperCase() + " house.");
  };

  btnWrong.onclick = () => {
    disableAnswerButtons();
    showCorrectAnswer();
    alert("❌ Wrong! No points.");
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

  // ✅ Hide timer
  document.getElementById("timerBox").style.display = "none";

  const answerText = document.createElement("p");
  answerText.id = "correctAnswerText";
  answerText.style.color = "green";
  answerText.style.fontWeight = "bold";
  answerText.style.fontSize ="25px";
  answerText.textContent = "Answer: " + questions[currentQuestionIndex].a;
  questionBox.appendChild(answerText);
}


// Display Answer button
document.getElementById("dsply").addEventListener("click", () => {
  if (currentQuestionIndex !== null) {
    showCorrectAnswer();
  }
});

// --- Image popup ---
function showImagePopup(src) {
  const overlay = document.createElement("div");
  overlay.id = "imgPopup";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0,0,0,0.8)";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = "9999";

  const bigImg = document.createElement("img");
  bigImg.src = src;
  bigImg.style.maxWidth = "80%";
  bigImg.style.maxHeight = "80%";
  bigImg.style.border = "5px solid white";
  bigImg.style.borderRadius = "10px";

  overlay.onclick = () => overlay.remove();

  overlay.appendChild(bigImg);
  document.body.appendChild(overlay);
}
