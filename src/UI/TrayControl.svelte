<script>
    import SmallButton from "./SmallButton.svelte";
    import { getContext } from 'svelte';
    import { v4 as uuidv4 } from "uuid";
    import { DiceObj } from "../Helper/DiceObj.js";
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let displayTray=false

    const trayContent = getContext("trayContent")
    const savedDiceCombination = getContext("savedDiceCombination")

    function handleReroll() {
        $trayContent.diceList.forEach((x) => trayContent.startRoll(x));
        displayTray=true;
    }

    function handleSave() {
        savedDiceCombination.update((state) => {
            if ($trayContent.diceList.length === 0) return state;
            let index = state.findIndex(
                (diceComb) => diceComb.name === $trayContent.name
            );

            let newComb = {
                name: $trayContent.name,
                id: uuidv4(),
                diceList: $trayContent.diceList.map((dice) =>
                    DiceObj.from(dice)
                ),
            };
            if (index == -1) return [...state, newComb];
            state.splice(index, 1, newComb);
            return state;
        });
    }

    function handleDeleteAll() {
        trayContent.clear();
    }

    function handleDisplayToggle(){
        displayTray = !displayTray
        if(displayTray)
            dispatch("showTray",null)
    }
</script>

<div class="container">
    <SmallButton iconName="save"    toolTip="Save tray"  activated={false} clickHandler={()=> handleSave()}/>
    <SmallButton iconName="reroll"  toolTip="Reroll"     activated={false} clickHandler={()=> handleReroll()}/>
    <SmallButton iconName="garbage" toolTip="Empty tray" activated={false} clickHandler={()=> handleDeleteAll()}/>
    <SmallButton iconName={displayTray ? "arrowup" : "arrowdown"}    toolTip="Show Tray"  activated={!displayTray} clickHandler={()=> handleDisplayToggle()}/>
</div>


<style>
.container {
        @apply grid gap-1 grid-cols-2 grid-rows-2 bg-transparent w-fit h-fit;
    }
</style>