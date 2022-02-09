'use strict';

import * as sound from  './sound.js';

const itemSize = 80;

export const ItemType = Object.freeze({
    carrot: 'carrot',
    bug: 'bug'
});
export class Field {
    constructor(item1, item2, item1_count, item2_count) {
        this.item1 = item1;
        this.item2 = item2;
        this.itemCount1 = item1_count;
        this.itemCount2 = item2_count;
        this.gameField = document.querySelector('.play_field');
        this.fieldRect = this.gameField.getBoundingClientRect();

        this.gameField.addEventListener('click', this.onClick);
    }

    setClickListener(onItemClick) {
        this.onItemClick = onItemClick;
    }

    init(){
        this.gameField.innerHTML = '';
        this._addItem(this.item1, this.itemCount1);
        this._addItem(this.item2, this.itemCount2);
    }

    onClick = (event) => {    
        if(event.target.matches('.carrot')){
            if(this.onItemClick && this.onItemClick(ItemType.carrot)){
                return false;
            }
            event.target.remove();
            sound.playCarrot();
        }else if(event.target.matches('.bug')){
            if(this.onItemClick && this.onItemClick(ItemType.bug)){
                return false;
            }
            sound.playBug();
        }
    }

    _addItem(item, count){
        for(let i=0; i<count; i++){
            this._newItem(item);
        }        
    }

    _newItem(item){
        const newItem = this._createItem(item);
        this.gameField.appendChild(newItem);
    }

    _createItem(className) {
        const newDiv = document.createElement('div');
        newDiv.setAttribute('class', className);

        const xpos = getRandomInt(0, this.fieldRect.width-itemSize);
        const ypos = getRandomInt(0, this.fieldRect.height-itemSize);

        newDiv.style.left = `${xpos}px`;
        newDiv.style.top = `${ypos}px`;

        return newDiv;
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}    
