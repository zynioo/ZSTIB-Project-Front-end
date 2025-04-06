<template>
  <main class="game-area">
    <div class="controls-container">
      <div class="difficulty">
        <button
          v-for="(label, level) in difficultyLevels"
          :key="level"
          :id="level"
          :class="{ active: difficulty === level }"
          @click="setDifficulty(level)"
        >
          <i :class="difficultyIcons[level]"></i> {{ label }}
        </button>
      </div>

      <div class="controls">
        <button id="new-game" @click="newGame">
          <i class="fas fa-sync-alt"></i> Nowa gra
        </button>
        <button
          id="check"
          @click="checkSolution"
          :disabled="checkButtonDisabled"
        >
          <i class="fas fa-check-circle"></i> Sprawdź
        </button>
        <button id="solve" @click="showSolution">
          <i class="fas fa-magic"></i> Rozwiąż
        </button>
        <button id="hint" @click="giveHint" :disabled="hintsRemaining <= 0">
          <i class="fas fa-lightbulb"></i> Podpowiedź
          <span class="hint-counter">{{ hintsRemaining }}</span>
        </button>
      </div>
    </div>

    <div id="message" class="message" :class="messageType" v-show="showMessage">
      {{ message }}
    </div>

    <div id="sudoku-container">
      <div id="sudoku-grid" class="sudoku-grid">
        <template v-for="(row, rowIndex) in 9">
          <div
            v-for="(col, colIndex) in 9"
            :key="`${rowIndex}-${colIndex}`"
            class="cell"
            :class="{
              'right-border': colIndex === 2 || colIndex === 5,
              'bottom-border': rowIndex === 2 || rowIndex === 5,
              prefilled: isPrefilled(rowIndex, colIndex),
              error: hasError(rowIndex, colIndex),
              selected: isSelected(rowIndex, colIndex),
              conflicts: hasConflict(rowIndex, colIndex),
              unavailable: isUnavailable(rowIndex, colIndex),
              correct: isCorrect(rowIndex, colIndex),
              hint: isHint(rowIndex, colIndex),
            }"
            :data-row="rowIndex"
            :data-col="colIndex"
            @click="selectCell(rowIndex, colIndex)"
          >
            {{ getCellDisplayValue(rowIndex, colIndex) }}
          </div>
        </template>
      </div>
    </div>

    <div class="number-pad" id="number-pad">
      <button
        v-for="num in 9"
        :key="num"
        class="number-btn"
        :class="{ completed: isNumberCompleted(num) }"
        :data-value="num"
        @click="enterNumber(num)"
      >
        {{ num }}
      </button>
    </div>

    <div class="controls">
      <button id="clear-cell" @click="clearSelectedCell">
        <i class="fas fa-eraser"></i> Wyczyść komórkę
      </button>
    </div>

    <div id="error-details" class="error-details" v-show="errorDetails">
      {{ errorDetails }}
    </div>
  </main>

  <!-- Confetti Container -->
  <div
    class="confetti-container"
    id="confetti-container"
    ref="confettiContainer"
  ></div>

  <!-- Winner Message -->
  <div class="winner-message" id="winner-message" v-show="showWinMessage">
    Gratuluję! Rozwiązałeś sudoku poprawnie!
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";

interface Cell {
  row: number;
  col: number;
}

interface CellState {
  prefilled: boolean;
  error: boolean;
  correct: boolean;
  conflicts: boolean;
  hint: boolean;
  value: number;
}

// Game state
const grid = ref<number[][]>(
  Array(9)
    .fill(0)
    .map(() => Array(9).fill(0))
);
const solution = ref<number[][]>(
  Array(9)
    .fill(0)
    .map(() => Array(9).fill(0))
);
const difficulty = ref<keyof typeof difficultyMap>("easy");
const difficultyMap = {
  easy: 40, // Cells to reveal
  medium: 30,
  hard: 25,
};

const difficultyLevels = {
  easy: "Łatwy",
  medium: "Średni",
  hard: "Trudny",
};

