<script>
    import TrayHole from "./TrayHole.svelte";
    import Dice from "./Dice.svelte";
    import Icon from "./Icon.svelte";
    import TrayTotal from "./TrayTotal.svelte";
    import { flip } from "svelte/animate";
    import { fade } from "svelte/transition";
    import { trayContent, savedDiceCombination } from "./diceStore.js";
    import { v4 as uuidv4 } from 'uuid';
    import { DiceObj } from "./diceStore.js";


    function handleDiceRemoveId(id) {
        trayContent.update((state) => {
            let index = state.diceList.findIndex((dice) => dice.id === id);
            if (index === -1 || index.length > 1) return state;
            state.diceList.splice(index, 1);
            return state;
        });
    }

    function handleReroll() {
        trayContent.update((state) =>{
            state.diceList = state.diceList.map((dc) => {
                dc.needRoll = dc.askRoll();
                return dc;
            })
            return state
        }
        );
    }

    function handleSave() {
        savedDiceCombination.update((state) => {
            if($trayContent.diceList.length ===0)
                return state
            let index = state.findIndex((diceComb) =>diceComb.name === $trayContent.name)

            let newComb = {
                name: $trayContent.name,
                id: uuidv4(),
                diceList: $trayContent.diceList.map(dice=>DiceObj.from(dice)),
            };
            if (index == -1)
                return [...state, newComb];
            state.splice(index, 1, newComb)
            return state
        });
    }

    function handleDeleteAll(){
        trayContent.update(state =>{
            state.diceList=[]
            return state
        })
    }
</script>

<div class="globalContainer ">
    <div class="flex shadowy w-full">
    <div  class="leftHeader"  >
        <div class="flex justify-around">
            <div class:iconWrapper={true} on:click={() => handleSave()}>
                <Icon name="save" class="w-8 h-8" />
            </div>
            <div class:iconWrapper={true} on:click={()=>handleDeleteAll()}>
                <Icon name="garbage" class="stroke-red-700 w-8 h-8"/>
            </div>
        </div>
        <input
            bind:value={$trayContent.name}
            class="rounded-sm border-slate-500 text-center font-semibold text-lg p-1 bg-transparent"
        />
    </div>
    <div  class="rightContainer" >
        <TrayHole class="justify-start h-full content-start">
            {#each $trayContent.diceList as dice, i (dice.id)}
                <div
                    animate:flip={{ delay: 200, duration: 1000 }}
                    transition:fade={{ duration: 200 }}
                    class="diceWrapper"
                >
                    <Dice
                        bind:diceContent={dice}
                        displayMode={false}
                        removeDiceAction={() => handleDiceRemoveId(dice.id)}
                    />
                </div>
            {/each}
            <TrayTotal trayStore={trayContent} buttonAction={handleReroll} />
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
        min-height:170px
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
