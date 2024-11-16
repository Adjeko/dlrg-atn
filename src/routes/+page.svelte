<script lang="ts">
	import '../app.css';
    import Manifest from "@mnfst/sdk";

	let { children } = $props();


    async function login() {
        const manifest = new Manifest();
        await manifest.signup('users', 'herbert@ich.com', 'hp1955')
    }
</script>





<h1>Welcome to SvelteKit</h1>
<p class="bg-red-500">Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
<button onclick={login}>Anmelden</button>



