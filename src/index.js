import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            className={'square' + (props.highlight?' highlight':'')}
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square 
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                highlight={this.props.line && this.props.line.includes(i)}
            />
        );
    }

    render() {
        const boardSize = 3;
        let drawSquares = [];
        for (let i=0; i<boardSize; i++){
            let row = [];
            for(let j=0; j<boardSize; j++){
                row.push(this.renderSquare(i * boardSize + j));
            }
            drawSquares.push(
                <div key={i} className="board-row">{row}</div>
            )
        }
        return (
            <div>{drawSquares}</div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            xIsNext: true,
            stepNumber: 0,
            listIsAscending: true,
        };
    }
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares).winner || squares[i]) {
            return ;
        }
        squares[i] = this.state.xIsNext? 'X': 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                last: i
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }
    handleSortToggle(){
        this.setState({
            listIsAscending: !this.state.listIsAscending
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares).winner;
        const line = calculateWinner(current.squares).line;

        let moves = history.map((step, move) => {
            const currentSquare = step.last;
            const col = Math.floor(currentSquare / 3);
            const row = currentSquare % 3;
            const desc = move ?
                'Go to move #' + move + ' ' + col + ', ' + row :
                'Go to game start';
            
            return (
                <li key={move}>
                    <button
                        className={move === this.state.stepNumber ? "current-item" : ""} 
                        onClick={() => this.jumpTo(move)}>{desc}
                    </button>
                </li>
            );
        });

        if (!this.state.listIsAscending) {
            moves.reverse();
        }

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X':'O');
        }
        return (
            <div className='game'>
                <div className='game-board'>
                    <Board 
                        squares={current.squares}
                        line = {line}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className='game-info'>
                    <div>{status}</div>
                    <button onClick={() => this.handleSortToggle()}>
                        {this.state.listIsAscending? 'descending' : 'ascending'}
                    </button>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
          winner: squares[a],
          line: lines[i]
      }
    }
  }
  return {
      winner: null,
      line: null
  };
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

