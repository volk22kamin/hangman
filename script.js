const hangmanImage = document.getElementById('image');
const letterDisplay = document.getElementById('letters');
const modal = document.getElementById('you-won-container');
const playAgain = document.getElementById('play-again');
const exit = document.getElementById('exit');
const finishMsg = document.getElementById('you-won');

let guessWord = '';
const undeline = '_ ';
let wordArr = [];
let stringDisplay = '';
let absentLetters = [];

const stepImages = ['first', 'second', 'third','four', 'five', 'six','seven', 'eight'];



// fetching the word from API
const getWordFromApi = async () => {
    const apiURL = 'https://random-words-api.vercel.app/word';
    guessWord = '';
    try{
        const response = await fetch(apiURL);
        const data  = await response.json();
        guessWord = data[0].word.toLowerCase();
        startGame();
        return true;
    } catch(error) {
        console.log("error" , error);
        return false;
    }
}




// global var of steps
let step = 0;


// adding input to the letter guising line
const addInput = (letter, occ) =>{
    if(!wordArr.includes(letter)){
        if(occ.length !== 0){
            for(let i = 0; i < occ.length; i++){
                wordArr[occ[i]] = letter;
            }
        } else {
            if(!absentLetters.includes(letter)){
                absentLetters.push(letter);
                changeStep();
            }
        }
    }
    stringDisplay = wordArr.join(' ');
    letterDisplay.textContent = stringDisplay;
}

// if the lwtter is not included in the word
const changeStep = () => {
    hangmanImage.setAttribute('src', `img/${stepImages[step++]}.png`);
}



// wining the game
const wonTheGame = () => {
    modal.classList.add('show');
    finishMsg.textContent = 'YOU WON!! YEEEY';
} 

const lostTheGame = () => {
    modal.classList.add('show');
    finishMsg.textContent = `You lost, the word was: ${guessWord}`  ;    
}
    


// first build of the guessing
const drawUnderlines = () => {
    for(let i = 0; i < guessWord.length; i++){
        wordArr.push(undeline);
    }
    stringDisplay = wordArr.join(' ');
    letterDisplay.textContent = stringDisplay;
}

// restarting the game (need to add later the guess word changes)
const restart = () => {
    modal.classList.remove('show');
    getWordFromApi();
    wordArr.length = 0;
    absentLetters = [];
    step = 0;
    startGame();
}

const startGame = () => {
    drawUnderlines();
    changeStep();   
    console.log(guessWord);
}

const gameHandler = (letter) => {
    addInput(letter, findAll(letter));
    // game over
    if(step === 8) lostTheGame();
    // if the same letter wntered twice
    if(absentLetters.includes(letter)) return;
    
    
    // check if won the game
    if(!wordArr.includes('_ ')) wonTheGame();
    
}

// find all occurancec
const findAll = (letter) => {
    let occ = [];
    for(let i = 0 ;i < guessWord.length; i++){
        if (letter === guessWord[i]) occ.push(i);
    }
    return occ;
}

// events
document.addEventListener('keydown', (e) => {
    e.keyCode >= 65 && e.keyCode <= 90 ? gameHandler(e.key) : false;
})

playAgain.addEventListener('click', restart);
exit.addEventListener('click', () => window.close());

// on load
getWordFromApi();

