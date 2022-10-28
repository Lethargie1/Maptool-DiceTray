<script>
    import SmallButton from "./SmallButton.svelte";
    import { trayContent,savedDiceCombination } from "../Helper/diceStore.js";
	import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();


    export let diceComb = null
    $: id = diceComb?.id
    $: diceList = diceComb?.diceList

    function handleDelete(){
        savedDiceCombination.update((state) => {
            let index = state.findIndex((dice) => dice.id === id);
            if (index === -1 || index.length > 1) return state;
            state.splice(index, 1);
            return state;
        });
    }


    function replaceActiveTray(){
        trayContent.changeName(diceComb.name)
        trayContent.replace(diceList)
        dispatch("load",id)
        
    }


</script>



<div class="container">
    <SmallButton iconName="traysend"    toolTip="Load tray"  activated={false} clickHandler={()=> replaceActiveTray()}/>
    <SmallButton iconName="garbage"  toolTip="delete saved tray"     activated={false} clickHandler={()=>handleDelete()}/>
</div>


<style>
.container {
        @apply grid gap-1 grid-cols-1 grid-rows-2 bg-transparent w-fit h-fit;
    }
</style>