const difficultyIcons = {
  easy: "fas fa-star",
  medium: "fas fa-star-half-alt",
  hard: "fas fa-meteor",
};

// UI state
const selectedCell = ref<Cell | null>(null);
const selectedNumber = ref<number | null>(null);
const hintsRemaining = ref<number>(3);
const numberCounts = ref<number[]>(Array(10).fill(0));
const cellStates = reactive<Map<string, CellState>>(new Map());

const message = ref<string>("");
const showMessageVisible = ref<boolean>(false);
const messageType = ref<string>("");
const errorDetails = ref<string>("");
const checkButtonDisabled = ref<boolean>(false);
const showWinMessage = ref<boolean>(false);
const confettiContainer = ref<HTMLElement | null>(null);

// Track cell states
const getCellKey = (row: number, col: number): string => `${row}-${col}`;

const setCellState = (row: number, col: number, state: Partial<CellState>) => {
  const key = getCellKey(row, col);
  const currentState = cellStates.get(key) || {
    prefilled: false,
    error: false,
    correct: false,
    conflicts: false,
    hint: false,
    value: 0,
  };

  cellStates.set(key, { ...currentState, ...state });
};

const getCellState = (row: number, col: number): CellState => {
  const key = getCellKey(row, col);
  return (
    cellStates.get(key) || {
      prefilled: false,
      error: false,
      correct: false,
      conflicts: false,
      hint: false,
      value: 0,
    }
  );
};

// Cell state helper functions
const isPrefilled = (row: number, col: number): boolean => {
  return getCellState(row, col).prefilled;
};

const hasError = (row: number, col: number): boolean => {
  return getCellState(row, col).error;
};

const isSelected = (row: number, col: number): boolean => {
  return selectedCell.value?.row === row && selectedCell.value?.col === col;
};

const hasConflict = (row: number, col: number): boolean => {
  return getCellState(row, col).conflicts;
};

const isUnavailable = (row: number, col: number): boolean => {
  // Check if this cell is unavailable based on selected number
  if (!selectedNumber.value) return false;

  // Logic to check if this empty cell can't contain the selected number
  // because it's in the same row/column/box as a cell that already has this number
  return false; // Placeholder - real logic will be implemented in methods
};

const isCorrect = (row: number, col: number): boolean => {
  return getCellState(row, col).correct;
};

const isHint = (row: number, col: number): boolean => {
  return getCellState(row, col).hint;
};

const getCellDisplayValue = (row: number, col: number): string => {
  const value = getCellState(row, col).value;
  return value > 0 ? value.toString() : "";
};

const isNumberCompleted = (num: number): boolean => {
  return numberCounts.value[num] >= 9;
};

// Game Methods
const initializeGame = () => {
  // Initialize the grid with 9x9 cells
  const gridElement = document.getElementById("sudoku-grid");
  if (!gridElement) return;

  gridElement.innerHTML = "";

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = row.toString();
      cell.dataset.col = col.toString();

      if (col === 2 || col === 5) {
        cell.classList.add("right-border");
      }
      if (row === 2 || row === 5) {
        cell.classList.add("bottom-border");
      }

      cell.addEventListener("click", () => selectCell(row, col));
      gridElement.appendChild(cell);
    }
  }
};

const generateSudoku = () => {
  // Clear the grid
  grid.value = Array(9)
    .fill(0)
    .map(() => Array(9).fill(0));

  // Generate a solved sudoku
  solveSudoku(grid.value);

  // Save the solution
  solution.value = grid.value.map((row) => [...row]);

  // Create the puzzle by removing numbers based on difficulty
  createPuzzle();
};

const solveSudoku = (board: number[][]): boolean => {
  const emptyCell = findEmptyCell(board);
  if (!emptyCell) return true;

  const [row, col] = emptyCell;
  const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  for (const num of numbers) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;

      if (solveSudoku(board)) {
        return true;
      }

      board[row][col] = 0;
    }
  }

  return false;
};

const findEmptyCell = (board: number[][]): [number, number] | null => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        return [row, col];
      }
    }
  }
  return null;
};

