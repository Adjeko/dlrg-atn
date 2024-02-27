<script lang="ts">
	import { Input } from '$lib/components';
	export let form;
</script>

<div class="flex flex-col w-full h-full">
	<div class="w-full">
		<form action="?/updatePassword" method="POST" class="flex flex-col space-y-2 w-full">
			<h3 class="text-2xl font-medium">Passwort ändern</h3>
			<div class="divider" />
			<Input
				id="oldPassword"
				label="Altes Passwort"
				type="password"
				required
				errors={form?.errors?.oldPassword}
			/>
			<Input
				id="password"
				label="Neues Passwort"
				type="password"
				required
				errors={form?.errors?.password}
			/>
			<Input
				id="passwordConfirm"
				label="Neues Passwort bestätigen"
				type="password"
				required
				errors={form?.errors?.passwordConfirm}
			/>
			<a href="/reset-password" class="text-primary hover:cursor-point hover:underline">
				Passwort vergessen?</a
			>
			<div class="w-full max-w-lg pt-3">
				<button type="submit" class="btn btn-primary w-full max-w-lg"> Passwort ändern </button>
			</div>
		</form>
	</div>
</div>