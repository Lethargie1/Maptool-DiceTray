<script>
  import HorizontalSavedListDiceList from './HorizontalSavedListDiceList.svelte';

    import StaticDiceList from "./StaticDiceList.svelte";
    import { flip } from "svelte/animate";
    import { fade, slide } from "svelte/transition";
    import { savedDiceCombination } from "../Helper/diceStore.js";
    import SavedControl from "./SavedControl.svelte";



    let opened =[]



</script>

<div>
{#each $savedDiceCombination as diceComb, i (diceComb.id)}
    <div
        class="grid-container "
        animate:flip={{ delay: 200, duration: 1000 }}
        transition:fade={{ duration: 200 }}
    >
        <div class="namepill" transition:slide>
            <input
                bind:value={diceComb.name}
                class="rounded-sm border-slate-500 text-center font-semibold text-sm p-0 bg-opacity-20 bg-slate-400 w-24"
            />
        </div>

        <div class="control">
            <SavedControl {diceComb} on:load />
        </div>

        <HorizontalSavedListDiceList {diceComb}/>
    </div>
{/each}
</div>

<style>
    
    .control {
        @apply px-1 flex justify-center items-center pl-2 py-2 bg-opacity-50 bg-slate-200 rounded-l-xl border-y-2 border-l-2 border-slate-700 border-opacity-50;
        grid-row-start: 2;
        grid-column-start: 1;
    }
    .namepill {
        @apply rounded-t-xl bg-opacity-50 bg-slate-200 flex justify-center items-center ml-2 p-1 px-3 border-t-2 border-x-2 border-slate-700 border-opacity-50;
        grid-row-start: 1;
        grid-column-start: 1;
        grid-column-end: span 2;
        justify-self: start 
    }
    .grid-container{
        @apply justify-start items-stretch grid w-full;
        grid-template-columns: max-content minmax(0, 1fr) ;
        max-width: 100%;
    }
</style>
