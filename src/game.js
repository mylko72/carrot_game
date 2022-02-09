'use strict';
import * as sound from  './sound.js';
import { Field, ItemType } from './field.js';

let started = false;
let timer = undefined;
let score = 0;

export const Reason = Object.freeze({
    win: 'win',
    lose: 'lose',
    cancel: 'cancel',
})

// Builder Pattern
export class GameBuilder {
    withGameDuration(duration){
        this.gameDuration = duration;
        return this;
    }

    withCarrotItem(item){
        this.carrotItem = item;
        return this;
    }

    withBugItem(item){
        this.bugItem = item;
        return this;
    }

    withCarrotCount(num){
        this.carrotCount = num;
        return this;
    }

    withBugCount(num){
        this.bugCount = num;
        return this;
    }

    build(){
        console.log(this);
        return new Game(
            this.gameDuration,  //
            this.carrotItem,    //
            this.bugItem,       //
            this.carrotCount,   //
            this.bugCount
        );
    }
}

class Game {
    constructor(gameDuration, carrotItem, bugItem, carrotCount, bugCount){
        this.itemCount1 = carrotCount;
        this.gameDuration = gameDuration;

        this.gameBtn = document.querySelector('.game_btn');
        this.playCounter = document.querySelector('.play_counter');
        this.playTimer = document.querySelector('.play_timer');

        this.gameField = new Field(carrotItem, bugItem, carrotCount, bugCount);
        this.gameField.setClickListener(this.onItemClick);

        this.gameBtn.addEventListener('click', () => {
            if(started){
                this.stopAndFinish(Reason.cancel);
            }else{
                this.start();
            }
        });
    }

    setGameStopListener(onGameStop){
        started = false;
        this.onGameStop = onGameStop;
    }

    start(){
        started = true;
        this.initGame();
        this.showStopButton();
        this.startTimer();
        sound.playBackground();
    }

    stopAndFinish(reason){
        started = false;
        this.stopTimer();
        this.hideGameButton();
        sound.stopBackground();
        this.onGameStop && this.onGameStop(reason);
    }   

    replayGame(){
        this.hidePopUp();
        this.showGameButton();
        this.start();
    }

    initGame(){
        score = 0;
        this.gameField.init();
        this.playCounter.textContent = this.itemCount1;        
    }

    onItemClick = (item) => {
        if(!started){
            return true;
        }

        if(item === ItemType.carrot){
            score++;
            this.updateScoreBoard();

            if(score === this.itemCount1){
                this.stopAndFinish(Reason.win);
            }
        }else if(item === ItemType.bug){
            this.stopAndFinish(Reason.lose);
        }
    }

    updateScoreBoard(){
        this.playCounter.textContent = this.itemCount1-score;
    }

    showStopButton(){
        this.gameBtn.classList.replace('play', 'stop');
    }

    showGameButton(){
        this.gameBtn.style.visibility = 'visible';
    }

    hideGameButton(){
        this.gameBtn.style.visibility = 'hidden';
    }
    
    startTimer(){
        let remainingTimeSec = this.gameDuration;
        this.updateTimer(remainingTimeSec)
        timer = setInterval(() => {
            if(remainingTimeSec <= 0){
                console.log('timeout');
                this.stopAndFinish(Reason.lose);
                return;
            }
            this.updateTimer(--remainingTimeSec);
        }, 1000);
    }

    stopTimer(){
        clearInterval(timer);
    }

    updateTimer(time){
        let minutes = Math.floor(time/60);
        let seconds = time % 60;
        minutes = minutes<10 ? '0'+minutes : minutes;
        seconds = seconds<10 ? '0'+seconds : seconds;
        this.playTimer.textContent = `${minutes}:${seconds}`
    }
}