'use strict';

export default class PopUp {
    constructor(){
        this.popUp = document.querySelector('.pop_up');
        this.popUpText  = document.querySelector('.pop_up_message');
        this.popUpRerfresh = document.querySelector('.pop_up_refesh');
        this.popUpScore = document.querySelector('.pop_up_score');
        this.popUpRerfresh.addEventListener('click', e => {
            this.onClick && this.onClick();
            this.hide();
        });
        this.popUpScore.addEventListener('click', e => {
            this.onClick && this.onClick();
        })
    }

    setClickListener(onClick){
        this.onClick = onClick;
    }

    showWithText(text){
        this.popUpText.innerText = text;
        this.popUp.classList.add('active');
    }

    hide(){
        this.popUp.classList.remove('active');
    }

}