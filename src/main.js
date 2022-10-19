
import App from './App.svelte';


try {
	const app = new App({
		target: document.body,
		props: {
			name: 'world'
		}
	});
}
catch (err) {
	console.log(err)
}

