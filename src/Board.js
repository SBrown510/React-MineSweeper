import {Fragment, useState} from 'react';

function advanceColor(color) {
    if( color === 'white' )
        return 'blue';
    if( color === 'blue' )
        return 'red';
    return 'blue';
}



function Cell(props) {
    console.log(" r " + props.rowIdx + " C " + props.colIdx)
    return (
        <td onClick={() => props.handleClick(props.rowIdx, props.colIdx)}
            width="50px"
            height="50px"
            style={{
                backgroundColor:
                props.cell.color
            }}>
        </td>
    );
}

function Row(props) {
    return (
        <tr>{ props.row.map( (cell, idx) => <Cell key={uniqueKey()}
                                                  cell={cell}
                                                  rowIdx={props.rowIdx}
                                                  colIdx={idx}
                                                  handleClick={props.handleClick}
        />)
        }
        </tr>
    )
}

let key = 1;
function uniqueKey() {
    return key++;
}

function randomize() {
    return Math.random() < 0.1;
}

const NUM_ROWS = 10, NUM_COLUMNS = 10;


function createInitialState() {
    let board = Array(NUM_ROWS).fill(Array(NUM_COLUMNS).fill({
        color: "white",
        isOccupied: true, //applies to entire board not just a cell
    }));
    board = board.map((row, rowIdx) => row.map( (col, colIdx) => {
        return {
            ...board[rowIdx][colIdx],
            row: rowIdx,
            column: colIdx
        }
    }));

    return {
        board,
        haveAWinner: false,
        nextColor: 'blue'   // applies to the entire board, not to a given cell.
    };
}


function TopMessage(props) {

    if( ! props.haveAWinner) {
        //const playerColor = props.nextColor.charAt(0).toUpperCase() + props.nextColor.slice(1);

        return <div style={{height: "50px", textAlign: "center"}}>
        </div>;
        //<p top-margin="100px"></p>
       // <span id="minutes"></span>:<span id="seconds"></span>

        //<!-- <p top-margin="100px">{playerColor} plays next </p> -->
    }
    //setTimeout(timer);
    //const winnerColor = props.winnerColor.charAt(0).toUpperCase() + props.winnerColor.slice(1);
    return <div style={{height: "50px", align: "center"}}>
        <button onClick={() => props.reset()}>Reset?</button>
    </div>
};

//<!-- <p align="center">{winnerColor} Wins. Game Over.</p> -->


let numClicks = 0;

export default function Board(props) {
    const [boardState, setBoardState ] = useState(createInitialState);

    const reset = () => {
        setBoardState(createInitialState());
    };


    function handleClick(rowIdx, colIdx) {
        console.log(`handleClick called with rowIdx = ${rowIdx}, colIdx = ${colIdx}, ${JSON.stringify(boardState)}`);
        if( boardState.haveAWinner )
            return;

        numClicks += 1;
        let board = boardState.board;
        let affectedRow = board[rowIdx].slice();
        console.log(`existing cell before change of color contains ${JSON.stringify(affectedRow[colIdx])}`);
        affectedRow[colIdx] = {
            ...affectedRow[colIdx],
            color: advanceColor(affectedRow[colIdx].color),
            isOccupied: true
        };
        console.log(`existing cell after change of color contains ${JSON.stringify(affectedRow[colIdx])}`);


        let newBoard = board.slice();
        newBoard[rowIdx] = affectedRow;

        setBoardState({
            ...boardState,
            board: newBoard,
        });

        if( numClicks >= 10 ) {
            setBoardState(boardState => ({
                ...boardState,
                haveAWinner: true,
                winnerColor: 'red'
            }));
        }
    }


    return (
        <Fragment>
            <TopMessage nextColor={numClicks % 2 ? 'blue' : 'red'}
                        winnerColor={boardState.winnerColor}
                        haveAWinner={boardState.haveAWinner}
                        reset={reset} />
            <table border={1} align="center">
                <tbody>
                {
                    boardState.board.map((row, rowIdx) => (<Row key={uniqueKey()}
                                                                row={row}
                                                                rowIdx={rowIdx}
                                                                handleClick={handleClick}
                    />))
                }
                </tbody>
            </table>
        </Fragment>
    );
}