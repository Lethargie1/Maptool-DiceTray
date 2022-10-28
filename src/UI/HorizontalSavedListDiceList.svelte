<script>
    import StaticDiceList from "./StaticDiceList.svelte";
    import { flip } from "svelte/animate";
    import { fade, slide } from "svelte/transition";
    import { savedDiceCombination } from "../Helper/diceStore.js";
    import SavedControl from "./SavedControl.svelte";


    export let diceComb = null
    let opened = false;
    let wrapable = false;

    $: showWrapHider = wrapable && !opened
</script>

<div
    class="list" class:overlayed={showWrapHider}
    on:click={() => {
        opened = !opened
    }}
>
    <StaticDiceList diceList={diceComb.diceList} bind:openWrap={opened} bind:canWrap={wrapable} />
</div>

<style>
    .list {
        @apply flex items-center pr-1 bg-opacity-50 border-y-2 border-slate-700 border-opacity-50 rounded-r-xl border-r-2 bg-slate-200 relative;
        grid-row-start: 2;
        grid-column-start: 2;
        grid-column-end: span 1;
        width: max-content;
        max-width: 100%;
        min-width: 0px;
    }
    .overlayed{

    }
    .overlayed::after {
        @apply rounded-r-xl border-r-2 text-right text-2xl flex justify-end items-center align-middle px-3;
    content: "\B7\B7\B7";
    position: absolute;
    background: linear-gradient(-90deg, rgb(255, 255, 255) 15%, rgba(124, 38, 205, 0));
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
</style>
