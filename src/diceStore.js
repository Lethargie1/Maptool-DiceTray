import { writable } from "svelte/store";
import produce from "immer";
import {immerable} from "immer"
import { v4 as uuidv4 } from 'uuid';

export class DiceObj {
    [immerable] = true
    maximum;
    value;
    id;

    constructor(maximum){
        this.maximum = maximum
        this.value = Math.floor(Math.random()*(this.maximum-1))+1
        this.id = uuidv4()
    }
    static from(other){
        let newDice = new DiceObj(other.maximum)
        return newDice;
    }   

    get display(){
        return "1d"+this.maximum
    }
    
    roll() { return Math.floor(Math.random()*(this.maximum-1))+1 }

}

export let trayContent = new writable([
    new DiceObj(10)
]);





export const PossibleDices =[
    new DiceObj(4),new DiceObj(6),new DiceObj(8),new DiceObj(10),new DiceObj(12),new DiceObj(20) 
]