const isValid = (
  board: number[][],
  row: number,
  col: number,
  num: number
): boolean => {
  // Check row
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) return false;
  }

  // Check column
  for (let i = 0; i < 9; i++) {
    if (board[i][col] === num) return false;
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[boxRow + i][boxCol + j] === num) return false;
    }
  }

  return true;
};

const shuffleArray = <T,>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const createPuzzle = () => {
  const cellsToReveal = difficultyMap[difficulty.value];
  const totalCells = 81;
  const cellsToHide = totalCells - cellsToReveal;

  const positions: [number, number][] = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      positions.push([i, j]);
    }
  }

  shuffleArray(positions);

  for (let i = 0; i < cellsToHide; i++) {
    const [row, col] = positions[i];
    grid.value[row][col] = 0;
  }
};

const renderGrid = () => {
  // Reset cell states
  cellStates.clear();

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const value = grid.value[row][col];

      if (value !== 0) {
        setCellState(row, col, {
          prefilled: true,
          value: value,
        });
      } else {
        setCellState(row, col, {
          value: 0,
        });
      }
    }
  }

  // Update number counts
  updateNumberCounts();
};

const selectCell = (row: number, col: number) => {
  // Clear previous highlighting
  clearUnavailableHighlighting();

  // Get the cell state
  const cellState = getCellState(row, col);

  // Don't allow selecting prefilled cells for input
  if (cellState.prefilled) {
    // If clicking on a cell with a number, highlight constraints
    if (cellState.value > 0) {
      highlightNumberConstraints(cellState.value);
    }
    return;
  }

  // If clicking on a correctly placed number, show constraints but don't select
  if (cellState.correct) {
    if (cellState.value > 0) {
      highlightNumberConstraints(cellState.value);
    }
    return;
  }

  // Select the cell
  selectedCell.value = { row, col };
};

const enterNumber = (value: number) => {
  if (!selectedCell.value) return;

  // Check if this number has reached its limit (9)
  if (numberCounts.value[value] >= 9) {
    return;
  }

  const { row, col } = selectedCell.value;

  // Get the current cell state
  const cellState = getCellState(row, col);

  // Clear any previous error states
  setCellState(row, col, {
    error: false,
    conflicts: false,
    correct: false,
    value: value,
  });

  // Validate the entry
  validateCell(row, col, value);

  // Update number counts and UI
  updateNumberCounts();

  // Remove constraint highlighting
  clearUnavailableHighlighting();
};

const highlightNumberConstraints = (number: number) => {
  // Set the selected number
  selectedNumber.value = number;

  // Find all cells that already contain the number (but only prefilled or correct ones)
  const cellsWithNumber: { row: number; col: number }[] = [];

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const state = getCellState(row, col);

      // Only count prefilled or correct numbers for constraints
      if (state.value === number && (state.prefilled || state.correct)) {
        cellsWithNumber.push({ row, col });
      }
    }
  }

  // Mark cells where the number cannot go
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const state = getCellState(row, col);

      // Skip cells that already have a number
      if (state.value !== 0) continue;

      // Check if this cell is in the same row, column or box as any cell with the number
      let isUnavailable = false;

      for (const position of cellsWithNumber) {
        // Same row
        if (position.row === row) {
          isUnavailable = true;
          break;
        }

        // Same column
        if (position.col === col) {
          isUnavailable = true;
          break;
        }

        // Same 3x3 box
        if (
          Math.floor(position.row / 3) === Math.floor(row / 3) &&
          Math.floor(position.col / 3) === Math.floor(col / 3)
        ) {
          isUnavailable = true;
          break;
        }
      }

      if (isUnavailable) {
        // Mark cell as unavailable
        const domCell = document.querySelector(
          `.cell[data-row="${row}"][data-col="${col}"]`
        );
        if (domCell) {
          domCell.classList.add("unavailable");
        }
      }
    }
  }
};

const clearUnavailableHighlighting = () => {
  document.querySelectorAll(".cell.unavailable").forEach((cell) => {
    cell.classList.remove("unavailable");
  });

  selectedNumber.value = null;
};

