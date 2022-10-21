<script>
    import { DiceObj } from "./DiceObj.js";
    import { onDestroy } from 'svelte';
    

    export let diceContent = new DiceObj(6);
    export let removeDiceAction = () => false;
    export let rollAction = () => false;
    export let displayMode = false;


    $: useImageAsBackground = true

    function handleClick() {
        if (displayMode) return;
        rollAction(diceContent);  
    }
    function handleContext(event) {
        event.preventDefault();
        //removeDiceAction();
    }
    function handleMouseDown(event){
       if((event.button===2 && event.which === 3) || (event.button===1 && event.which === 2))
        removeDiceAction();
    }


</script>

<div class="hover:ring-2 flex flex-col items-center" >
    <div
        class="bg-transparent flex justify-center items-center text-center  select-none relative w-14 h-14 z-0"
        on:click={handleClick}
        on:contextmenu={handleContext}
        on:mousedown={handleMouseDown}
    >
        <img
            class="z-10 w-14 h-14 "
            class:absolute={useImageAsBackground}
            class:inset-0={useImageAsBackground}
            class:rotating = {diceContent.rolling}
            src={diceContent.svg}
            alt="Document"
        />
        {#if !displayMode}
            {#if !diceContent.rolling}
                <div class=" z-20 shadowy">
                    {diceContent.value}
                </div>
            {/if}
        {:else}
            <div class=" z-20 shadowy">
                {!diceContent.maximum && diceContent.value
                    ? diceContent.value
                    : "?"}
            </div>
        {/if}
    </div>
    {#if displayMode}
        <div class=" z-20 shadowy">
            {diceContent.display}
        </div>
    {/if}
</div>

<style>
    @keyframes rotation {
        from {
        }
        to {
            transform: rotate(360deg);
        }
    }

    .rotating {
        animation-name: rotation;
        animation-duration: 1s;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
    }

    .shadowy {
        @apply font-bold;
        text-shadow: 0 2px 2px white, 2px 0 2px white, -2px 0 2px white,
            0 -2px 2px white;
    }
</style>
