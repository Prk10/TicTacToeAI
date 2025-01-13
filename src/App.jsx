import React from 'react';
import './index.css';
import {useState} from 'react';


export default function Game() {
  
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0)
  const xIsNext = currentMove % 2 == 0;
  const currentSquares = history[currentMove];
  

  function handlePlay(nextSquares_) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares_]
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {

    if (move == currentMove && move > 0) {
      return (
        <li style={{fontSize: '1.1rem', paddingLeft: '0.5rem'}}>{"You are at #" + move}</li>
      )
    }
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    }
    else {
      description = "Go to game start"
    }

    return (
      <>
        <li key={move}>
          <button className="history_btn" onClick={() => jumpTo(move)}>{description}</button> 
        </li>
      </>
    )
  })


  return (
    <>
    <div className="game_">
      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
        </div>
        <div className="game-info">
       
          <ol style={{fontSize: '0.9rem'}}>{moves}</ol>
        </div>
      </div>

    </div>  
    </>
   
  );
}
function Square({value, onSquareClick}) {
  
  return (
    <>
    <button onClick={onSquareClick} className="square">{value}</button>

    </>
  );
}

function Board({xIsNext, squares, onPlay}) {

  
  let status;

  if (winner(squares) == 'Tie') {
    status = "It is a Tie!";
  }
  else if (winner(squares)) {
    status = "Winner: " + winner(squares);
  }
  else {
    status = "Next Player: " + ((xIsNext)? 'X': 'O');
  }

 

  function handler(i) {

    if (squares[i] != null || winner(squares)) return;
    const nextSquares = squares.slice();
    
    nextSquares[i] = player(squares);
    //(xIsNext)? nextSquares[i] = 'X': nextSquares[i] = 'O';
    
    onPlay(nextSquares);
    
  }

  const rows = [];
  let columns = [];

  for (let i = 0; i < 7; i = i + 3) {
    columns = [];

    for (let j = 0; j < 3; j++) {
      columns.push(
        <Square value={squares[i + j]} onSquareClick={() => handler(i+j)}/>
      )
    }
    
    rows.push(
      <div className="board-row" key={i}> 
          {columns}
      </div>
    )
  }

  let best_move;

  if (minimax(squares) != null) {
    best_move = "Best Move - " + "(" + minimax(squares)[0] + ", " + minimax(squares)[1] + ")";
  }
  
  return (
    <>
    <div>{status}</div>
    <div>{best_move}</div>
    {rows}
    
    </>
  );
}




function winner(board) {

  for (let i = 0; i < 3; i++)
  {
    if (board[i] != null && board[i] == board[i+3] && board[i] == board[i+6])
    {
      return board[i];
    }
  }

  for (let i = 0; i < 7; i = i + 3)
  {
    if (board[i] != null && board[i] == board[i+1] && board[i] == board[i+2])
    {
      return board[i];
    }
  }

  const diagnols = [[0, 4, 8], [2, 4, 6]];

  for (let i = 0; i < diagnols.length; i++) {

    const [a, b, c] = diagnols[i];

    if (board[a] != null && board[a] == board[b] && board[a] == board[c]) {
      return board[a];
    }
  }
  let tie = true;
  for (let i = 0; i < 9; i++) {
    if (board[i] == null) {
      tie = false;
    }
  }

  if (tie) {
    return 'Tie';
  }
}

function terminal(board) {
  return winner(board) != null;
}

function utility(board) {
  const winner_ = winner(board);
  if (winner_ === 'Tie') {
    return 0;
  } else if (winner_ === 'X') {
    return 1;
  } else if (winner_ === 'O') {
    return -1;
  }
}

function result(board, action) {
  const boardCopy = board.slice(); 
  boardCopy[action] = player(board);
  return boardCopy;
}

function minimax(board) {
  function algor(board) {
    if (terminal(board)) {
      return [utility(board), null];
    }

    if (player(board) === 'X') {
      let maxEval = -Infinity;
      let action_ = null;
      for (let action of actions(board)) {
        const [eval_, _] = algor(result(board, action));
        if (eval_ > maxEval) {
          maxEval = eval_;
          action_ = action;
        }
      }
      return [maxEval, action_];
    }

    if (player(board) === 'O') {
      let minEval = Infinity;
      let action_ = null;
      for (let action of actions(board)) {
        const [eval_, _] = algor(result(board, action));
        if (eval_ < minEval) {
          minEval = eval_;
          action_ = action;
        }
      }
      return [minEval, action_];
    }
  }

  const [_, bestAction] = algor(board);

  const coords = [[0,0], [0,1], [0,2],
                  [1,0], [1,1], [1,2],
                  [2,0], [2,1], [2,2]];

  return coords[bestAction];
}

function player(board) {
  let num_x = 0;
  let num_o = 0;

  for (let sq of board) {
    if (sq === 'X') {
      num_x++;
    } else if (sq === 'O') {
      num_o++;
    }
  }

  return num_x === num_o ? 'X' : 'O';
}

function actions(board) {
  const actions_ = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] == null) {
      actions_.push(i);
    }
  }

  return actions_;
}
