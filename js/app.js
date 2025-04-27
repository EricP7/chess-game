document.addEventListener('DOMContentLoaded', () => {
    const player1Input = document.getElementById('player1');
    const player2Input = document.getElementById('player2');
    const startGameButton = document.getElementById('start-game');
    const resetGameButton = document.getElementById('reset-game');
    
    const game = new Game(null);
    
    game.initialize();
    
    window.gameInstance = game;
    
    startGameButton.addEventListener('click', () => {
        const player1Name = player1Input.value.trim();
        const player2Name = player2Input.value.trim();
        
        game.startGame(player1Name, player2Name);
    });
    
    resetGameButton.addEventListener('click', () => {
        game.resetGame();
        
        if (p5Instance) {
            p5Instance.resetBoard();
        }
    });
});