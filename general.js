// ===============================
// GLOBAL DATA
// ===============================
const questions = [
  "What is the capital of France?", "Which planet is known as the Red Planet?",
  "Who wrote 'Romeo and Juliet'?", "What is H2O commonly known as?",
  "Who discovered gravity?", "Which continent is the Sahara Desert located in?",
  "Who painted the Mona Lisa?", "Which gas do plants absorb from the atmosphere?",
  "What is the largest mammal in the world?", "Which festival is known as the 'Festival of Lights'?",
  "In which country are the Pyramids of Giza located?", "What is the boiling point of water in Celsius?",
  "Which organ pumps blood throughout the human body?", "Which is the smallest prime number?",
  "What color is chlorophyll?", "Which country is known as the Land of Rising Sun?"
];

const answers = [
  "Paris", "Mars", "William Shakespeare", "Water",
  "Isaac Newton", "Africa", "Leonardo da Vinci", "Carbon dioxide",
  "Blue whale", "Diwali", "Egypt", "100°C",
  "Heart", "2", "Green", "Japan"
];

// ===============================
// HOUSES
// ===============================
const houses = [
  { id: "red", name: "RED", color: "red", score: 0 },
  { id: "blue", name: "BLUE", color: "blue", score: 0 },
  { id: "yellow", name: "YELLOW", color: "gold", score: 0 },
  { id: "green", name: "GREEN", color: "green", score: 0 }
];

// ===============================
// STATE
// ===============================
let currentQuestion = -1;
let currentHouseIndex = -1;
let questionPassed = false;
let passCount = 0;
let timerInterval;
let remainingTime = 0;

// ===============================
// DOM REFERENCES
// ===============================
const leftContainer = document.querySelector(".questions");
const rightContainer = document.getElementById("questionDisplay");
const quizImg = document.getElementById("generalimg");
const stopBanner = document.getElementById("stop");
const buzzer = document.getElementById("buzzer");
const tickSound = document.getElementById("tickSound");
const hurraySound = document.getElementById("hurraySound");


// ===============================
// HOUSE CHOOSER
// ===============================
let houseChooserContainer = leftContainer.querySelector(".house-chooser");
if (!houseChooserContainer) {
  houseChooserContainer = document.createElement("div");
  houseChooserContainer.className = "house-chooser";
  houseChooserContainer.style.fontSize = "30px"
  houseChooserContainer.style.marginTop = "12px";
  leftContainer.appendChild(houseChooserContainer);
}

// ===============================
// RIGHT UI ELEMENTS
// ===============================
const timerBox = document.createElement("div");
timerBox.style.fontSize = "50px";
timerBox.style.marginTop = "10px";
timerBox.style.backgroundColor = "yellow";

const correctBtn = document.createElement("button");
correctBtn.textContent = "Correct";
correctBtn.className = "extra";
correctBtn.style.margin = "20px";
correctBtn.style.fontSize = "40px";


const wrongBtn = document.createElement("button");
wrongBtn.textContent = "Wrong";
wrongBtn.className = "extra";
wrongBtn.style.margin = "20px";
wrongBtn.style.fontSize = "40px";

// ===============================
// TIMER
// ===============================
function getTimeForPass(count) {
  if (count === 0) return 30;
  if (count === 1) return 15;
  return 10;
}

function startTimer(duration) {
  remainingTime = duration;
  updateTimerBox();
  if (stopBanner) stopBanner.style.display = "none";
  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    remainingTime--;
    updateTimerBox();

    if (tickSound && remainingTime > 0) {
      tickSound.currentTime = 0;
      tickSound.play();
    }

    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      if (tickSound) { tickSound.pause(); tickSound.currentTime = 0; }
      if (buzzer) { buzzer.currentTime = 0; buzzer.play(); }
      if (stopBanner) stopBanner.style.display = "block";
      handleTimeout();
    }
  }, 1000);
}

function updateTimerBox() {
  timerBox.textContent = `⏳ ${remainingTime}s`;
}

// ===============================
// HOUSE SELECTION
// ===============================
function renderHouseChooser(title = "🏠 Choose a House:") {
  houseChooserContainer.innerHTML = `<h4>${title}</h4>`;
  houses.forEach((house, index) => {
    const btn = document.createElement("button");
    btn.textContent = house.name;
    btn.className = "color";
    btn.style.backgroundColor = house.color;
     btn.style.height = "60px";
     btn.style.width = "100px";
     btn.style.fontSize = "20px";
     btn.style.fontWeight = "bold";
    btn.style.color = "white";
    btn.style.margin = "4px";
    btn.onclick = () => {
      currentHouseIndex = index;
      houseChooserContainer.innerHTML = "";
      displayQuestionRight(getTimeForPass(passCount));
    };
    houseChooserContainer.appendChild(btn);
  });
}

