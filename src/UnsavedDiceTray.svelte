<script>
    import TrayHole from "./TrayHole.svelte";
    import Dice from "./UI/Dice.svelte";
    import Icon from "./UI/Icon.svelte";
    import TrayTotal from "./TrayTotal.svelte";
    import { flip } from "svelte/animate";
    import { fade } from "svelte/transition";
    import { trayContent, savedDiceCombination } from "./Helper/diceStore.js";
    import { v4 as uuidv4 } from "uuid";
    import { DiceObj } from "./Helper/DiceObj.js";
    import { onDestroy } from "svelte";

    let trayName;
    let sendToChat;
    const unsubscribe = trayContent.subscribe((value) => {
        trayName = value.name;
        sendToChat = value.sendNotification;
    });
    onDestroy(unsubscribe);

    //let trayName = $trayContent.name
    $: trayContent.changeName(trayName);

    function handleDiceRemoveId(dice) {
        trayContent.remove(dice);
    }

    function handleReroll() {
        $trayContent.diceList.forEach((x) => trayContent.startRoll(x));
    }

    function handleSave() {
        savedDiceCombination.update((state) => {
            if ($trayContent.diceList.length === 0) return state;
            let index = state.findIndex(
                (diceComb) => diceComb.name === $trayContent.name
            );

            let newComb = {
                name: $trayContent.name,
                id: uuidv4(),
                diceList: $trayContent.diceList.map((dice) =>
                    DiceObj.from(dice)
                ),
            };
            if (index == -1) return [...state, newComb];
            state.splice(index, 1, newComb);
            return state;
        });
    }

    function handleDeleteAll() {
        trayContent.clear();
    }
</script>

<div class="globalContainer ">
    <div class="flex shadowy w-full flex-col items-stretch">
        <div class="pl-2 pt-2">
            <span class="w-24 text-center pr-2">
                Tray name:
            </span>
        <input
            bind:value={trayName}
            class="rounded-sm border-slate-500 text-left font-semibold text-base p-1 bg-opacity-20 bg-slate-400"
        />
        </div>
        <div class="flex">
            <div class="leftHeader">
                    <div class:iconWrapper={true} on:click={() => handleSave()}>
                        <Icon name="save" class="w-5 h-5" />
                        <div class="icon-tt">
                            Store dice definition
                        </div>
                    </div>
                    <div
                        class:iconWrapper={true}
                        on:click={() => handleDeleteAll()}
                    >
                        <Icon name="garbage" class="stroke-red-700 w-5 h-5" />
                        <div class="icon-tt">
                            Empty tray
                        </div>
                    </div>
                    <div
                        class:iconWrapper={sendToChat}
                        class:iconWrapperClicked={!sendToChat}
                        on:click={() => trayContent.toggleNotification()}
                    >
                        <Icon
                            name="chat"
                            class={`${
                                sendToChat
                                    ? "stroke-green-500"
                                    : "stroke-red-700"
                            } w-5 h-5`}
                        />
                        <div class="icon-tt">
                            Toggle chat integration
                        </div>
                    </div>
            </div>
            <div class="rightContainer">
                <TrayHole class="justify-start content-start">
                    {#each $trayContent.diceList as dice, i (dice.id)}
                        <div
                            animate:flip={{ delay: 200, duration: 1000 }}
                            transition:fade={{ duration: 200 }}
                            class="diceWrapper"
                        >
                            <Dice
                                diceContent={dice}
                                displayMode={false}
                                rollAction={() => trayContent.startRoll(dice)}
                                removeDiceAction={() =>
                                    handleDiceRemoveId(dice)}
                            />
                        </div>
                    {/each}
                    <TrayTotal
                        trayStore={trayContent}
                        buttonAction={handleReroll}
                    />
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
        min-height: 54px;
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
        left: 100%;
        top:0%;
        z-index: 1;
    }
    .iconWrapper:hover .icon-tt {
        visibility: visible;
    }
</style>
