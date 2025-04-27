class ChessPiece {
    constructor(type, color, row, col) {
        this.type = type;
        this.color = color;
        this.row = row;
        this.col = col;
        this.hasMoved = false;
        this.element = null;
    }

    getImagePath() {
        return `assets/${this.color}_${this.type}.svg`;
    }

    createElement() {
        const element = document.createElement('div');
        element.classList.add('chess-piece', 'loading-piece');
        element.style.backgroundImage = `url('${this.getImagePath()}')`;
        element.dataset.pieceType = this.type;
        element.dataset.pieceColor = this.color;
        this.element = element;
        return element;
    }

    moveTo(row, col) {
        this.row = row;
        this.col = col;
        this.hasMoved = true;
    }
}