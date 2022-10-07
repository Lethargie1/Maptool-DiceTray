<script>
    import { trayContent, PossibleDices } from "./diceStore.js";
    import produce from "immer";
    import Dice from "./Dice.svelte";
    import { DiceObj } from "./diceStore.js";

    const addDice =(oldDice) => draftState => {draftState.push(DiceObj.from(oldDice))}
    function handleDiceAdd(possibleDice) {
        trayContent.update(state => 
        produce(state,addDice(possibleDice))
        );
    }

    function handleDiceRoll(index) {
        trayContent.update((oldTray) => produce(oldTray, draft => {draft[index].value= draft[index].roll()}));
    }
</script>

<div class=" bg-amber-800 p-4">
    <div class="bg-amber-400 h-32 flex justify-start flex-wrap gap-4 p-4">
        {#each $trayContent as diceContent, i}
            <Dice {diceContent} rerollAction={() => handleDiceRoll(i)} />
        {/each}
    </div>
</div>
<div class=" bg-amber-800 p-4 flex justify-center">
    <div class="bg-amber-400 flex items-center gap-4 p-4 justify-center">
        {#each PossibleDices as Rollable}
            <div
                class=" bg-red-600 w-14 h-14 flex items-center justify-center hover:ring-2"
                on:click={() => handleDiceAdd(Rollable)}
            >
                <div class="text-center">
                    {Rollable.display}
                </div>
            </div>
        {/each}
    </div>
</div>

<style global lang="postcss">
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
</style>