const validateCell = (row: number, col: number, value: number): boolean => {
  if (!value) {
    setCellState(row, col, { error: false, correct: false });
    clearConflicts();
    errorDetails.value = "";
    return true;
  }

  // Create a temporary board with current values
  const tempBoard = Array(9)
    .fill(0)
    .map(() => Array(9).fill(0));

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      tempBoard[r][c] = getCellState(r, c).value;
    }
  }

  // Temporarily remove the value we're checking
  tempBoard[row][col] = 0;

  const isValidMove = isValid(tempBoard, row, col, value);
  const isCorrectValue = value === solution.value[row][col];

  clearConflicts();

  if (!isValidMove || !isCorrectValue) {
    // Flag any value that's either invalid or doesn't match the solution as an error
    setCellState(row, col, { error: true, correct: false });

    // Only show conflicts for Sudoku rule violations
    if (!isValidMove) {
      showConflicts(row, col, value);
    }
  } else {
    // Only correct if both valid and matches solution
    setCellState(row, col, { error: false, correct: true });

    // Update number counts when a cell becomes correct
    updateNumberCounts();

    errorDetails.value = "";
  }

  return isValidMove;
};

const showConflicts = (row: number, col: number, value: number) => {
  let errorMessage = "Konflikt: ";
  let conflicts: string[] = [];

  // Check row
  for (let i = 0; i < 9; i++) {
    if (i !== col) {
      const state = getCellState(row, i);
      if (state.value === value) {
        setCellState(row, i, { conflicts: true });
        conflicts.push(`wiersz ${row + 1}`);
      }
    }
  }

  // Check column
  for (let i = 0; i < 9; i++) {
    if (i !== row) {
      const state = getCellState(i, col);
      if (state.value === value) {
        setCellState(i, col, { conflicts: true });
        conflicts.push(`kolumna ${col + 1}`);
      }
    }
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (boxRow + i !== row || boxCol + j !== col) {
        const state = getCellState(boxRow + i, boxCol + j);
        if (state.value === value) {
          setCellState(boxRow + i, boxCol + j, { conflicts: true });
          conflicts.push(`kwadrat 3x3`);
        }
      }
    }
  }

  // Set error details
  if (conflicts.length > 0) {
    // Filter for unique conflict types
    const uniqueConflicts = [...new Set(conflicts)];
    errorMessage += uniqueConflicts.join(", ");
    errorDetails.value = errorMessage;
  }
};

const clearConflicts = () => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (getCellState(row, col).conflicts) {
        setCellState(row, col, { conflicts: false });
      }
    }
  }
};

const setDifficulty = (level: "easy" | "medium" | "hard") => {
  difficulty.value = level;

  // Re-enable check button if disabled
  checkButtonDisabled.value = false;

  newGame();
};

const hideMessage = () => {
  showMessageVisible.value = false;
  message.value = "";
};

const newGame = () => {
  generateSudoku();
  renderGrid();
  hideMessage();
  clearSelectedCell();
  clearUnavailableHighlighting();

  // Reset selection and hints
  selectedCell.value = null;
  selectedNumber.value = null;
  hintsRemaining.value = 3;

  // Re-enable hint and check buttons
  checkButtonDisabled.value = false;

  // Reset number counts
  numberCounts.value = Array(10).fill(0);

  errorDetails.value = "";
  showWinMessage.value = false;
};

const checkSolution = () => {
  let isComplete = true;
  let isCorrect = true;

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const state = getCellState(row, col);
      const value = state.value;

      if (value === 0) {
        isComplete = false;
      }

      if (value !== 0 && value !== solution.value[row][col]) {
        isCorrect = false;
        setCellState(row, col, { error: true });
      }
    }
  }

  if (!isComplete) {
    showMessage("Nie wszystkie pola są wypełnione!", "error");
    showMessageVisible.value = true;
  } else if (!isCorrect) {
    showMessage("Rozwiązanie zawiera błędy!", "error");
  } else {
    showMessage("Gratulacje! Rozwiązałeś sudoku poprawnie!", "success");
    showWinAnimation();
  }
};

