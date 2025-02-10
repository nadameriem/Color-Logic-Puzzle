const startPage = document.getElementById("start-page");
const gamePage = document.getElementById("game-page");
const startButton = document.getElementById("start-button");
const gridElement = document.getElementById("grid");
const checkButton = document.getElementById("check-button");
const messageElement = document.getElementById("message");
const levelElement = document.getElementById("level");
const timerElement = document.getElementById("timer");
const levelCompletePopup = document.getElementById("level-complete-popup");
const nextLevelButton = document.getElementById("next-level-button");
const gameCompletePopup = document.getElementById("game-complete-popup");
const restartButton = document.getElementById("restart-button");

// Game variables
let grid = [];
let colors = [];
let gridSize = 4;
let colorCount = 4;
let time = 0;
let timerInterval;
let currentLevel = 1;
let timerStarted = false; // Flag to track if the timer has started

// Switch to the game page when the Start Button is clicked
startButton.addEventListener("click", () => {
  startPage.classList.add("hidden");
  gamePage.classList.remove("hidden");
  initializeGame(); // Initialize the game when the page is shown
});

// Initialize the game
function initializeGame() {
  gridSize = currentLevel === 1 ? 4 : currentLevel === 2 ? 6 : 8;
  colorCount = currentLevel === 1 ? 4 : currentLevel === 2 ? 6 : 8;
  colors = generateColors(colorCount);
  grid = generateGrid(gridSize, colors);
  time = 0;
  timerStarted = false; // Reset the timer started flag
  clearInterval(timerInterval);
  timerElement.textContent = "0s"; // Reset timer display
  renderGrid();
  levelElement.textContent = currentLevel;
}

// Generate random colors
function generateColors(count) {
  const baseHue = Math.floor(Math.random() * 360); // Random starting hue
  const colorList = [];

  for (let i = 0; i < count; i++) {
    const hue = (baseHue + i * (360 / count)) % 360; // Evenly spaced hues
    colorList.push(`hsl(${hue}, 60%, 80%)`); // Light pastel colors
  }

  return colorList;
}

// Generate a grid with random colors
function generateGrid(size, colors) {
  const grid = [];
  for (let i = 0; i < size; i++) {
    grid[i] = [];
    for (let j = 0; j < size; j++) {
      grid[i][j] = colors[Math.floor(Math.random() * colors.length)];
    }
  }
  return grid;
}

// Render the grid
function renderGrid() {
  gridElement.innerHTML = "";
  gridElement.style.gridTemplateColumns = `repeat(${gridSize}, 50px)`;
  gridElement.style.gridTemplateRows = `repeat(${gridSize}, 50px)`;
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.style.backgroundColor = grid[i][j];
      cell.addEventListener("click", () => changeColor(i, j));
      gridElement.appendChild(cell);
    }
  }
}

// Change the color of a cell
function changeColor(i, j) {
  if (!timerStarted) {
    timerStarted = true;
    timerInterval = setInterval(updateTimer, 1000); // Start the timer on first click
  }

  const currentColor = grid[i][j];
  const currentIndex = colors.indexOf(currentColor);
  const nextIndex = (currentIndex + 1) % colors.length;
  grid[i][j] = colors[nextIndex];
  renderGrid();
}

// Check if the grid follows the rules
function checkProgress() {
  // Rule 1: No two adjacent cells (up, down, left, right) can have the same color
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const neighbors = [
        [i - 1, j], [i + 1, j], [i, j - 1], [i, j + 1] // Up, Down, Left, Right
      ];
      for (const [x, y] of neighbors) {
        if (x >= 0 && x < gridSize && y >= 0 && y < gridSize && grid[i][j] === grid[x][y]) {
          messageElement.textContent = "Invalid: Two adjacent cells have the same color!";
          return;
        }
      }
    }
  }

  // Rule 2: Each row and column must contain all colors
  for (let i = 0; i < gridSize; i++) {
    const rowColors = new Set(grid[i]);
    const colColors = new Set();
    for (let j = 0; j < gridSize; j++) {
      colColors.add(grid[j][i]);
    }
    if (rowColors.size !== colorCount || colColors.size !== colorCount) {
      messageElement.textContent = "Invalid: Each row and column must contain all colors!";
      return;
    }
  }

  // Level completed
  messageElement.textContent = "Valid: Great job!";
  clearInterval(timerInterval); // Stop the timer
  showLevelCompletePopup();
}

// Update the timer
function updateTimer() {
  time++;
  timerElement.textContent = `${time}s`; // Update the timer display
}

// Show level complete popup
function showLevelCompletePopup() {
  levelCompletePopup.classList.remove("hidden");
}

// Show game complete popup
function showGameCompletePopup() {
  gameCompletePopup.classList.remove("hidden");
}

// Go to the next level
nextLevelButton.addEventListener("click", () => {
  levelCompletePopup.classList.add("hidden");
  messageElement.textContent = ""; // Clear the message
  currentLevel++;
  if (currentLevel <= 3) {
    initializeGame();
  } else {
    showGameCompletePopup();
  }
});

// Restart the game
restartButton.addEventListener("click", () => {
  gameCompletePopup.classList.add("hidden");
  currentLevel = 1;
  initializeGame();
});

// Event listeners
checkButton.addEventListener("click", checkProgress);
