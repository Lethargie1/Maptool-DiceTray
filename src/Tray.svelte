<script>
    import { trayContent, PossibleDices, savedDiceCombination } from "./diceStore.js";
    import produce from "immer";
    import Dice from "./Dice.svelte";
    import { DiceObj } from "./diceStore.js";
    import { flip } from "svelte/animate";
    import { fade } from "svelte/transition";
    import ModifierModal from "./ModifierModal.svelte";
    import Icon from "./Icon.svelte";
    import TrayTotal from "./TrayTotal.svelte"
    import TrayHole from "./TrayHole.svelte"

    let showModal = false;
    let value = -1;
    $: trayTotal = $trayContent.reduce(
        (previousTotal, currentDice) => previousTotal + currentDice.value,
        0
    );

    function handleDiceAdd(possibleDice) {
        if (possibleDice.maximum === 0) {
            showModal = true;
            return;
        }
        trayContent.update((state) => [...state, DiceObj.from(possibleDice)]);
    }
    function handleContext(event) {
        event.preventDefault();
    }

    function handleDiceRemoveId(id) {
        trayContent.update((state) => {
            let index = state.findIndex((dice) => dice.id === id);
            if (index === -1 || index.length > 1) return state;
            state.splice(index, 1);
            return state;
        });
    }

    function handleModalModifier(e) {
        let flatDice = new DiceObj(0);
        flatDice.value = e.detail;
        trayContent.update((state) => [...state, flatDice]);
    }

    function handleReroll() {
        trayContent.update((state) =>
            state.map((dc) => {
                dc.needRoll = true;
                return dc;
            })
        );
    }
</script>

<div class="bg-amber-700">
<div class="p-4">
    <TrayHole class="justify-start min-h-full">
        {#each $trayContent as diceContent, i (diceContent.id)}
            <div
                animate:flip={{ delay: 200, duration: 1000 }}
                transition:fade={{ duration: 200 }}
            >
                <Dice
                    bind:diceContent
                    removeDiceAction={() => handleDiceRemoveId(diceContent.id)}
                />
            </div>
        {/each}
        <TrayTotal trayStore={trayContent} buttonAction={handleReroll}/>
    </TrayHole>
</div>
<div class="p-4 flex justify-center">
    <TrayHole class="justify-center">
        {#each PossibleDices as Rollable}
            <div
                class=" bg-transparent flex items-center justify-center cursor-pointer"
                on:click={() => handleDiceAdd(Rollable)}
            >
                <Dice diceContent={Rollable} displayMode={true} />
            </div>
        {/each}
    </TrayHole>
</div>
<div class="p-4 flex justify-center">
    
    {#each $savedDiceCombination as diceComb}
    <div
        class="bg-amber-800 flex items-center gap-4 p-4 justify-center trayhole rounded-md"
    >
    {#each diceComb.diceList as dice}
        <div  class=" bg-transparent flex items-center justify-center cursor-pointer">
            <Dice diceContent={dice} displayMode={true} />
            
        </div>
        {/each}
    </div>
    {/each}
    
</div>
</div>


<ModifierModal bind:showModal on:success={handleModalModifier} />
{JSON.stringify($trayContent)}
{value}

<style>
    .trayhole {
        box-shadow: inset 0 0px 17px 7px rgba(54, 23, 4, 0.7),
            0 0 4px 2px rgba(221, 160, 81, 0.3); /*bottom internal shadow*/
    }
</style>
