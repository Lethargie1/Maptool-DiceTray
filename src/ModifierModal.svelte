<script>
    import Modal from "./Modal.svelte";
    import { createEventDispatcher } from 'svelte';

    let value=0
    export let showModal=false

    const dispatch = createEventDispatcher();
    const success = () => dispatch('success', value)

</script>
{#if showModal}
    <Modal on:close={()=>{showModal=false ; success()}}>
        <div class="flex flex-col items-center">
        Ajouter un modificateur
        <input type=number bind:value class="text-center" />
        </div>
    </Modal>
{/if}
