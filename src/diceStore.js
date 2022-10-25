import { writable } from "svelte/store";
import { v4 as uuidv4 } from 'uuid';

import { DiceObj } from "./DiceObj";
import { runArbitraryMacroJson } from "./macroCom";

export let trayContent = createTrayStore()


let messager = {
    postUpdate: () => null
}
export function attachMessenger(mess){
    messager = mess;
}
function createTrayStore() {
    const { subscribe, update } = writable(
        {
            name: "New Name",
            diceList: [new DiceObj(10)],
            sendNotification: true
        });
        
    return {
        subscribe,
        changeName: (name) => {
            update( state => {state.name=name; return {...state}})
        }  ,
        toggleNotification: () =>{
            update( state => {state.sendNotification= !state.sendNotification; return {...state}})
        },
        add: createAddDice(update),
        remove: createRemoveDice(update),
        startRoll: createStartRollDice(update),
        rollConclude: createRollConclude(update),
        clear: createClearDice(update),
        replace: createReplaceAllDice(update)
    };
}

function createAddDice(update) {
    return (dice) => {
        const newDice = DiceObj.from(dice)
        update((state) => {
            state.diceList = [...state.diceList, newDice]
            let message = {
                action: messaging.add,
                target: DiceObj.infoFrom(newDice),
                diceList: state.diceList.map(x => DiceObj.infoFrom(x))
            }
            if (state.sendNotification)
                messager.postUpdate(message)
            return state
        });
        trayContent.startRoll(newDice)
    }
}

function createRemoveDice(update) {
    return (dice) => {
        update((state) => {
            let index = state.diceList.findIndex((d) => d.id === dice.id);
            if (index === -1 || index.length > 1) return state;
            state.diceList.splice(index, 1);
            let message = {
                action: messaging.remove,
                target: DiceObj.infoFrom(dice),
                diceList: state.diceList.map(x => DiceObj.infoFrom(x))
            }
            if (state.sendNotification)
                messager.postUpdate(message)
            return state;
        });
        

    }
}

function createStartRollDice(update) {
    return (dice) => {
        update((state) => {
            let selected = state.diceList.find((d) => d.id === dice.id);
            if (!selected) return state;
            if (!selected.canRoll) return state
            if (selected.rolling === false){
                let message = {
                    action: messaging.roll,
                    target: DiceObj.infoFrom(selected),
                    diceList: state.diceList.map(x => DiceObj.infoFrom(x))
                }
                if (state.sendNotification)
                    messager.postUpdate(message)
            }
            selected.rolling = true
            DiceObj.clearCallback(selected)
            selected.rollingCallback = setTimeout(() => {
                trayContent.rollConclude(selected)
            }, 2000);
            return state
        })
    }
}

function createRollConclude(update) {
    return (dice) => {
        update((state) => {
            let selected = state.diceList.find((d) => d.id === dice.id);
            if (!selected) return state;
            selected.rolling = false
            selected.value = selected.roll()
            DiceObj.clearCallback(selected)
            let message = {
                action: messaging.rollResult,
                target: DiceObj.infoFrom(selected),
                diceList: state.diceList.map(x => DiceObj.infoFrom(x))
            }
            if (state.sendNotification)
                messager.postUpdate(message)
            return state
        })
    }
}


function replaceStateDiceList(state, newList){
    state.diceList.forEach(x => {
        DiceObj.clearCallback(x)
    })
    state.diceList = newList
    return state;
}

function createClearDice(update) {
    return () => {
        update(state => {
            let message = {
                action: messaging.clear,
                target: null,
                diceList: null
            }
            if (state.sendNotification)
                messager.postUpdate(message)
            return replaceStateDiceList(state,[])
        })
    }
}

function createReplaceAllDice(update) {
    return (newDiceList) => {
        const genList = newDiceList.map(x => DiceObj.from(x))
        update(state => {
            const newState = replaceStateDiceList(state,genList)
            let message = {
                action: messaging.new,
                target: null,
                diceList: newState.diceList.map(x => DiceObj.infoFrom(x))
            }
            if (state.sendNotification)
                messager.postUpdate(message)
            return newState
        })
        genList.forEach( x=> trayContent.startRoll(x))
    }
}



export let savedDiceCombination = new writable([
    {
        name: "initial combo",
        id: uuidv4(),
        diceList: [
            new DiceObj(12), new DiceObj(12), new DiceObj(6)
        ]
    }
])



export const PossibleDices = [
    new DiceObj(0), new DiceObj(4), new DiceObj(6), new DiceObj(8), new DiceObj(10), new DiceObj(12), new DiceObj(20)
]


const messaging={
    remove:"remove",
    add:"add",
    roll:"roll",
    rollResult:"rollResult",
    rollAll:"rollAll",
    clear:"clear",
    new:"new"
}