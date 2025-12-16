// ===============================
// SHOW / HIDE MODE BUTTONS
// ===============================
function Sight() {
  document.querySelectorAll('.sight').forEach(btn => btn.style.display = 'inline-block');
  document.getElementById('sight').style.display = 'none';
  document.getElementById('sound').style.display = 'none';
}

function Sound() {
  document.querySelectorAll('.sound').forEach(btn => btn.style.display = 'inline-block');
  document.getElementById('sight').style.display = 'none';
  document.getElementById('sound').style.display = 'none';
}

function back4() {
  document.querySelectorAll('.sight').forEach(btn => btn.style.display = 'none');
  document.getElementById('sight').style.display = 'inline-block';
  document.getElementById('sound').style.display = 'inline-block';
}

function back5() {
  document.querySelectorAll('.sound').forEach(btn => btn.style.display = 'none');
  document.getElementById('sight').style.display = 'inline-block';
  document.getElementById('sound').style.display = 'inline-block';
}

function showSightSound() {
  document.getElementById('sightSoundButtons').style.display = 'inline-block';
  document.getElementById('showSightSound').style.display = 'none';
}

// ===============================
// GLOBAL VARIABLES
// ===============================
let timerIntervalSS;
let timeLeftSS = 30;
let currentQuestionIndexSS = null;
let selectedHouseSS = null;
let currentModeSS = null;
let passCountSS = 0;

const buzzer = document.getElementById("buzzer");
const tickSound = document.getElementById("tickSound");
const hurraySound = document.getElementById("hurraySound");

