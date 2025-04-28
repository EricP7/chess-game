

let boardState = null;
let selectedPiece = null;
let squareSize = 0;


const BOARD_SIZE = 8;
const boardColors = {
    light: [240, 217, 181],
    dark: [181, 136, 99],
    selected: [255, 255, 0, 100]
};


const pieceSymbols = {
    'white': {
        'pawn': '♙', 'rook': '♖', 'knight': '♘',
        'bishop': '♗', 'queen': '♕', 'king': '♔'
    },
    'black': {
        'pawn': '♟', 'rook': '♜', 'knight': '♞',
        'bishop': '♝', 'queen': '♛', 'king': '♚'
    }
};


function initializeBoard() {

    boardState = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null));


    for (let col = 0; col < BOARD_SIZE; col++) {
        boardState[1][col] = { type: 'pawn', color: 'black' };
        boardState[6][col] = { type: 'pawn', color: 'white' };
    }


    const backRowPieces = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];

    for (let col = 0; col < BOARD_SIZE; col++) {
        boardState[0][col] = { type: backRowPieces[col], color: 'black' };
        boardState[7][col] = { type: backRowPieces[col], color: 'white' };
    }

    selectedPiece = null;
}


function movePiece(fromRow, fromCol, toRow, toCol) {
    boardState[toRow][toCol] = boardState[fromRow][fromCol];
    boardState[fromRow][fromCol] = null;
}


const sketch = (p) => {
    p.setup = function () {

        const container = document.getElementById('p5-container');
        const canvasSize = Math.min(container.clientWidth, 600);
        squareSize = canvasSize / BOARD_SIZE;

        const canvas = p.createCanvas(canvasSize, canvasSize);
        canvas.parent('p5-container');


        if (!boardState) {
            initializeBoard();
        }


        canvas.mousePressed(() => {
            const col = Math.floor(p.mouseX / squareSize);
            const row = Math.floor(p.mouseY / squareSize);


            if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) {
                return;
            }

            const clickedPiece = boardState[row][col];


            if (selectedPiece) {

                if (clickedPiece) {
                    selectedPiece = { ...clickedPiece, row, col };
                } else {

                    movePiece(selectedPiece.row, selectedPiece.col, row, col);
                    selectedPiece = null;
                }
            }

            else if (clickedPiece) {
                selectedPiece = { ...clickedPiece, row, col };
            }
        });
    };

    p.draw = function () {

        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {

                const isLight = (row + col) % 2 === 0;
                const color = isLight ? boardColors.light : boardColors.dark;

                p.fill(color);
                p.noStroke();
                p.rect(col * squareSize, row * squareSize, squareSize, squareSize);


                if (row === 7) {
                    p.fill(isLight ? boardColors.dark : boardColors.light);
                    p.textSize(12);
                    p.textAlign(p.RIGHT, p.BOTTOM);
                    p.text(String.fromCharCode(97 + col), (col + 1) * squareSize - 2, (row + 1) * squareSize - 2);
                }

                if (col === 0) {
                    p.fill(isLight ? boardColors.dark : boardColors.light);
                    p.textSize(12);
                    p.textAlign(p.LEFT, p.TOP);
                    p.text(8 - row, col * squareSize + 2, row * squareSize + 2);
                }
            }
        }


        if (selectedPiece) {
            p.fill(...boardColors.selected);
            p.rect(
                selectedPiece.col * squareSize,
                selectedPiece.row * squareSize,
                squareSize,
                squareSize
            );
        }


        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                const piece = boardState[row][col];
                if (piece) {
                    const x = col * squareSize + squareSize / 2;
                    const y = row * squareSize + squareSize / 2;

                    p.fill(piece.color === 'white' ? 255 : 0);
                    p.textSize(squareSize * 0.7);
                    p.textAlign(p.CENTER, p.CENTER);
                    p.text(pieceSymbols[piece.color][piece.type], x, y);
                }
            }
        }
    };
};


document.addEventListener('DOMContentLoaded', () => {

    new p5(sketch);


    document.getElementById('reset-game').addEventListener('click', () => {
        initializeBoard();
    });
});