

<script>
    import {DiceObj} from "./diceStore.js"


    export let diceContent = new DiceObj(6)
    export let removeDiceAction = (id) => false
    export let allowRoll = true

    function handleClick(event) {
        if (!allowRoll)
            return;
        diceContent.value = diceContent.roll()
    }
    function handleContext(event){
        event.preventDefault()
        removeDiceAction(diceContent.id)
    }
</script>

<div class="w-14 h-14 bg-red-600 flex justify-center items-center text-center hover:ring-2 select-none" on:click={handleClick} on:contextmenu={handleContext}>
    {diceContent.display}
    {diceContent.value}
</div>

