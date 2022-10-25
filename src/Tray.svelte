<script>
    import { trayContent, PossibleDices, savedDiceCombination } from "./diceStore.js";
    import Dice from "./Dice.svelte";
    import { DiceObj } from "./DiceObj.js";
    import ModifierModal from "./ModifierModal.svelte";
    import Icon from "./Icon.svelte";
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
        trayContent.add(possibleDice)
    }
 
    function handleModalModifier(e) {
        let flatDice = new DiceObj(0);
        flatDice.value = e.detail;
        trayContent.add(flatDice)
    }


</script>

<div class="bg-yellow-100 flex flex-col items-center">
    <div class=" w-full">
        <UnsavedDiceTray />
    </div>
<div class="p-4 flex justify-center relative">
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
    class="button"
    on:click={()=>{displaySaved = !displaySaved}}
    >
    <Icon name={displaySaved ? "arrowup" : "arrowdown"} class="m-6 h-6" />
</div>
{#if displaySaved}
    {#each $savedDiceCombination as diceComb, i (diceComb.id)}
    <SavedDiceTray bind:savedDiceComb={diceComb} />
    {/each}
{/if}



<div class="relative z-20">
<ModifierModal bind:showModal on:success={handleModalModifier} />
</div>
</div>

<style>
    .button{
        @apply h-10 w-64 bg-slate-300 hover:bg-slate-400 active:bg-slate-200 rounded-full flex items-center justify-center;
        box-shadow: -4px -4px 10px -2px rgb(148 163 184) inset, 4px 4px 10px -2px #ffffff inset,
            0px 0px 3px 0px rgb(182, 164, 60), 2px 2px 3px -1px #ffffff
    }

</style>