// ===============================
// QUESTIONS
// ===============================
const sightQuestions = [
  { q: "What is shown in the image?", a: "Mount Everest", img: "https://tse4.mm.bing.net/th/id/OIF.glHbjpPHyrqeP1YjaosQfQ?rs=1&pid=ImgDetMain&o=7&rm=3" },
  { q: "Identify the monument.", a: "Taj Mahal", video: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { q: "Which animal is this?", a: "Snow Leopard", img: "https://via.placeholder.com/400x250?text=Sight+3" },
  { q: "Name the flag.", a: "Nepal", img: "https://via.placeholder.com/400x250?text=Sight+4" },
  { q: "Which painting style?", a: "Impressionism", img: "https://via.placeholder.com/400x250?text=Sight+5" }
];

const soundQuestions = [
  { q: "Identify the sound clip.", a: "Pink Panther Theme", audio: "anthem.mp3" },
  { q: "Which instrument is playing?", a: "Trumpet", audio: "https://www2.cs.uic.edu/~i101/SoundFiles/StarWars60.wav" },
  { q: "Guess the movie theme.", a: "Star Wars", audio: "https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand3.wav" },
  { q: "Identify the animal sound.", a: "Dog", audio: "https://www2.cs.uic.edu/~i101/SoundFiles/taunt.wav" },
  { q: "Which language is spoken?", a: "English", audio: "https://www2.cs.uic.edu/~i101/SoundFiles/gettysburg.wav" }
];

// ===============================
// SCORE HANDLING
// ===============================
function getScoresSS() {
  return JSON.parse(localStorage.getItem("houseScores")) || [
    { id: "red", name: "RED", score: 0 },
    { id: "blue", name: "BLUE", score: 0 },
    { id: "yellow", name: "YELLOW", score: 0 },
    { id: "green", name: "GREEN", score: 0 }
  ];
}

function saveScoresSS(data) {
  localStorage.setItem("houseScores", JSON.stringify(data));
}

function updateScoreSS(houseId, delta) {
  const data = getScoresSS();
  const house = data.find(h => h.id === houseId);
  if (house) {
    house.score = Math.max(0, house.score + delta);
  }
  saveScoresSS(data);
}

// ===============================
// DOM ELEMENTS
// ===============================
const questionBoxSS = document.getElementById("questionBoxSS");
const houseSelectSS = document.getElementById("houseSelectSS");
const answerTextSS = document.getElementById("answerText");
const timerTextSS = document.getElementById("timerTextSS");
const timerBoxSS = document.getElementById("timerBoxSS");

// ===============================
// UTILITIES
// ===============================
function clearQuestionAreaSS() {
  clearInterval(timerIntervalSS);              // 🔧 FIX: stop timer immediately
  questionBoxSS.innerHTML = "";
  questionBoxSS.style.display = "none";
  answerTextSS.textContent = "";
  timerBoxSS.style.display = "none";
  document.getElementById("generalimg").style.display = "block";
}

function getCurrentQuestionSS() {
  return currentModeSS === "sight"
    ? sightQuestions[currentQuestionIndexSS]
    : soundQuestions[currentQuestionIndexSS];
}


function myfunction(event) {
  const btn = event.target;
  const number = parseInt(btn.textContent.trim(), 10);

  currentModeSS = btn.classList.contains("sight") ? "sight" : "sound";
  currentQuestionIndexSS = number - 1;

  passCountSS = 0;
  timeLeftSS = 30;
  selectedHouseSS = null;

  clearQuestionAreaSS();

  btn.style.display = "none";
  houseSelectSS.style.display = "block";
}

// ===============================
// HOUSE SELECTION (TIMER STARTS HERE ONLY)
// ===============================
document.querySelectorAll("#houseSelectSS button").forEach(houseBtn => {
  houseBtn.addEventListener("click", () => {
    selectedHouseSS = houseBtn.id;
    houseSelectSS.style.display = "none";
    document.getElementById("generalimg").style.display = "none";

    const q = getCurrentQuestionSS();
    questionBoxSS.innerHTML = `<div>${q.q}</div>`;
    questionBoxSS.style.display = "block";

    if (q.img) {
      const img = document.createElement("img");
      img.src = q.img;
      img.style.cssText = "width:300px; height:200px; display:block; margin:auto;";
      questionBoxSS.appendChild(img);
    }

    if (q.video) {
      const video = document.createElement("video");
      video.src = q.video;
      video.controls = true;
      video.style.cssText = "width:300px; display:block; margin:auto;";
      questionBoxSS.appendChild(video);
    }

    if (q.audio) {
      const audio = document.createElement("audio");
      audio.src = q.audio;
      audio.controls = true;
      audio.style.cssText = "width:70%; display:block; margin:auto;";
      questionBoxSS.appendChild(audio);
    }
           // 🔧 FIX: timer starts ONLY after house selection
    showAnswerButtonsSS();
  });
});

// ===============================
// TIMER
// ===============================
function startTimerSS() {
  clearInterval(timerIntervalSS);               // 🔧 FIX: prevent multiple timers
  timerBoxSS.style.display = "inline-block";
  timerTextSS.textContent = `${timeLeftSS}s`;

  timerIntervalSS = setInterval(() => {
    timeLeftSS--;
    timerTextSS.textContent = `${timeLeftSS}s`;

    if (tickSound) {
      tickSound.currentTime = 0;
      tickSound.play();
    }

    if (timeLeftSS <= 0) {
      clearInterval(timerIntervalSS);
      timerBoxSS.style.display = "none";
      if (buzzer) buzzer.play();
      alert("⏰ Time up!");
    }
  }, 1000);
}


function showAnswerButtonsSS() {
  const btnCorrect = document.createElement("button");
  const btnWrong = document.createElement("button");
  const btnStart = document.createElement("button");

  btnCorrect.textContent = "Correct";
  btnWrong.textContent = "Wrong";
  btnStart.textContent = "Start Timer";
  btnCorrect.className = "btns";
  btnWrong.className = "btns";
  btnStart.className = "btns";
  btnCorrect.onclick = () => {
    updateScoreSS(selectedHouseSS, 10);
    clearInterval(timerIntervalSS);
    showCorrectAnswerSS(true);
    if (hurraySound) hurraySound.play();
  };
  btnStart.onclick = startTimerSS;
  btnWrong.onclick = handlePassSS;

  questionBoxSS.append(btnCorrect, btnWrong, btnStart);
}


function handlePassSS() {
  passCountSS++;

  clearInterval(timerIntervalSS);                // 🔧 FIX: stop timer on pass
  timerBoxSS.style.display = "none";

  if (passCountSS >= 4) {
    showCorrectAnswerSS(true);
    if (buzzer) buzzer.play();
    return;
  }

  timeLeftSS = passCountSS === 1 ? 15 : 10;
  houseSelectSS.style.display = "block";         // 🔧 FIX: waiting for house
}

// ===============================
// SHOW ANSWER
// ===============================
function showCorrectAnswerSS() {
  const q = getCurrentQuestionSS();
  answerTextSS.textContent = "Answer: " + q.a;
  answerTextSS.style.fontSize = "40px";
  answerTextSS.style.fontWeight = "bold";
  answerTextSS.style.color = "lightgreen";
}