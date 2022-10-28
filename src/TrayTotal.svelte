<script>
    import Icon from "./UI/Icon.svelte";

    export let trayStore = null;
    export let buttonAction = null;

    $: trayTotal = $trayStore.diceList.reduce(
        (previousTotal, currentDice) => previousTotal + currentDice.value,
        0
    );
</script>

<div class="base">
    <table class="table-auto">
        <tbody
            ><tr>
                <td
                    ><button
                        class="button"
                        title="Reroll all"
                        on:click={buttonAction}
                    >
                        <Icon name="reroll" class="w-6 h-6 border-black" />
                    </button></td
                >
                <td
                    ><div class="px-2">
                        {trayTotal}
                    </div></td
                >
            </tr></tbody
        >
    </table>
</div>

<style>
    .base {
        @apply bg-slate-400 absolute bottom-2 right-2 font-mono text-xl rounded-md bg-opacity-50 flex items-center h-10;
    }
    .button {
        @apply p-1 block rounded-md hover:bg-slate-400 active:bg-slate-500 hover:bg-opacity-30 active:bg-opacity-30;
    }
</style>
