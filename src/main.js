
import App from './App.svelte';


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

