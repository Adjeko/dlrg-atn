<script lang="ts">
    import { PB } from '@/lib/stores/pocketbase.svelte.js';

    let { children } = $props();

    async function login() {
        const data = {
            "password": "12345678",
            "passwordConfirm": "12345678",
            "email": "test@example.com",
            "emailVisibility": true,
            // "verified": true,
            "name": "test"
        };

        const record = PB().collection('users').create(data);
        
    }
</script>





<h1>Welcome to SvelteKit</h1>
<p class="bg-red-500">Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
<button onclick={login}>Anmelden</button>



