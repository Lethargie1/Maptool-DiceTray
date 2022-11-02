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

<div class="flex flex-col justify-start h-screen w-screen">
    <div class="grow-0">
        <HorizontalControlBar
            bind:displayTray
            bind:displaySaved
            on:addDice={showTray}
            on:showSaved={showSaved}
            on:showTray={showTray}
        />
    </div>
    {#if displayTray}
        <div class="grow overflow-y-auto">
            <ActiveDices />
        </div>
    {/if}
    {#if displaySaved}
        <div class="grow overflow-y-auto">
            <HorizontalSavedList on:load={showTray} />
        </div>
    {/if}
</div>

<style global>
    *{
        margin: 0; padding: 0;
    }
</style>