

import React, {Fragment, useState} from 'react';

let cellCount = 0;
let bombCount = 0;
let clickBomb = false;

function advanceColor(color, board, row, col) {
    if (!board[row][col].isOccupied) {
        let ret = "";
        if (color === 'black') {
            clickBomb = true;
            ret = 'black';
        } else if (board[row][col].bomb) {
            clickBomb = true;
            ret = "black";
        } else if (board[row][col].aroundBombs > 0) {
            document.getElementById("table").rows[row].cells.item(col).innerHTML = board[row][col].aroundBombs;
            cellCount++;
            ret = "grey";
        } else if (color === 'white') {
            cellCount++;
            ret = 'grey';
        } else if (color === 'grey') {
            ret = "grey";
        }
        return ret;
    }
    return "grey"
    //win game on global increment
}




function Cell(props) {
    if (props.cell.isOccupied && (props.cell.aroundBombs > 0)) {
        return (
            <td id="cell"
                onClick={() => props.handleClick(props.rowIdx, props.colIdx)}
                width="50px"
                height="50px"
                style={{
                    textAlign: "center",
                    backgroundColor: props.cell.color,
                }}
            >
                {props.cell.aroundBombs}
            </td>
        );

    }
    return (
        <td id="cell"
            onClick={() => props.handleClick(props.rowIdx, props.colIdx)}
            width="50px"
            height="50px"
            style={{
                textAlign: "center",
                backgroundColor: props.cell.color,
            }}
        >
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

let NUM_ROWS = 6, NUM_COLUMNS = 7;


function createInitialState() {
    let board = Array(NUM_ROWS).fill(Array(NUM_COLUMNS).fill({
        color: "white",
        isOccupied: false,
        bomb:false,
        aroundBombs:0
    }));
    board = board.map((row, rowIdx) => row.map( (col, colIdx) => {
        return {...board[rowIdx][colIdx], row: rowIdx, column: colIdx }
    }));
    //make bombs
    bombCount = 0;
    for (let rowIdx = 0; rowIdx < NUM_ROWS;rowIdx++) {
        for (let colIdx = 0; colIdx < NUM_COLUMNS;colIdx++) {
            //randomize is set to .2 so 20% of the board is bombs
            if (randomize()) {
                board[rowIdx][colIdx].bomb = true;
                bombCount++;

                //sets around bombs of surrounding elements
                if (rowIdx === 0) {
                    if (colIdx === 0) {
                        for (let i = 0; i < 2; i++) {
                            board[rowIdx + 1][i].aroundBombs++;
                        }
                        board[rowIdx][1].aroundBombs++;
                    } else if (colIdx === NUM_COLUMNS-1) {
                        for (let i = 0; i < 2; i++) {
                            board[rowIdx + 1][colIdx - 1 + i].aroundBombs++;
                        }
                        board[rowIdx][colIdx - 1].aroundBombs++;
                    } else {
                        for (let i = 0; i < 3; i++) {
                            board[rowIdx + 1][colIdx - 1 + i].aroundBombs++;
                        }
                        board[rowIdx][colIdx + 1].aroundBombs++;
                        board[rowIdx][colIdx - 1].aroundBombs++;
                    }
                } else if (rowIdx === NUM_ROWS - 1) {
                    if (colIdx === 0) {
                        for (let i = 0; i < 2; i++) {
                            board[rowIdx - 1][i].aroundBombs++;
                        }
                        board[rowIdx][colIdx + 1].aroundBombs++;
                    } else if (colIdx === NUM_COLUMNS-1) {
                        for (let i = 0; i < 2; i++) {
                            board[rowIdx - 1][colIdx - i].aroundBombs++;
                        }
                        board[rowIdx][colIdx - 1].aroundBombs++;
                    } else {
                        for (let i = 0; i < 3; i++) {
                            board[rowIdx - 1][colIdx - 1 + i].aroundBombs++;
                        }
                        board[rowIdx][colIdx + 1].aroundBombs++;
                        board[rowIdx][colIdx - 1].aroundBombs++;
                    }
                } else if (colIdx === 0) {
                    board[rowIdx - 1][colIdx].aroundBombs++;
                    board[rowIdx - 1][colIdx + 1].aroundBombs++;
                    board[rowIdx][colIdx + 1].aroundBombs++;
                    board[rowIdx + 1][colIdx].aroundBombs++;
                    board[rowIdx + 1][colIdx + 1].aroundBombs++;
                } else if (colIdx === NUM_COLUMNS - 1) {
                    board[rowIdx - 1][colIdx].aroundBombs++;
                    board[rowIdx - 1][colIdx - 1].aroundBombs++;
                    board[rowIdx][colIdx - 1].aroundBombs++;
                    board[rowIdx + 1][colIdx].aroundBombs++;
                    board[rowIdx + 1][colIdx - 1].aroundBombs++;
                } else {
                    for (let i = 0; i < 3; i++) {
                        board[rowIdx - 1][colIdx - 1 + i].aroundBombs++;
                    }
                    for (let i = 0; i < 3; i++) {
                        board[rowIdx + 1][colIdx - 1 + i].aroundBombs++;
                    }
                    board[rowIdx][colIdx + 1].aroundBombs++;
                    board[rowIdx][colIdx - 1].aroundBombs++;
                }
            }


        }
    }
    return {
        board,
        haveAWinner: false,
        haveALoser: false
    };
}

function TopMessage(props) {

    if( ! props.haveAWinner && ! props.haveALoser) {
        return <div style={{height: "50px", textAlign: "center"}}><p top-margin="100px"></p>
            <button id="reveal" class="button" onClick={() => props.reveal()}>Reveal</button>
        </div>;
    }
    return <div style={{height: "50px", textAlign: "center"}}><p top-margin="100px"></p>
        <button id="reset" class="button" onClick={() => props.reset()}>Reset?</button>
    </div>;
};

function randomize() {
    return Math.random() < 0.2;
}

let numCells = NUM_ROWS * NUM_COLUMNS;

export default function Board(props) {
    const [boardState, setBoardState] = useState(createInitialState);


    //reveals bomb on first click, unreaveals on second click
    function reveal() {
        for (let i = 0; i < NUM_ROWS; i++) {
            let board = boardState.board;
            let affectedRow = board[i];
            for (let j = 0; j < NUM_COLUMNS; j++) {
                if (board[i][j].bomb) {
                    console.log(`existing cell before change of color contains ${JSON.stringify(affectedRow[j])}`);
                    let newCol = "black"
                    if (board[i][j].color === "black") {
                        newCol = "white";
                    }
                    affectedRow[j] = {
                        ...affectedRow[j],
                        color: newCol,
                    };
                    console.log(`existing cell after change of color contains ${JSON.stringify(affectedRow[j])}`);
                }
            }
            let newBoard = board;
            newBoard[i] = affectedRow;

            setBoardState({
                ...boardState,
                board: newBoard,
            });
        }
        console.log(boardState.board);
    }

    //resets board
    const reset = () => {
        clickBomb = false;
        bombCount = 0;
        cellCount = 0;
        numCells = NUM_ROWS * NUM_COLUMNS;
        setBoardState(createInitialState());
    };

    //sets three board difficulties
    const easy = () => {
        console.log("easy")
        document.getElementById("SplashScreen").style.zIndex = "-10";
        document.getElementById("SplashScreen").style.opacity = "0";
        reset();
    };

    const medium = () => {
        console.log("medium")
        document.getElementById("SplashScreen").style.zIndex = "-10";
        document.getElementById("SplashScreen").style.opacity = "0";
        NUM_ROWS = 10;
        NUM_COLUMNS= 15;
        reset();
    };

    const hard = () => {
        console.log("hard")
        document.getElementById("SplashScreen").style.zIndex = "-10";
        document.getElementById("SplashScreen").style.opacity = "0";
        NUM_ROWS = 14;
        NUM_COLUMNS = 20;
        reset();
    };

    //logic to reveal when clicking a nonnumbered grey square
    function revealArea(rowIdx, colIdx) {
        if (rowIdx === 0) {
            if (colIdx === 0) {
                for (let i = 0; i < 2; i++) {
                    handleClick(rowIdx + 1, i);
                }
                handleClick(rowIdx, 1);
            } else if (colIdx === NUM_COLUMNS - 1) {
                for (let i = 0; i < 2; i++) {
                    handleClick(rowIdx + 1, colIdx - 1 + i);
                }
                handleClick(rowIdx, colIdx - 1);
            } else {
                for (let i = 0; i < 3; i++) {
                    handleClick(rowIdx + 1, colIdx - 1 + i);
                }
                handleClick(rowIdx, colIdx + 1);
                handleClick(rowIdx, colIdx - 1);
            }
        } else if (rowIdx === NUM_ROWS - 1) {
            if (colIdx === 0) {
                for (let i = 0; i < 2; i++) {
                    handleClick(rowIdx - 1, i);
                }
                handleClick(rowIdx, colIdx + 1);

            } else if (colIdx === NUM_COLUMNS - 1) {
                for (let i = 0; i < 2; i++) {
                    handleClick(rowIdx - 1, colIdx - i);
                }
                handleClick(rowIdx, colIdx - 1);
            } else {
                for (let i = 0; i < 3; i++) {
                    handleClick(rowIdx - 1, colIdx - 1 + i);
                }
                handleClick(rowIdx, colIdx + 1);
                handleClick(rowIdx, colIdx - 1);
            }
        } else if (colIdx === 0) {
            handleClick(rowIdx - 1, colIdx);
            handleClick(rowIdx - 1, colIdx + 1);
            handleClick(rowIdx, colIdx + 1);
            handleClick(rowIdx + 1, colIdx);
            handleClick(rowIdx + 1, colIdx + 1);

        } else if (colIdx === NUM_COLUMNS - 1) {
            handleClick(rowIdx - 1, colIdx);
            handleClick(rowIdx - 1, colIdx - 1);
            handleClick(rowIdx, colIdx - 1);
            handleClick(rowIdx + 1, colIdx);
            handleClick(rowIdx + 1, colIdx - 1);
        } else {
            for (let i = 0; i < 3; i++) {
                handleClick(rowIdx - 1, colIdx - 1 + i);
            }
            for (let i = 0; i < 3; i++) {
                handleClick(rowIdx + 1, colIdx - 1 + i);

            }
            handleClick(rowIdx, colIdx + 1);
            handleClick(rowIdx, colIdx - 1);
        }
    }



    function handleClick(rowIdx, colIdx) {
        console.log(`handleClick called with rowIdx = ${rowIdx}, colIdx = ${colIdx}, ${JSON.stringify(boardState)}`);
        if (boardState.haveAWinner || boardState.haveALoser)
            return;

        if (boardState.board[rowIdx][colIdx].isOccupied) return;


        //CHANGE NUMCLICKS
        //MAKLE GLOBAL VARIABLE WITH CELLS - BOMBS AND THEN INCREMENT ON ADVANCE COLOR AND CHECK IN HANDLECLICK
        //TO SEE IF WIN
        let board = boardState.board;
        let affectedRow = board[rowIdx];
        console.log(`existing cell before change of color contains ${JSON.stringify(affectedRow[colIdx])}`);

        let x = false;
        if (affectedRow[colIdx].color === "white" && affectedRow[colIdx].aroundBombs < 1 && !affectedRow[colIdx].bomb) {
            x = true;
        }
        affectedRow[colIdx] = {
            ...affectedRow[colIdx],
            color: advanceColor(affectedRow[colIdx].color, board, rowIdx, colIdx),
            isOccupied: true
        };
        console.log(`existing cell after change of color contains ${JSON.stringify(affectedRow[colIdx])}`);
        let newBoard = board;
        newBoard[rowIdx] = affectedRow;
        console.log(newBoard);


        setBoardState({
            ...boardState,
            board: newBoard,
        });

        console.log("board set");
        console.log(board);
        if (x) {
            revealArea(rowIdx, colIdx);
        }

        if (clickBomb) {
            setBoardState(boardState => ({
                ...boardState,
                haveALoser: true,
            }));
            //timeout to allow time for the board to update
            setTimeout(function () {
                alert("Game Over, you lose!");
            }, 5);
        }


        if (cellCount === (numCells - bombCount)) {
            console.log("cellcount " + cellCount);
            console.log("numCells " + numCells);
            console.log("bombCount" + bombCount);
            setBoardState(boardState => ({
                ...boardState,
                haveAWinner: true,
            }));

            setTimeout(function () {
                alert("You Win!");
                console.log(board);
                console.log(cellCount);
            }, 5);
        }
    }


        return (
            <Fragment>
                <div id="SplashScreen" className="splash">
                    <h2> </h2>
                <h1 className="text"> Minesweeper </h1>
                    <p className="text"> Choose your Difficulty </p>
                <input id="Easy" type="button" className="button" value="Easy" onClick={() => easy()}/>
                <input id="Medium" type="button" className="button" value="Medium" onClick={() => medium()}/>
                <input id="Hard" type="button" className="button" value="Hard" onClick={() => hard()}/>

            </div>
                <h1 className="text">Minesweeper</h1>
                <TopMessage
                            haveALoser={boardState.haveALoser}
                            haveAWinner={boardState.haveAWinner}
                            reveal={reveal}
                            reset={reset}
                    />
                <table id="table" border={1} align="center">
                    <tbody>
                    {
                        boardState.board.map((row, rowIdx) =>
                                                                    (<Row key={uniqueKey()}
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


