<script>

    import { getContext } from 'svelte';
    import Dice from "./Dice.svelte"
    import ModifierModal from "./ModifierModal.svelte"
    import {DiceObj} from "../Helper/DiceObj"
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    let trayContent = getContext("trayContent")
    let possibleDices = getContext("possiblesDices")

    export let contextAction = () => null;

    let showModal = false;
    

    function handleContext(event) {
        event.preventDefault();
        contextAction();
    }
    

    function handleDiceAdd(possibleDice) {
        if (possibleDice.maximum === 0) {
            showModal = true;
            return;
        }
        trayContent.add(possibleDice);
        dispatch("addDice",null)
    }
    function handleModalModifier(e) {
        let flatDice = new DiceObj(0);
        flatDice.value = e.detail;
        trayContent.add(flatDice);
        dispatch("addDice",null)
    }
</script>

<div on:contextmenu={handleContext} class="flex flex-wrap gap-0 relative rounded-md justify-center ">
    {#each possibleDices as Rollable}
        <div
            class=" bg-transparent flex items-center justify-center cursor-pointer hover:ring-2"
            on:click={() => handleDiceAdd(Rollable)}
        >
            <Dice diceContent={Rollable} displayMode={true} />
        </div>
    {/each}
    <ModifierModal bind:showModal on:success={handleModalModifier}/>
</div>
