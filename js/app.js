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
let totalClicks = 0
let secretNumber = 0
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
        duration: 5,
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
                    mainButton.textContent = "🐈"

                    // ⏰ Step 2: Swap the cat out for the actual RAT 2 seconds later
                    setTimeout(() => {
                        if (stageIndex === 1) {
                            mainButton.textContent = "🐀"
                        }
                    }, 2000)
                }
            }, Math.random() * 1500 + 1000)
        },
        onClick: () => {

            if (mainButton.textContent.includes("🐀")) {
                nextStage()
            } else if (mainButton.textContent.includes("🐈")) {
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
        dialogue: "",
        buttonText: "I memorized it.",
        duration: 10,
        onEnter: () => {
            secretNumber = Math.floor(Math.random() * 90) + 10
            dialogueText.textContent = `Remember the number: ${secretNumber}`
        },
        onClick: () => nextStage(),
        onTimeout: () => nextStage()
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
        //stage 7 = the user should write the answer upon the equation)
        buttonText: "",
        duration: 20,
        onEnter: () => {
            const num1 = Math.floor(Math.random() * 10) + 1
            const num2 = Math.floor(Math.random() * 10) + 1
            const correctAnswer = num1 + num2

            dialogueText.textContent = `Quick math break! What is ${num1} + ${num2}?`

            interactionArea.innerHTML = `
                <input type="number" id="mid-game-guess" placeholder="?" style="padding: 10px; font-size: 1.2rem; border-radius: 5px; border: none; margin-bottom: 15px; text-align: center; color: black; width: 80px;"><br>
                <button id="submit-mid-guess" class="tempting-button" style="background-color: #3b82f6; box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.4); padding: 12px 30px; font-size: 1.1rem;">Submit</button>`

            document.querySelector('#submit-mid-guess').addEventListener('click', () => {
                const playerGuess = parseInt(document.querySelector('#mid-game-guess').value)
                if (playerGuess === correctAnswer) {
                    playSound('click')
                    nextStage()
                } else {
                    triggerGameOver(`Wrong math! ${num1} + ${num2} is not ${playerGuess || 0}.`)
                }
            })


        },
        onClick: () => { }
    },

    {
        //stage 8 = this stage is displaying another useless number (the goal is to make the user forget about the first number)
        dialogue: "",
        buttonText: "Got it.",
        duration: 7,
        onEnter: () => {
            const decoyNumber = Math.floor(Math.random() * 89) + 11
            dialogueText.textContent = `Oh look, another completely useless number: ${decoyNumber}`
        },
        onClick: () => nextStage(),
        onTimeout: () => nextStage()
    },

    {
        // stage 9 = just a question 
        dialogue: "Still remember the first number?",
        buttonText: "Yes, obviously.",
        duration: 10,
        onClick: () => nextStage(),
        onTimeout: () => nextStage()
    },
    {
        //stage 10 = user must type the number that he remember minus other random number (equation)
        dialogue: "Still? Are you absolutely sure you remember it?",
        buttonText: "JUST LET ME WIN ALREADY",
        duration: 10,
        onClick: () => triggerFinalStageMath(),
        onTimeout: () => nextStage()
    }



]
/*-------------------------------- Functions --------------------------------*/
function playSound(type) {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return

    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    if (type === 'click') {
        osc.frequency.setValueAtTime(450, ctx.currentTime)
        gain.gain.setValueAtTime(0.1, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08)
        osc.start()
        osc.stop(ctx.currentTime + 0.08)
    }
    else if (type === 'tick') {
        osc.frequency.setValueAtTime(700, ctx.currentTime)
        gain.gain.setValueAtTime(0.04, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.03)
        osc.start()
        osc.stop(ctx.currentTime + 0.03)
    }
    else if (type === 'fail') {
        osc.frequency.setValueAtTime(280, ctx.currentTime)
        osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.4)
        gain.gain.setValueAtTime(0.25, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)
        osc.start()
        osc.stop(ctx.currentTime + 0.4)
    }
    else if (type === 'win') {
        const notes = [523.25, 659.25, 783.99, 1046.50]
        notes.forEach((freq, index) => {
            const time = ctx.currentTime + (index * 0.08)
            const noteOsc = ctx.createOscillator()
            const noteGain = ctx.createGain()

            noteOsc.frequency.setValueAtTime(freq, time)
            noteGain.gain.setValueAtTime(0.1, time)
            noteGain.gain.exponentialRampToValueAtTime(0.01, time + 0.15)

            noteOsc.connect(noteGain)
            noteGain.connect(ctx.destination)
            noteOsc.start(time)
            noteOsc.stop(time + 0.15)
        })
    }

}

