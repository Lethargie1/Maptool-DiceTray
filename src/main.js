
import App from './App.svelte';
import { attachMessenger} from './Helper/diceStore';
import { messager } from './Com/macroCom';




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

