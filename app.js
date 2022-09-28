// HTML elements that we need for DOM manipulation.
const DOMStrings = {
    dice: document.querySelector('.dice'),
    btnNew: document.querySelector('.btn--new'),
    btnHold: document.querySelector('.btn--hold'),
    btnRoll: document.querySelector('.btn--roll')
};

// Game object to set default values for the the game.
const game = {
    activePlayer: '',
    otherPlayer: '',
    recentActivePlayer: '', // For swapping of players.
    dieSides: 6, // We can also set the number of sides for our dice, but we need to design the dots also.
    randomNumber: 0,
    scoreLimit: 100, // Winning score.
    gamePlay: '', // If true, game is on, if false, game has winner or player decided to HOLD.
    rollNumberToAvoid: [1, 3] // We can set up the numbers we want to avoid.
};

// Player 1 object
const player1 = {
    playerName: 'player-1',
    score: 0,
    currentScore: 0
};

// Player 2 object
const player2 = {
    playerName: 'player-2',
    score: 0,
    currentScore: 0
};

class UI {
    static activePlayerCurrentScore(currentScoreElement) {
        currentScoreElement.textContent = game.activePlayer.currentScore;
    }
    static displayDice(randomNumber) {
        DOMStrings.dice.src = `dice-${randomNumber}.png`;
    }
    static activePlayerScore(scoreElement) {
        scoreElement.textContent = game.activePlayer.score;
    }
    static addPlayerActive(activePlayer) {
        document.querySelector(`#${activePlayer.playerName}`).classList.toggle('player--active');
    }
    static removePlayerActive(activePlayer, otherPlayer) {
        let players = [activePlayer, otherPlayer];
        for (let i = 0; i < players.length; i++) {
            document.querySelector(`#${players[i].playerName}`).classList.remove('player--active');
        }
    }
    static disableEnableElements(elementState) {
        const toDisableButtons = [DOMStrings.btnRoll, DOMStrings.btnHold];
        for (let i = 0; i < toDisableButtons.length; i++) {
            if (elementState == 'disable') {
                toDisableButtons[i].disabled = true;
            } else if (elementState == 'enable') {
                toDisableButtons[i].disabled = false;
            }
            toDisableButtons[i].classList.toggle('disabled-state');
        }
        DOMStrings.dice.classList.toggle('disabled-state');
    }
    static addCurrentScoreToScore(activePlayerName) {
        const element = Game.getActivePlayerDOM(activePlayerName, 'score');
        game.activePlayer.score += game.activePlayer.currentScore;
        element.textContent = game.activePlayer.score;
    }
    static highlightWinner() {
        const parentElement = document.querySelector(`#${game.activePlayer.playerName}`);
        const nameElement = Game.getActivePlayerDOM(game.activePlayer.playerName, 'win-text');
        if (nameElement.classList.contains('win-text')) {
            nameElement.classList.toggle('win-text-hide');
        }
        if (parentElement.classList.contains('player')) {
            parentElement.classList.toggle('player--winner');
        }
        if (parentElement.classList.contains('player--active')) {
            parentElement.classList.toggle('player--active');
        }

    }
    static clearScores() {
        let players = [player1, player2];
        for (let i = 0; i < players.length; i++) {
            let element = Game.getActivePlayerDOM(players[i].playerName, 'score');
            element.textContent = 0;
            let currentScoreElement = Game.getActivePlayerDOM(players[i].playerName, 'current-score');
            currentScoreElement.textContent = 0;
            players[i].currentScore = 0;
            players[i].score = 0;
        }
    }
}