const showSolution = () => {
  // Clear any highlighted errors
  clearConflicts();
  clearUnavailableHighlighting();
  errorDetails.value = "";

  // Clear selected cell
  selectedCell.value = null;

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const state = getCellState(row, col);

      if (!state.prefilled) {
        setCellState(row, col, {
          value: solution.value[row][col],
          error: false,
          correct: true,
        });
      }
    }
  }

  // Refresh number counts after showing solution
  updateNumberCounts();

  showMessage("Oto rozwiązanie sudoku!", "success");

  // Disable the check button after solving
  checkButtonDisabled.value = true;
};

const showMessage = (text: string, type: "success" | "error") => {
  message.value = text;
  showMessageVisible.value = true;
  showMessage.value = true;
};

showMessageVisible.value = false;
showMessage.value = false;

const giveHint = () => {
  if (!selectedCell.value || hintsRemaining.value <= 0) {
    return;
  }

  const { row, col } = selectedCell.value;
  const state = getCellState(row, col);

  // Don't give hints for prefilled cells or cells already filled correctly
  if (state.prefilled || state.correct) {
    return;
  }

  // Get the correct value from solution
  const correctValue = solution.value[row][col];

  // Check if this number has reached its limit (9)
  if (numberCounts.value[correctValue] >= 9) {
    return;
  }

  // Update the cell with the correct value
  setCellState(row, col, {
    value: correctValue,
    hint: true,
    correct: true,
    error: false,
    conflicts: false,
  });

  // Decrease hints
  hintsRemaining.value--;

  // Update number counts
  updateNumberCounts();

  // Clear error messages and conflicts
  clearConflicts();
  errorDetails.value = "";
};

const clearSelectedCell = () => {
  if (!selectedCell.value) return;

  const { row, col } = selectedCell.value;

  // Clear cell content
  setCellState(row, col, {
    value: 0,
    error: false,
    correct: false,
    conflicts: false,
    hint: false,
  });

  // Clear any conflict highlighting
  clearConflicts();

  // Update number counts after removing a number
  updateNumberCounts();

  // Remove constraint mode check
  clearUnavailableHighlighting();

  errorDetails.value = "";
};

const updateNumberCounts = () => {
  // Reset counts
  numberCounts.value = Array(10).fill(0);

  // Count each correct number on the board
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const state = getCellState(row, col);
      const value = state.value;

      // Only count correct or prefilled numbers
      if (value > 0 && (state.correct || state.prefilled)) {
        numberCounts.value[value]++;
      }
    }
  }
};

const showWinAnimation = () => {
  showWinMessage.value = true;

  // Create confetti animation
  if (!confettiContainer.value) return;

  // Clear any existing confetti
  confettiContainer.value.innerHTML = "";
  confettiContainer.value.style.display = "block";

  // Create confetti pieces
  const colors = [
    "#ffc107",
    "#ff5757",
    "#007b41",
    "#009e52",
    "#e6ac00",
    "#ffffff",
  ];

  for (let i = 0; i < 200; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";

    // Random position, color, delay, and shape
    const left = Math.random() * 100 + "%";
    const color = colors[Math.floor(Math.random() * colors.length)];
    const delay = Math.random() * 3;
    const size = Math.random() * 10 + 5;
    const shape = Math.random() > 0.5 ? "50%" : "0";

    confetti.style.left = left;
    confetti.style.backgroundColor = color;
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
    confetti.style.borderRadius = shape;
    confetti.style.animationDelay = `${delay}s`;

    confetti.classList.add("active");
    confettiContainer.value.appendChild(confetti);
  }

  // Hide confetti after animation completes
  setTimeout(() => {
    if (confettiContainer.value) {
      confettiContainer.value.style.display = "none";
      showWinMessage.value = false;
    }
  }, 7000);
};

// Initialize the game on component mount
onMounted(() => {
  confettiContainer.value = document.getElementById("confetti-container");
  newGame();
});
</script>

