'use strict';
import { GameBuilder, Reason } from './game.js';
import PopUp from './popup.js';
import * as sound from  './sound.js';

const gameFinishBanner = new PopUp();

const carrotGame = new GameBuilder()
    .withGameDuration(5)
    .withCarrotItem('carrot')
    .withBugItem('bug')
    .withCarrotCount(5)
    .withBugCount(5)
    .build();

carrotGame.setGameStopListener((reason) => {
    console.log(reason);
    let message;
    switch(reason) {
        case Reason.cancel:
            message = 'Replay?'
            sound.playAlert();
            break;
        case Reason.win:
            message = 'YOU WON';
            sound.playWin();
            break;
        case Reason.lose:
            message = 'YOU LOST';
            sound.playAlert();
            break;
        default:
            throw new Error('not valid reason');
    }
    gameFinishBanner.showWithText(message);
})

gameFinishBanner.setClickListener(() => {
    carrotGame.showGameButton();
    carrotGame.start();
});

