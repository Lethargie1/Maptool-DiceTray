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
        @apply bg-yellow-100 flex flex-wrap gap-0 p-4 relative rounded-md;
        box-shadow: inset 0 0px 17px 7px rgba(187, 137, 72, 0.7),
            0 0 4px 2px rgba(182, 146, 99, 0.3); /*bottom internal shadow*/
        
    }

</style>