<style scoped>
:root {
  --sudoku-primary: #007b41;
  --sudoku-primary-light: #009e52;
  --sudoku-primary-dark: #005730;
  --sudoku-secondary: #1e1e1e;
  --sudoku-accent: #ffc107;
  --sudoku-accent-dark: #e6ac00;
  --sudoku-text: #ffffff;
  --sudoku-border: #2e2e2e;
  --sudoku-dark: #005f2f;
  --sudoku-hover: #005f2f;
  --sudoku-background: #121212;
  --sudoku-card-bg: #1c1c1c;
}

* {
  box-sizing: border-box;
}

.game-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

/* Controls area */
.controls-container {
  width: 100%;
  margin-bottom: 20px;
  background-color: var(--sudoku-card-bg);
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.difficulty {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  justify-content: center;
}

.controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

button {
  font-family: "Quicksand", sans-serif;
  font-weight: 600;
  padding: 12px 16px;
  background-color: var(--sudoku-primary);
  color: var(--sudoku-text);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 6px;
}

button:hover {
  background-color: var(--sudoku-primary-light);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

button:active {
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

button:disabled {
  background-color: #333;
  cursor: not-allowed;
  opacity: 0.5;
  transform: none;
}

.difficulty button {
  background-color: var(--sudoku-secondary);
  border: 1px solid var(--sudoku-border);
  flex: 1;
}

.difficulty button:hover {
  background-color: var(--sudoku-dark);
}

.difficulty button.active {
  background-color: var(--sudoku-primary);
  color: var (--sudoku-text);
  font-weight: bold;
  border: 1px solid var(--sudoku-accent);
  position: relative;
}

.difficulty button.active::after {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  background-color: var(--sudoku-accent);
  border-radius: 50%;
}

/* Main game area */
#sudoku-container {
  border: 2px solid var(--sudoku-border);
  margin-bottom: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  overflow: hidden;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

#sudoku-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.6);
}

.sudoku-grid {
  display: grid;
  grid-template-columns: repeat(9, 50px);
  grid-template-rows: repeat(9, 50px);
  gap: 1px;
  background-color: var(--sudoku-border);
}

.cell {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--sudoku-secondary);
  font-size: 20px;
  cursor: pointer;
  color: var(--sudoku-text);
  transition:
    background-color 0.2s,
    transform 0.1s;
}

.cell:hover:not(.prefilled):not(.unavailable) {
  background-color: var(--sudoku-dark);
  transform: scale(1.05);
}

.prefilled {
  font-weight: bold;
  background-color: var(--sudoku-secondary);
  color: var(--sudoku-accent);
  text-shadow: 0 0 5px rgba(255, 193, 7, 0.3);
}

.error {
  background-color: rgba(255, 87, 87, 0.3);
}

.right-border {
  border-right: 2px solid var(--sudoku-primary);
}

.bottom-border {
  border-bottom: 2px solid var(--sudoku-primary);
}

.cell.selected {
  background-color: var(--sudoku-dark);
  box-shadow: inset 0 0 0 2px var(--sudoku-accent);
  animation: pulse-selection 2s infinite;
}

/* Enhanced error styles */
.cell.error {
  background-color: rgba(255, 87, 87, 0.3);
  animation: pulse-error 1s infinite;
}

.conflicts {
  background-color: rgba(255, 87, 87, 0.15);
}

.subtle-error {
  border: 2px dashed rgba(255, 87, 87, 0.4);
  position: relative;
}

.subtle-error::after {
  content: "!";
  position: absolute;
  bottom: 2px;
  right: 2px;
  font-size: 10px;
  color: #ff5757;
  opacity: 0.8;
}

/* Enhanced constraint styling */
.cell.unavailable {
  position: relative;
  background-color: rgba(219, 68, 55, 0.15);
}

.cell.unavailable::before {
  content: "✕";
  position: absolute;
  color: rgba(219, 68, 55, 0.4);
  font-size: 26px;
  opacity: 0.7;
}

/* Correctly entered numbers */
.cell.correct {
  font-weight: bold;
  background-color: var(--sudoku-secondary);
  color: var(--sudoku-accent);
  animation: correct-number 0.5s;
}

/* Hint styling */
.hint {
  background-color: var(--sudoku-accent);
  color: var(--sudoku-secondary);
  animation: hint-glow 2s infinite;
}

.hint-counter {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  margin-left: 5px;
}

/* Message display */
.message {
  margin: 15px 0;
  padding: 15px;
  border-radius: 6px;
  text-align: center;
  font-weight: 500;
  width: 100%;
  animation: fadeIn 0.5s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.success {
  background-color: var(--sudoku-primary);
  color: var(--sudoku-text);
  border-left: 4px solid var(--sudoku-accent);
}

.error-message {
  background-color: rgba(255, 87, 87, 0.2);
  color: #ff5757;
  border-left: 4px solid #ff5757;
}

/* Number pad styles */
.number-pad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 20px 0;
  background-color: var(--sudoku-card-bg);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 250px;
}

.number-btn {
  width: 60px;
  height: 60px;
  font-size: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--sudoku-primary);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: var(--sudoku-text);
  transition: all 0.2s;
  margin: 0 auto;
  font-weight: bold;
}