class Game {
    static generateRandomNumber(limit) {
        const randomNumber = Math.floor((Math.random() * limit) + 1);
        return randomNumber;
    }
    static getParentElement(activePlayerName) {
        const playerElement = document.querySelector(`#${activePlayerName}`);
        const playerElementChildrens = playerElement.children;
        return playerElementChildrens;
    }
    static getElementChildrens(parentElementChildrens, neededElement) {
        for (let i = 0; i < parentElementChildrens.length; i++) {
            if (parentElementChildrens[i].classList.contains(`${neededElement}`)) {
                const element = parentElementChildrens[i];
                return element;
            }
        }
    }
    static getElementChildChildrens(playerElementChildrens, neededElement) {
        for (let i = 0; i < playerElementChildrens.length; i++) {
            if (playerElementChildrens[i].classList.contains('name')) {
                const currentElement = playerElementChildrens[i];
                const currentElementChildrens = currentElement.children;
                for (let j = 0; j < currentElementChildrens.length; j++) {
                    if (currentElementChildrens[j].classList.contains(`${neededElement}`)) {
                        const nameElement = currentElementChildrens[j];
                        return nameElement;
                    }
                }
            }
            if (playerElementChildrens[i].classList.contains('current')) {
                const currentElement = playerElementChildrens[i];
                const currentElementChildrens = currentElement.children;
                for (let j = 0; j < currentElementChildrens.length; j++) {
                    if (currentElementChildrens[j].classList.contains(`${neededElement}`)) {
                        const currentScoreElement = currentElementChildrens[j];
                        return currentScoreElement;
                    }
                }
            }
        }
    }
    static getActivePlayerDOM(activePlayerName, neededElement) {
        const playerElementChildrens = this.getParentElement(activePlayerName);
        if (neededElement == 'name') {
            const nameElement = this.getElementChildrens(playerElementChildrens, neededElement);
            return nameElement;
        }
        if (neededElement == 'win-text') {
            const playerElementChildrens = this.getParentElement(activePlayerName);
            const winTextElement = this.getElementChildChildrens(playerElementChildrens, neededElement);
            return winTextElement;
        }
        if (neededElement == 'score') {
            const scoreElement = this.getElementChildrens(playerElementChildrens, neededElement);
            return scoreElement;
        }
        if (neededElement == 'current') {
            const currentElement = this.getElementChildrens(playerElementChildrens, neededElement);
            return currentElement;
        }
        if (neededElement == 'current-label') {
            const playerElementChildrens = this.getParentElement(activePlayerName);
            const currentLabelElement = this.getElementChildChildrens(playerElementChildrens, neededElement);
            return currentLabelElement;
        }
        if (neededElement == 'current-score') {
            const playerElementChildrens = this.getParentElement(activePlayerName);
            const currentScoreElement = this.getElementChildChildrens(playerElementChildrens, neededElement);
            return currentScoreElement;
        }
    }
    static swapPlayers() {
        game.activePlayer.currentScore = 0;
        const element = Game.getActivePlayerDOM(game.activePlayer.playerName, 'current-score');
        element.textContent = 0;
        game.randomNumber = 0;
        game.activePlayer = game.otherPlayer;
        game.otherPlayer = game.recentActivePlayer;
        game.recentActivePlayer = game.activePlayer;
        UI.removePlayerActive(game.activePlayer, game.otherPlayer);
        UI.addPlayerActive(game.activePlayer);
    }
    static checkIfActivePlayerWins() {
        if (game.activePlayer.score >= game.scoreLimit) {
            game.gamePlay = false;
        }
    }

    static gamePlay() {
        if (game.gamePlay == true) {
            const rollNumberToAvoid = game.rollNumberToAvoid;
            let matched = 0;
            let notMatched = 0;
            for (let i = 0; i < rollNumberToAvoid.length; i++) {
                if (game.randomNumber == rollNumberToAvoid[i]) {
                    matched += 1;
                } else {
                    notMatched += 1;
                }
            }
            if (matched == 1) {
                game.activePlayer.currentScore = 0;
                this.checkIfActivePlayerWins();
                if (game.gamePlay == true) {
                    this.swapPlayers();
                }
            } else if (notMatched == rollNumberToAvoid.length) {
                game.activePlayer.currentScore += game.randomNumber;
                const element = Game.getActivePlayerDOM(game.activePlayer.playerName, 'current-score');
                UI.activePlayerCurrentScore(element);
            }

        }
    }

