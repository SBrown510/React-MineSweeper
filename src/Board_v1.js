import {Fragment, useState} from 'react';

let gameWon = true;

function advanceColor(color, cellData,props) {
    if (cellData.bee) {
        console.log("is bee at row: " + cellData.row + " and col: " + cellData.col)
        gameWon = false;
        return 'black'
    }
    if( color === 'white' )
        return 'blue';
    return 'blue';
}


function handleClick(cellData, setCellData) {
    setCellData({
        ...cellData,
        color: advanceColor(cellData.color, cellData),
        isOccupied: true
    });
}

function Cell(props) {
    const [cellData, setCellData] = useState({
        color: 'white',
        isOccupied: false,
        bee: randomize(),
        key: uniqueKey(),
        row: props.rowIdx,
        col: props.colIdx
    });

    return (
        <td onClick={() => handleClick(cellData, setCellData,props)}
            width="50px"
            height="50px"
            style={{
                backgroundColor: cellData.color}}>
        </td>
    );
}

function Row(props) {
    return (
        <tr>{ props.row.map( (cell, idx) => <Cell key={uniqueKey()}
                                                  cell={cell}
                                                  rowIdx={props.rowIdx}
                                                  colIdx={idx}

        />)
        }
        </tr>
    )
}

function randomize() {
    return Math.random() < 0.15;
}

let key = 1;
function uniqueKey() {
    return key++;
}

function createInitialState() {
    let board = Array(NUM_ROWS).fill(Array(NUM_COLUMNS).fill({
        color: "white",
        isOccupied: false,
        bee: false
    }));
    board = board.map((row, rowIdx) =>
        row.map( (col, colIdx) => {
        return {...board[rowIdx][colIdx],
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

    if(gameWon) {
        //const playerColor = props.nextColor.charAt(0).toUpperCase() + props.nextColor.slice(1);
        return <div style={{height: "50px", textAlign: "center"}}><p top-margin="100px"> Timer Goes Here</p></div>;
    }
        //<span id="minutes"></span>:<span id="seconds"></span>
        //<!-- <p top-margin="100px">{playerColor} plays next </p> -->
    //setTimeout(timer);
    //const winnerColor = props.winnerColor.charAt(0).toUpperCase() + props.winnerColor.slice(1);
    return <div style={{height: "50px", align: "center"}}>
        <button onClick={() => props.reset()}>Reset?</button>
    </div>
};


function createReveal(board) {
    let btn = document.createElement("button");
    btn.innerHTML = 'Reveal';
    btn.onclick = function () {
        for (let i = 0; i < NUM_ROWS; i++) {
            for (let j = 0; j < NUM_COLUMNS; j++) {
                console.log(board.board[i][j])
                //if (board.board[i][j].bee)
                //    console.log("revealed bee");
            }
        }
    }
    document.body.appendChild(btn);
}

const NUM_ROWS = 6, NUM_COLUMNS = 7;

export default function Board(props) {
    const initialState = createInitialState();
 //   createReveal(initialState);

    return (

        <Fragment>
            <TopMessage />
            <table border={1} align="center">
                <tbody>
                {
                    initialState.board.map((row, rowIdx) => (<Row key={uniqueKey()}
                                                                  row={row}
                                                                  rowIdx={rowIdx}
                    />))
                }
                </tbody>
            </table>
        </Fragment>
    );
}


/*
let sec = 0;
function pad ( val ) {
    return val > 9 ? val : "0" + val;
}

let timer = setInterval( function(){
    document.getElementById("seconds").innerHTML=pad(++sec % 60);
    document.getElementById("minutes").innerHTML=pad(parseInt(sec / 60,10));
}, 1000);

setTimeout(function () {
    clearInterval(timer);
}, 11000);
*/