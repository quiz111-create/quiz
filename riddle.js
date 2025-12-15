let currentQuestionIndex = null;
let selectedHouse = null;
let timerInterval;
let timeLeft = 30;
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
  const house = data.find(h => h.id === houseId);
  if (house) {
    house.score += delta;
  }
  saveScores(data);
}



const questionBox = document.getElementById("questionBox");
const buttonContainer = document.getElementById("buttonss");
const houseSelect = document.getElementById("houseSelect");



document.getElementById("showQn").addEventListener("click", () => {
  buttonContainer.style.display = "block";
  document.getElementById("showQn").style.display = "none";
});


questions.forEach((q, i) => {
  const btn = document.createElement("button");
  btn.textContent = i + 1;
  btn.className = "quiz-btn";
  btn.style.width = "50px";
  btn.style.margin = "5px";
  btn.style.alignItems = "center"

  btn.onclick = () => {
    currentQuestionIndex = i;
    btn.remove();                
    houseSelect.style.display = "block";  
     clearInterval(timerInterval);
    timeLeft = 30;
  };

  buttonContainer.appendChild(btn);
});



document.querySelectorAll("#houseSelect button").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedHouse = btn.id;
    houseSelect.style.display = "none";
      clearInterval(timerInterval);
    timeLeft = 30;
 startTimer();
    showQuestion();
    showAnswerButtons();
  });
});



function showQuestion() {
  questionBox.style.display = "block";
  questionBox.innerHTML = `<div style="font-size:40px; font-weight:bold;">
    ${questions[currentQuestionIndex].q}
  </div><br>`;
}
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


function showAnswerButtons() {
  const correctBtn = document.createElement("button");
  const wrongBtn = document.createElement("button");

  correctBtn.textContent = "Correct";
  wrongBtn.textContent = "Wrong";

  correctBtn.className = "quiz-btn";
  wrongBtn.className = "quiz-btn";

  correctBtn.onclick = () => {
    updateScore(selectedHouse, 10);
    disableAnswerButtons();
    showCorrectAnswer();
    alert(`✅ Correct! +10 points to ${selectedHouse.toUpperCase()} house`);
    clearInterval(timerInterval);
     timeLeft=30;
  };

  wrongBtn.onclick = () => {
    disableAnswerButtons();
    showCorrectAnswer();
    alert("❌ Wrong! No points added");
    clearInterval(timerInterval);
    timeLeft=30;
    
  };

  questionBox.appendChild(correctBtn);
  questionBox.appendChild(wrongBtn);
}



function disableAnswerButtons() {
  document.querySelectorAll("#questionBox button").forEach(btn => {
    btn.disabled = true;
  });
}



function showCorrectAnswer() {
  if (document.getElementById("correctAnswerText")) return;

  const ans = document.createElement("p");
  ans.id = "correctAnswerText";
  ans.style.color = "green";
  ans.style.fontSize = "30px";
  ans.style.fontWeight = "bold";
  ans.textContent = "Answer: " + questions[currentQuestionIndex].a;

  timerBox.style.display = "none";

  questionBox.appendChild(ans);
}



document.getElementById("dsply").addEventListener("click", () => {
  if (currentQuestionIndex !== null) showCorrectAnswer();
});
