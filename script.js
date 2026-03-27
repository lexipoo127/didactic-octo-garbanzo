const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('#statusText');
const resetBtn = document.querySelector('#resetBtn');
const diffSelect = document.querySelector('#difficulty');

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let active = true;

const winPatterns = [
  [0,1,2], [3,4,5], [6,7,8], // Rows
  [0,3,6], [1,4,7], [2,5,8], // Cols
  [0,4,8], [2,4,6]           // Diagonals
];

// 1. Handle Clicks
cells.forEach(cell => {
  cell.addEventListener('click', () => {
    const index = cell.dataset.index;
    if (board[index] !== "" || !active) return;

    makeMove(index);

    // If it's AI's turn, wait half a second then move
    if (active && diffSelect.value !== "pvp" && currentPlayer === "O") {
      setTimeout(aiLogic, 500);
    }
  });
});

function makeMove(index) {
  board[index] = currentPlayer;
  cells[index].innerText = currentPlayer;
  cells[index].style.color = (currentPlayer === "X") ? "#00f3ff" : "#ff00c1";
  checkResult();
}

function checkResult() {
  let won = winPatterns.some(p => board[p[0]] && board[p[0]] === board[p[1]] && board[p[0]] === board[p[2]]);
  
  if (won) {
    statusText.innerText = `${currentPlayer} WINS!`;
    active = false;
  } else if (!board.includes("")) {
    statusText.innerText = "DRAW!";
    active = false;
  } else {
    currentPlayer = (currentPlayer === "X") ? "O" : "X";
    statusText.innerText = `${currentPlayer}'s Turn`;
  }
}

// 2. Simple AI Logic
function aiLogic() {
  const diff = diffSelect.value;
  let move = -1;

  if (diff === "hard") move = getSmartMove();
  if (diff === "normal") move = (Math.random() > 0.5) ? getSmartMove() : getRandomMove();
  if (diff === "easy" || move === -1) move = getRandomMove();

  if (move !== -1) makeMove(move);
}

function getRandomMove() {
  let available = board.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);
  return available[Math.floor(Math.random() * available.length)];
}

function getSmartMove() {
  // A. Can I win right now?
  for (let p of winPatterns) {
    let vals = p.map(i => board[i]);
    if (vals.filter(v => v === "O").length === 2 && vals.filter(v => v === "").length === 1) {
      return p[vals.indexOf("")];
    }
  }
  // B. Is the human about to win? Block them!
  for (let p of winPatterns) {
    let vals = p.map(i => board[i]);
    if (vals.filter(v => v === "X").length === 2 && vals.filter(v => v === "").length === 1) {
      return p[vals.indexOf("")];
    }
  }
  // C. Take the center if open
  if (board[4] === "") return 4;
  return -1; // Default to random if no smart move found
}

// 3. Play Again
resetBtn.addEventListener('click', () => {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  active = true;
  statusText.innerText = "X's Turn";
  cells.forEach(c => c.innerText = "");
});
