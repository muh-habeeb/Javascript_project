// Function to update the UI with the latest scores
const initializeScore = () => {
  result.textContent = allScore.lastWinner; // Show the last winner result
  yScoreTxt.textContent = allScore.yScore;
  cScoreTxt.textContent = allScore.cScore;
  tScoreTxt.textContent = allScore.tScore;
};
window.addEventListener("DOMContentLoaded", initializeScore);

// Declare necessary variables
let autoplayInterval;
let item = ["rock", "paper", "scissor"];

// Select DOM elements
let result = document.querySelector(".result");
let yScoreTxt = document.getElementById("yScore");
let cScoreTxt = document.getElementById("cScore");
let tScoreTxt = document.getElementById("tScore");
let autoPlayBtn = document.getElementById("autoPlay");
let resetBtn = document.getElementById("resetBtn");
let stopPlayBtn = document.getElementById("stopPlay");
let optionBtn = document.querySelectorAll(".circle");

// Retrieve scores from localStorage or initialize them
let allScore = JSON.parse(localStorage.getItem("allScore")) || {
  lastWinner: "someone",
  cScore: 100,
  yScore: 100,
  tScore: 100,
};

// Track autoplay state
let isAutoPlaying = false;

// Function to check the result of the game
const check = (choice) => {
  let comp = item[Math.floor(Math.random() * 3)];

  if (comp === choice) {
    allScore.tScore += 1;
    allScore.lastWinner = "it's a tie";
  } else if (
    (comp === "rock" && choice === "paper") ||
    (comp === "scissor" && choice === "rock") ||
    (comp === "paper" && choice === "scissor")
  ) {
    allScore.yScore += 1;
    allScore.lastWinner = "you Win";
  } else {
    allScore.cScore += 1;
    allScore.lastWinner = "computer win";
  }

  // Update UI and localStorage
  initializeScore();
  localStorage.setItem("allScore", JSON.stringify(allScore));
};

// Function to start autoplay
const autoPlayFunc = () => {
  if (!isAutoPlaying) {
    isAutoPlaying = true;
    autoplayInterval = setInterval(() => {
      check(item[Math.floor(Math.random() * 3)]); // Pick a random choice
    }, 1000);

    // Disable buttons while autoplay is running
    optionBtn.forEach((btn) => (btn.disabled = true));
  }
};

// Function to stop autoplay
const stopAutoPLayFun = () => {
  clearInterval(autoplayInterval);
  isAutoPlaying = false;

  // Re-enable buttons after stopping autoplay
  optionBtn.forEach((btn) => (btn.disabled = false));
};

// Event listeners For Control Buttons
autoPlayBtn.addEventListener("click", autoPlayFunc);
stopPlayBtn.addEventListener("click", stopAutoPLayFun);
resetBtn.addEventListener("click", () => {
  // Reset scores
  allScore = {
    lastWinner: "someone",
    cScore: 100,
    yScore: 100,
    tScore: 100,
  };

  // Update localStorage and UI
  localStorage.setItem("allScore", JSON.stringify(allScore));
  stopAutoPLayFun();
  initializeScore();
});

// Key Management For R P S
document.addEventListener("keydown", (e) => {
  let keys = [
    e.key == "r",
    e.key == "p",
    e.key == "s",
    e.key == "R",
    e.key == "P",
    e.key == "S",
  ];
  if (keys[0] || keys[3]) {
    check("rock");
  } else if (keys[1] || keys[4]) {
    check("paper");
  } else if (keys[2] || keys[5]) {
    check("scissor");
  }
});
