<script>
    import Modal from "./Modal.svelte";
    import { createEventDispatcher } from 'svelte';

    let value=0
    export let showModal=false

    const dispatch = createEventDispatcher();
    const success = () => dispatch('success', value)

</script>
{#if showModal}
    <Modal on:accept={()=>{showModal=false ; success()}} on:cancel={()=>{showModal=false}}>
        <div class="flex flex-col items-center" slot="header">
            Ajouter un modificateur
        </div>
        <div class="flex flex-col items-center">
            <input type=number bind:value class="text-center border-2 border-slate-400 p-2 rounded-sm" />
        </div>
    </Modal>
{/if}
