<script>
    import TrayHole from "./TrayHole.svelte";
    import Dice from "./Dice.svelte";
    import Icon from "./Icon.svelte";

    export let savedDiceComb = null;
</script>

<div class="p-2 z-0 relative flex w-full">
    <div
        class="flex justify-start flex-col rounded-l-md gap-2 items-stretch w-40 border-r-0 bg-opacity-0 border-2 border-slate-700 border-opacity-50"
    >
        <div class="flex justify-around">
            <div class:iconWrapper={true}>
                <Icon name="traysend" class="w-8 h-8" />
            </div>
            <div class:iconWrapper={true}>
                <Icon name="garbage" class="stroke-red-700 w-8 h-8"/>
            </div>
        </div>
        <input
            value={savedDiceComb.name}
            class="rounded-sm border-slate-500 text-center font-semibold text-lg p-1 bg-transparent"
        />
    </div>
    <div
        class="p-2  rounded-r-md flex-grow border-l-0 bg-opacity-0 border-2 border-slate-700 border-opacity-50"
    >
        <TrayHole class="justify-start">
            {#each savedDiceComb.diceList as dice}
                <div
                    class=" bg-transparent flex items-center justify-center cursor-pointer"
                >
                    <Dice diceContent={dice} displayMode={true} />
                </div>
            {/each}
        </TrayHole>
    </div>
</div>

<style>
    .iconWrapper {
        @apply p-2 hover:bg-slate-500 hover:bg-opacity-50 rounded-md
    }
</style>
