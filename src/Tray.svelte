<script>
    import { trayContent, PossibleDices } from "./diceStore.js";
    import produce from "immer";
    import Dice from "./Dice.svelte";
    import { DiceObj } from "./diceStore.js";
    import { flip } from "svelte/animate";
    import { fade } from "svelte/transition";

    $: trayTotal = $trayContent.reduce(
        (previousTotal, currentDice) => previousTotal + currentDice.value,
        0
    );

    function handleDiceAdd(possibleDice) {
        trayContent.update((state) => [...state, DiceObj.from(possibleDice)]);
    }
    function handleContext(event) {
        event.preventDefault();
    }
    function handleDiceRemove(index) {
        trayContent.update((state) => {
            state.splice(index, 1);
            return state;
        });
    }

    function handleDiceRemoveId(id) {
        trayContent.update((state) => {
            let index = state.findIndex((dice) => dice.id === id);
            if (index === -1 || index.length > 1) return state;
            state.splice(index, 1);
            return state;
        });
    }
</script>

<div class=" bg-amber-700 p-4">
    <div
        class="bg-amber-800 flex justify-start flex-wrap gap-0 p-4 relative min-h-full trayhole rounded-md"
        on:contextmenu={handleContext}
    >
        {#each $trayContent as diceContent, i (diceContent.id)}
            <div animate:flip="{{delay:200, duration:1000}}" transition:fade="{{duration: 200}}" >
                <Dice
                    bind:diceContent
                    removeDiceAction={() => handleDiceRemoveId(diceContent.id)}
                />
            </div>
        {/each}
        <div
            class="w-10 bg-slate-400 absolute bottom-2 right-2 flex justify-center items-center text-center font-mono text-xl py-1 px-10 rounded-md opacity-50"
        >
            {trayTotal}
        </div>
    </div>
</div>
<div class=" bg-amber-700 p-4 flex justify-center">
    <div
        class="bg-amber-800 flex items-center gap-4 p-4 justify-center trayhole rounded-md"
    >
        {#each PossibleDices as Rollable}
            <div
                class=" bg-transparent flex items-center justify-center hover:ring-2 cursor-pointer"
                on:click={() => handleDiceAdd(Rollable)}
            >
            <Dice  diceContent={Rollable} allowRoll={false}  />
            </div>
        {/each}
    </div>
</div>
{JSON.stringify($trayContent)}

<style>
    .trayhole {
        box-shadow: inset 0 0px 17px 7px rgba(54, 23, 4, 0.7),
            0 0 4px 2px rgba(221, 160, 81, 0.3); /*bottom internal shadow*/
    }
</style>
