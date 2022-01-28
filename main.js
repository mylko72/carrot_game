const controlBtn = document.querySelector('.control_btn');
const playField = document.querySelector('.play_field');
const playCounter = document.querySelector('.play_counter');
const playTimer = document.querySelector('.play_timer');
const layerPop = document.querySelector('.layer_pop');
const message = layerPop.querySelector('.txt_message');
const fieldRect = playField.getBoundingClientRect();

class PlayGame {
    constructor(settings){
        this.setId = null;
        this.counter = settings.counter;
        this.timer = settings.timer;
        this.item1 = settings.item1;
        this.item2 = settings.item2;
    }

    addScore(){
        this.counter--;
        playCounter.textContent = this.counter;

        if(this.counter === 0 && this.counter < this.timer){
            clearInterval(this.setId);
            this.alertPop(printWin);
        }
    }

    play(){
        playCounter.textContent = this.counter;
        playTimer.textContent = `00:${this.timer}`;

        controlBtn.classList.replace('play', 'stop');
        this.addItems();
        this.startTimer();
    }

    replay(settings){
        layerPop.classList.remove('active');
        playField.innerHTML = '';
        this.timer = settings.timer;
        this.counter = settings.counter;
        this.setId = null;
        this.play();
    }

    stop(printMessage){
        clearInterval(this.setId);
        this.alertPop(printMessage)
    }    

    alertPop(callback){
        layerPop.classList.add('active');
        callback();
        //showMessage(message);
    }

    startTimer(){
        this.setId = setInterval(() => {
            this.timer--;
            if(this.timer == 0){
                console.log('timeout');
                clearInterval(this.setId);
                this.alertPop(printLost);
            }
            playTimer.textContent = `00:0${this.timer}`;
        }, 1000);
    }

    addItems(){
        for(let i=0; i<this.counter; i++){
            this.newItem(this.item1);
            this.newItem(this.item2);
        }        
    }

    newItem(item){
        const newItem = this.create(item);
        playField.appendChild(newItem);
    }

    addBug(){

    }

    create(className) {
        const newDiv = document.createElement('div');
        newDiv.setAttribute('class', className);

        const xpos = getRandomInt(0, fieldRect.width-80);
        const ypos = getRandomInt(0, fieldRect.height-80);

        newDiv.style.left = `${xpos}px`;
        newDiv.style.top = `${ypos}px`;

        return newDiv;
    }
}

const settings = {
    counter: 10,
    timer: 10,
    item1: 'carrot',
    item2: 'bug'
}

const game1 = new PlayGame(settings);

controlBtn.addEventListener('click', () => {
    if(controlBtn.classList.contains('play')){
        game1.play();
    }else{
        game1.stop(printReplay);
    }
});

document.addEventListener('click', (e) => {
    if(e.target.classList.contains('replay')){
        game1.replay(settings);
    }
});

playField.addEventListener('click', (e) => {
    if(layerPop.classList.contains('active')){
        return false;
    }

    if(e.target.classList.contains('carrot')){
        e.target.remove();
        game1.addScore();
    }

    if(e.target.classList.contains('bug')){
        game1.stop(printLost);
    }
})


function printReplay(){
    message.innerHTML = 'Replay <span>?</span>';
}

function printLost(){
    message.innerHTML = 'YOU LOST';
}

function printWin(){
    message.innerHTML = 'YOU WON';
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}
