<script>
    import { DiceObj } from "../Helper/DiceObj.js";
    import { onDestroy } from "svelte";

    export let diceContent = new DiceObj(6);
    export let removeDiceAction = () => false;
    export let rollAction = () => false;
    export let displayMode = false;

    $: useImageAsBackground = true;

    function handleClick() {
        if (displayMode) return;
        rollAction(diceContent);
    }
    function handleContext(event) {
        event.preventDefault();
        //removeDiceAction();
    }
    function handleMouseDown(event) {
        if (
            (event.button === 2 && event.which === 3) ||
            (event.button === 1 && event.which === 2)
        )
            removeDiceAction();
    }
</script>

<div
    class="flex justify-center  select-none relative w-12 h-12 z-0 container"
    on:click={handleClick}
    on:contextmenu={handleContext}
    on:mousedown={handleMouseDown}
>
    <img
        class="z-10 w-12 h-12 image"
        class:absolute={useImageAsBackground}
        class:inset-0={useImageAsBackground}
        class:rotating={diceContent.rolling}
        src={diceContent.svg}
        alt="Document"
    />
    <div class=" z-20 shadowy relative">
        {#if !displayMode && !diceContent.rolling}
            {diceContent.value}
        {:else if displayMode}
            {!diceContent.maximum ? diceContent.display : diceContent.maximum}
        {/if}
    </div>
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
        animation-duration: 0.5s;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
    }

    .shadowy {
        @apply font-bold;
        text-shadow: 0 2px 2px white, 2px 0 2px white, -2px 0 2px white,
            0 -2px 2px white;
        padding: 0px 0;
        flex: 0 1 auto;
        margin:auto
    }
    .image {
    }
    .container {
        flex: 1;
    }
</style>
