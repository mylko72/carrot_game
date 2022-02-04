'use strict';
import PopUp from './popup.js';

const gameBtn = document.querySelector('.game_btn');
const playField = document.querySelector('.play_field');
const playCounter = document.querySelector('.play_counter');
const playTimer = document.querySelector('.play_timer');
const layerPop = document.querySelector('.pop_up');
const message = layerPop.querySelector('.pop_up_message');
const fieldRect = playField.getBoundingClientRect();

class PlayGame {
    constructor(settings){
        this.started = false;
        this.timer = undefined;
        this.score = 0;
        this.itemCount1 = settings.item1_count;
        this.itemCount2 = settings.item2_count;
        this.gameDuration = settings.game_duration;
        this.item1 = settings.item1;
        this.item2 = settings.item2;
        this.itemSize = 80;

        this.bgSound = new Audio('./sound/bg.mp3');
        this.carrotSound = new Audio('./sound/carrot_pull.mp3');
        this.bugSound = new Audio('./sound/bug_pull.mp3');
        this.alertSound = new Audio('./sound/alert.wav');
        this.winSound = new Audio('./sound/game_win.mp3');
    }

    startGame(){
        this.started = true;
        this.initGame();
        this.showStopButton();
        this.startTimer();
        this.playSound(this.bgSound);
    }

    stopGame(){
        this.started = false;
        this.stopTimer();
        this.hideGameButton();
        // this.showPopUp(printMessage)
        gameFinishBanner.showWithText('REPLAY');
        this.stopSound(this.bgSound);
        this.playSound(this.alertSound);
    }   

    replayGame(){
        this.hidePopUp();
        this.showGameButton();
        this.startGame();
    }

    initGame(){
        this.score = 0;
        playField.innerHTML = '';
        playCounter.textContent = this.itemCount1;
        this.addItem(this.item1, this.itemCount1);
        this.addItem(this.item2, this.itemCount2);
    }

    finishGame(win){
        this.started = false;
        this.stopTimer();
        this.hideGameButton();
        if(win){
            this.playSound(this.winSound);
        }else{
            this.playSound(this.alertSound);
        }
        
        this.stopSound(this.bgSound);
        gameFinishBanner.showWithText(win ? 'YOU WON' : 'YOU LOST');
    }

    onFieldClick(event){
        if(!this.started){
            return false;
        }
    
        if(event.target.matches('.carrot')){
            event.target.remove();
            this.score++;
            this.updateScoreBoard();

            this.playSound(this.carrotSound);
            if(this.score === this.itemCount1){
                this.finishGame(true)
            }
        }else if(event.target.matches('.bug')){
            this.finishGame(false)
        }
    }

    updateScoreBoard(){
        playCounter.textContent = this.itemCount1-this.score;
    }

    showStopButton(){
        gameBtn.classList.replace('play', 'stop');
    }

    showGameButton(){
        gameBtn.style.visibility = 'visible';
    }

    hideGameButton(){
        gameBtn.style.visibility = 'hidden';
    }
    
    playSound(sound){
        sound.play();
        sound.currentTime = 0;
    }

    stopSound(sound){
        sound.pause();
    }

    startTimer(){
        let remainingTimeSec = this.gameDuration;
        this.updateTimer(remainingTimeSec)
        this.timer = setInterval(() => {
            if(remainingTimeSec <= 0){
                console.log('timeout');
                this.stopTimer();
                this.stopSound(this.bgSound);
                this.playSound(this.alertSound);
                // this.showPopUp(printLost);
                gameFinishBanner.showWithText('YOU LOST');
                return;
            }
            // playTimer.textContent = `00:0${this.gameDuration}`;
            this.updateTimer(--remainingTimeSec);
        }, 1000);
    }

    stopTimer(){
        console.log(this.timer);
        clearInterval(this.timer);
    }

    updateTimer(time){
        let minutes = Math.floor(time/60);
        let seconds = time % 60;
        minutes = minutes<10 ? '0'+minutes : minutes;
        seconds = seconds<10 ? '0'+seconds : seconds;
        playTimer.textContent = `${minutes}:${seconds}`
    }

    addItem(item, count){
        for(let i=0; i<count; i++){
            this.newItem(item);
        }        
    }

    newItem(item){
        const newItem = this.createItem(item);
        playField.appendChild(newItem);
    }

    createItem(className) {
        const newDiv = document.createElement('div');
        newDiv.setAttribute('class', className);

        const xpos = getRandomInt(0, fieldRect.width-this.itemSize);
        const ypos = getRandomInt(0, fieldRect.height-this.itemSize);

        newDiv.style.left = `${xpos}px`;
        newDiv.style.top = `${ypos}px`;

        return newDiv;
    }
}

const GAME_SETTINGS = {
    item1: 'carrot',
    item2: 'bug',
    item1_count: 20,
    item2_count: 30,
    game_duration: 15
}

const game1 = new PlayGame(GAME_SETTINGS);
const gameFinishBanner = new PopUp();

gameFinishBanner.setClickListener(() => {
    game1.showGameButton();
    game1.startGame();
});

gameBtn.addEventListener('click', () => {
    if(gameBtn.classList.contains('play')){
        game1.startGame();
    }else{
        game1.stopGame();
    }
});

playField.addEventListener('click', (e) => {
    game1.onFieldClick(e);
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}