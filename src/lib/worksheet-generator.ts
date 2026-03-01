export type Difficulty = "easy" | "medium" | "hard";

export interface GridData {
  numbers: number[][];
  hasAnswerRow: boolean;
}

export interface WorksheetConfig {
  title: string;
  gridCount: number;
  rows: number;
  columns: number;
  difficulty: Difficulty;
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateGridNumbers(rows: number, cols: number, difficulty: Difficulty): number[][] {
  const grid: number[][] = [];

  for (let r = 0; r < rows; r++) {
    const row: number[] = [];
    for (let c = 0; c < cols; c++) {
      let num: number;
      switch (difficulty) {
        case "easy":
          num = getRandomInt(1, 9);
          break;
        case "medium":
          num = getRandomInt(-9, 9);
          // avoid 0 for cleaner worksheets
          if (num === 0) num = getRandomInt(1, 9);
          break;
        case "hard":
          num = getRandomInt(-9, 40);
          if (num === 0) num = getRandomInt(1, 9);
          break;
      }
      row.push(num);
    }
    grid.push(row);
  }

  return grid;
}

export function generateWorksheet(config: WorksheetConfig): GridData[] {
  const grids: GridData[] = [];

  for (let i = 0; i < config.gridCount; i++) {
    // For mixed difficulty across grids
    let gridDifficulty = config.difficulty;
    if (config.difficulty === "hard" && i < config.gridCount) {
      // Mix difficulties in hard mode
      const mix: Difficulty[] = ["easy", "medium", "hard"];
      gridDifficulty = mix[i % 3];
    }

    grids.push({
      numbers: generateGridNumbers(config.rows, config.columns, gridDifficulty),
      hasAnswerRow: true,
    });
  }

  return grids;
}

export function computeColumnSums(grid: GridData): number[] {
  const cols = grid.numbers[0]?.length ?? 0;
  return Array.from({ length: cols }, (_, c) =>
    grid.numbers.reduce((sum, row) => sum + row[c], 0)
  );
}

export function createEmptyGrids(config: WorksheetConfig): GridData[] {
  return Array.from({ length: config.gridCount }, () => ({
    numbers: Array.from({ length: config.rows }, () =>
      Array.from({ length: config.columns }, () => 0)
    ),
    hasAnswerRow: true,
  }));
}

export const defaultConfig: WorksheetConfig = {
  title: "I.Q. Brain Academy",
  gridCount: 5,
  rows: 3,
  columns: 10,
  difficulty: "medium",
};
