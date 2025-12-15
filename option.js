  // quiz.js
  document.addEventListener("DOMContentLoaded", () => {
    const quizBox = document.getElementById("quizBox");
    const showQnBtn = document.getElementById("showQn");
    const numberButtons = document.getElementById("numberButtons");
    const stopDiv = document.getElementById("stop");
    const houseSelect = document.getElementById("houseSelect");

    let timerInterval;
    let timeLeft = 30;
    let pendingQuestionIndex = null;

    
    let houses = JSON.parse(localStorage.getItem("houseScores")) || [
      { id: "red", name: "RED", color: "#ff4d4d", score: 0 },
      { id: "blue", name: "BLUE", color: "#66a3ff", score: 0 },
      { id: "yellow", name: "YELLOW", color: "#ffff66", score: 0 },
      { id: "green", name: "GREEN", color: "#4dff4d", score: 0 }
    ];

    let currentHouseIndex = null;

    // Questions
    const questions = [
      { q: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], correct: 1 },
      { q: "Who wrote 'Romeo and Juliet'?", options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"], correct: 1 },
      { q: "What is the largest mammal on Earth?", options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"], correct: 1 },
      { q: "Which gas do plants absorb from the atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], correct: 2 },
      { q: "What is the capital of France?", options: ["Rome", "Madrid", "Paris", "Berlin"], correct: 2 },
      { q: "Who painted the Mona Lisa?", options: ["Vincent Van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"], correct: 2 }
    ];

    
    showQnBtn.addEventListener("click", () => {
      document.querySelectorAll(".startBtn hidden").forEach(btn => btn.classList.remove("hidden"));
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
  function resetHouseColors() {
    // New updated colors
    const newHouses = [
      { id: "red", name: "RED", color: "#ff3333", score: 0 },      // change color here
      { id: "blue", name: "BLUE", color: "#3385ff", score: 0 },    // change color here
      { id: "yellow", name: "YELLOW", color: "#ffff66", score: 0 },// change color here
      { id: "green", name: "GREEN", color: "#4dff4d", score: 0 }   // change color here
    ];

    // Clear old values
    localStorage.removeItem("houseScores");

    // Save new values
    localStorage.setItem("houseScores", JSON.stringify(newHouses));

    alert("House colors reset! Page will reload.");
    location.reload();
  }


    
    const houseButtons = {
      red: document.getElementById("red"),
      blue: document.getElementById("blue"),
      yellow: document.getElementById("yellow"),
      green: document.getElementById("green"),
    };

    Object.entries(houseButtons).forEach(([id, el]) => {
      el.addEventListener("click", () => chooseHouse(id));
    });

    function chooseHouse(houseId) {
      currentHouseIndex = houses.findIndex(h => h.id === houseId);
      houseSelect.style.display = "none";
      alert("🏠 Selected House: " + houses[currentHouseIndex].name);
      loadQuestion(pendingQuestionIndex);
    }

    
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
  localStorage.removeItem("houseScores");

    
    function startTimer() {
      const timerText = document.getElementById("timerText");
      const timerBox = document.getElementById("timerBox");

      timerInterval = setInterval(() => {
        timeLeft--;
        timerText.textContent = `${timeLeft}s`;

        if (timeLeft <= 5) timerBox.style.backgroundColor = "#ff6868";
        else if (timeLeft <= 10) timerBox.style.backgroundColor = "#ffd966";
        else timerBox.style.backgroundColor = "#ffe680";

        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          stopDiv.style.display = "block";
          disableOptions();
          showCorrectAnswer();
        }
      }, 1000);
    }


    window.checkAnswer = function(selectedBtn, chosenIndex, correctIndex) {
      clearInterval(timerInterval);
      const options = document.querySelectorAll(".option");

      options.forEach((btn, i) => {
        btn.disabled = true;
        if (i === correctIndex) btn.classList.add("correct");
        else if (btn === selectedBtn && i !== correctIndex) btn.classList.add("wrong");
      });

      if (chosenIndex === correctIndex) {
        houses[currentHouseIndex].score += 10;
      }

      saveScores();
      showCorrectAnswer();
    };

    function disableOptions() {
      document.querySelectorAll(".option").forEach(btn => (btn.disabled = true));
    }

  function showCorrectAnswer() {
  const qData = questions[pendingQuestionIndex - 1];
  const answerText = document.getElementById("answerText");
  const timerBox = document.getElementById("timerBox");

  if (timerBox) timerBox.style.display = "none";

  answerText.textContent = "✅ Correct Answer: " + qData.options[qData.correct];
  answerText.style.color = "green"; 
  answerText.style.fontSize = "30px";
  answerText.style.fontWeight = "bold";
}


    function saveScores() {
      localStorage.setItem("houseScores", JSON.stringify(houses));
    }
  });
