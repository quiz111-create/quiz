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
// GLOBAL DATA
// ===============================
const houses = [
  { id: "red", name: "RED", color: "red", score: 0 },
  { id: "blue", name: "BLUE", color: "blue", score: 0 },
  { id: "yellow", name: "YELLOW", color: "gold", score: 0 }, // gold looks better than pure yellow
  { id: "green", name: "GREEN", color: "green", score: 0 }
];

// ===============================
// LEFT: HOUSE SELECTION
// ===============================

// ===============================
// STATE
// ===============================
let currentQuestion = -1;
let currentHouseIndex = -1;
let questionPassed = false;
let passCount = 0; // 0 = first attempt, 1 = first pass, etc.
let timerInterval;
let remainingTime = 0;

// ===============================
// DOM REFERENCES
// ===============================
const leftContainer = document.querySelector(".questions"); // LEFT box
const rightContainer = document.getElementById("questionDisplay"); // RIGHT box
const quizImg = document.getElementById("generalimg");
const stopBanner = document.getElementById("stop");

// Make a dedicated house chooser in LEFT
let houseChooserContainer = leftContainer.querySelector(".house-chooser");
if (!houseChooserContainer) {
  houseChooserContainer = document.createElement("div");
  houseChooserContainer.className = "house-chooser";
  houseChooserContainer.style.marginTop = "12px";
  leftContainer.appendChild(houseChooserContainer);
}

// Reusable UI elements in RIGHT box
const timerBox = document.createElement("div");
timerBox.className = "timerBox";
timerBox.style.fontSize = "30px";
timerBox.style.marginTop = "10px";

const correctBtn = document.createElement("button");
correctBtn.textContent = "Correct";
correctBtn.className = "extraBtn";
correctBtn.style.margin = "10px";

const wrongBtn = document.createElement("button");
wrongBtn.textContent = "Wrong";
wrongBtn.className = "extraBtn";
wrongBtn.style.margin = "10px";

// ===============================
// TIMER (based on pass count, not house)
// ===============================
function getTimeForPass(count) {
  if (count === 0) return 30;  // First attempt
  if (count === 1) return 15;  // First pass
  return 10;                   // Second and third pass
}

function startTimer(duration) {
  remainingTime = duration;
  updateTimerBox();

  if (stopBanner) stopBanner.style.display = "none";
  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    remainingTime--;
    updateTimerBox();
    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      if (stopBanner) stopBanner.style.display = "block";
      handleTimeout();
    }
  }, 1000);
}
function updateTimerBox() {
  timerBox.textContent = `⏳ ${remainingTime}s`;
}

// ===============================
// LEFT: HOUSE SELECTION
// ===============================
function renderHouseChooser(title = "🏠 Choose a House:") {
  houseChooserContainer.innerHTML = `<h4 style="margin:8px 0;">${title}</h4>`;

  houses.forEach((house, index) => {
    const btn = document.createElement("button");
    btn.textContent = house.name;
    btn.className = "color";
    btn.style.margin = "4px";
    btn.style.backgroundColor = house.color;   // 🎨 set background color
    btn.style.color = "white";                 // ensure text is readable
    btn.style.fontWeight = "bold";             // make text pop
    btn.onclick = () => {
      currentHouseIndex = index;
      houseChooserContainer.innerHTML = "";
      displayQuestionRight(getTimeForPass(passCount));
    };
    houseChooserContainer.appendChild(btn);
  });
}

// ===============================
// RIGHT: DISPLAY QUESTION + CONTROLS
// ===============================
function displayQuestionRight(time) {
  clearInterval(timerInterval);
  detachRightControls();

  const q = questions[currentQuestion];
  const currentHouse = houses[currentHouseIndex];
  if (currentQuestion === -1 || currentHouse === undefined) return;

  quizImg.style.display = "none";
  if (stopBanner) stopBanner.style.display = "none";

  rightContainer.innerHTML = `
    <h3 style="font-size:20px;">🎯 Question for ${currentHouse.name} House</h3>
    <p style="font-size:30px; line-height:1.4;">${q}</p>
  `;
 
  rightContainer.appendChild(correctBtn);
  rightContainer.appendChild(wrongBtn);
   rightContainer.appendChild(timerBox);

  // Attach event listeners fresh each time to avoid stale handlers
  correctBtn.onclick = handleCorrect;
  wrongBtn.onclick = handleWrong;

  startTimer(time);
}

