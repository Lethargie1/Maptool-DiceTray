<script>
    import SmallButton from "./SmallButton.svelte";
    import { getContext, onDestroy } from 'svelte';
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();


    export let displaySaved = false

    const trayContent = getContext("trayContent")
    const savedDiceCombination = getContext("savedDiceCombination")

    let sendToChat;
    const unsubscribe = trayContent.subscribe((value) => {
        sendToChat = value.sendNotification;
    });
    onDestroy(unsubscribe);


    function handleTraysClick(){
        displaySaved = !displaySaved
        if(displaySaved)
            dispatch("showSaved",null)
    }
    
    </script>

<div class="container">
    <SmallButton iconName="chat"    toolTip="Toggle chat notification"  activated={!sendToChat} clickHandler={() => trayContent.toggleNotification()} />
    <SmallButton iconName="savedTrays"  toolTip="Open saved trays"     activated={!displaySaved} clickHandler={()=>handleTraysClick()} />
</div>


<style>
.container {
        @apply grid gap-1 grid-cols-1 grid-rows-2 bg-transparent w-fit h-fit;
    }
</style>