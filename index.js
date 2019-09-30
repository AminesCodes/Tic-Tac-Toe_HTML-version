class Player {
    constructor (id, name) {
        this.id = id;
        this.name = name;
        this.turn = null;
        this.wins = 0;
        this.started = false;
    }
}

let playerOne;
let playerTwo;
let numberOfPlayers;
let O = `<img src="letter o - temp.png" alt="O">`;
let X = `<img src="/red-x.png" alt="X">`;

let gameGrid = [];
let thereIsAWin = false;


document.addEventListener("DOMContentLoaded", () => {
    let numberOfPlayersSelectionDiv = document.querySelector("#numberOfPlayersSelection");
    
    let namesInputsDiv = document.querySelector("#namesInputs");
    namesInputsDiv.style.display = "none";

    let gameOverDiv = document.querySelector("#gameOver");
    gameOverDiv.style.display = "none";

    let gameWrapDiv = document.querySelector("#GameWrap");
    gameWrapDiv.style.display = "none";

    let playerTwoNameInput = document.querySelector("#p2Name");
    playerTwoNameInput.style.visibility = "hidden";

    let playerOneNameInput = document.querySelector("#p1Name");

    let onePlayerBtn = document.querySelector("#onePlayer");
    onePlayerBtn.addEventListener("click", () => {
        namesInputsDiv.style.display = "block";
        clearNumberOfPlayersSelection(numberOfPlayersSelectionDiv);
        numberOfPlayers = 1;
    }) //END EVENT LISTENER TO ONE PLAYER BUTTON;

    let twoPlayersBtn = document.querySelector("#twoPlayers");
    twoPlayersBtn.addEventListener("click", () => {
        namesInputsDiv.style.display = "block";
        clearNumberOfPlayersSelection(numberOfPlayersSelectionDiv);
        playerTwoNameInput.style.visibility = "visible";
        numberOfPlayers = 2;
    }) //END EVENT LISTENER TO TWO PLAYER BUTTON

    let startBtn = document.querySelector("#start");
    startBtn.addEventListener("click", () => {
        namesInputsDiv.style.display = "none";
        if (playerOneNameInput.value) {
            playerOne = new Player(1, playerOneNameInput.value);
        } else {
            playerOne = new Player(1, "PLAYER 1");
        }
        playerOne.turn = true;
        playerOne.started = true;

        if (numberOfPlayers === 2) {
            if (playerTwoNameInput.value) {
                playerTwo = new Player(2, playerTwoNameInput.value);
            } else {
                playerTwo = new Player(2, "PLAYER 2");
            }
        } else {
            playerTwo = new Player(2, "COMPUTER");
        }
        addPlayersInfoToDOM();

        gameWrapDiv.style.display = "block";
    }) //END EVENT LISTENER TO THE START BUTTON
    

    let gridContainer = document.querySelector("#container");
    gridContainer.addEventListener("click", (event) => {
        let selection = event.target;
        
        if (selection.parentNode === gridContainer && selection.innerHTML === "") {
            let index = selection.id[3];
            if (playerOne.turn && !thereIsAWin) {
                gameGrid[index] = "x";
                selection.innerHTML = X;
                playerOne.turn = false;
                playerTwo.turn = true;
                checkForAWin(gameOverDiv);
                gameGridFull(gameOverDiv);

            } else if (numberOfPlayers === 2 && !thereIsAWin){
                gameGrid[index] = "o";
                selection.innerHTML = O;
                playerOne.turn = true;
                playerTwo.turn = false;
                checkForAWin(gameOverDiv);
                gameGridFull(gameOverDiv);
            }

            if (!thereIsAWin) {
                getComputerMove(gameOverDiv);  
                checkForAWin(gameOverDiv);
            }
            gameGridFull(gameOverDiv);
        }
    }) //END EVENT LISTENER FOR THE MOVES SELECTION

    let restartButton = document.querySelector("#restart");
    restartButton.addEventListener("click", () => {
        resetGameGrid(gridContainer, gameOverDiv);
    }) //END EVENT LISTENER FOR THE RESTART BUTTON

    let QuitButton = document.querySelector("#QuitButton");
    QuitButton.addEventListener("click", () => {
        let paragraph = gameOverDiv.querySelector("p");
        if (playerOne.wins > playerTwo.wins) {
            paragraph.innerText = `${playerOne.name.toUpperCase()} WON THE GAME\nTHANK YOU FOR PLAYING`
        } else if (playerOne.wins < playerTwo.wins) {
            paragraph.innerText = `${playerTwo.name.toUpperCase()} WON THE GAME\nTHANK YOU FOR PLAYING`
        } else {
            paragraph.innerText = `TIE GAME\nTHANK YOU FOR PLAYING`
        }

        setTimeout(() => location.reload(), 2500);
    }) //END EVENT LISTENER FOR THE QUITE BUTTON

}) //END EVENT LISTENER TO THE DOM CONTENT LOADED

