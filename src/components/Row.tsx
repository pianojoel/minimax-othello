import '../App.css'
import {Cell} from './Cell'
export function Row({setPlayerTurn, y, board, setBoard, playerTurn, setScore}:any){
    

const row = [...Array(8).keys()];

    return (
        <div className={'row'}>
       {row.map((x) => (
            <Cell key={`${x},${y}`} setScore={setScore} x={x} y={y} board={board} playerTurn={playerTurn} setBoard={setBoard} setPlayerTurn={setPlayerTurn}/>
       ))}
       </div>
    )

       }