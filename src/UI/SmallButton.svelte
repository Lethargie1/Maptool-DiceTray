<script>
    import Icon from "./Icon.svelte";

    export let iconName = "save";
    export let toolTip = "This is a tooltip";
    export let clickHandler = () => null;
    export let activated = false
</script>

<div class="relative">
<div class:activated on:click={clickHandler} class="button ">
    <Icon name={iconName} />
    
</div>
<div class="icon-tt">
    {toolTip}
</div>
</div>

<style>
    .button {
        @apply hover:bg-slate-500 hover:bg-opacity-50 rounded-md p-1 bg-opacity-50 bg-slate-300 w-6 relative;
    }

    .activated {
        @apply bg-red-600;
    }
    .icon-tt {
        @apply bg-slate-100 text-sm w-20 p-1 rounded-lg border-slate-600 border-2;
        visibility: hidden;
        position: absolute;
        left: 100%;
        top: 0%;
        z-index: 100;
    }
    .button:hover + .icon-tt {
        visibility: visible;
    }
</style>