const clearNumberOfPlayersSelection = (element) => {
    element.style.display = "none";
}

const getRandomMove = () => {
    let randomIndex = Math.floor(Math.random() * 9);
    if (!gameGrid[randomIndex]) {
        gameGrid[randomIndex] = "o"
        return randomIndex;
    } else {
        return getRandomMove();
    }
}

const getComputerMove = (container) => {
    if (numberOfPlayers === 1 && !playerOne.turn && !gameGridFull(container)) {
        let computerMoveIndex = getRandomMove();
        let computerMove = document.querySelector(`#div${computerMoveIndex}`);
        computerMove.innerHTML = O;
        playerOne.turn = true;
        playerTwo.turn = false;
    }
}

const gameGridFull = (container) => {
    let gridFull = true;
    for (let i = 0; i < 9; i++) {
        if (!gameGrid[i]) {
            gridFull = false;
        }
    }

    if (gridFull && !thereIsAWin) {
        setTimeout(() => {
            container.style.display = "block";
            let paragraph = container.querySelector("P");
            paragraph.innerText = "TIE GAME";
        }, 500)
    }
    return gridFull;
}

const resetGameGrid = (gridContainer, gameOverContainer) => {
    thereIsAWin = false;

    let gameGrids = gridContainer.querySelectorAll("div");
    for (let i = 0; i < gameGrids.length; i++) {
        gameGrids[i].innerHTML = "";
    }
    gameOverContainer.style.display = " none";
    gameGrid = [];

    if (playerOne.started) {
        playerOne.started = false;
        playerTwo.started = true;
        playerOne.turn = false;
        playerTwo.turn = true;
    } else {
        playerOne.started = true;
        playerTwo.started = false;
        playerOne.turn = true;
        playerTwo.turn = false;
    }

    if (playerTwo.started && numberOfPlayers === 1) {
        getComputerMove();
    } 
}

const checkForAWin = (container) => {
    for (let i = 0; i < 7; i+=3) {
        if (gameGrid[i] === gameGrid[i+1] 
            && gameGrid[i] === gameGrid[i+2]
            && gameGrid[i] === "x") {
                playerOne.wins += 1;
                displayWin(playerOne, playerTwo, container);
                thereIsAWin = true;
                addPlayersInfoToDOM();
        }
        
        if (gameGrid[i] === gameGrid[i+1] 
            && gameGrid[i] === gameGrid[i+2]
            && gameGrid[i] === "o") {
                playerTwo.wins += 1;
                displayWin(playerTwo, playerOne, container);
                thereIsAWin = true;
                addPlayersInfoToDOM();
        }
    }

    for (let i = 0; i < 3; i++) {
        if (gameGrid[i] === gameGrid[i+3] 
            && gameGrid[i] === gameGrid[i+6]
            && gameGrid[i] === "x") {
                playerOne.wins += 1;
                displayWin(playerOne, playerTwo, container);
                thereIsAWin = true;
                addPlayersInfoToDOM();
        }
        
        if (gameGrid[i] === gameGrid[i+3] 
            && gameGrid[i] === gameGrid[i+6]
            && gameGrid[i] === "o") {
                playerTwo.wins += 1;
                displayWin(playerTwo, playerOne, container);
                thereIsAWin = true;
                addPlayersInfoToDOM();
        }
    }
    
    if ((gameGrid[0] === gameGrid[4] 
        && gameGrid[0] === gameGrid[8]
        && gameGrid[0] === "x")
        || (gameGrid[2] === gameGrid[4] 
            && gameGrid[2] === gameGrid[6]
            && gameGrid[2] === "x")) {
            playerOne.wins += 1;
            displayWin(playerOne, playerTwo, container);
            thereIsAWin = true;
            addPlayersInfoToDOM();
    }
    
    if ((gameGrid[0] === gameGrid[4] 
        && gameGrid[0] === gameGrid[8]
        && gameGrid[0] === "o")
        || (gameGrid[2] === gameGrid[4] 
            && gameGrid[2] === gameGrid[6]
            && gameGrid[2] === "o")) {
            playerTwo.wins += 1;
            displayWin(playerTwo, playerOne, container);
            thereIsAWin = true;
            addPlayersInfoToDOM();
    }
}

const displayWin = (winner, loser, parentDiv) => {
    parentDiv.style.display = "block";

    let paragraph = parentDiv.querySelector("p");
    paragraph.innerHTML = `${winner.name} won this round <br> Would you like to play again?`
}

const addPlayersInfoToDOM = () => {
    let playerOneNameOnDOM = document.querySelector("#playerOne");
    playerOneNameOnDOM.innerText = playerOne.name.toUpperCase() + ": " + playerOne.wins;
    
    let playerTwoNameOnDOM = document.querySelector("#playerTwo");
    playerTwoNameOnDOM.innerText = playerTwo.name.toUpperCase() + ": " + playerTwo.wins;
}