const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const rows = 20;
const cols = 10;
const size = 30;

let grid = Array.from({ length: rows }, () => Array(cols).fill(0));

let volume = 0;
let gameOver = false;

const volumeDisplay = document.getElementById("volumeDisplay");

// ---------------- SHAPES ----------------

const shapes = [
  [[1,1,1,1]],

  [[1,1],[1,1]],

  [[0,1,0],[1,1,1]],

  [[1,0,0],[1,1,1]],

  [[0,0,1],[1,1,1]],

  [[0,1,1],[1,1,0]],

  [[1,1,0],[0,1,1]]
];

// ---------------- PIECE ----------------

let piece;

function spawnPiece() {
  const shape = shapes[Math.floor(Math.random() * shapes.length)];

  piece = {
    x: Math.floor(cols / 2) - 1,
    y: 0,
    shape: shape
  };
}

// ---------------- DRAW ----------------

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c]) {
        ctx.fillStyle = "lime";
        ctx.fillRect(c * size, r * size, size - 2, size - 2);
      }
    }
  }
}

function drawPiece() {
  ctx.fillStyle = "red";

  piece.shape.forEach((row, r) => {
    row.forEach((val, c) => {
      if (val) {
        ctx.fillRect((piece.x + c) * size, (piece.y + r) * size, size - 2, size - 2);
      }
    });
  });
}

function draw() {
  drawGrid();
  drawPiece();
}

// ---------------- COLLISION ----------------

function collision() {
  return piece.shape.some((row, r) =>
    row.some((val, c) => {
      if (!val) return false;

      let newX = piece.x + c;
      let newY = piece.y + r;

      return (
        newX < 0 ||
        newX >= cols ||
        newY >= rows ||
        (grid[newY] && grid[newY][newX])
      );
    })
  );
}

// ---------------- MERGE ----------------

function merge() {
  piece.shape.forEach((row, r) => {
    row.forEach((val, c) => {
      if (val) {
        grid[piece.y + r][piece.x + c] = 1;
      }
    });
  });

  clearRows();
  updateVolume();
  spawnPiece();
  checkGameOver();
}

// ---------------- ROW CLEAR ----------------

function clearRows() {
  let cleared = 0;

  for (let r = rows - 1; r >= 0; r--) {
    if (grid[r].every(cell => cell === 1)) {
      grid.splice(r, 1);
      grid.unshift(Array(cols).fill(0));
      cleared++;
      r++;
    }
  }

  if (cleared > 0) {
    volume = Math.max(0, volume - cleared * 10);
  }
}

// ---------------- VOLUME ----------------

function updateVolume() {
  let filled = grid.flat().filter(x => x === 1).length;
  volume = Math.min(100, Math.floor((filled / (rows * cols)) * 100));
  volumeDisplay.innerText = `Volume: ${volume}%`;
}

// ---------------- GAME OVER ----------------

function checkGameOver() {
  for (let c = 0; c < cols; c++) {
    if (grid[0][c] === 1) {
      gameOver = true;
      alert(`Try again 😭 Final Volume: ${volume}%`);
    }
  }
}

// ---------------- SPEED ----------------

function getSpeed() {
  let highest = grid.findIndex(row => row.some(cell => cell === 1));

  if (highest === -1) return 300;

  let height = rows - highest;
  return Math.max(100, 300 - height * 10); // safer speed
}

// ---------------- DROP ----------------

let isSoftDropping = false;

function drop() {
  if (gameOver) return;

  piece.y += isSoftDropping ? 2 : 1;

  if (collision()) {
    piece.y--;
    merge();
  }

  draw();
}

// ---------------- CONTROLS ----------------

document.addEventListener("keydown", (e) => {
  if (gameOver) return;

  if (e.key === "ArrowLeft") piece.x--;
  if (e.key === "ArrowRight") piece.x++;
  if (e.key === "ArrowDown") isSoftDropping = true;

  if (collision()) {
    if (e.key === "ArrowLeft") piece.x++;
    if (e.key === "ArrowRight") piece.x--;
  }

  draw();
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowDown") isSoftDropping = false;
});

// ---------------- RESET ----------------

function resetGame() {
  grid = Array.from({ length: rows }, () => Array(cols).fill(0));
  volume = 0;
  gameOver = false;

  volumeDisplay.innerText = "Volume: 0%";

  spawnPiece();
  draw();
}

// ---------------- BUTTON ----------------

document.getElementById("submitBtn").onclick = () => {
  if (gameOver) {
    resetGame();
    startGameLoop();
  } else {
    alert("Current Volume: " + volume + "%");
  }
};

// ---------------- LOOP (FIXED) ----------------

let gameInterval;

function startGameLoop() {
  clearInterval(gameInterval);

  gameInterval = setInterval(() => {
    drop();

    // update speed dynamically
    clearInterval(gameInterval);
    startGameLoop();

  }, getSpeed());
}

// ---------------- START ----------------

spawnPiece();
draw();
startGameLoop();
