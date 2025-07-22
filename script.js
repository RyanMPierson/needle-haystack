
const haystack = document.getElementById('haystack');
const startBtn = document.getElementById('start-btn');
const timerSpan = document.getElementById('timer');
const resultSpan = document.getElementById('result');
const hintsToggle = document.getElementById('hints-toggle');
const gridSizeSelect = document.getElementById('grid-size');

let needleIndex = null;
let startTime = null;
let timerInterval = null;
let gameActive = false;
let gridSize = 20;
let HAY_COUNT = gridSize * gridSize;


function resetGame() {
    haystack.innerHTML = '';
    resultSpan.textContent = '';
    timerSpan.textContent = 'Time: 0.00s';
    gameActive = false;
    clearInterval(timerInterval);
}


function startGame() {
    resetGame();
    gridSize = Number(gridSizeSelect.value);
    HAY_COUNT = gridSize * gridSize;
    haystack.style.gridTemplateColumns = `repeat(${gridSize}, 30px)`;
    needleIndex = Math.floor(Math.random() * HAY_COUNT);
    for (let i = 0; i < HAY_COUNT; i++) {
        const hay = document.createElement('div');
        hay.classList.add('hay');
        hay.dataset.index = i;
        hay.style.position = 'relative';
        hay.addEventListener('click', onHayClick);
        haystack.appendChild(hay);
    }
    startTime = Date.now();
    gameActive = true;
    timerInterval = setInterval(updateTimer, 50);
}

function updateTimer() {
    if (!gameActive) return;
    const elapsed = (Date.now() - startTime) / 1000;
    timerSpan.textContent = `Time: ${elapsed.toFixed(2)}s`;
}


function onHayClick(e) {
    if (!gameActive) return;
    const idx = Number(e.target.dataset.index);
    const needleRow = Math.floor(needleIndex / gridSize);
    const needleCol = needleIndex % gridSize;
    const clickRow = Math.floor(idx / gridSize);
    const clickCol = idx % gridSize;

    if (idx === needleIndex) {
        e.target.classList.add('needle');
        gameActive = false;
        clearInterval(timerInterval);
        const elapsed = (Date.now() - startTime) / 1000;
        timerSpan.textContent = `Time: ${elapsed.toFixed(2)}s`;
        resultSpan.textContent = `You found the needle in ${elapsed.toFixed(2)} seconds!`;
        removeArrows();
    } else {
        e.target.style.opacity = '0.5';
        if (hintsToggle.checked) {
            showArrows(clickRow, clickCol, needleRow, needleCol, e.target);
        } else {
            removeArrows();
        }
    }
}

function showArrows(clickRow, clickCol, needleRow, needleCol, cell) {
    removeArrows();
    // Row arrow
    if (clickRow === needleRow) {
        if (clickCol < needleCol) {
            addArrow(cell, '→', 'row'); // right
        } else if (clickCol > needleCol) {
            addArrow(cell, '←', 'row'); // left
        }
    }
    // Column arrow
    if (clickCol === needleCol) {
        if (clickRow < needleRow) {
            addArrow(cell, '↓', 'col'); // down
        } else if (clickRow > needleRow) {
            addArrow(cell, '↑', 'col'); // up
        }
    }
    // Diagonal arrows
    if ((clickRow - clickCol) === (needleRow - needleCol)) {
        // This is a \ diagonal (top-left to bottom-right)
        if (clickRow < needleRow) {
            addArrow(cell, '↘', 'diag1'); // down-right
        } else if (clickRow > needleRow) {
            addArrow(cell, '↖', 'diag1'); // up-left
        }
    }
    if ((clickRow + clickCol) === (needleRow + needleCol)) {
        // This is a / diagonal (top-right to bottom-left)
        if (clickRow < needleRow) {
            addArrow(cell, '↙', 'diag2'); // down-left
        } else if (clickRow > needleRow) {
            addArrow(cell, '↗', 'diag2'); // up-right
        }
    }
}

function addArrow(cell, symbol, type) {
    const arrow = document.createElement('div');
    arrow.className = 'arrow';
    arrow.textContent = symbol;
    arrow.dataset.type = type;
    cell.appendChild(arrow);
}

function removeArrows() {
    document.querySelectorAll('.arrow').forEach(a => a.remove());
}

gridSizeSelect.addEventListener('change', () => {
    startGame();
});

startBtn.addEventListener('click', startGame);