    // Inititaing the game or preparing default values of the game object, then setting
    // the default active player which is player 1 by highlighting it on the html
    static init() {
        // If true, game is good to go, if false, game declares the winner or maybe
        // triggered by NEW GAME or HOLD event.
        game.gamePlay = true;

        // Setting default values to the game object.
        game.activePlayer = player1;
        game.otherPlayer = player2;
        game.recentActivePlayer = game.activePlayer;

        // Highlighting player 1 on the html.
        document.querySelector(`#${game.activePlayer.playerName}`).classList.add('player--active');

        // Setting default dice display to 1.
        DOMStrings.dice.src = 'dice-1.png';
    }
}
// NEW GAME button event, to play another game that depends on the condition of
// game.gamePlay object value. If condition is false, we enable the elements that're
// disabled, get some nodelist to toogle classes required, reset the scores to zero
// for both players, remove 'player--active' class & re-initiate the game. If 
// condition is true, it means we click the NEW GAME button while there's no 
// winner so we just reset the scores to zero & re-initialize the game.
DOMStrings.btnNew.addEventListener('click', function () {
    if (game.gamePlay == false) {
        // Static class to enable disabled elements.
        UI.disableEnableElements('enable');

        // Getting the nodelist of section with class 'player' which is represented by the 
        // active player.
        const parentElement = document.querySelector(`#${game.activePlayer.playerName}`);

        // If there's class 'player--winner', we toggle that class, it
        // the class is there, we remove it, if it's not there we add it.
        if (parentElement.classList.contains('player--winner')) {
            parentElement.classList.toggle('player--winner');
        }

        // Getting the child node of section with the class 'win-text' to check if it's
        // there, if true, we toggle the span with the class 'win-text-hide' to remove it
        // if's there, or add it if's not there.
        const nameElement = Game.getActivePlayerDOM(game.activePlayer.playerName, 'win-text');
        if (nameElement.classList.contains('win-text')) {
            nameElement.classList.toggle('win-text-hide');
        }

        // Static class to reset scores to zero, this references to active & other players actual
        // score & current score. This also applies to the html.
        UI.clearScores();

        // Re-initiating the game, means starting a new game.
        Game.init();
    } else if (game.gamePlay == true) {
        // Static class to reset scores to zero, this references to active & other players actual
        // score & current score. This also applies to the html.
        UI.clearScores();

        // Static class to remove class 'player--active'.
        UI.removePlayerActive(game.activePlayer, game.otherPlayer);

        // Re-initiating the game, means starting a new game.
        Game.init();
    }
});

// HOLD button event, to add current score to the actual score & check
// if there's a winner by the condition of game.gamePlay. If condition is
// true, there's not yet a winner & we swap players. If condition is false,
// there's a winner & we disable ROLL & HOLD button then lower the opacity
// of the dice image.
DOMStrings.btnHold.addEventListener('click', function () {
    // Static class to add current score to the actual score
    UI.addCurrentScoreToScore(game.activePlayer.playerName);

    // Static class to check if player score reached the score limit.
    // In other words, to check if player wins.
    Game.checkIfActivePlayerWins();

    // If condition is true, then we just swap players, if false, we
    // disable HOLD & ROLL buttons. If condition is false, it also means
    // there's a winner, thus we highlight it by changing the appearance.
    // We also lower the opacity of the dice image.
    if (game.gamePlay == true) {
        // Static class to swap players, by default player 1 is the active player
        // then player 2 becomes the new active player.
        Game.swapPlayers();
    } else {
        // Static class to disable HOLD & ROLL buttons then lower the opacity
        // of the dice image.
        UI.disableEnableElements('disable');

        // Static class to highlight the winner.
        UI.highlightWinner();
    }
});

// ROLL button event, to roll the dice by generating random number that
// matches the dice number, presented by red circles. Then we display it
// then initiate the game.
DOMStrings.btnRoll.addEventListener('click', function () {
    // Generate random number & saving it to game.randomNumber object name.
    const randomNumber = Game.generateRandomNumber(game.dieSides);
    game.randomNumber = randomNumber;

    // Static class to display randomNumber.
    UI.displayDice(randomNumber);

    // Static class to initiate game.
    Game.gamePlay();
});

// Static class to run the code.
Game.init();