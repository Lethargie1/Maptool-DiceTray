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
        trayContent.replace(savedDiceComb.diceList)
    }

</script>

<div class="globalContainer">
    <div class="flex shadowy w-full">
    <div  class="leftHeader" >
        <div class="flex justify-around">
            <div class:iconWrapper={true} on:click={()=>replaceActiveTray()}>
                <Icon name="traysend" class="w-8 h-8" />
            </div>
            <div class:iconWrapper={true} on:click={()=>handleDeleteById(savedDiceComb.id)}>
                <Icon name="garbage" class="stroke-red-700 w-8 h-8"/>
            </div>
        </div>
        <input
            bind:value={savedDiceComb.name}
            class="rounded-sm border-slate-500 text-center font-semibold text-lg p-1 bg-transparent"
        />
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

<style>
    .iconWrapper {
        @apply  hover:bg-slate-500 hover:bg-opacity-50 rounded-md p-2;
        box-shadow: -5px -5px 7px -3px rgb(182, 164, 60) inset, 5px 5px 7px -3px #ffffff inset,
            -1px -1px 3px -1px rgb(182, 164, 60), 2px 2px 3px -1px #ffffff
    }
    .leftHeader {
        @apply p-2 flex justify-start flex-col rounded-l-md gap-2 items-stretch w-40  
    }
    .rightContainer{
        @apply  p-2 rounded-r-md flex-grow;
    }
    .diceWrapper{
        @apply bg-transparent flex items-center justify-center cursor-pointer
    }
    .globalContainer{
        @apply p-4 z-0 relative flex w-full;
        
    }
    .shadowy{
        @apply  rounded-md border-2 border-slate-700 border-opacity-10 bg-yellow-50;
        box-shadow: 5px 0px 8px 0px rgb(182, 164, 60), 0 5px 8px 0px rgb(182, 164, 60), -1px -1px 7px 1px #ffffff inset
    }
</style>
