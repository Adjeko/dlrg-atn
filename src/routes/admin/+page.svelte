<script>
	// @ts-ignore
	import { onMount } from "svelte";
	// @ts-ignore
	import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$lib/components/ui/table";
	// @ts-ignore
	import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "$lib/components/ui/select";
	import { Input } from "$lib/components/ui/input";
	// @ts-ignore
	import { Button } from "$lib/components/ui/button";
	import { Toaster } from "svelte-sonner";
	import { toast } from "svelte-sonner";
	import { Search } from "lucide-svelte";;

	// @ts-ignore
	let users = $state([]);
	let searchTerm = $state("");

	$effect(() => {
		// Simulating API call to fetch users
		users = [
			{ id: 1, name: "John Doe", email: "john@example.com", role: "user" },
			{ id: 2, name: "Jane Smith", email: "jane@example.com", role: "admin" },
			{ id: 3, name: "Bob Johnson", email: "bob@example.com", role: "moderator" },
		];
	});

	// @ts-ignore
	function updateUserRole(userId, newRole) {
		const userIndex = users.findIndex((user) => user.id === userId);
		if (userIndex !== -1) {
			users[userIndex].role = newRole;
			toast.success(`Updated role for ${users[userIndex].name} to ${newRole}`);
		}
	}

	let filteredUsers = $derived(users.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())));
</script>

<div class="container mx-auto p-6">
	<h1 class="text-3xl font-bold mb-6">User Role Management</h1>

	<div class="mb-4 relative">
		<Input type="text" placeholder="Search users..." bind:value={searchTerm} class="pl-10" />
		<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
	</div>

	<Table>
		<TableHeader>
			<TableRow>
				<TableHead>Name</TableHead>
				<TableHead>Email</TableHead>
				<TableHead>Role</TableHead>
				<TableHead>Actions</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each filteredUsers as user (user.id)}
				<TableRow>
					<TableCell>{user.name}</TableCell>
					<TableCell>{user.email}</TableCell>
					<TableCell>{user.role}</TableCell>
					<TableCell>
						<Select onValueChange={(/** @type {any} */ value) => updateUserRole(user.id, value)}>
							<SelectTrigger class="w-[180px]">
								<SelectValue placeholder="Select a role" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="user">User</SelectItem>
								<SelectItem value="moderator">Moderator</SelectItem>
								<SelectItem value="admin">Admin</SelectItem>
							</SelectContent>
						</Select>
					</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>

	{#if filteredUsers.length === 0}
		<p class="text-center mt-4 text-gray-500">No users found</p>
	{/if}
</div>

<Toaster />
