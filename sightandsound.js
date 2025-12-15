
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


let timerIntervalSS;
let timeLeftSS = 30;
let currentQuestionIndexSS = null;
let selectedHouseSS = null;
let currentModeSS = null;
let passCountSS = 0;


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
    house.score += delta;
    if (house.score < 0) house.score = 0;
  }
  saveScoresSS(data);
}


const questionBoxSS = document.getElementById("questionBoxSS");
const houseSelectSS = document.getElementById("houseSelectSS");
const answerTextSS = document.getElementById("answerText");
const timerTextSS = document.getElementById("timerTextSS");
const timerBoxSS = document.getElementById("timerBoxSS");


function clearQuestionAreaSS() {
  clearInterval(timerIntervalSS);
  questionBoxSS.innerHTML = "";
  questionBoxSS.style.display = "none";
  answerTextSS.textContent = "";
  document.getElementById("generalimg").style.display = "block";
  timerBoxSS.style.display = "none";
}


function getCurrentQuestionSS() {
  return currentModeSS === "sight" ? sightQuestions[currentQuestionIndexSS] : soundQuestions[currentQuestionIndexSS];
}


function myfunction(event) {
  const btn = event.target;
  const number = parseInt(btn.textContent.trim(), 10);
  if (btn.classList.contains("sight")) {
    currentModeSS = "sight";
  } else if (btn.classList.contains("sound")) {
    currentModeSS = "sound";
  } else {
    return;
  }

  currentQuestionIndexSS = number - 1;
  passCountSS = 0;
  timeLeftSS = 30;
  selectedHouseSS = null;

  clearQuestionAreaSS();

  
  answerTextSS.style.fontSize = "20px";
  answerTextSS.style.fontWeight = "normal";
  answerTextSS.style.color = "inherit";

  
  btn.style.display = "none";

  houseSelectSS.style.display = "block";
}

document.querySelectorAll("#houseSelectSS button").forEach(houseBtn => {
  houseBtn.addEventListener("click", () => {
    selectedHouseSS = houseBtn.id;
    houseSelectSS.style.display = "none";
    document.getElementById("generalimg").style.display = "none";

    const q = getCurrentQuestionSS();
    questionBoxSS.innerHTML = `<div>${q.q}</div>`;
    questionBoxSS.style.display = "block";

  
    if (q.img) {
      const imgEl = document.createElement("img");
      imgEl.src = q.img;
      imgEl.style.cssText = "height:200px; width:300px; margin-top:10px; cursor:pointer; display:block; margin-left:auto; margin-right:auto;";
      questionBoxSS.appendChild(imgEl);
      imgEl.addEventListener("click", () => {
        document.getElementById("modalImg").src = q.img;
        document.getElementById("imgModal").style.display = "block";
      });
    }
    if (q.video) {
      const videoEl = document.createElement("video");
      videoEl.src = q.video;
      videoEl.controls = true;
      videoEl.style.cssText = "width:300px; height:200px; margin-top:10px; display:block; margin-left:auto; margin-right:auto;";
      questionBoxSS.appendChild(videoEl);
    }
    if (q.audio) {
      const audioEl = document.createElement("audio");
      audioEl.src = q.audio;
      audioEl.controls = true;
      audioEl.style.cssText = "width:70%; margin-top:10px; display:block; margin-left:auto; margin-right:auto;";
      questionBoxSS.appendChild(audioEl);
    }

    startTimerSS();
    showAnswerButtonsSS();
  });
});


document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("imgModal").style.display = "none";
});


function startTimerSS() {
  timerBoxSS.style.display = "inline-block";
  timerBoxSS.style.backgroundColor = "#ffe680";
  timerTextSS.textContent = `${timeLeftSS}s`;

  clearInterval(timerIntervalSS);
  timerIntervalSS = setInterval(() => {
    timeLeftSS--;
    timerTextSS.textContent = `${timeLeftSS}s`;

    if (timeLeftSS <= 5) timerBoxSS.style.backgroundColor = "#ff6868";
    else if (timeLeftSS <= 10) timerBoxSS.style.backgroundColor = "#ffd966";

    if (timeLeftSS <= 0) {
      clearInterval(timerIntervalSS);
      alert("⏰ Time up!");
      timerBoxSS.style.display = "none";
    }
  }, 1000);
}

function showAnswerButtonsSS() {
  
  questionBoxSS.querySelectorAll(".quiz-btn").forEach(b => b.remove());

  const btnCorrect = document.createElement("button");
  const btnWrong = document.createElement("button");
  const btnPass = document.createElement("button");

  btnCorrect.textContent = "Correct";
  btnWrong.textContent = "Wrong";
  btnPass.textContent = "Pass";

  btnCorrect.className = "quiz-btn";
  btnWrong.className = "quiz-btn";
  btnPass.className = "quiz-btn";

  btnCorrect.onclick = () => {
    if (selectedHouseSS) {
      updateScoreSS(selectedHouseSS, 10);
    }
    disableAnswerButtonsSS();

    clearInterval(timerIntervalSS);
    timerBoxSS.style.display = "none";

    showCorrectAnswerSS(true); 
    alert("✅ Correct! +10 points added to " + selectedHouseSS.toUpperCase() + " house.");
  };

  
  btnWrong.onclick = () => {
    alert("❌ Wrong! No points. Passing to next house.");
    handlePassSS();
  };

  
  btnPass.onclick = () => {
    handlePassSS();
  };

  
  questionBoxSS.appendChild(document.createElement("br"));
  questionBoxSS.appendChild(btnCorrect);
  questionBoxSS.appendChild(btnWrong);
  questionBoxSS.appendChild(btnPass);
}

function disableAnswerButtonsSS() {
  questionBoxSS.querySelectorAll("button.quiz-btn").forEach(btn => {
    btn.disabled = true;
  });
}


function handlePassSS() {
  passCountSS++;
  clearInterval(timerIntervalSS);
  disableAnswerButtonsSS();

 
  if (passCountSS >= 4) {
    alert("➡️ Passed/Wrong 4 times! Timer hidden, showing enlarged answer.");
    showCorrectAnswerSS(true); 
    timerBoxSS.style.display = "none";
    return;
  }

 
  if (passCountSS === 3) {
    timeLeftSS = 10;
    alert("➡️ Passed/Wrong to audience. Choose a house, 10s timer will run then answer revealed.");

   
    houseSelectSS.style.display = "block";

   
    startTimerSS();
    return;
  }

  
  if (passCountSS === 1) timeLeftSS = 15;
  else if (passCountSS === 2) timeLeftSS = 10;

  
  const q = getCurrentQuestionSS();
  questionBoxSS.innerHTML = `<div>${q.q}</div>`;
  answerTextSS.textContent = "";
  document.getElementById("generalimg").style.display = "none";


  houseSelectSS.style.display = "block";

  alert(`➡️ Passed/Wrong! Choose the next house. Time: ${timeLeftSS}s`);

 
  timerBoxSS.style.display = "none";
}

function showCorrectAnswerSS(enlarge = false) {
  const q = getCurrentQuestionSS();
  answerTextSS.textContent = "Answer: " + q.a;

  if (enlarge) {
    answerTextSS.style.fontSize = "40px"; 
    answerTextSS.style.fontWeight = "bold";
    answerTextSS.style.color = "lightgreen";  
  } else {
    answerTextSS.style.fontSize = "40px";   
    answerTextSS.style.fontWeight = "bold";
    answerTextSS.style.color="lightgreen";
  }
}
