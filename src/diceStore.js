import { writable } from "svelte/store";
import { v4 as uuidv4 } from 'uuid';

import importedSvgStrd20 from "../assets/d20.svg";
import importedSvgStrd12 from "../assets/d12.svg";
import importedSvgStrd10 from "../assets/d10.svg";
import importedSvgStrd8 from "../assets/d8.svg";
import importedSvgStrd6 from "../assets/d6.svg";
import importedSvgStrd4 from "../assets/d4.svg";
import importedSvgStrdx from "../assets/+x.svg";

export class DiceObj {
    maximum;
    value;
    id;
    rolling;
    needRoll;

    constructor(maximum) {
        this.maximum = maximum
        this.value = 0
        this.id = uuidv4()
        this.rolling= false;
        this.needRoll=true;
    }
    static from(other) {
        let newDice = new DiceObj(other.maximum)
        if (other.maximum===0){
            newDice.value= other.value;
        }
        return newDice;
    }

    get display() {
        switch (this.maximum) {
            case 0:
                return "+X"
            default:
                return "1d" + this.maximum
        }
        
    }

    get svg() {
        switch (this.maximum) {
            case 20:
                return importedSvgStrd20
            case 12:
                return importedSvgStrd12
            case 10:
                return importedSvgStrd10
            case 8:
                return importedSvgStrd8
            case 6:
                return importedSvgStrd6
            case 4:
                return importedSvgStrd4
            case 0:
                return importedSvgStrdx
            default:
                return importedSvgStrd20
        }
    }

    get canRoll() {
        switch (this.maximum) {
            case 0:
                return false
            default:
                return true
        }
    }

    roll() { 
        switch (this.maximum) {
            case 0:
                return this.value
            default:
                return Math.floor(Math.random() * (this.maximum)) + 1 
        }
        
    }


}

export let trayContent = new writable([
    new DiceObj(10)
]);


export let savedDiceCombination = new writable([
    {
        name: "initial combo",
        diceList: [
            new DiceObj(12), new DiceObj(12), new DiceObj(6)
        ]
    }
])



export const PossibleDices = [
    new DiceObj(0), new DiceObj(4), new DiceObj(6), new DiceObj(8), new DiceObj(10), new DiceObj(12), new DiceObj(20)
]