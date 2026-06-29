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



/*-------------------------------- Variables --------------------------------*/

let gameStarted = false
let stageIndex = 0
let stageClicks = 0
let tatalClicks = 0
let secretNumbers = 0
let minusNumber = 0
let globalTimer = null
let timeLeft = 10
let targetClicks = 0

/*-------------------------------- Constants --------------------------------*/
const stages = [
    {
        //stage 0 = just dont click
        dialogue: "Do not Click The Button",
        buttonText: "CLICK",
        duration: 10,
        onTimeout: () => nextStage(),
        onClick: () => triggerGameOver("You clicked it! I explicitly said Not to.")
    },
    {
        //stage 1 = the screen will display a cat rather than a rat (the user expected to press the button if he saw a rat)
        dialogue: "Click if you see a rat...",
        buttonText: "WAIT FOR IT...",
        duration: 10,
        onEnter: () => {
            
            setTimeout(() => {
                if (stageIndex === 1) {
                    mainButton.textContent = "🐈 CAT! DON'T CLICK IT! 🐈"

                    // ⏰ Step 2: Swap the cat out for the actual RAT 2 seconds later
                    setTimeout(() => {
                        if (stageIndex === 1) {
                            mainButton.textContent = "🐀 RAT! CLICK IT! 🐀"
                        }
                    }, 2000)
                }
            }, Math.random() * 1500 + 1000)
        },
        onClick: () => {
            // 🎯 Evaluate exactly what text was on the button the millisecond they clicked
            if (mainButton.textContent.includes("RAT")) {
                nextStage()
            } else if (mainButton.textContent.includes("CAT")) {
                triggerGameOver("Gotcha! That was a cat! I explicitly said click a RAT.")
            } else {
                triggerGameOver("Too early! There wasn't even an animal on the screen yet!")
            }
        }
    },
    {
        //stage 2 = 
        dialogue: "Don't Click... just wait 3 seconds",
        buttonText: "CLICK",
        duration: 3,
        onTimeout: () => nextStage(),
        onClick: () => {
            playSound('fail')
            dialogueText.textContent = "I SAID DON'T CLICK! Timer restarted. Wait 3 seconds!"
            resetStageTimer(3)
        }
    },

    //stage 3 = click random times (but the question is like an equation ex.(5 - 2 = ___  so the user should click 3 times))
    {
        dialogue: "",
        buttonText: "CLICK",
        duration: 10,
        onEnter: () => {
            // 1. Pick a random target number of clicks between 1 and 10
            targetClicks = Math.floor(Math.random() * 10) + 1
            
            // 2. Build a random subtraction equation that equals our target
            // Example: If target is 4, offset is 3, equation is: 7 - 3 = 4
            const offset = Math.floor(Math.random() * 5) + 1
            const startingNum = targetClicks + offset
            
            dialogueText.textContent = `Click ${startingNum} - ${offset} = ____ times`
        },
        onClick: () => {
            if (stageClicks >= targetClicks) nextStage()
        }
    },
    {
        //stage 4 =  MEMORY OF THE LAST STAGE (user should press like the last stage)
        dialogue: "Click same as last stage!",
        buttonText: "CLICK",
        duration: 10,
        onClick: () => {
            // Checks against the exact same target clicks generated previously
            if (stageClicks >= targetClicks) nextStage()
        }
    },
    {
        //stage 5 = User have to remember the number that display on the screen
        dialogue:"",
        buttonText: "I memorized it.",
        duration: 10,
        onEnter: () => {
            secretNumber = Math.floor(Math.random() * 90) + 10
            dialogueText.textContent = `Remember the number: ${secretNumber}`
        },
        onClick: () => nextStage()
    },
    {
        //stage 6 = the user should click 15 times before the time runs out
        dialogue: "QUICK! System glitch! Click 15 times before time runs out!",
        buttonText: "TAP!",
        duration: 8,
        onClick: () => {
            if (stageClicks >= 15) nextStage()
        }
    },
    {
        //stage 7 = 
        
    }



]
/*-------------------------------- Functions --------------------------------*/

/*----------------------------- Event Listeners -----------------------------*/

/*----------------------------- Theme Manager -----------------------------*/
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        bodyElement.classList.toggle('light-mode')
        themeToggleBtn.textContent = bodyElement.classList.contains('light-mode') ? '🌙' : '☀️'
    })
}