// ===============================
// DISPLAY QUESTION
// ===============================
function displayQuestionRight(time) {
  clearInterval(timerInterval);
  detachRightControls();
  if (currentQuestion === -1 || currentHouseIndex === -1) return;

  quizImg.style.display = "none";
  if (stopBanner) stopBanner.style.display = "none";

  rightContainer.innerHTML = `
    <h1>🎯 Question for ${houses[currentHouseIndex].name} House</h1>
    <p style="font-size:60px;">${questions[currentQuestion]}</p>
  `;

  rightContainer.appendChild(correctBtn);
  rightContainer.appendChild(wrongBtn);
  rightContainer.appendChild(timerBox);

  correctBtn.onclick = handleCorrect;
  wrongBtn.onclick = handleWrong;

  startTimer(time);
}


function handleCorrect() {
  clearInterval(timerInterval);
  if (tickSound) { tickSound.pause(); tickSound.currentTime = 0; }

  ensureHouseScores();
  const stored = JSON.parse(localStorage.getItem("houseScores"));
  const currentHouse = houses[currentHouseIndex];

  const updated = stored.map(h => {
    if (h.id === currentHouse.id) {
      h.score += questionPassed ? 5 : 10;
    }
    return h;
  });
  localStorage.setItem("houseScores", JSON.stringify(updated));

  rightContainer.innerHTML = `
    <h1>✅ Correct Answer:</h1>
    <p style="font-size:70px;color:green;"><b>${answers[currentQuestion]}</b></p>
  `;

 
  if (hurraySound) { hurraySound.currentTime = 0; hurraySound.play(); }
  setTimeout(() => {
    alert(`${currentHouse.name} +${questionPassed ? 5 : 10} points`);
    houseChooserContainer.innerHTML = "";
    showIntroRight();
  }, 500); // slight delay so sound triggers first
}

function handleWrong() {
  clearInterval(timerInterval);
  setTimeout(() => {
    alert(`❌ ${houses[currentHouseIndex].name} got it wrong`);
    passQuestion();
  }, 500);
}

// ===============================
// FLOW CONTROL
// ===============================
function detachRightControls() {
  [timerBox, correctBtn, wrongBtn].forEach(el => {
    if (el.parentNode) el.parentNode.removeChild(el);
  });
}

function showIntroRight() {
  clearInterval(timerInterval);
  if (tickSound) { tickSound.pause(); tickSound.currentTime = 0; }
  detachRightControls();
  quizImg.style.display = "block";
  if (stopBanner) stopBanner.style.display = "none";
}

function myFunction(n, btn) {
  currentQuestion = n - 1;
  questionPassed = false;
  passCount = 0;
  currentHouseIndex = -1;
  if (btn) btn.remove();
  renderHouseChooser();
}

function handleTimeout() {
  
  if (buzzer) { buzzer.currentTime = 0; buzzer.play(); }
  setTimeout(() => {
    alert(`⏰ Time's up for ${houses[currentHouseIndex].name}`);
    passQuestion();
  }, 500);
}

function passQuestion() {
  questionPassed = true;
  passCount++;
  if (tickSound) { tickSound.pause(); 
    tickSound.currentTime = 0; }

  if (passCount >= houses.length) {
    rightContainer.innerHTML = `
      <h2>📢 Correct Answer:</h2>
      <p style="font-size:30px;color:green;"><b>${answers[currentQuestion]}</b></p>
    `;
    houseChooserContainer.innerHTML = "";
    setTimeout(showIntroRight, 3000);
    return;
  }

  currentHouseIndex = -1;
  detachRightControls();
  renderHouseChooser("🏠 Choose next House:");
}


showIntroRight();
function ensureHouseScores() {
  const existing = localStorage.getItem("houseScores");
  if (!existing) {
    const defaultData = [
      { id: "red", name: "RED", color: "red", score: 0 },
      { id: "blue", name: "BLUE", color: "blue", score: 0 },
      { id: "yellow", name: "YELLOW", color: "yellow", score: 0 },
      { id: "green", name: "GREEN", color: "green", score: 0 }
    ];
    localStorage.setItem("houseScores", JSON.stringify(defaultData));
  }
}
