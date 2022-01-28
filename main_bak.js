const controlBtn = document.querySelector('.control_btn');
const playField = document.querySelector('.play_field');
const playCounter = document.querySelector('.play_counter');
const playTimer = document.querySelector('.play_timer');
const layerPop = document.querySelector('.layer_pop');
const fieldRect = playField.getBoundingClientRect();
let counter = 10;
let timer = 10;
let setId = null;

playField.addEventListener('click', (e) => {
    if(layerPop.classList.contains('active')){
        return false;
    }

    if(e.target.classList.contains('carrot')){
        e.target.remove();
        addScore();

        if(counter === 0 && counter < timer){
            clearInterval(setId);
            alertPop('YOU WON');
        }
    }

    if(e.target.classList.contains('bug')){
        stop('YOU LOST');
    }
})

controlBtn.addEventListener('click', () => {
    if(controlBtn.classList.contains('play')){
        play();
    }else{
        stop('replay<span>?</span>');
    }
});

document.addEventListener('click', (e) => {
    if(e.target.classList.contains('reload')){
        layerPop.classList.remove('active');
        replay();
    }
});

function addScore(){
    counter--;
    playCounter.textContent = counter;
}

function play(){
    playCounter.textContent = counter;
    playTimer.textContent = `00:${timer}`;
    controlBtn.classList.replace('play', 'stop');
    addItems();
    startTimer();
}

function stop(message){
    clearInterval(setId);
    alertPop(message)
}

function replay(){
    playField.innerHTML = '';
    timer = 10;
    counter = 10;
    setId = null;
    play();
}

function alertPop(message){
    layerPop.classList.add('active');
    showMessage(message);
}

function showMessage(message){
    const txtElem = layerPop.querySelector('.txt_message');
    txtElem.innerHTML = message;
}

function startTimer(){
    setId = setInterval(() => {
        timer--;
        if(timer == 0){
            console.log('timeout');
            clearInterval(setId);
            alertPop('YOU LOST');
        }
        playTimer.textContent = `00:0${timer}`;
    }, 1000);
}

function addItems(){
    for(let i=0; i<counter; i++){
        addCarrot();
        addBug();
    }
}

function createItems(className){
    const newItem = document.createElement('div');
    newItem.setAttribute('class', className);

    const xpos = getRandomInt(0, fieldRect.width-80);
    const ypos = getRandomInt(0, fieldRect.height-80);

    newItem.style.left = `${xpos}px`;
    newItem.style.top = `${ypos}px`;

    return newItem;
}

function addCarrot(){
    const carrot = createItems('carrot');
    playField.appendChild(carrot);
}

function addBug(){
    const bug = createItems('bug');
    playField.appendChild(bug);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
  }

