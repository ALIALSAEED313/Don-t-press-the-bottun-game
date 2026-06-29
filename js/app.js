/*------------------------ Cached Element References ------------------------*/
const dialogueText = document.querySelector('#dialogue-text')
const interactionArea = document.querySelector('#game-interaction-area')
const gameInstruction = document.querySelector('.game-instruction')
const themeToggleBtn = document.querySelector('#theme-toggle')
const timerDisplay = document.querySelector('#timer-display')
const bodyElement = document.querySelector('body')
let mainButton = document.querySelector('#main-button')


console.log('dialogueText')
console.log('interactionArea')
console.log('gameInstructions')
console.log('themeToggleBtn')
console.log('timerDisplay')
console.log('bodyElement')
console.log('mainButton')

/*-------------------------------- Constants --------------------------------*/


/*-------------------------------- Variables --------------------------------*/

let gameStarted = false
let stageIndex = 0
let stageClicks = 0
let tatalClicks = 0
let secretNumbers = 0
let minusNumber = 0
let globalTimer = null
let timeLeft = 10
/*-------------------------------- Functions --------------------------------*/

/*----------------------------- Event Listeners -----------------------------*/