function updateStageUI() {
    stageClicks = 0
    const currentStage = stages[stageIndex]

    if (currentStage) {
        interactionArea.innerHTML = `<button id="main-button" class="tempting-button"></button>`
        setButtonListener()

        dialogueText.textContent = currentStage.dialogue || ""
        mainButton.textContent = currentStage.buttonText || "CLICK"

        if (currentStage.onEnter) currentStage.onEnter()
        resetStageTimer(currentStage.duration || 10)
    }

}

function resetStageTimer(second) {
    if (globalTimer) clearInterval(globalTimer)

    timeLeft = second
    timerDisplay.textContent = `Time Left: ${timeLeft}s`
    timerDisplay.classList.remove('hidden')

    globalTimer = setInterval(() => {
        timeLeft--
        playSound('tick')

        if (timeLeft > 0) {
            timerDisplay.textContent = `Time Left: ${timeLeft}s`

        } else {
            clearInterval(globalTimer)
            timerDisplay.textContent = `Time Left: 0s`

            const currentStage = stages[stageIndex]
            if (currentStage && currentStage.onTimeout) {
                currentStage.onTimeout()
            } else {
                triggerGameOver("Time ran out!")
            }
        }
    }, 1000)
}
function nextStage() {
    stageIndex++
    updateStageUI()
}

function triggerGameOver(reasonText) {
    clearInterval(globalTimer)
    timerDisplay.classList.add('hidden')

    dialogueText.textContent = `${reasonText} Back to the beginning!`
    interactionArea.innerHTML = `<button id="main-button" class="tempting-button">START GAME</button>`

    stageIndex = 0
    stageClicks = 0
    totalClicks = 0
    gameStarted = false
    playSound('fail')

    if (gameInstruction) gameInstruction.classList.remove('hidden')
    setButtonListener()
}

function triggerFinalStageMath() {
    clearInterval(globalTimer)
    stageIndex = 999
    minusNumber = Math.floor(Math.random() * 9) + 1
    let correctAnswer = secretNumber - minusNumber

    dialogueText.textContent = `What is the number I asked you to remember minus ${minusNumber}?`
    resetStageTimer(15)

    interactionArea.innerHTML = `
        <input type="number" id="game-guess" placeholder="Your answer..." style="padding: 10px; font-size: 1.2rem; border-radius: 5px; border: none; margin-bottom: 15px; text-align: center; color: black;"><br>
        <button id="submit-guess" class="tempting-button" style="background-color: #10b981; box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.4);">Submit Answer</button>
    `
    document.querySelector('#submit-guess').addEventListener('click', () => {
        const playerGuess = parseInt(document.querySelector('#game-guess').value)

        if (playerGuess === correctAnswer) {
            clearInterval(globalTimer)
            timerDisplay.classList.add('hidden')
            dialogueText.textContent = "🎉 YOU WON THE GAME! 🎉"
            interactionArea.innerHTML = `<p style='color: #10b981; font-weight: bold; font-size: 1.5rem;'>Brilliant memory!</p>`
            playSound('win')
        } else {
            triggerGameOver(`Wrong! The answer was ${correctAnswer}.`)
        }
    })
}
/*----------------------------- Event Listeners -----------------------------*/
function setButtonListener() {
    mainButton = document.querySelector('#main-button')
    if (mainButton) {
        mainButton.addEventListener('click', handleButtonClick)
    }
}

function handleButtonClick() {
    if (!gameStarted) {
        gameStarted = true
        if (gameInstruction) gameInstruction.classList.add('hidden')
        updateStageUI()
        return
    }

    playSound('click')
    stageClicks++
    totalClicks++

    if (stages[stageIndex]) {
        stages[stageIndex].onClick()
    }
}
/*----------------------------- Theme Manager -----------------------------*/
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        bodyElement.classList.toggle('light-mode')
        themeToggleBtn.textContent = bodyElement.classList.contains('light-mode') ? '🌙' : '☀️'
    })
}

setButtonListener()
timerDisplay.classList.add('hidden')
mainButton.textContent = "START GAME"