<script>
    import Dice from "./Dice.svelte";


    export let diceList = null;

    export let canWrap = false
    export let openWrap = false;
    
    let listWidth = 0
    let dicesWidth = []
    $:{
        let totalWidth = dicesWidth.reduce((prev,current)=> prev+current,0)
        canWrap = totalWidth > listWidth
    }
</script>

<div 
class="flex gap-0 relative rounded-md justify-start w-m"  
bind:clientWidth={listWidth} 
class:closed={!openWrap} 
class:opened={openWrap}>
    {#each diceList as dice, i (dice.id)}
        <div  class=" bg-transparent flex items-center justify-center cursor-pointer " bind:clientWidth={dicesWidth[i]} >
            <Dice
                diceContent={dice}
                displayMode={true}

            />
        </div>
    {/each}
</div>
<style>
    .closed{
        @apply overflow-clip
    }
    .opened{
        @apply flex-wrap
    }
</style>