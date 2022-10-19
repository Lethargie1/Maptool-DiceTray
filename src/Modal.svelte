<script>
	import { createEventDispatcher, onDestroy } from 'svelte';

	const dispatch = createEventDispatcher();
	const accept = () => dispatch('accept');
	const cancel = () => dispatch('cancel');
	let modal;

	const handle_keydown = e => {
		if (e.key === 'Escape') {
			cancel();
			return;
		}

		if (e.key === 'Tab') {
			// trap focus
			const nodes = modal.querySelectorAll('*');
			const tabbable = Array.from(nodes).filter(n => n.tabIndex >= 0);

			let index = tabbable.indexOf(document.activeElement);
			if (index === -1 && e.shiftKey) index = 0;

			index += tabbable.length + (e.shiftKey ? -1 : 1);
			index %= tabbable.length;

			tabbable[index].focus();
			e.preventDefault();
		}
	};

	const previously_focused = typeof document !== 'undefined' && document.activeElement;

	if (previously_focused) {
		onDestroy(() => {
			previously_focused.focus();
		});
	}
</script>

<svelte:window on:keydown={handle_keydown}/>

<div class="modal-background " on:click={cancel}></div>

<div class="modal " role="dialog" aria-modal="true" bind:this={modal}>
	<slot name="header"></slot>
	<hr class="py-2">
	<slot></slot>
	<hr class="py-2">

	<!-- svelte-ignore a11y-autofocus -->
	<div class="flex justify-around items-stretch">
		<button autofocus on:click={accept}>accept</button>
		<button on:click={cancel}>cancel</button>
	</div>
</div>

<style>
	.modal-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,0.3);
	}

	.modal {
		position: absolute;
		left: 50%;
		top: 50%;
		width: calc(100vw - 4em);
		max-width: 32em;
		max-height: calc(100vh - 4em);
		overflow: auto;
		transform: translate(-50%,-50%);
		padding: 1em;
		border-radius: 0.2em;
		background: white;
	}

	button {
		@apply px-7 hover:bg-slate-400 py-2 rounded-md;
		display: block;
	}
</style>