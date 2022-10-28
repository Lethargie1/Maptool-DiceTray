<script>
    import { getContext } from 'svelte';
    import { flip } from "svelte/animate";
    import { fade } from "svelte/transition";
    import Dice from "./Dice.svelte";

    const trayContent = getContext("trayContent")


    function handleDiceRemoveId(dice) {
        trayContent.remove(dice);
    }
</script>

<div class="container">
    {#each $trayContent.diceList as dice, i (dice.id)}
        <div
            animate:flip={{ delay: 200, duration: 1000 }}
            transition:fade={{ duration: 200 }}
            class="diceWrapper"
        >
            <Dice
                diceContent={dice}
                displayMode={false}
                rollAction={() => trayContent.startRoll(dice)}
                removeDiceAction={() => handleDiceRemoveId(dice)}
            />
        </div>
    {/each}
</div>

<style>
    .container{
        @apply flex flex-wrap justify-start content-start items-center h-full m-0
    }
    .diceWrapper {
        @apply bg-transparent flex items-center justify-center cursor-pointer hover:ring-2;
    }
</style>
