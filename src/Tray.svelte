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
    import SavedDiceTray from "./SavedDiceTray.svelte"
    import UnsavedDiceTray from "./UnsavedDiceTray.svelte"

    let displaySaved = false;
    let showModal = false;


    function handleDiceAdd(possibleDice) {
        if (possibleDice.maximum === 0) {
            showModal = true;
            return;
        }
        trayContent.update((state) => [...state, DiceObj.from(possibleDice)]);
    }
 
    function handleModalModifier(e) {
        let flatDice = new DiceObj(0);
        flatDice.value = e.detail;
        trayContent.update((state) => [...state, flatDice]);
    }


</script>

<div class="bg-yellow-50 flex flex-col items-center">
    <div class=" w-full">
        <UnsavedDiceTray />
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

<div 
    class="h-10 w-64 bg-slate-300 hover:bg-slate-400 active:bg-slate-200 rounded-full flex items-center justify-center"
    on:click={()=>{displaySaved = !displaySaved}}
    >
    <Icon name={displaySaved ? "arrowup" : "arrowdown"} class="m-6 h-6" />
</div>
{#if displaySaved}
    {#each $savedDiceCombination as diceComb, i (diceComb.id)}
    <SavedDiceTray bind:savedDiceComb={diceComb} />
    {/each}
{/if}




<ModifierModal bind:showModal on:success={handleModalModifier} />
{JSON.stringify($trayContent)}
{JSON.stringify($savedDiceCombination)}
{displaySaved}
</div>

<style>

</style>
