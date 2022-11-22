
import App from './App.svelte';
import { attachMessenger} from './Helper/diceStore';
import { messager } from './Com/diceMessager';




attachMessenger(messager)



//this thing gets me rid of the annoying style that maptool try to inject
window.addEventListener('load', (event) => {

	setTimeout(() => {
		let a = document.head.getElementsByTagName('*');
		if(a[0].tagName === "STYLE")
		{
			a[0].remove()
		}
			
	},200)
	
  });
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

