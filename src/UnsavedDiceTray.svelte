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

<div class="p-2 z-0 relative flex w-full ">
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
        <TrayHole class="justify-start">
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

<style>
    .iconWrapper {
        @apply p-2 hover:bg-slate-500 hover:bg-opacity-50 rounded-md;
    }
    .leftHeader {
        @apply flex justify-start flex-col rounded-l-md gap-2 items-stretch w-40 border-r-0 border-2 border-slate-700 border-opacity-50 bg-yellow-100
    }
    .rightContainer{
        @apply p-2  rounded-r-md flex-grow border-l-0 border-2 border-slate-700 border-opacity-50 bg-yellow-100
    }
    .diceWrapper{
        @apply bg-transparent flex items-center justify-center cursor-pointer
    }
</style>
