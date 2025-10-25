<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Alert, AlertDescription, AlertTitle } from "$lib/components/ui/alert";
	import { Toaster, toast } from "svelte-sonner";
	import { User, Mail, Lock, CircleAlert, Eye, EyeOff } from "lucide-svelte";
    import { PB } from '@/lib/stores/pocketbase.svelte.js';
	import * as z from "zod";

	const schema = z.object({
		username: z.string().min(1, "Benutzername darf nicht leer sein"),
		email: z.string().email("Ungültige E-Mail-Adresse"),
		password: z.string().min(5, "Passwort muss mindestens 5 Zeichen lang sein"),
	});

	let username = $state("");
	let email = $state("");
	let password = $state("");
	let errors = $state<{ [key: string]: string }>({});
	let showPassword = $state(false);

	async function handleSubmit(event: Event) {
		event.preventDefault();
		errors = {};
		try {
			schema.parse({ username, email, password });
			
			await signup(email, password, username);
			await login(email, password);
			
			goto('/timeline', { replaceState: true });
		} catch (error) {
			if (error instanceof z.ZodError) {
				error.errors.forEach((err) => {
					errors[err.path[0]] = err.message;
				});
			}
		}

	}

	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}

	async function signup(email : string, password : string, username: string) {
		const data = {
            "password": password,
            "passwordConfirm": password,
            "email": email.toLowerCase(),
            "emailVisibility": true,
            // "verified": true,
            "name": username,
			"role": "Mitglied"
        };
        try {
            const record = await PB.instance.collection('users').create(data);
        } catch (error : any) {
            if (error.status === 400) {
            	errors["password"] = "Es ist ein Fehler beim Erstellen des Kontos aufgetretten.";
       		} 
			if (error.status === 403) {
            	errors["password"] = "Sie haben nicht die Berechtigung diese Operation auszuführen.";
       		} 
			else {
				errors["password"] = `Ein unbekannter Fehler ist aufgetreten. Fehler: ${error.status}: ${error.message}`;
			}
        }
    }

	async function login(email : string, password : string) {
		try {
			const record = await PB.instance.collection('users').authWithPassword(email.toLowerCase(), password)
			console.log(record)
		}
		catch (error : any) {
			if (error.status === 400) {
            	errors["password"] = "Falscher Benutzername oder Passwort.";
       		} 
			else {
				errors["password"] = `Ein unbekannter Fehler ist aufgetreten. Fehler: ${error.status}: ${error.message}`;
			}
		}
    }
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-100">
	<div class="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
		<div class="text-center">
			<h2 class="mt-6 text-3xl font-bold text-gray-900">Konto erstellen</h2>
		</div>
		<form onsubmit={handleSubmit} class="mt-8 space-y-6">
			<div class="space-y-4">
				<div>
					<Label for="username" class="block text-sm font-medium text-gray-700">Benutzername</Label>
					<div class="mt-1 relative">
						<Input id="username" bind:value={username} type="text" class="pl-10" />
						<User class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
					</div>
					{#if errors.username}
						<p class="mt-1 text-xs text-red-500">{errors.username}</p>
					{/if}
				</div>
				<div>
					<Label for="email" class="block text-sm font-medium text-gray-700">E-Mail-Adresse</Label>
					<div class="mt-1 relative">
						<Input id="email" bind:value={email} type="email" class="pl-10" />
						<Mail class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
					</div>
					{#if errors.email}
						<p class="mt-1 text-xs text-red-500">{errors.email}</p>
					{/if}
				</div>
				<div>
					<Label for="password" class="block text-sm font-medium text-gray-700">Passwort</Label>
					<div class="mt-1 relative">
						<Input id="password" bind:value={password} type={showPassword ? "text" : "password"} class="pl-10 pr-10" />
						<Lock class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
						<button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" onclick={togglePasswordVisibility}>
							{#if showPassword}
								<EyeOff size={20} />
							{:else}
								<Eye size={20} />
							{/if}
						</button>
					</div>
					{#if errors.password}
						<p class="mt-1 text-xs text-red-500">{errors.password}</p>
					{/if}
				</div>
			</div>

			<div>
				<Button type="submit" class="w-full bg-[#e30613] hover:bg-[#b8000f] text-white">Registrieren</Button>
			</div>
		</form>
		<div class="mt-4 text-center">
			<p class="text-sm text-gray-600">
				Bereits ein Konto?
				<a href="/login" class="font-medium text-blue-600 hover:text-blue-500">Hier anmelden</a>
			</p>
		</div>
	</div>
</div>

<Toaster />