.number-btn:hover {
  background-color: var(--sudoku-primary-light);
  transform: scale(1.08);
}

.number-btn:active {
  transform: scale(0.95);
}

.error-details {
  color: #ff5757;
  margin-top: 15px;
  font-weight: 500;
  background-color: rgba(255, 87, 87, 0.1);
  padding: 12px;
  border-radius: 6px;
  text-align: center;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* Style for number buttons that have reached their limit */
.number-btn.completed {
  background-color: var(--sudoku-accent);
  color: var(--sudoku-secondary);
  box-shadow: 0 0 10px rgba(255, 193, 7, 0.5);
  cursor: not-allowed;
  position: relative;
}

.number-btn.completed::after {
  content: "✓";
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 12px;
  font-weight: bold;
}

.number-btn.completed:hover {
  transform: none;
  background-color: var(--sudoku-accent);
}

/* Confetti Animation */
.confetti-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 99;
  overflow: hidden;
  display: none;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #ffc107;
  opacity: 0;
}

.confetti.active {
  animation: confetti-fall 4s ease-out forwards;
}

.winner-message {
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 123, 65, 0.9);
  color: white;
  padding: 20px 40px;
  border-radius: 10px;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  z-index: 100;
  display: none;
  animation: pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.5);
  border: 2px solid var(--sudoku-accent);
}

/* Animations */
@keyframes pulse-error {
  0% {
    background-color: rgba(255, 87, 87, 0.2);
  }
  50% {
    background-color: rgba(255, 87, 87, 0.4);
  }
  100% {
    background-color: rgba(255, 87, 87, 0.2);
  }
}

@keyframes pulse-selection {
  0% {
    box-shadow: inset 0 0 0 2px var(--sudoku-accent);
  }
  50% {
    box-shadow: inset 0 0 0 3px var(--sudoku-accent-dark);
  }
  100% {
    box-shadow: inset 0 0 0 2px var(--sudoku-accent);
  }
}

@keyframes correct-number {
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes hint-glow {
  0% {
    box-shadow: 0 0 5px var(--sudoku-accent);
  }
  50% {
    box-shadow: 0 0 15px var(--sudoku-accent);
  }
  100% {
    box-shadow: 0 0 5px var(--sudoku-accent);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes confetti-fall {
  0% {
    transform: translateY(-100px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(calc(100vh + 100px)) rotate(360deg);
    opacity: 0;
  }
}

@keyframes pop-in {
  0% {
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 0;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .sudoku-grid {
    grid-template-columns: repeat(9, 35px);
    grid-template-rows: repeat(9, 35px);
  }

  .cell {
    font-size: 16px;
  }

  .number-btn {
    width: 45px;
    height: 45px;
    font-size: 20px;
  }

  .controls {
    flex-direction: column;
  }

  button {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 400px) {
  .sudoku-grid {
    grid-template-columns: repeat(9, 30px);
    grid-template-rows: repeat(9, 30px);
  }

  .cell {
    font-size: 14px;
  }

  .number-btn {
    width: 40px;
    height: 40px;
  }
}
</style>
