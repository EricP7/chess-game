class Game {
    constructor(boardElement) {
        this.board = new Board(boardElement);
        this.player1Name = 'Player 1';
        this.player2Name = 'Player 2';
        this.currentTurn = 'white';
        this.isGameStarted = false;
        
        this.gameInfoElement = document.getElementById('game-info');
        this.currentPlayerElement = document.getElementById('current-player');
        this.player1NameElement = document.getElementById('player1-name');
        this.player2NameElement = document.getElementById('player2-name');
    }

    initialize() {
        this.board.initialize();
        this.currentTurn = 'white';
        this.isGameStarted = false;
        this.hideGameInfo();
    }

    startGame(player1Name, player2Name) {
        this.player1Name = player1Name || 'Player 1';
        this.player2Name = player2Name || 'Player 2';
        this.currentTurn = 'white';
        this.isGameStarted = true;
        
        this.updateGameInfo();
        this.showGameInfo();
    }

    resetGame() {
        this.board.reset();
        this.currentTurn = 'white';
        this.isGameStarted = false;
        this.hideGameInfo();
    }

    updateGameInfo() {
        this.currentPlayerElement.textContent = this.currentTurn.charAt(0).toUpperCase() + this.currentTurn.slice(1);
        this.player1NameElement.textContent = this.player1Name;
        this.player2NameElement.textContent = this.player2Name;
    }

    showGameInfo() {
        this.gameInfoElement.classList.remove('hidden');
    }

    hideGameInfo() {
        this.gameInfoElement.classList.add('hidden');
    }

    switchTurn() {
        this.currentTurn = this.currentTurn === 'white' ? 'black' : 'white';
        this.updateGameInfo();
    }
}