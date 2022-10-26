<script>
    import TrayHole from "./TrayHole.svelte";
    import Dice from "./Dice.svelte";
    import Icon from "./Icon.svelte";
    import { trayContent, savedDiceCombination } from "./diceStore.js";

    export let savedDiceComb = null;


    function handleDeleteById(id){
        savedDiceCombination.update((state) => {
            let index = state.findIndex((dice) => dice.id === id);
            if (index === -1 || index.length > 1) return state;
            state.splice(index, 1);
            return state;
        });
    }

    function replaceActiveTray(){
        trayContent.changeName(savedDiceComb.name)
        trayContent.replace(savedDiceComb.diceList)
        
    }

</script>

<div class="globalContainer">

        <div class="flex shadowy w-full flex-col items-stretch">
            <div class="pl-2 pt-2">
                <span class="w-24 text-center pr-2">
                    Tray name:
                </span>
            <input
                bind:value={savedDiceComb.name}
                class="rounded-sm border-slate-500 text-left font-semibold text-base p-1 bg-opacity-20 bg-slate-400"
            />
            </div>
            <div class="flex">
    <div  class="leftHeader" >

            <div class:iconWrapper={true} on:click={()=>replaceActiveTray()}>
                <Icon name="traysend" class="w-5 h-5" />
                <div class="icon-tt">
                    Replace current tray by this one
                </div>
            </div>
            
            <div class:iconWrapper={true} on:click={()=>handleDeleteById(savedDiceComb.id)}>
                <Icon name="garbage" class="stroke-red-700 w-5 h-5"/>
                <div class="icon-tt">
                    Empty tray
                </div>
            </div>
            
    </div>
    <div  class="rightContainer" >
        <TrayHole class="justify-start">
            {#each savedDiceComb.diceList as dice}
                <div class="diceWrapper" >
                    <Dice diceContent={dice} displayMode={true} />
                </div>
            {/each}
        </TrayHole>
    </div>
</div>
</div>
</div>

<style>
    .iconWrapper {
        @apply hover:bg-slate-500 hover:bg-opacity-50 rounded-md p-2 relative;
        box-shadow: -5px -5px 7px -3px rgb(182, 164, 60) inset,
            5px 5px 7px -3px #ffffff inset, -1px -1px 3px -1px rgb(182, 164, 60),
            2px 2px 3px -1px #ffffff;
    }
    .iconWrapperClicked {
        @apply hover:bg-slate-500 hover:bg-opacity-50 rounded-md p-2 bg-opacity-50 bg-yellow-100;
        box-shadow: 5px 5px 7px -3px rgb(182, 164, 60) inset,
            -3px -3px 5px -3px rgb(182, 164, 60) inset,
            1px 1px 3px -1px rgb(182, 164, 60), -2px -2px 3px -1px #ffffff;
    }
    .leftHeader {
        @apply pl-2 py-2 pr-0 flex content-start flex-wrap rounded-l-md gap-2 w-24 shrink-0;
    }
    .rightContainer {
        @apply pl-0 py-2 pr-2 rounded-r-md flex-grow;
        min-height: 103px;
    }
    .diceWrapper {
        @apply bg-transparent flex items-center justify-center cursor-pointer;
    }
    .globalContainer {
        @apply p-4 z-0 relative flex w-full h-fit;
    }
    .shadowy {
        @apply rounded-md border-2 border-slate-700 border-opacity-10 bg-yellow-50;
        box-shadow: 5px 0px 8px 0px rgb(182, 164, 60),
            0 5px 8px 0px rgb(182, 164, 60), -1px -1px 7px 1px #ffffff inset;
    }
    .icon-tt{
        @apply bg-slate-200 text-sm w-20 p-1 rounded-lg border-slate-600 ;
        visibility: hidden;
        position: absolute;
        left: 0%;
        top:100%;
        z-index: 1;
    }
    .iconWrapper:hover .icon-tt {
        visibility: visible;
    }
</style>
