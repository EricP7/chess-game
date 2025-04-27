let boardSize;
let squareSize;
let pieceImages = {};
let selectedSquare = null;
let validMoves = [];
let boardColors = {
    light: [240, 217, 181],
    dark: [181, 136, 99]
};
let boardState;
let gameInstance;

const chessSketch = (p) => {
    p.preload = function() {
        const pieceTypes = ['pawn', 'rook', 'knight', 'bishop', 'queen', 'king'];
        const pieceColors = ['white', 'black'];
        
        pieceImages = {};
        
        pieceColors.forEach(color => {
            pieceImages[color] = {};
            pieceTypes.forEach(type => {
                let img = p.createGraphics(50, 50);
                img.background(0, 0, 0, 0);
                
                img.fill(color === 'white' ? 255 : 0);
                img.stroke(color === 'white' ? 0 : 255);
                img.strokeWeight(2);
                img.ellipse(25, 25, 40);
                
                img.textSize(20);
                img.textAlign(p.CENTER, p.CENTER);
                img.fill(color === 'white' ? 0 : 255);
                
                let letter = '';
                switch(type) {
                    case 'pawn': letter = 'P'; break;
                    case 'rook': letter = 'R'; break;
                    case 'knight': letter = 'N'; break;
                    case 'bishop': letter = 'B'; break;
                    case 'queen': letter = 'Q'; break;
                    case 'king': letter = 'K'; break;
                }
                
                img.text(letter, 25, 25);
                
                pieceImages[color][type] = img;
            });
        });
    };
    
    p.setup = function() {
        let container = document.getElementById('p5-container');
        boardSize = Math.min(container.clientWidth, 600);
        squareSize = boardSize / 8;
        
        let canvas = p.createCanvas(boardSize, boardSize);
        canvas.parent('p5-container');
        
        boardState = [];
        
        canvas.mousePressed(handleMousePressed);
    };
    
    p.draw = function() {
        drawBoard();
        drawPieces();
        drawHighlights();
    };
    
    function drawBoard() {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
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
    }
    
    function drawPieces() {
        if (!boardState) return;
        
        for (const piece of boardState) {
            const x = piece.col * squareSize + squareSize / 2;
            const y = piece.row * squareSize + squareSize / 2;
            const img = pieceImages[piece.color][piece.type];
            
            if (img) {
                p.imageMode(p.CENTER);
                p.image(img, x, y, squareSize * 0.8, squareSize * 0.8);
            }
        }
    }
    
    function drawHighlights() {
        if (selectedSquare) {
            p.fill(255, 215, 0, 100);
            p.rect(
                selectedSquare.col * squareSize, 
                selectedSquare.row * squareSize, 
                squareSize, 
                squareSize
            );
            
            p.fill(0, 128, 0, 80);
            for (const move of validMoves) {
                p.rect(
                    move.col * squareSize,
                    move.row * squareSize,
                    squareSize,
                    squareSize
                );
            }
        }
    }
    
    function handleMousePressed() {
        const col = Math.floor(p.mouseX / squareSize);
        const row = Math.floor(p.mouseY / squareSize);
        
        if (col < 0 || col > 7 || row < 0 || row > 7) return;
        
        const clickedPiece = findPieceAt(row, col);
        
        if (selectedSquare) {
            if (clickedPiece && clickedPiece.color === selectedSquare.color) {
                selectedSquare = { row, col, piece: clickedPiece };
                calculateValidMoves();
            } else {
                const selectedPiece = findPieceAt(selectedSquare.row, selectedSquare.col);
                if (selectedPiece) {
                    movePiece(selectedPiece, row, col);
                    gameInstance.switchTurn();
                }
                
                selectedSquare = null;
                validMoves = [];
            }
        } else if (clickedPiece) {
            selectedSquare = { row, col, piece: clickedPiece };
            calculateValidMoves();
        }
    }
    
    function findPieceAt(row, col) {
        return boardState.find(p => p.row === row && p.col === col);
    }
    
    function movePiece(piece, toRow, toCol) {
        const capturedPieceIndex = boardState.findIndex(p => p.row === toRow && p.col === toCol);
        if (capturedPieceIndex !== -1) {
            boardState.splice(capturedPieceIndex, 1);
        }
        
        piece.row = toRow;
        piece.col = toCol;
        piece.hasMoved = true;
    }
    
    function calculateValidMoves() {
        validMoves = [];
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const pieceAtSquare = findPieceAt(row, col);
                if (!pieceAtSquare || pieceAtSquare.color !== selectedSquare.piece.color) {
                    validMoves.push({ row, col });
                }
            }
        }
    }
    
    p.resetBoard = function() {
        boardState = gameInstance.board.pieces;
        selectedSquare = null;
        validMoves = [];
    };
    
    p.syncWithGame = function(game) {
        gameInstance = game;
        boardState = game.board.pieces;
    };
};

let p5Instance;
document.addEventListener('DOMContentLoaded', () => {
    p5Instance = new p5(chessSketch);
    
    const checkGameInstance = setInterval(() => {
        if (window.gameInstance) {
            p5Instance.syncWithGame(window.gameInstance);
            clearInterval(checkGameInstance);
        }
    }, 100);
});