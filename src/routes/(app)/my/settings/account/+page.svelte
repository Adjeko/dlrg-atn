<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { Input, Modal } from '$lib/components';

	export let form;
	export let data;
	let emailModalOpen : any;
	let usernameModalOpen : any;
	let loading : any;

	$: emailModalOpen = false;
	$: usernameModalOpen = false;
	$: loading = false;

	const submitUpdateEmail = () => {
		loading = true;
		emailModalOpen = true;
		return async ({ result } : any) => {
			switch (result.type) {
				case 'success':
					await invalidateAll();
					emailModalOpen = false;
					break;
				case 'error':
					break;
				default:
					await applyAction(result);
			}
			loading = false;
		};
	};

	const submitUpdateUsername = () => {
		loading = true;
		usernameModalOpen = true;
		return async ({ result } : any) => {
			switch (result.type) {
				case 'success':
					await invalidateAll();
					break;
				case 'error':
					break;
				default:
					await applyAction(result);
			}
			loading = false;
			usernameModalOpen = false;
		};
	};
</script>

<div class="flex flex-col w-full h-full space-y-12">
	<div class="w-full">
		<h3 class="text-2xl font-medium">Email ändern</h3>
		<div class="divider" />
		<Modal label="change-email" checked={emailModalOpen}>
			<span slot="trigger" class="btn btn-primary">Email ändern</span>
			<h3 slot="heading">Email ändern</h3>
			<form action="?/updateEmail" method="POST" class="space-y-2" use:enhance={submitUpdateEmail}>
				<Input
					id="email"
					type="email"
					label="Gib deine neue Email Addresse ein."
					required={true}
					value={form?.data?.email}
					disabled={loading}
					errors={form?.errors?.email}
				/>
				<button type="submit" class="btn btn-primary w-full" disabled={loading}
					>Email ändern</button
				>
			</form>
		</Modal>
	</div>
	<div class="w-full">
		<h3 class="text-2xl font-medium">Benutzernamen ändern</h3>
		<div class="divider mb-0.5" />
		<Input id="username" label="Username" value={data?.user?.username} disabled errors={undefined}/>
		<Modal label="change-username" checked={usernameModalOpen}>
			<span slot="trigger" class="btn btn-primary">Benutzernamen ändern</span>
			<h3 slot="heading">Benutzernamen ändern</h3>
			<form
				action="?/updateUsername"
				method="POST"
				class="space-y-2"
				use:enhance={submitUpdateUsername}
			>
				<Input
					id="username"
					type="text"
					label="Gib deinen neuen Benutzernamen ein"
					required={true}
					value={form?.data?.username}
					errors={form?.errors?.username}
					disabled={loading}
				/>
				<button type="submit" class="btn btn-primary w-full" disabled={loading}
					>Benutzernamen ändern</button
				>
			</form>
		</Modal>
	</div>
</div>