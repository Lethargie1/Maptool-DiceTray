<script>


    export let contextAction = () => null;
    function handleContext(event) {
        event.preventDefault();
        contextAction();
    }
</script>


<div
    class:hole={true}
    class={$$props.class}
    on:contextmenu={handleContext}
>
    <slot />
</div>

<style>
    .hole {
        @apply bg-yellow-100 flex flex-wrap gap-0 p-4 relative rounded-md border-2 border-slate-700 border-opacity-10;
        box-shadow: 3px 3px 8px 0px rgb(182, 164, 60) inset, 1px 1px 7px 2px #ffffff, 0px 0px 8px 0px rgb(182, 164, 60) inset
        
    }

</style>
