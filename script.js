class Stopwatch{
    constructor(displayMinutesSeconds, displayMilliseconds, startBtn, resetBtn, startSound, pauseSound, resetSound){
        // Inicializando propriedades
        this.minutes = 0
        this.seconds = 0
        this.milliseconds = 0
        this.interval = null
        this.isActive = false

        //Referências ao HTML e efeitos sonoros
        this.displayMinutesSeconds = displayMinutesSeconds
        this.displayMilliseconds = displayMilliseconds
        this.startBtn = startBtn
        this.resetBtn = resetBtn

        this.startSound = startSound
        this.pauseSound = pauseSound
        this.resetSound = resetSound

        // Métodos de inicialização
        this.loadSavedTime()
        this.init()
    }

    init(){
        this.startBtn.addEventListener("click", ()=> this.start())
        this.resetBtn.addEventListener("click", ()=> this.reset())
    }

    playSound(sound){
        sound.currentTime = 0
        sound.play()
    }

    updateDisplay(){
        this.displayMinutesSeconds.textContent = `${String(this.minutes).padStart(2, "0")}:${String(this.seconds).padStart(2, "0")} `

        this.displayMilliseconds.textContent = String(this.milliseconds).padStart(2, "0")
    }

    start(){
        if(!this.isActive){
            this.isActive = true
            this.playSound(this.startSound)

            // classe de animação no container
            document.querySelector(".container").classList.toggle("animated", true)

            this.startBtn.textContent = "⏸️"
            this.startBtn.title = "Pausar contagem"
            this.resetBtn.style.display = "block"

            // Temporizador
            this.interval = setInterval(()=> {
                this.milliseconds++
                if(this.milliseconds >= 100){
                    this.milliseconds = 0
                    this.seconds++
                }

                if(this.seconds >= 60){
                    this.seconds = 0
                    this.minutes++
                }

                this.updateDisplay()
            }, 10) // função chamada a cada 0.01 segundos.
        } else{
            this.pause()
        }
    }

    pause(){
        if(this.isActive){
            this.isActive = false
            this.playSound(this.pauseSound)

            document.querySelector(".container").classList.toggle("animated", false)
            this.startBtn.textContent = "▶️"
            this.startBtn.title = "Retomar contagem"

            clearInterval(this.interval)

            localStorage.setItem("stopwatchTime", JSON.stringify({
                minutes: this.minutes,
                seconds: this.seconds,
                milliseconds: this.milliseconds
            }))
        }
    }

    reset(){
        clearInterval(this.interval)
        this.isActive = false
        this.playSound(this.resetSound)

        this.minutes = 0
        this.seconds = 0
        this.milliseconds = 0

        this.updateDisplay()

        document.querySelector(".container").classList.toggle("animated", false)
        this.startBtn.textContent = "▶️";
        this.startBtn.title = "Iniciar contagem"
        this.resetBtn.style.display = "none";
        
        localStorage.removeItem("stopwatchTime");
    }

    loadSavedTime(){
        const savedTime = JSON.parse(localStorage.getItem("stopwatchTime"))

        if(savedTime){
            this.minutes = savedTime.minutes
            this.seconds = savedTime.seconds
            this.milliseconds = savedTime.milliseconds

            this.updateDisplay()
            this.resetBtn.style.display = "block"
        }
    }

}

class App{
    constructor(){
        const minutesSecondsEl = document.getElementById("minutes-seconds")
        const millisecondsEl = document.getElementById("milliseconds")
        const startButton = document.getElementById("startBtn")
        const resetButton = document.getElementById("resetBtn")
        const startSound = new Audio("./sounds/startSound.mp3")
        const pauseSound = new Audio("./sounds/pauseSound.mp3")
        const resetSound = new Audio("./sounds/resetSound.mp3")
        

        this.Stopwatch = new Stopwatch(minutesSecondsEl, millisecondsEl, startButton, resetButton, startSound, pauseSound, resetSound)
    }
}

window.addEventListener("DOMContentLoaded", () => {
    const app = new App();
});