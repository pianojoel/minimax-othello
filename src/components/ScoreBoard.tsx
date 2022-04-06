import { getWinner, initBoard } from '../App'
import '../App.css'
import { Color } from './Board';

export function ScoreBoard({score, playerTurn,setPlayerTurn, setBoard, setScore, gameOver, board}:any){
function handleClick(){
setBoard(initBoard());
setScore({x: 0, y: 0, points: 0})
setPlayerTurn(Color.BLACK)
}

const winner = getWinner(board);

    return (
        <div className={'scoreBoard'}>
            
            {!gameOver && <p>{playerTurn}  to play</p>}
            {gameOver && (winner === Color.NONE ? 'DRAW!' : `${winner} wins!`)}
            <p>White: {score[0]} points</p>
            <p>Black: {score[1]}  points</p>
            <button onClick={handleClick}>Reset game</button>
        </div>
    )

} 