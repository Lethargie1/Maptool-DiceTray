<script>
    import { trayContent, PossibleDices } from "./diceStore.js";
    import produce from "immer";
    import Dice from "./Dice.svelte";
    import { DiceObj } from "./diceStore.js";
    import { flip } from "svelte/animate";
    import { fade } from "svelte/transition";
    import ModifierModal from "./ModifierModal.svelte";
    import Icon from "./Icon.svelte";
    import TrayTotal from "./TrayTotal.svelte"

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

<div class=" bg-amber-700 p-4">
    <div
        class="bg-amber-800 flex justify-start flex-wrap gap-0 p-4 relative min-h-full trayhole rounded-md"
        on:contextmenu={handleContext}
    >
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
    </div>
</div>
<div class=" bg-amber-700 p-4 flex justify-center">
    <div
        class="bg-amber-800 flex items-center gap-4 p-4 justify-center trayhole rounded-md"
    >
        {#each PossibleDices as Rollable}
            <div
                class=" bg-transparent flex items-center justify-center cursor-pointer"
                on:click={() => handleDiceAdd(Rollable)}
            >
                <Dice diceContent={Rollable} displayMode={true} />
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
