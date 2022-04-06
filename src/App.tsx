import React from "react";
import { Board, Color } from "./components/Board";
import "./App.css";
import cloneDeep from "clone-deep";

export function countPoints(board: Color[][]) {
  const white = board
    .reduce((sum, cur) => {
      return [...sum, ...cur];
    })
    .filter((item) => {
      return item === Color.WHITE;
    }).length;

  const black = board
    .reduce((sum, cur) => {
      return [...sum, ...cur];
    })
    .filter((item) => {
      return item === Color.BLACK;
    }).length;

  return [white, black];
}

export function isCellValid(
  x: number,
  y: number,
  board: Color[][],
  playerTurn: Color
) {
  if (board[x][y] !== Color.NONE) return false;
  const allDirections = getDirections(x, y, board);
  const oppositeColor = playerTurn === Color.BLACK ? Color.WHITE : Color.BLACK;

  if (
    allDirections.some((row) => {
      const firstSame = row.indexOf(playerTurn);
      if (
        firstSame > 0 &&
        row.slice(0, firstSame).every((item) => item === oppositeColor)
      )
        return true;
      return false;
    })
  ) {
    return true;
  }
  return false;
}

function getPoints(x: number, y: number, board: Color[][], playerTurn: Color) {
  const allDirections = getDirections(x, y, board);
  const oppositeColor = playerTurn === Color.BLACK ? Color.WHITE : Color.BLACK;

  return allDirections
    .map((row) => {
      const firstSame = row.indexOf(playerTurn);
      if (
        firstSame > 0 &&
        row.slice(0, firstSame).every((item) => item === oppositeColor)
      )
        return row.slice(0, firstSame);
      return [];
    })
    .flat().length;
}

export const initBoard = () => {
  const grid = [];
  for (let i = 0; i < 8; i++) {
    const row = [];
    for (let j = 0; j < 8; j++) {
      row.push(Color.NONE);
    }
    grid.push(row);
  }
  grid[3][3] = Color.WHITE;
  grid[4][4] = Color.WHITE;
  grid[3][4] = Color.BLACK;
  grid[4][3] = Color.BLACK;

  return grid;
};
export function checkIfGameOver(board: Color[][]) {
  return (
    getLegalMoves(board, Color.WHITE).length === 0 &&
    getLegalMoves(board, Color.BLACK).length === 0
  );
}

export function getWinner(board: Color[][]) {
  if (!checkIfGameOver(board)) return Color.NONE;
  const [whiteCount, blackCount] = countPoints(board);

  if (blackCount > whiteCount) {
    return Color.BLACK;
  }
  if (whiteCount > blackCount) {
    return Color.WHITE;
  }
  return Color.NONE;
}

