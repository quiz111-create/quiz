function revealSecond() {
  const second = document.getElementById("second");
  second.style.display = "block";
  second.scrollIntoView({ behavior: "smooth" });
}
function pageChange() {
  const selectedPage = document.getElementById("selectRound").value;
  if (selectedPage !== "#") {
    window.location.href = selectedPage;
  }
  else{
    alert("Please select a round!")
  }
}
function showQuestion() {
  const buttons = document.querySelectorAll('.question');
  buttons.forEach(button => {
    button.style.display = 'inline-block';
  });
  document.getElementById('showQn').style.display="none";
  image.style.display="none";
}
function showQuestion1() {
  const buttons = document.querySelectorAll('.startBtn');
  buttons.forEach(button => {
    button.style.display = 'inline-block';
  });
  document.getElementById('showQn').style.display="none";
  image.style.display="none";
}

        

      function timer(){
        document.getElementById("outer").style.display="block";
        document.getElementById("timer").style.display="block";
        document.getElementById("stops").style.display="block";
        document.getElementById("start").style.display="none";
      }
       const outer = document.getElementById('outer');
const stop = document.getElementById('stop');

outer.addEventListener('animationend', () => {
  stop.style.display = 'block'; 
});
function rapfunction1(){
  document.getElementById("q1").style.display="inline-block";
  document.getElementById("next1").style.display="inline-block";
}
function next1(){
  document.getElementById("q2").style.display="inline-block";
  document.getElementById("next2").style.display="inline-block";
  document.getElementById("q1").style.display="none";
   document.getElementById("next1").style.display="none";

}
function next2(){
  document.getElementById("q3").style.display="inline-block";
  document.getElementById("next3").style.display="inline-block";
  document.getElementById("q2").style.display="none";
   document.getElementById("next2").style.display="none";
  
}
function next3(){
  document.getElementById("q4").style.display="inline-block";
  document.getElementById("next4").style.display="inline-block";
  document.getElementById("q3").style.display="none";
   document.getElementById("next3").style.display="none";
  
}
function next4(){
  document.getElementById("q5").style.display="inline-block";
  document.getElementById("next5").style.display="inline-block";
  document.getElementById("q4").style.display="none";
   document.getElementById("next4").style.display="none";
  
}
function next5(){
  document.getElementById("q6").style.display="inline-block";
  document.getElementById("next6").style.display="inline-block";
  document.getElementById("q5").style.display="none";
   document.getElementById("next5").style.display="none";
  
}
function next6(){
  document.getElementById("q7").style.display="inline-block";
  document.getElementById("next7").style.display="inline-block";
  document.getElementById("q6").style.display="none";
   document.getElementById("next6").style.display="none";
  
}
function next7(){
  document.getElementById("q8").style.display="inline-block";
  document.getElementById("next8").style.display="inline-block";
  document.getElementById("q7").style.display="none";
   document.getElementById("next7").style.display="none";
  
}
function next8(){
  document.getElementById("q9").style.display="inline-block";
  document.getElementById("next9").style.display="inline-block";
  document.getElementById("q8").style.display="none";
   document.getElementById("next8").style.display="none";
  
}
function next9(){
  document.getElementById("q10").style.display="inline-block";
  document.getElementById("next10").style.display="inline-block";
  document.getElementById("q9").style.display="none";
   document.getElementById("next9").style.display="none";
}
function playSound() {
  document.getElementById("sound").play();
}