const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const rows = 20;
const cols = 10;

const grid = Array.from({ length: rows }, () => Array(cols).fill(0));

let volume = 0;
let gameOver = false;

const volumeDisplay = document.getElementById("volumeDisplay");

// ---------------- PIECE ----------------

let piece = {
  x: 4,
  y: 0,
  shape: [
    [1, 1],
    [1, 1]
  ]
};

// ---------------- DRAW ----------------

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c]) {
        ctx.fillStyle = "lime";
        ctx.fillRect(c * 30, r * 30, 28, 28);
      }
    }
  }
}

function drawPiece() {
  ctx.fillStyle = "red";

  piece.shape.forEach((row, r) => {
    row.forEach((val, c) => {
      if (val) {
        ctx.fillRect((piece.x + c) * 30, (piece.y + r) * 30, 28, 28);
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
        grid[newY][newX]
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

// ---------------- SPAWN ----------------

function spawnPiece() {
  piece = {
    x: Math.floor(Math.random() * (cols - 2)),
    y: 0,
    shape: [[1, 1], [1, 1]]
  };
}

// ---------------- ROW CLEAR (EVIL MODE) ----------------

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
    volumeDisplay.innerText = `Volume: ${volume}%`;
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

// ---------------- DROP ----------------

function drop() {
  if (gameOver) return;

  piece.y++;

  if (collision()) {
    piece.y--;
    merge();
  }

  draw();
}

// ---------------- CONTROLS ----------------

document.addEventListener("keydown", (e) => {
  if (gameOver) return;

  setTimeout(() => {
    if (e.key === "ArrowLeft") piece.x--;
    if (e.key === "ArrowRight") piece.x++;
    if (e.key === "ArrowDown") piece.y++;

    if (collision()) {
      if (e.key === "ArrowLeft") piece.x++;
      if (e.key === "ArrowRight") piece.x--;
      if (e.key === "ArrowDown") piece.y--;
    }

    draw();
  }, 150);
});

// ---------------- RESET ----------------

function resetGame() {
  for (let r = 0; r < rows; r++) {
    grid[r].fill(0);
  }

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
  } else {
    alert("Current Volume: " + volume + "%");
  }
};

// ---------------- LOOP ----------------

setInterval(drop, 80);

// start
draw();