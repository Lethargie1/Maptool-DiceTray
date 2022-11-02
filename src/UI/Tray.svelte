<script>
    import HorizontalControlBar from "./HorizontalControlBar.svelte";
    import ActiveDices from "./ActiveDices.svelte";
    import {
        trayContent,
        PossibleDices,
        savedDiceCombination,
    } from "../Helper/diceStore.js";
    import { setContext } from "svelte";
    import HorizontalSavedList from "./HorizontalSavedList.svelte";

    setContext("trayContent", trayContent);
    setContext("possiblesDices", PossibleDices);
    setContext("savedDiceCombination", savedDiceCombination);

    let displayTray = false;
    let displaySaved = false;

    function showTray() {
        displayTray = true;
        displaySaved = false;
    }

    function showSaved() {
        displayTray = false;
        displaySaved = true;
    }
</script>

<div class="grid grid-rows-2 whole">
    <div >
        <HorizontalControlBar
            bind:displayTray
            bind:displaySaved
            on:addDice={showTray}
            on:showSaved={showSaved}
            on:showTray={showTray}
        />
    </div>
    {#if displayTray}
        <div class="overflow-y-auto tray">
            <ActiveDices />
        </div>
    {/if}
    {#if displaySaved}
        <div class="overflow-y-auto">
            <HorizontalSavedList on:load={showTray} />
        </div>
    {/if}
</div>

<style>
    .tray {
        
    }
    .whole{
        grid-template-rows: max-content 1fr;
        position:absolute;
  top:0px;
  right:0px;
  bottom:20%;
  left:0px;
    }
</style>