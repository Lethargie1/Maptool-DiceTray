import { writable } from "svelte/store";
import produce from "immer";
import { immerable } from "immer"
import { v4 as uuidv4 } from 'uuid';
import importedSvgStrd20 from "../assets/d20.svg";
import importedSvgStrd12 from "../assets/d12.svg";
import importedSvgStrd10 from "../assets/d10.svg";
import importedSvgStrd8 from "../assets/d8.svg";
import importedSvgStrd6 from "../assets/d6.svg";
import importedSvgStrd4 from "../assets/d4.svg";

export class DiceObj {
    [immerable] = true
    maximum;
    value;
    id;

    constructor(maximum) {
        this.maximum = maximum
        this.value = this.roll()
        this.id = uuidv4()
    }
    static from(other) {
        let newDice = new DiceObj(other.maximum)
        return newDice;
    }

    get display() {
        return "1d" + this.maximum
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
            default:
                return importedSvgStrd20


        }
    }

    roll() { return Math.floor(Math.random() * (this.maximum)) + 1 }

}

export let trayContent = new writable([
    new DiceObj(10)
]);





export const PossibleDices = [
    new DiceObj(4), new DiceObj(6), new DiceObj(8), new DiceObj(10), new DiceObj(12), new DiceObj(20)
]