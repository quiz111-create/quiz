document.addEventListener("DOMContentLoaded", function () {

let currentCategoryG = null;
let currentQuestionIndexG = null;
let selectedHouseG = null;
let timeLeftG = 30;
let timerIntervalG = null;

const QUESTIONS_G = {
  gold: [
    { q: "What is the chemical symbol for gold?", a: "Au" },
    { q: "Which country hosted the 2016 Olympics?", a: "Brazil" },
    { q: "Who wrote 'Hamlet'?", a: "William Shakespeare" },
    { q: "What is the capital of Australia?", a: "Canberra" },
    { q: "What is 25 x 4?", a: "100" }
  ],
  diamond: [
    { q: "What is the hardest natural substance?", a: "Diamond" },
    { q: "Who discovered gravity?", a: "Isaac Newton" },
    { q: "Which planet has rings?", a: "Saturn" },
    { q: "What is the boiling point of water?", a: "100°C" },
    { q: "Who painted the Mona Lisa?", a: "Leonardo da Vinci" }
  ],
  platinum: [
    { q: "What is the largest organ in the human body?", a: "Skin" },
    { q: "Which element has atomic number 1?", a: "Hydrogen" },
    { q: "What is the square root of 256?", a: "16" },
    { q: "Who invented the telephone?", a: "Alexander Graham Bell" },
    { q: "What is the capital of Canada?", a: "Ottawa" }
  ]
};

const elG = {
  startBtn: document.getElementById("startGambling"),
  gamblingButtons: document.getElementById("gamblingButtons"),
  houseSelect: document.getElementById("houseSelectG"),
  questionBox: document.getElementById("questionBox"),
  timerBox: document.getElementById("timerBox"),
  display: document.getElementById("Display"),
  generalImg: document.getElementById("generalimg")
};

// Start round
elG.startBtn.addEventListener("click", () => {
  elG.startBtn.style.display = "none";
  elG.gamblingButtons.style.display = "block";
});

["gold", "diamond", "platinum"].forEach(cat => {
  document.getElementById(cat).addEventListener("click", () => {
    document.querySelectorAll(".categorySet").forEach(set => set.style.display = "none");
    document.querySelector(`.categorySet.${cat}`).style.display = "block";
    elG.gamblingButtons.style.display = "none";
    currentCategoryG = cat;
  });
});

// Back buttons
["backGold", "backDiamond", "backPlatinum"].forEach(id => {
  const backBtn = document.getElementById(id);
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      document.querySelectorAll(".categorySet").forEach(set => set.style.display = "none");
      elG.gamblingButtons.style.display = "block";

      elG.questionBox.innerHTML = "";
      elG.display.textContent = "";
      elG.timerBox.textContent = "";

      clearInterval(timerIntervalG);
      currentCategoryG = null;
    });
  }
});

// Question click
document.querySelectorAll(".num").forEach(btn => {
  btn.addEventListener("click", e => {
    currentQuestionIndexG = parseInt(e.target.textContent.trim(), 10) - 1;
    e.target.disabled = true;
    e.target.style.opacity = "0.5";

    selectedHouseG = null;
    timeLeftG = 30;

    elG.houseSelect.style.display = "block";
    elG.generalImg.style.display = "none";
    elG.questionBox.innerHTML = "";
    elG.display.textContent = "";
    elG.timerBox.textContent = "";
  });
});

// House select
document.querySelectorAll("#houseSelectG button").forEach(hBtn => {
  hBtn.addEventListener("click", () => {
    selectedHouseG = hBtn.id.replace("G", "");
    elG.houseSelect.style.display = "none";

    const q = QUESTIONS_G[currentCategoryG][currentQuestionIndexG];
    elG.questionBox.innerHTML = `<div><h1>${q.q}</h1></div>`;
    elG.questionBox.style.display = "block";
    startTimerG(q.a);
    showAnswerButtonsG(q.a);
  });
});

// Timer
function startTimerG(answer) {
  clearInterval(timerIntervalG);
  timeLeftG = 30;
  elG.timerBox.textContent = `${timeLeftG}s`;
         if (timeLeftG <= 5) timerBox.style.backgroundColor = "#ff6868";
        else if (timeLeftG <= 10) timerBox.style.backgroundColor = "#ffd966";
        else timerBox.style.backgroundColor = "#ffe680";
  elG.timerBox.style.height = "50px";
  elG.timerBox.style.width = "150px";
  elG.timerBox.style.borderRadius = "20px";


   elG.timerBox.style.fontSize = "28px";   // adjust size as you like
  elG.timerBox.style.fontWeight = "bold"; // makes it bold
  elG.timerBox.style.textAlign = "center"; 
  timerIntervalG = setInterval(() => {
    timeLeftG--;
    elG.timerBox.textContent = `${timeLeftG}s`;
    
    if (timeLeftG <= 0) {
      clearInterval(timerIntervalG);
      showAnswerTextG(answer);
      disableAnswerButtonsG();
    }
  }, 1000);
}


function showAnswerButtonsG(answer) {
  const correctBtn = document.createElement("button");
  const wrongBtn = document.createElement("button");
  correctBtn.textContent = "Correct";
  wrongBtn.textContent = "Wrong";
  correctBtn.className = "quiz-action quiz-btn";
  wrongBtn.className = "quiz-action quiz-btn";

  correctBtn.onclick = () => {
    updateScoreG(selectedHouseG, scoreFor(currentCategoryG));
    alert(`✅ ${selectedHouseG.toUpperCase()} gains +${scoreFor(currentCategoryG)}!`);
    clearInterval(timerIntervalG);
    showAnswerTextG(answer);
    disableAnswerButtonsG();
  };

  wrongBtn.onclick = () => {
    updateScoreG(selectedHouseG, -scoreFor(currentCategoryG) / 2);
    alert(`❌ ${selectedHouseG.toUpperCase()} loses −${scoreFor(currentCategoryG) / 2}!`);
    clearInterval(timerIntervalG);
    showAnswerTextG(answer);
    disableAnswerButtonsG();
  };

  elG.questionBox.appendChild(document.createElement("br"));
  elG.questionBox.appendChild(correctBtn);
  elG.questionBox.appendChild(wrongBtn);
}

function disableAnswerButtonsG() {
  elG.questionBox.querySelectorAll(".quiz-action").forEach(btn => btn.disabled = true);
}

function showAnswerTextG(answer) {
  elG.display.style.fontSize = "30px";
  elG.display.style.color = "green";
  elG.display.textContent = "Answer: " + answer;
}

function scoreFor(cat) {
  if (cat === "gold") return 10;
  if (cat === "diamond") return 20;
  if (cat === "platinum") return 30;
  return 0;
}

function updateScoreG(houseId, delta) {
  const data = JSON.parse(localStorage.getItem("houseScores")) || [
    { id: "red", name: "RED", score: 0 },
    { id: "blue", name: "BLUE", score: 0 },
    { id: "yellow", name: "YELLOW", score: 0 },
    { id: "green", name: "GREEN", score: 0 }
  ];
  const house = data.find(h => h.id === houseId);
  if (house) {
    house.score += delta;
    if (house.score < 0) house.score = 0;
  }
  localStorage.setItem("houseScores", JSON.stringify(data));
}

});
