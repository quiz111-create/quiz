
let currentCategoryMB = null;
let currentQuestionIndexMB = null;
let selectedHouseMB = null;
let timeLeftMB = 30;
let timerIntervalMB = null;


const QUESTIONS_MB = {
  history: [
    { q: "Who was the first President of USA?", a: "George Washington" },
    { q: "In which year did WW2 end?", a: "1945" },
    { q: "Who built the pyramids?", a: "Ancient Egyptians" },
    { q: "Which empire was ruled by Julius Caesar?", a: "Roman Empire" },
    { q: "Where was Napoleon born?", a: "Corsica" }
  ],
  movies: [
    { q: "Who was the first President of USA?", a: "George Washington" },
    { q: "In which year did WW2 end?", a: "1945" },
    { q: "Who built the pyramids?", a: "Ancient Egyptians" },
    { q: "Which empire was ruled by Julius Caesar?", a: "Roman Empire" },
    { q: "Where was Napoleon born?", a: "Corsica" }
  ],
  science: [
    { q: "What is H2O?", a: "Water" },
    { q: "Who proposed relativity?", a: "Albert Einstein" },
    { q: "What planet is known as Red Planet?", a: "Mars" },
    { q: "What gas do plants release?", a: "Oxygen" },
    { q: "What is the speed of light?", a: "299,792 km/s" }
  ],
  sport: [
    { q: "Which country won FIFA 2018?", a: "France" },
    { q: "How many players in basketball team?", a: "5" },
    { q: "Where were 2020 Olympics held?", a: "Tokyo" },
    { q: "Which sport uses a shuttlecock?", a: "Badminton" },
    { q: "Who is known as 'The King of Clay'?", a: "Rafael Nadal" }
  ],
  maths: [
    { q: "What is 12 x 12?", a: "144" },
    { q: "Square root of 81?", a: "9" },
    { q: "Value of Pi (approx)?", a: "3.14" },
    { q: "Solve: 15 + 25", a: "40" },
    { q: "What is 7 factorial?", a: "5040" }
  ],

currentaffair: [
    { q: "What is 12 x 12?", a: "144" },
    { q: "Square root of 81?", a: "9" },
    { q: "Value of Pi (approx)?", a: "3.14" },
    { q: "Solve: 15 + 25", a: "40" },
    { q: "What is 7 factorial?", a: "5040" }
  ]
};


const el = {
  mixedBagButtons: document.getElementById("mixedBagButtons"),
  startBtn: document.getElementById("showMixedBag"),
  houseSelect: document.getElementById("houseSelectMB"),
  questionBox: document.getElementById("questionBoxMB"),
  timerBox: document.getElementById("timerBoxMB"),
  timerText: document.getElementById("timerTextMB"),
  answerText: document.getElementById("answerTextMB"),
  generalImg: document.getElementById("generalimgMB"),
  categoryHeaders: [
    document.getElementById("history"),
    document.getElementById("science"),
    document.getElementById("sport"),
    document.getElementById("maths"),
    document.getElementById("currentaffair"),
    document.getElementById("movies")
  ]
};


function showMixedBag() {
  document.querySelector(".main1").style.height = "auto";
  clearInterval(timerIntervalMB);
  resetQuestionAreaMB();
  el.mixedBagButtons.style.display = "block";
  el.startBtn.style.display = "none";
  el.generalImg.style.display = "block";
  hideAllQuestionButtons();
  showCategoryHeaders();
}


function History() { toggleCategory("history"); }
function Science() { toggleCategory("science"); }
function Sports()  { toggleCategory("sport"); }
function Maths()   { toggleCategory("maths"); }
function Currentaffair()   { toggleCategory("currentaffair"); }
function Movies() {toggleCategory("movies")}

function toggleCategory(cls) {
  clearInterval(timerIntervalMB);
  resetQuestionAreaMB();

 
  document.querySelectorAll(".categorySet").forEach(set => {
    set.style.display = "none";
  });

  
  const selectedSet = document.querySelector(`.categorySet.${cls}`);
  if (selectedSet) selectedSet.style.display = "block";

  el.categoryHeaders.forEach(h => h.style.display = "none");
  el.generalImg.style.display = "block";

  // ✅ Set current category here
  currentCategoryMB = cls;
}

function hideAllQuestionButtons() {
  document.querySelectorAll(".categorySet").forEach(set => {
    set.style.display = "none";
  });
}
function backHistory() { backToCategories("history"); 
  document.getElementById("houseSelectMB").style.display="none";
}
function backScience() { backToCategories("science");
  document.getElementById("houseSelectMB").style.display="none";
 }
function backSports()  { backToCategories("sport");
  document.getElementById("houseSelectMB").style.display="none";
 }
function backMaths()   { backToCategories("maths"); 
  document.getElementById("houseSelectMB").style.display="none";
}
function backMaths()   { backToCategories("maths"); 
  document.getElementById("houseSelectMB").style.display="none";
}
function backCurrentaffair()   { backToCategories("currentaffair");
  document.getElementById("houseSelectMB").style.display="none";
 }
 function backMovies()   { backToCategories("movies");
  document.getElementById("houseSelectMB").style.display="none";
 }
