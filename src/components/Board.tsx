import React, { useState } from "react";
import { Row } from "./Row";
import { ScoreBoard } from "./ScoreBoard";
import "../App.css";
import {
  checkIfGameOver,
  countPoints,
  flipDiscs,
  getBestMove,
  getLegalMoves,
  initBoard,
} from "../App";
import cloneDeep from "clone-deep";
export enum Color {
  NONE = "NONE",
  WHITE = "WHITE",
  BLACK = "BLACK",
}

export function Board() {
  const [board, setBoard] = useState(initBoard());
  const [playerTurn, setPlayerTurn] = useState(Color.BLACK);
  const [score, setScore] = useState([0, 0]);

  const boardz = [...Array(8).keys()];

  const gameOver = checkIfGameOver(board);

  const possibleMoves = getLegalMoves(board, playerTurn);

  if (possibleMoves.length > 0 && playerTurn === Color.WHITE) {
    const bestMove = getBestMove(cloneDeep(board), playerTurn, 6);
    //console.log(bestMove)
    flipDiscs(bestMove.x, bestMove.y, board, playerTurn);
    //console.log('flipped')
    setBoard([...board]);
    //console.log('set board');

    setScore(countPoints(board));
    setPlayerTurn(Color.BLACK);
  }

  if (possibleMoves.length === 0 && playerTurn === Color.WHITE && !gameOver) {
    console.log("No bestmove for white");
    setPlayerTurn(Color.BLACK);
  }
  if (possibleMoves.length === 0 && playerTurn === Color.BLACK && !gameOver) {
    setPlayerTurn(Color.WHITE);
    console.log("No bestmove for black");
  }

  return (
    <>
      <div className={"board-outer"}>
        <div className={"board"}>
          {boardz.map((y) => (
            <>
              <Row
                key={y}
                y={y}
                setScore={setScore}
                board={board}
                setBoard={setBoard}
                playerTurn={playerTurn}
                setPlayerTurn={setPlayerTurn}
              />
            </>
          ))}
        </div>
      </div>
      <ScoreBoard
        board={board}
        score={score}
        gameOver={gameOver}
        setScore={setScore}
        playerTurn={playerTurn}
        setPlayerTurn={setPlayerTurn}
        setBoard={setBoard}
      ></ScoreBoard>
    </>
  );
}
