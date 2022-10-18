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

    let displaySaved = false;
    let showModal = false;
    $: unsavedCombination = {
        name: "new comb",
        diceList: $trayContent
    }

    function handleDiceAdd(possibleDice) {
        if (possibleDice.maximum === 0) {
            showModal = true;
            return;
        }
        trayContent.update((state) => [...state, DiceObj.from(possibleDice)]);
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

<div class="bg-yellow-50 flex flex-col items-center">
<div class="p-4 w-full">
    <TrayHole class="justify-start ">
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

<div 
    class="h-10 w-64 bg-slate-300 hover:bg-slate-400 active:bg-slate-200 rounded-full flex items-center justify-center"
    on:click={()=>{displaySaved = !displaySaved}}
    >
    <Icon name={displaySaved ? "arrowup" : "arrowdown"} class="m-6 h-6" />
</div>
{#if displaySaved}
    {#each $savedDiceCombination as diceComb}
    <SavedDiceTray savedDiceComb={diceComb} />
    {/each}
{/if}




<ModifierModal bind:showModal on:success={handleModalModifier} />
{JSON.stringify($trayContent)}
{displaySaved}
</div>

<style>

</style>
