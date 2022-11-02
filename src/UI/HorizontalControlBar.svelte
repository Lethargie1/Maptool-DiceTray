<script>
    import { getContext, onDestroy } from "svelte";
    import TrayControl from "./TrayControl.svelte";
    import DiceAdder from "./DiceAdder.svelte";
    import MetaControl from "./MetaControl.svelte";
    import { slide } from 'svelte/transition';
    let trayContent = getContext("trayContent");

    export let displayTray = false;
    export let displaySaved = false;

    

    

    let trayName;
    let sendToChat;
    const unsubscribe = trayContent.subscribe((value) => {
        trayName = value.name;
        sendToChat = value.sendNotification;
    });
    onDestroy(unsubscribe);

    $: trayContent.changeName(trayName);

    $: trayTotal = $trayContent?.diceList?.reduce(
        (previousTotal, currentDice) => previousTotal + currentDice.value,
        0
    );
</script>

<div class="grid justify-start items-stretch whole">
    <div class="controlsLeft">
        <div class="px-1 flex justify-center items-center">
            <TrayControl bind:displayTray on:showTray/>
        </div>
        <div
            class="flex justify-center items-center border-x-2 border-slate-700 "
        >
            {trayTotal}
        </div>
    </div>
    <div class="adder">
        <DiceAdder on:addDice/>
    </div>
    <div class="meta">
        <div class="px-1 flex justify-center items-center border-l-2 border-slate-700">
            <MetaControl bind:displaySaved on:showSaved/>
        </div>
    </div>
    {#if displayTray}
        <div class="namepill" transition:slide>
            <input
                bind:value={trayName}
                class="rounded-sm border-slate-500 text-center font-semibold text-base p-1 bg-opacity-20 bg-slate-400 w-52"
            />
        </div>
    {/if}
</div>

<style>
    .controlsLeft {
        @apply grid grid-cols-2  w-fit items-stretch justify-items-stretch py-2 pl-2 bg-opacity-50 bg-slate-200 rounded-l-xl border-y-2 border-l-2 border-slate-700 border-opacity-50;
        grid-row-start: 1;
        grid-column-start: 1;
        outline: solid red 1px
    }
    .adder {
        @apply px-1 bg-opacity-50 bg-slate-200 w-fit border-y-2 border-slate-700 border-opacity-50;
        grid-row-start: 1;
        grid-column-start: 2;
        outline: solid red 1px;
        display: flex;
        align-items: center;
    }
    .meta {
        @apply flex pr-2 py-2 items-stretch bg-opacity-50 bg-slate-200 rounded-r-xl w-fit border-y-2 border-r-2 border-slate-700 border-opacity-50 ;
        grid-row-start: 1;
        grid-column-start: 3;
    }
    .namepill {
        @apply rounded-b-xl bg-opacity-50 bg-slate-200 flex justify-center items-center ml-2 p-1 px-3 border-b-2 border-x-2 border-slate-700;
        grid-row-start: 2;
        grid-column-start: 1;
        grid-column-end: span 2;
        justify-self: start 
    }
    .whole {
        min-width: 330px;
        border: solid blue 1px
    }
</style>
