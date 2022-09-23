<script> 
    export let name 
    let value = 0
    value = 5+3
    value = value * 2
</script>

<div>
    <h1 class="text-m font-medium underline">Hello welcome to svelte</h1>
    hello terrible {name}
    I have calculated value to be {value}
</div>

<style global lang="postcss">
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
</style>