// ===============================
// BUTTON HANDLERS
// ===============================
function playConfetti() {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 }
  });
}

function playSound(id) {
  const sound = document.getElementById(id);
  if (sound) {
    sound.currentTime = 0;
    sound.play();
  }
}

function handleCorrect() {
  clearInterval(timerInterval);

  const currentHouse = houses[currentHouseIndex];
  ensureHouseScores();
  const stored = JSON.parse(localStorage.getItem("houseScores"));

  const updated = stored.map(h => {
    if (h.id === currentHouse.id) {
      h.score += questionPassed ? 5 : 10;
    }
    rightContainer.innerHTML = `
      <h2>📢 Correct Answer:</h2>
      <p style="font-size:30px; color:green;"><b>${answers[currentQuestion]}</b></p>
    `;
    return h;
  });

  localStorage.setItem("houseScores", JSON.stringify(updated));

  // 🎉 Confetti + Hurray sound
  playConfetti();
  playSound("hurraySound");

  alert(`✅ ${currentHouse.name} got it right! ${questionPassed ? "+5" : "+10"} points`);

  houseChooserContainer.innerHTML = "";
  showIntroRight();
}

function handleWrong() {
  clearInterval(timerInterval);

  // 😢 Boo + Sad sound
  playSound("sadSound");

  alert(`❌ ${houses[currentHouseIndex].name} got it wrong!`);
  passQuestion();
}

// ===============================
// UTIL: Detach controls from RIGHT
// ===============================
function detachRightControls() {
  [timerBox, correctBtn, wrongBtn].forEach(el => {
    if (el.parentNode) el.parentNode.removeChild(el);
  });
}

// ===============================
// FLOW HANDLERS
// ===============================
function showIntroRight() {
  clearInterval(timerInterval);
  detachRightControls();
  quizImg.style.display = "block";
  if (stopBanner) stopBanner.style.display = "none";
}
function stopSound(id) {
  const sound = document.getElementById(id);
  if (sound) {
    sound.pause();
    sound.currentTime = 0; // reset to start
  }
}

// Stop all sounds at once
function stopAllSounds() {
  stopSound("hurraySound");
  stopSound("sadSound");
  stopSound("booSound");
}

// HTML buttons call myFunction(n, this)
function myFunction(n, selectedBtn) {
  // 🛑 Stop any playing sounds before moving to new question
  stopAllSounds();

  currentQuestion = n - 1; // array is 0-based
  questionPassed = false;
  passCount = 0;
  currentHouseIndex = -1;

  if (selectedBtn) {
    selectedBtn.parentNode.removeChild(selectedBtn);
  }

  renderHouseChooser("🏠 Choose a House:");
}

function handleTimeout() {
  alert(`⏰ Time's up for ${houses[currentHouseIndex].name} House!`);
  passQuestion();
}

function passQuestion() {
  questionPassed = true;
  passCount++;

  // After the 4th pass (i.e., attempts by 4 houses), reveal the correct answer
  if (passCount >= houses.length) {
    alert("❌ All teams failed. Revealing the correct answer to audience.");
    detachRightControls();
    rightContainer.innerHTML = `
      <h2>📢 Correct Answer:</h2>
      <p style="font-size:30px; color:green;"><b>${answers[currentQuestion]}</b></p>
    `;
    houseChooserContainer.innerHTML = "";
    setTimeout(() => {
      showIntroRight();
    }, 3000);
    return;
  }

  // On pass: show the house chooser again (it was hidden after selection)
  alert("🔁 Question passed. Choose the next house.");
  currentHouseIndex = -1; // wait for new selection
  detachRightControls();
  renderHouseChooser("🏠 Choose next House:");
}

// ===============================
// INIT
// ===============================
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
