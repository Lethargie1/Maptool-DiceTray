
import App from './App.svelte';
import { attachMessenger} from './diceStore';
import { messager } from './macroCom';




attachMessenger(messager)

try {
	new App({
		target: document.body,
		props: {
			name: 'world'
		}
	});
}
catch (err) {
	console.log(err)
}

