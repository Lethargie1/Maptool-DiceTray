
import App from './App.svelte';
import { attachMessenger} from './Helper/diceStore';
import { messager } from './Com/macroCom';




attachMessenger(messager)

function rep2(k,v) {
	return k && v && typeof v !== "number" ? v.tagName + " " +(Array.isArray(v) ? "[object Array]" : "" + v) : v; 
}

function replacer(k, v) { 
	if (k && v && typeof v !== "number"){

		return `${v.tagName} ${v.outerHTML}`

	}else{
		return v;
	}
	
}


//this thing gets me rid of the annoying style that maptool try to inject
window.addEventListener('load', (event) => {

	setTimeout(() => {
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

