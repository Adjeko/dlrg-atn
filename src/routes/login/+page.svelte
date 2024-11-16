<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Alert, AlertDescription, AlertTitle } from "$lib/components/ui/alert";
	import { Toaster, toast } from "svelte-sonner";
	import { User, Mail, Lock, CircleAlert, Eye, EyeOff } from "lucide-svelte";;
	import * as z from "zod";

	const schema = z.object({
		email: z.string().email("Ungültige E-Mail-Adresse"),
		password: z.string().min(8, "Passwort muss mindestens 8 Zeichen lang sein"),
	});

	let email = $state("");
	let password = $state("");
	let errors = $state<{ [key: string]: string }>({});
	let showPassword = $state(false);

	function handleSubmit(event: Event) {
		event.preventDefault();
		errors = {};
		try {
			schema.parse({ email, password });
			// Hier würde die Anmelde-Logik implementiert werden
			console.log("Anmeldung erfolgreich", { email, password });
			toast.success("Anmeldung erfolgreich!");
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
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-100">
	<div class="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
		<div class="text-center">
			<h2 class="mt-6 text-3xl font-bold text-gray-900">Konto erstellen</h2>
		</div>
		<form onsubmit={handleSubmit} class="mt-8 space-y-6">
			<div class="space-y-4">
		        <div>
					<Label for="email" class="block text-sm font-medium text-gray-700">E-Mail-Adresse</Label>
					<div class="mt-1 relative">
						<Input id="email" bind:value={email} type="email" required class="pl-10" />
						<Mail class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
					</div>
					{#if errors.email}
						<p class="mt-1 text-xs text-red-500">{errors.email}</p>
					{/if}
				</div>
				<div>
					<Label for="password" class="block text-sm font-medium text-gray-700">Passwort</Label>
					<div class="mt-1 relative">
						<Input id="password" bind:value={password} type={showPassword ? "text" : "password"} required class="pl-10 pr-10" />
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

			{#if Object.keys(errors).length > 0}
				<Alert variant="destructive">
					<CircleAlert class="h-4 w-4" />
					<AlertTitle>Fehler</AlertTitle>
					<AlertDescription>Bitte korrigieren Sie die angegebenen Fehler.</AlertDescription>
				</Alert>
			{/if}

			<div>
				<Button type="submit" class="w-full">Anmelden</Button>
			</div>
		</form>
		<div class="mt-4 text-center">
			<p class="text-sm text-gray-600">
				Noch nicht registriert?
				<a href="/register" class="font-medium text-blue-600 hover:text-blue-500">Hier registrieren</a>
			</p>
		</div>
	</div>
</div>

<Toaster />
