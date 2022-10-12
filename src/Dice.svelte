<script>
    import { DiceObj } from "./diceStore.js";
    import importedSvgStr from "../assets/d20.svg";

    export let diceContent = new DiceObj(6);
    export let removeDiceAction = () => false;
    export let allowRoll = true;
    let rolling = false;

    function handleClick(event) {
        if (!allowRoll) return;
        rolling = true;

        setTimeout(() => {
            diceContent.value = diceContent.roll();
            rolling = false;
        }, 2000);
    }
    function handleContext(event) {
        event.preventDefault();
        removeDiceAction();
    }
</script>

<div
    class="bg-transparent flex justify-center items-center text-center hover:ring-2 select-none relative w-14 h-14 z-0"
    on:click={handleClick}
    on:contextmenu={handleContext}
>
    <img
        class="absolute inset-0 z-10"
        class:rotating={rolling}
        src={diceContent.svg}
        alt="Document"
    />
    {#if allowRoll}
        {#if !rolling}
            <div class="text-white z-20">
                {diceContent.value}
            </div>
        {/if}
    {:else}
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
