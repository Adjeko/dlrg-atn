<script lang="ts">
	import { Input } from '$lib/components';
	export let form : any;
</script>

<div class="flex flex-col items-center h-full w-full">
	<h2 class="mt-2 text-center text-3xl font-bold tracking-tight text-base-content">
		Lege ein neues Konto an
	</h2>
	<p class="text-center mt-1">
		oder <a href="/login" class="text-primary font-medium hover:cursor-pointer hover:underline"
			>melde dich an</a
		> wenn du bereits ein Konto hast.
	</p>
	<form action="?/register" method="POST" class="flex flex-col items-center space-y-2 w-full pt-4">
		<Input id="name" label="Name" value={form?.data?.name} errors={form?.errors?.name} />
		<Input
			type="email"
			id="email"
			label="Email"
			value={form?.data?.email}
			errors={form?.errors?.email}
		/>
		<Input type="password" id="password" label="Password" errors={form?.errors?.password} />
		<Input
			type="password"
			id="passwordConfirm"
			label="Confirm Password"
			errors={form?.errors?.passwordConfirm}
		/>

		<p class="mt-2 py-4 max-w-lg text-center font-bold tracking-tight text-base-content">
			Wenn du dich registrierst, bekommst du ein Verifizierungsmail an die von dir angegebene Email geschickt. 
			Mit dieser musst du dich verifizieren, um dich anschließend anmelden zu können.
		</p>
		<div class="w-full max-w-lg pt-2">
			<button type="submit" class="btn btn-primary w-full">Registrieren und Verifizierungsmail schicken</button>
		</div>
	</form>
</div>