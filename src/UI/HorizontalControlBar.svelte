<script>
    import { getContext, onDestroy } from "svelte";
    import TrayControl from "./TrayControl.svelte";
    import DiceAdder from "./DiceAdder.svelte";
    import MetaControl from "./MetaControl.svelte";
    import { slide, fade } from "svelte/transition";
    import Icon from "./Icon.svelte"
    let trayContent = getContext("trayContent");

    export let displayTray = false;
    export let displaySaved = false;
    let savedDisplay = 0;
    let showControls = true;
    $: iconName = showControls ? "arrowleft" : "arrowright"
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

    function horizontalSlide(node, {
	delay = 0,
	duration = 800
}) {
    const o = parseFloat(getComputedStyle(node).width);
    const h = parseFloat(getComputedStyle(node).height);
	return {
		delay,
		duration,
		css: (t,u) => `transform: translate(-${u*o}px,0);
        clip-path: inset(0px 5px);`
	};
}
function horizontalShrink(node, {
	delay = 0,
	duration = 800
}) {
    const o = parseFloat(getComputedStyle(node).width);
    const h = parseFloat(getComputedStyle(node).height);
	return {
		delay,
		duration,
		css: (t,u) => `height: ${h}px;width: ${t*o}px;clip-path: inset(0px 5px);`
	};
}

function handleStretcher(){
    if (showControls){
        if (displaySaved)
            savedDisplay = 2
        else if (displayTray)
            savedDisplay = 1
        else
            savedDisplay = 0
        displaySaved=false
        displayTray =false
        showControls = false

    }else{
        if (savedDisplay == 2)
            displaySaved = true
        else if (savedDisplay == 1)
            displayTray = true

        showControls = true

    }
}
</script>

<div class="wrapper">
    {#if showControls}
    <div class="contentBox" transition:horizontalShrink>
        <div class="content" in:fade="{{ delay: 200}}" out:fade>
            <div class="controlsLeft">
                <div class="px-1 flex justify-center items-center">
                    <TrayControl bind:displayTray on:showTray />
                </div>
                <div
                    class="flex justify-center items-center border-x-2 border-slate-700 border-opacity-50"
                >
                    {trayTotal}
                </div>
            </div>
            <div class="adder">
                <DiceAdder on:addDice />
            </div>
            <div class="meta">
                <div
                    class="px-1 flex justify-center items-center border-l-2 border-slate-700 border-opacity-50"
                >
                    <MetaControl bind:displaySaved on:showSaved />
                </div>
            </div>
        </div>
    </div>
    {/if}
    <button class="controlHider" on:click={()=>handleStretcher()}> 
        <Icon name={iconName} />
    </button>
    
</div>
{#if displayTray}
        <div class="namepill" transition:slide>
            <input
                bind:value={trayName}
                class="rounded-sm border-slate-500 text-center font-semibold text-base p-1 bg-opacity-100 bg-slate-300 w-52"
            />
        </div>
    {/if}
<style>
    .contentBox{
        @apply w-fit h-14 ;
        position:static
 
    }
    .content{
        @apply grid justify-start items-stretch whole h-14;
        position: relative;
        right: 0px;
        width: 31.25rem
        
    }
    .controlHider {
        @apply w-7 h-14 border-slate-700 border-opacity-50 border-2 rounded-lg bg-opacity-50 bg-slate-300 hover:bg-slate-500 hover:bg-opacity-50;
        grid-row-start: 1;
        grid-column-start: 2;

    }
    .wrapper {
        @apply grid justify-start items-stretch w-fit bg-opacity-50 bg-slate-200 border-slate-700 border-opacity-50 rounded-xl p-2 border-2;

        
    }
    .controlsLeft {
        @apply grid grid-cols-2  w-fit items-stretch justify-items-stretch;
        grid-row-start: 1;
        grid-column-start: 1;
    }
    .adder {
        @apply px-1 w-fit;
        grid-row-start: 1;
        grid-column-start: 2;
        display: flex;
        align-items: center;
    }
    .meta {
        @apply flex items-stretch  w-fit;
        grid-row-start: 1;
        grid-column-start: 3;
    }
    .namepill {
        @apply rounded-b-xl bg-opacity-50 bg-slate-200 flex justify-center items-center ml-2 p-1 px-3 border-b-2 border-x-2 border-slate-700 w-fit;
        --pointermap: block;

    }
    .whole {
        min-width: 330px;
    }
</style>
