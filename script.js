//DOM elements and variables
const grid = document.querySelector('.grid');
let width = 10;
let bugsAmount = 20;
let squares = [];
let isGameover = false;
let codes = 0;

//Create board
function createBoard() {
    //get shuffled array for random bugs(bombs)
    const bugsArr = Array(bugsAmount).fill('bug');
    const emptyArr = Array(width * width - bugsAmount).fill('empty');
    const boardArr = emptyArr.concat(bugsArr);
    const shuffledArr = boardArr.sort(() => Math.random() - 0.5);

    //Create squares inside html
    for (let i = 0; i < width * width; i++) {
        const square = document.createElement('div');
        square.setAttribute('id', i);
        square.classList.add(shuffledArr[i]);
        grid.appendChild(square);
        squares.push(square);

        //event listener for a normal click
        square.addEventListener('click', function (e) {
            click(square);
        })

        //left click
        square.oncontextmenu = function (e) {
            e.preventDefault();
            addCode(square);
        }
    }

    //add  numbers
    for (let i = 0; i < squares.length; i++) {
        let total = 0;
        const isLeftEdge = (i % width === 0);
        const isRightEdge = (i % width === width - 1);

        if (squares[i].classList.contains('empty')) {
            if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bug')) {
                total++
            }
            if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bug')) {
                total++
            }
            if (i > 10 && squares[i - width].classList.contains('bug')) {
                total++
            }
            if (i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('bug')) {
                total++
            }
            if (i < 98 && !isRightEdge && squares[i + 1].classList.contains('bug')) {
                total++
            }
            if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bug')) {
                total++
            }
            if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains('bug')) {
                total++
            }
            if (i < 89 && squares[i + width].classList.contains('bug')) {
                total++
            }
            squares[i].setAttribute('data', total);
            squares[i].classList.add('num');
        }
    }
}

createBoard();

//add code icons(flags) with right click
function addCode(square) {
    if (isGameover) {
        return;
    }
    if (!square.classList.contains('checked.safe') && (codes < bugsAmount)) {
        if (!square.classList.contains('coded')) {
            square.classList.add('coded');
            square.innerHTML = '<i class="fas fa-code"></i>';
            codes++;
            checkforWin();
        } else {
            square.classList.remove('coded');
            square.innerHTML = '';
            codes--;
        }
    }
}


//click on square function
function click(square) {
    let currentId = square.id;
    if (isGameover) {
        return;
    }
    if (square.classList.contains('checked.safe') || square.classList.contains('coded')) {
        return;
    }
    if (square.classList.contains('bug')) {
        gameOver(square);
    } else {
        let total = square.getAttribute('data');
        if (total != 0) {
            square.classList.add('checked.safe');
            square.innerHTML = total;
            return;
        }
        checkSquare(square, currentId);
    }
    square.classList.add('checked.safe');
    square.innerHTML = '<i class="fas fa-check"></i>';
}

//check neighbor squares when square is clicked
function checkSquare(square, currentId) {
    const isLeftEdge = (currentId % width === 0);
    const isRightEdge = (currentId & width === width - 1);

    setTimeout(() => {
        if (currentId > 0 && !isLeftEdge) {
            const newId = squares[parseInt(currentId) - 1].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        if (currentId > 9 && !isRightEdge) {
            const newId = squares[parseInt(currentId) + 1 - width].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        if (currentId > 10) {
            const newId = squares[parseInt(currentId) - width].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        if (currentId > 11 && !isLeftEdge) {
            const newId = squares[parseInt(currentId) - 1 - width].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        if (currentId < 98 && !isRightEdge) {
            const newId = squares[parseInt(currentId) + 1].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        if (currentId < 90 && !isLeftEdge) {
            const newId = squares[parseInt(currentId) - 1 + width].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        if (currentId < 88 && !isRightEdge) {
            const newId = squares[parseInt(currentId) + 1 + width].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        if (currentId < 89) {
            const newId = squares[parseInt(currentId) + width].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
    }, 10)
}

//game over
function gameOver(square) {
    console.log('Game Over!');
    isGameover = true;

    //show bombs
    squares.forEach(square => {
        if (square.classList.contains('bug')) {
            square.innerHTML = '<i class="fas fa-bug"></i>';
        }
    })
}

//check for win
function checkforWin() {
    let matches = 0;
    for (let i = 0; i < squares.length; i++) {
        if (squares[i].classList.contains('coded') && squares[i].classList.contains('bug')) {
            matches++
        }
        if (matches === bugsAmount) {
            console.log('you won');
            isGameover = true;
        }
    }
}
