

<script>
    import {DiceObj} from "./diceStore.js"


    export let diceContent = new Dice(6)
    export let rerollAction;
</script>

<div class="w-14 h-14 bg-red-600 flex justify-center items-center text-center " on:click={rerollAction}>
    {diceContent.display}
    {diceContent.value}
</div>