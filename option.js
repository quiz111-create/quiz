// quiz.js
document.addEventListener("DOMContentLoaded", () => {

  const quizBox = document.getElementById("quizBox");
  const showQnBtn = document.getElementById("showQn");
  const numberButtons = document.getElementById("numberButtons");
  const stopDiv = document.getElementById("stop");
  const houseSelect = document.getElementById("houseSelect");

  const buzzer = document.getElementById("buzzer");
  const tickSound = document.getElementById("tickSound");
  const hurraySound = document.getElementById("hurraySound");
  const sadSound = document.getElementById("sadSound");

  let timerInterval;
  let timeLeft = 30;
  let pendingQuestionIndex = null;

  // ===============================
  // HOUSES
  // ===============================
  let houses = JSON.parse(localStorage.getItem("houseScores")) || [
    { id: "red", name: "RED", color: "#ff4d4d", score: 0 },
    { id: "blue", name: "BLUE", color: "#66a3ff", score: 0 },
    { id: "yellow", name: "YELLOW", color: "#ffff66", score: 0 },
    { id: "green", name: "GREEN", color: "#4dff4d", score: 0 }
  ];

  let currentHouseIndex = null;

  // ===============================
  // QUESTIONS
  // ===============================
  const questions = [
    { q: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], correct: 1 },
    { q: "Who wrote 'Romeo and Juliet'?", options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"], correct: 1 },
    { q: "What is the largest mammal on Earth?", options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"], correct: 1 },
    { q: "Which gas do plants absorb from the atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], correct: 2 },
    { q: "What is the capital of France?", options: ["Rome", "Madrid", "Paris", "Berlin"], correct: 2 },
    { q: "Who painted the Mona Lisa?", options: ["Vincent Van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"], correct: 2 }
  ];

  // ===============================
  // SHOW QUESTIONS
  // ===============================
  showQnBtn.addEventListener("click", () => {
    document.querySelectorAll(".startBtn").forEach(btn => btn.classList.remove("hidden"));
    showQnBtn.style.display = "none";
    document.getElementById("generalimg").style.display = "none";
  });

  document.querySelectorAll(".startBtn").forEach((btn, idx) => {
    btn.addEventListener("click", () => {
      pendingQuestionIndex = idx + 1;
      houseSelect.style.display = "block";
      btn.remove();
    });
  });

  // ===============================
  // HOUSE SELECTION
  // ===============================
  const houseButtons = {
    red: document.getElementById("red"),
    blue: document.getElementById("blue"),
    yellow: document.getElementById("yellow"),
    green: document.getElementById("green")
  };

  Object.entries(houseButtons).forEach(([id, el]) => {
    el.addEventListener("click", () => chooseHouse(id));
  });

  function chooseHouse(houseId) {
    currentHouseIndex = houses.findIndex(h => h.id === houseId);
    houseSelect.style.display = "none";
    loadQuestion(pendingQuestionIndex);
  }

  // ===============================
  // LOAD QUESTION
  // ===============================
  function loadQuestion(index) {
    clearInterval(timerInterval);
    stopDiv.style.display = "none";
    timeLeft = 30;

    const qData = questions[index - 1];
    const currentHouse = houses[currentHouseIndex];

    quizBox.innerHTML = `
      <div style="background:${currentHouse.color};padding:8px;border-radius:10px;margin-bottom:10px;">
        <h1>Question for ${currentHouse.name} House</h1>
      </div>
      <div id="timerBox" class="timerBox">⏱ <span id="timerText">${timeLeft}s</span></div>
      <div id="questionText"><b>${qData.q}</b></div>
      <div id="optionsContainer" class="options-grid">
        ${qData.options
          .map((opt, i) => `<button class="option" onclick="checkAnswer(this, ${i}, ${qData.correct})">${opt}</button>`)
          .join("")}
      </div>
      <p id="answerText"></p>
    `;

    startTimer();
  }

  // ===============================
  // TIMER WITH SOUND
  // ===============================
  function startTimer() {
    const timerText = document.getElementById("timerText");
    const timerBox = document.getElementById("timerBox");

    timerInterval = setInterval(() => {
      timeLeft--;
      timerText.textContent = `${timeLeft}s`;

      // ⏱ Tick sound
      if (tickSound && timeLeft > 0) {
        tickSound.currentTime = 0;
        tickSound.play();
      }

      if (timeLeft <= 5) timerBox.style.backgroundColor = "#ff6868";
      else if (timeLeft <= 10) timerBox.style.backgroundColor = "#ffd966";
      else timerBox.style.backgroundColor = "#ffe680";

      if (timeLeft <= 0) {
        clearInterval(timerInterval);

        if (tickSound) {
          tickSound.pause();
          tickSound.currentTime = 0;
        }

        // 🔊 Buzzer BEFORE alert
        if (buzzer) {
          buzzer.currentTime = 0;
          buzzer.play();
        }

        setTimeout(() => {
          stopDiv.style.display = "block";
          disableOptions();
          showCorrectAnswer();
        }, 400);
      }
    }, 1000);
  }

  // ===============================
  // CHECK ANSWER
  // ===============================
  window.checkAnswer = function(btn, chosen, correct) {
    clearInterval(timerInterval);

    if (tickSound) {
      tickSound.pause();
      tickSound.currentTime = 0;
    }

    const options = document.querySelectorAll(".option");
    options.forEach((b, i) => {
      b.disabled = true;
      if (i === correct) b.classList.add("correct");
      else if (b === btn) b.classList.add("wrong");
    });

    if (chosen === correct) {
      houses[currentHouseIndex].score += 10;
      if (hurraySound) {
        hurraySound.currentTime = 0;
        hurraySound.play();
      }
    } else {
      if (sadSound) {
        sadSound.currentTime = 0;
        sadSound.play();
      }
    }

    saveScores();
    showCorrectAnswer();
  };

  function disableOptions() {
    document.querySelectorAll(".option").forEach(b => b.disabled = true);
  }

  function showCorrectAnswer() {
    const qData = questions[pendingQuestionIndex - 1];
    const answerText = document.getElementById("answerText");
    const timerBox = document.getElementById("timerBox");

    if (timerBox) timerBox.style.display = "none";

    answerText.textContent = "✅ Correct Answer: " + qData.options[qData.correct];
    answerText.style.color = "green";
    answerText.style.fontSize = "50px";
    answerText.style.fontWeight = "bold";
  }

  function saveScores() {
    localStorage.setItem("houseScores", JSON.stringify(houses));
  }

});
