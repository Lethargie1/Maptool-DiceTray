<script>
    import { DiceObj } from "./diceStore.js";

    export let diceContent = new DiceObj(6);
    export let removeDiceAction = () => false;
    export let displayMode = false;
    //let rolling = false;

    $: if (diceContent.needRoll && diceContent.canRoll && !displayMode){
        diceContent.needRoll = false;
        diceContent.rolling = true;
        setTimeout(() => {
            diceContent.value = diceContent.roll();
            diceContent.rolling = false;
        }, 2000);
    }

    $: useImageAsBackground = true

    function handleClick(event) {
        if (displayMode) return;
        //rolling = true;
        diceContent.needRoll=true;
        
    }
    function handleContext(event) {
        event.preventDefault();
        removeDiceAction();
    }
</script>

<div class="hover:ring-2 flex flex-col items-center"
>
<div
    class="bg-transparent flex justify-center items-center text-center  select-none relative w-14 h-14 z-0"
    on:click={handleClick}
    on:contextmenu={handleContext}
>
    <img
        class="z-10 w-14 h-14"
        class:absolute={useImageAsBackground}
        class:inset-0={useImageAsBackground}
        class:rotating={diceContent.rolling}
        src={diceContent.svg}
        alt="Document"
    />
    {#if !displayMode}
        {#if !diceContent.rolling}
            <div class="text-white z-20">
                {diceContent.value}
            </div>
        {/if}
    {:else}
        <div class="text-white z-20">
            ?
        </div>
    {/if}
</div>
{#if displayMode}
<div class="text-white z-20">
    {diceContent.display}
</div>
{/if}
</div>



<style>
    @keyframes rotation {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(720deg);
        }
    }

    .rotating {
        animation-name: rotation;
        animation-duration: 2s;
    }
</style>