function backToCategories(cls) {
  clearInterval(timerIntervalMB);
  resetQuestionAreaMB();
  hideCategoryButtons(cls);
  showCategoryHeaders();
  el.generalImg.style.display = "block";
}

function myfunctionMB(event) {
  const btn = event.target;
  const number = parseInt(btn.textContent.trim(), 10);
  const category = btn.getAttribute("data-category");
  if (!category) return;

  currentCategoryMB = category;
  currentQuestionIndexMB = number - 1;
  selectedHouseMB = null;
  timeLeftMB = 30;

  btn.style.display = "none";
  clearInterval(timerIntervalMB);
  resetQuestionAreaMB();
  el.houseSelect.style.display = "block";
}



document.querySelectorAll("#houseSelectMB button").forEach(houseBtn => {
  houseBtn.addEventListener("click", () => {
    selectedHouseMB = houseBtn.id;
    el.houseSelect.style.display = "none";

    const q = QUESTIONS_MB[currentCategoryMB][currentQuestionIndexMB];
    el.questionBox.innerHTML = `<div style="height:70%; width:90%; background:#FFF4E8; border-radius:30px;"><h2>${q.q}</h2></div>`;
    el.questionBox.style.display = "block";

    startTimerMB(q.a);
    showAnswerButtonsMB(q.a);
  });
});


function startTimerMB(answer) {
  clearInterval(timerIntervalMB);
  timeLeftMB = 30;
  el.timerBox.style.display = "inline-block";
  el.timerText.textContent = `${timeLeftMB}s`;
  el.timerBox.style.backgroundColor = "#ffe680";

  timerIntervalMB = setInterval(() => {
    timeLeftMB--;
    el.timerText.textContent = `${timeLeftMB}s`;
    if (timeLeftMB <= 5) el.timerBox.style.backgroundColor = "#ff6868";
    else if (timeLeftMB <= 10) el.timerBox.style.backgroundColor = "#ffd966";

    if (timeLeftMB <= 0) {
      clearInterval(timerIntervalMB);
      el.timerBox.style.display = "none";
      showAnswerText(answer);
      disableAnswerButtonsMB();
    }
  }, 1000);
}

function showAnswerButtonsMB(answer) {
  el.questionBox.querySelectorAll(".quiz-action").forEach(b => b.remove());

  const btnCorrect = document.createElement("button");
  const btnWrong = document.createElement("button");

  btnCorrect.textContent = "Correct";
  btnWrong.textContent = "Wrong";
  btnCorrect.className = "quiz-action quiz-btn";
  btnWrong.className = "quiz-action quiz-btn";

  btnCorrect.onclick = () => {
    if (selectedHouseMB) {
      updateScoreMB(selectedHouseMB, 10);
      // 🎉 Prompt for correct answer
      alert(`✅ ${selectedHouseMB.toUpperCase()} House gains +10 points!`);
    }
    clearInterval(timerIntervalMB);
    el.timerBox.style.display = "none";
    showAnswerText(answer);
    disableAnswerButtonsMB();
  };

  btnWrong.onclick = () => {
    clearInterval(timerIntervalMB);
    el.timerBox.style.display = "none";
    // ❌ Prompt for wrong answer
    alert(`❌ ${selectedHouseMB ? selectedHouseMB.toUpperCase() : "House"} got it wrong. Passed to audience.`);
    showAnswerText(answer);
    disableAnswerButtonsMB();
  };

  el.questionBox.appendChild(document.createElement("br"));
  el.questionBox.appendChild(btnCorrect);
  el.questionBox.appendChild(btnWrong);
}

function disableAnswerButtonsMB() {
  el.questionBox.querySelectorAll(".quiz-action").forEach(btn => {
    btn.disabled = true;
  });
}


function updateScoreMB(houseId, delta) {
  const data = JSON.parse(localStorage.getItem("houseScores")) || [
    { id: "red", name: "RED", color: "red", score: 0 },
    { id: "blue", name: "BLUE", color: "blue", score: 0 },
    { id: "yellow", name: "YELLOW", color: "yellow", score: 0 },
    { id: "green", name: "GREEN", color: "green", score: 0 }
  ];
  const house = data.find(h => h.id === houseId);
  if (house) {
    house.score += delta;
    if (house.score < 0) house.score = 0;
  }
  localStorage.setItem("houseScores", JSON.stringify(data));
}


function resetQuestionAreaMB() {
  clearInterval(timerIntervalMB);

 
  el.questionBox.innerHTML = "";
  el.questionBox.style.display = "none";

  el.answerText.textContent = "";
  el.timerBox.style.display = "none";
  el.timerBox.style.backgroundColor = "#ffe680";

 
  el.questionBox.querySelectorAll(".quiz-action").forEach(b => b.remove());
}

function hideAllQuestionButtons() {
  ["history", "science", "sport", "maths","currentaffair"].forEach(cls => hideCategoryButtons(cls));
}

function hideCategoryButtons(cls) {
  document.querySelectorAll("." + cls).forEach(btn => {
    btn.style.display = "none";
  });
}

function showCategoryHeaders() {
  el.categoryHeaders.forEach(h => h.style.display = "inline-block");
}

function showAnswerText(answer) {
  el.answerText.textContent = "Answer: " + answer;

}
