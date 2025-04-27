class Board {
    constructor(boardElement) {
        this.boardElement = boardElement;
        this.squares = [];
        this.pieces = [];
        this.selectedPiece = null;
    }

    initialize() {
        this.squares = [];
        this.pieces = [];
        
        if (this.boardElement) {
            this.boardElement.innerHTML = '';
            
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    const square = document.createElement('div');
                    square.classList.add('chess-square');
                    square.classList.add((row + col) % 2 === 0 ? 'chess-white' : 'chess-black');
                    square.dataset.row = row;
                    square.dataset.col = col;
                    
                    square.addEventListener('click', () => this.handleSquareClick(row, col));
                    
                    this.boardElement.appendChild(square);
                    this.squares.push(square);
                }
            }
        }
        
        this.setupInitialPosition();
    }

    setupInitialPosition() {
        for (let col = 0; col < 8; col++) {
            this.addPiece('pawn', 'white', 6, col);
            this.addPiece('pawn', 'black', 1, col);
        }
        
        this.addPiece('rook', 'white', 7, 0);
        this.addPiece('rook', 'white', 7, 7);
        this.addPiece('rook', 'black', 0, 0);
        this.addPiece('rook', 'black', 0, 7);
        
        this.addPiece('knight', 'white', 7, 1);
        this.addPiece('knight', 'white', 7, 6);
        this.addPiece('knight', 'black', 0, 1);
        this.addPiece('knight', 'black', 0, 6);
        
        this.addPiece('bishop', 'white', 7, 2);
        this.addPiece('bishop', 'white', 7, 5);
        this.addPiece('bishop', 'black', 0, 2);
        this.addPiece('bishop', 'black', 0, 5);
        
        this.addPiece('queen', 'white', 7, 3);
        this.addPiece('queen', 'black', 0, 3);
        
        this.addPiece('king', 'white', 7, 4);
        this.addPiece('king', 'black', 0, 4);
    }

    addPiece(type, color, row, col) {
        const piece = new ChessPiece(type, color, row, col);
        this.pieces.push(piece);
        
        if (this.boardElement) {
            const square = this.getSquare(row, col);
            if (square) {
                square.appendChild(piece.createElement());
            }
        }
        
        return piece;
    }

    getSquare(row, col) {
        if (this.boardElement) {
            return this.squares[row * 8 + col];
        }
        return null;
    }

    getPiece(row, col) {
        return this.pieces.find(p => p.row === row && p.col === col);
    }

    handleSquareClick(row, col) {
        this.clearHighlights();
        
        const clickedPiece = this.getPiece(row, col);
        
        if (this.selectedPiece) {
            if (clickedPiece && clickedPiece.color === this.selectedPiece.color) {
                this.selectedPiece = clickedPiece;
                this.highlightSelectedPiece();
            } else {
                this.movePiece(this.selectedPiece, row, col);
                this.selectedPiece = null;
            }
        } else if (clickedPiece) {
            this.selectedPiece = clickedPiece;
            this.highlightSelectedPiece();
        }
    }

    movePiece(piece, toRow, toCol) {
        const capturedPiece = this.getPiece(toRow, toCol);
        if (capturedPiece) {
            this.removePiece(capturedPiece);
        }
        
        const fromRow = piece.row;
        const fromCol = piece.col;
        piece.moveTo(toRow, toCol);
        
        if (this.boardElement && piece.element) {
            const toSquare = this.getSquare(toRow, toCol);
            if (toSquare) {
                toSquare.appendChild(piece.element);
            }
        }
    }

    removePiece(piece) {
        if (this.boardElement && piece.element && piece.element.parentNode) {
            piece.element.parentNode.removeChild(piece.element);
        }
        
        const index = this.pieces.indexOf(piece);
        if (index !== -1) {
            this.pieces.splice(index, 1);
        }
    }

    highlightSelectedPiece() {
        if (!this.selectedPiece || !this.boardElement) return;
        
        const square = this.getSquare(this.selectedPiece.row, this.selectedPiece.col);
        if (square) {
            square.classList.add('selected');
        }
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (!this.getPiece(row, col)) {
                    const moveSquare = this.getSquare(row, col);
                    if (moveSquare) {
                        moveSquare.classList.add('valid-move');
                    }
                }
            }
        }
    }

    clearHighlights() {
        if (!this.boardElement) return;
        
        for (const square of this.squares) {
            square.classList.remove('selected', 'valid-move');
        }
    }

    reset() {
        this.initialize();
    }
}