export function getBestMove(_board: Color[][], player: Color, depth: number) {
  const legalMoves = getLegalMoves(_board, player);
  //console.log("LEGAL MOVES:", player, legalMoves);

  const movesWithScore = legalMoves.map((move) => {
    const __board = flipDiscs(move.x, move.y, cloneDeep(_board), player);
    console.log("move in getBestMove", move);
    return {
      x: move.x,
      y: move.y,
      score: minimax(
        __board,
        player === Color.BLACK ? Color.WHITE : Color.BLACK,
        -Infinity,
        Infinity,
        depth
      ),
    };
  });
  const bestMove = movesWithScore
    .sort((a, b) => a.score - b.score)
    .reverse()[0];

  console.log("movesWithScore", movesWithScore);
  console.log("best move", bestMove);
  return bestMove;
}
export function minimax(
  _board: Color[][],
  player: Color,
  alpha: number,
  beta: number,
  depth: number
) {
  //console.log("MINIMAX DEPTH", depth);
  //console.log("DEPTH:", depth, player);
  // console.log("PLAYER:", player);
  if (depth === 0 || checkIfGameOver(_board)) {
    const [white, black] = countPoints(_board);
    const score = white - black;
    //console.log("RETURN SCORE", score);
    return white - black;
  }

  if (player === Color.WHITE) {
    let maxEval = -Infinity;

    const legalMoves = getLegalMoves(_board, player);
    //console.log("Legal moves white", legalMoves);
    for (let move of legalMoves) {
      //console.log("move in minimax white", move);
      const newBoard = flipDiscs(move.x, move.y, cloneDeep(_board), player);
      let evaluation = minimax(newBoard, Color.BLACK, alpha, beta, depth - 1);

      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    //console.log("RETURN MAXEVAL WHITE", maxEval);
    return maxEval;
  }

  if (player === Color.BLACK) {
    let minEval = Infinity;

    const legalMoves = getLegalMoves(_board, player);
    //console.log("Legal moves black", legalMoves);
    for (let move of legalMoves) {
      //console.log("move in minimax black", move);
      const newBoard = flipDiscs(move.x, move.y, cloneDeep(_board), player);
      let evaluation = minimax(newBoard, Color.WHITE, alpha, beta, depth - 1);
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    //console.log("RETURN MINEVAL BLACK", minEval);
    return minEval;
  }

  return 0;

  //minimax()
}

export function getDirections(x: number, y: number, board: Color[][]) {
  const col = board[x];
  const row = board.map((col) => {
    return col[y];
  });
  let NW: Color[] = [];
  let i = x - 1;
  let j = y - 1;
  while (i >= 0 && j >= 0) {
    NW.push(board[i][j]);
    i--;
    j--;
  }

  let NE: Color[] = [];
  i = x + 1;
  j = y - 1;
  while (i < 8 && j >= 0) {
    NE.push(board[i][j]);
    i++;
    j--;
  }

  let SW: Color[] = [];
  i = x - 1;
  j = y + 1;
  while (i >= 0 && j < 8) {
    SW.push(board[i][j]);
    i--;
    j++;
  }

  let SE: Color[] = [];
  i = x + 1;
  j = y + 1;
  while (i < 8 && j < 8) {
    SE.push(board[i][j]);
    i++;
    j++;
  }

  const W = row.slice(0, x).reverse();
  const E = row.slice(x + 1);
  const N = col.slice(0, y).reverse();
  const S = col.slice(y + 1);

  return [W, E, N, S, NW, NE, SW, SE];
}

export function flipDiscs(
  x: number,
  y: number,
  _board: Color[][],
  playerTurn: Color
) {
  const allDirections = getDirections(x, y, _board);

  //if (!isCellValid(x, y, board, playerTurn)) return null;

  const oppositeColor = playerTurn === Color.BLACK ? Color.WHITE : Color.BLACK;
  //console.log('X', x,'Y', y)
  _board[x][y] = playerTurn;

  const mapped = allDirections.map((row) => {
    const firstSame = row.indexOf(playerTurn);
    if (
      firstSame > 0 &&
      row.slice(0, firstSame).every((item) => item === oppositeColor)
    )
      return row.slice(0, firstSame);
    return [];
  });

  //console.log(mapped)

  for (let i = 0; i < mapped.length; i++) {
    if (mapped[i].length > 0) {
      switch (i) {
        case 0:
          for (let j = 0; j < mapped[i].length; j++) {
            _board[x - j - 1][y] = playerTurn;
          }
          break;
        case 1:
          for (let j = 0; j < mapped[i].length; j++) {
            _board[x + j + 1][y] = playerTurn;
          }
          break;
        case 2:
          for (let j = 0; j < mapped[i].length; j++) {
            _board[x][y - j - 1] = playerTurn;
          }
          break;
        case 3:
          for (let j = 0; j < mapped[i].length; j++) {
            _board[x][y + j + 1] = playerTurn;
          }
          break;
        case 4:
          for (let j = 0; j < mapped[i].length; j++) {
            _board[x - j - 1][y - j - 1] = playerTurn;
          }
          break;
        case 5:
          for (let j = 0; j < mapped[i].length; j++) {
            _board[x + j + 1][y - j - 1] = playerTurn;
          }
          break;
        case 6:
          for (let j = 0; j < mapped[i].length; j++) {
            _board[x - j - 1][y + j + 1] = playerTurn;
          }
          break;
        case 7:
          for (let j = 0; j < mapped[i].length; j++) {
            _board[x + j + 1][y + j + 1] = playerTurn;
          }
          break;
      }
    }
  }
  return _board;
}

export function getLegalMoves(board: Color[][], playerTurn: Color) {
  let legalMoves = [];

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (isCellValid(i, j, board, playerTurn)) {
        legalMoves.push({
          x: i,
          y: j,
          score: getPoints(i, j, board, playerTurn),
        });
      }
    }
  }
  return legalMoves;
}

function App() {
  return (
    <div className="App">
      <header className="App-header"></header>
      <Board />
    </div>
  );
}

export default App;
