<script>
    import TrayHole from "./TrayHole.svelte";
    import Dice from "./Dice.svelte";
    import Icon from "./Icon.svelte";
    import TrayTotal from "./TrayTotal.svelte";
    import { flip } from "svelte/animate";
    import { fade } from "svelte/transition";
    import { trayContent, savedDiceCombination } from "./diceStore.js";
    import { v4 as uuidv4 } from 'uuid';
    import { DiceObj } from "./diceStore.js";
    export let trayName = "No-name";

    function handleDiceRemoveId(id) {
        trayContent.update((state) => {
            let index = state.findIndex((dice) => dice.id === id);
            if (index === -1 || index.length > 1) return state;
            state.splice(index, 1);
            return state;
        });
    }

    function handleReroll() {
        trayContent.update((state) =>
            state.map((dc) => {
                dc.needRoll = dc.askRoll();
                return dc;
            })
        );
    }

    function handleSave() {
        savedDiceCombination.update((state) => {
            let nameList = state.map((diceComb) => diceComb.name);
            let finalName;
            if (nameList.includes(trayName)) finalName = trayName + " copy";
            else finalName = trayName;

            let newComb = {
                name: finalName,
                id: uuidv4(),
                diceList: $trayContent,
            };

            return [...state, newComb];
        });
    }
</script>

<div class="p-2 z-0 relative flex w-full ">
    <div  class="leftHeader"  >
        <div class="flex justify-around">
            <div class:iconWrapper={true} on:click={() => handleSave()}>
                <Icon name="save" class="w-8 h-8" />
            </div>
        </div>
        <input
            bind:value={trayName}
            class="rounded-sm border-slate-500 text-center font-semibold text-lg p-1 bg-transparent"
        />
    </div>
    <div  class="rightContainer" >
        <TrayHole class="justify-start">
            {#each $trayContent as dice, i (dice.id)}
                <div
                    animate:flip={{ delay: 200, duration: 1000 }}
                    transition:fade={{ duration: 200 }}
                    class="diceWrapper"
                >
                    <Dice
                        bind:diceContent={dice}
                        displayMode={false}
                        removeDiceAction={() => handleDiceRemoveId(dice.id)}
                    />
                </div>
            {/each}
            <TrayTotal trayStore={trayContent} buttonAction={handleReroll} />
        </TrayHole>
    </div>
</div>

<style>
    .iconWrapper {
        @apply p-2 hover:bg-slate-500 hover:bg-opacity-50 rounded-md;
    }
    .leftHeader {
        @apply flex justify-start flex-col rounded-l-md gap-2 items-stretch w-40 border-r-0 border-2 border-slate-700 border-opacity-50 bg-yellow-100
    }
    .rightContainer{
        @apply p-2  rounded-r-md flex-grow border-l-0 border-2 border-slate-700 border-opacity-50 bg-yellow-100
    }
    .diceWrapper{
        @apply bg-transparent flex items-center justify-center cursor-pointer
    }
</style>
