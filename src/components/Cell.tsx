import React, { useState } from "react";
import { countPoints, flipDiscs, getDirections, isCellValid } from "../App";
import { Color } from "./Board";
type props = {
  setPlayerTurn: any;
  x: number;
  y: number;
  board: Color[][];
  setBoard: any;
  playerTurn: Color;
  setScore: any;
};

export function Cell({
  setScore,
  setPlayerTurn,
  x,
  y,
  board,
  setBoard,
  playerTurn,
}: props) {
  // function countPoints(){
  //     const white = board.reduce((sum, cur) => {
  //         return [...sum,...cur]
  //     }).filter(item => {
  //         return item === Color.WHITE
  //     }).length;

  //     const black = board.reduce((sum, cur) => {
  //         return [...sum,...cur]
  //     }).filter(item => {
  //         return item === Color.BLACK
  //     }).length;

  //     return [white, black]

  // }

  // function flipDiscs(x: number, y:number){

  //     const allDirections = getDirections(x, y, board);

  //     if (!isCellValid(x, y, board, playerTurn)) return false

  //     const oppositeColor = playerTurn === Color.BLACK ? Color.WHITE : Color.BLACK

  //     board[x][y] = playerTurn;

  //         const mapped = allDirections.map(row => {
  //             const firstSame = row.indexOf(playerTurn);
  //         if (firstSame > 0 && row.slice(0, firstSame).every(item => item === oppositeColor)) return row.slice(0, firstSame)
  //         return []
  //     })

  //     for (let i = 0; i < mapped.length; i++){
  //         if(mapped[i].length > 0){
  //             switch(i){
  //                 case 0:
  //                     for(let j = 0; j < mapped[i].length; j++){
  //                         board[x-j-1][y] = playerTurn
  //                     }
  //                     break;
  //                     case 1:
  //                     for(let j = 0; j < mapped[i].length; j++){
  //                         board[x+j+1][y] = playerTurn
  //                     }
  //                     break;
  //                     case 2:
  //                     for(let j = 0; j < mapped[i].length; j++){
  //                         board[x][y-j-1] = playerTurn
  //                     }
  //                     break;
  //                     case 3:
  //                     for(let j = 0; j < mapped[i].length; j++){
  //                         board[x][y+j+1] = playerTurn
  //                     }
  //                     break;
  //                     case 4:
  //                         for(let j = 0; j < mapped[i].length; j++){
  //                             board[x-j-1][y-j-1] = playerTurn
  //                         }
  //                         break;
  //                     case 5:
  //                     for(let j = 0; j < mapped[i].length; j++){
  //                         board[x+j+1][y-j-1] = playerTurn
  //                     }
  //                     break;
  //                     case 6:
  //                         for(let j = 0; j < mapped[i].length; j++){
  //                             board[x-j-1][y+j+1] = playerTurn
  //                         }
  //                         break;
  //                     case 7:
  //                         for(let j = 0; j < mapped[i].length; j++){
  //                             board[x+j+1][y+j+1] = playerTurn
  //                         }
  //                         break;

  //             }
  //         }
  //     }
  //         return true;
  // }

  function clickHandler() {
    if (board[x][y] !== Color.NONE) return;
    if (!isCellValid(x, y, board, playerTurn)) return;
    flipDiscs(x, y, board, playerTurn);

    setBoard([...board]);

    setScore(countPoints(board));
    setPlayerTurn(playerTurn === Color.BLACK ? Color.WHITE : Color.BLACK);
  }

  return (
    <div onClick={clickHandler} className={"cell"}>
      {board[x][y] === Color.BLACK && <BlackDisc />}
      {board[x][y] === Color.WHITE && <WhiteDisc />}
    </div>
  );
}

function WhiteDisc() {
  return <div className={"whiteDisc"} />;
}
function BlackDisc() {
  return <div className={"blackDisc"} />;
}
