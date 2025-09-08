<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Select, SelectContent, SelectItem, SelectTrigger } from "$lib/components/ui/select";
	import { Separator } from "$lib/components/ui/separator";
    import { PB } from "@/lib/stores/pocketbase.svelte";
    import type { User } from "@/lib/types/User";
	import { UserCogIcon, ShieldIcon, User as UserIcon } from "lucide-svelte";
    import { onMount } from "svelte";

	// Verfügbare Rollen und zugehörige Icons
	const roles = ["Admin", "Moderator", "Mitglied"] as const;
	type Role = typeof roles[number];
	const roleIcons: Record<Role, typeof ShieldIcon | typeof UserCogIcon | typeof UserIcon> = {
		Admin: ShieldIcon,
		Moderator: UserCogIcon,
		Mitglied: UserIcon
	};

	// Aktuelle Rolle für jeden Benutzer
	let users = $state<User[]>([]);

	onMount(async () => {
		const readUsers : User[] = await PB.getAllUsers();

		users = readUsers;
	});

	// Gruppierte und sortierte Benutzerliste
	const groupedUsers = $derived.by(() => {
		const groups: { [key: string]: User[] } = {
			Admin: [],
			Moderator: [],
			Mitglied: [],
		};

		// Benutzer nach Rollen gruppieren
		users.forEach((user) => {
			const role = user.role;
			if (groups[role]) {
				groups[role].push(user);
			}
		});

		// Innerhalb jeder Gruppe alphabetisch sortieren
		Object.keys(groups).forEach((role) => {
			groups[role].sort((a, b) => a.name.localeCompare(b.name, "de"));
		});

		return groups;
	});

	// Funktion zum Aktualisieren der Rolle
	const updateRole = (userId: string, newRole: any) => {
		const user = users.find((user) => user.id === userId);
		if (user) {
			user.role = newRole.value;
		}
		
		PB.instance.collection("users").update(userId, { role: newRole.value });
	};
</script>

<Card>
	<CardHeader>
		<CardTitle class="flex items-center gap-2">
			<UserCogIcon class="size-5" />
			Benutzer-Verwaltung
		</CardTitle>
	</CardHeader>
	<CardContent>
		<div class="relative overflow-x-auto">
			<table class="w-full text-left">
				<thead class="text-sm text-muted-foreground">
					<tr class="border-b">
						<th class="p-4">Name</th>
						<th class="p-4">E-Mail</th>
						<th class="p-4">Rolle</th>
					</tr>
				</thead>
				<tbody>
					{#each roles as role}
						{#if groupedUsers[role].length > 0}
							<tr>
								<td colspan="3" class="pt-6 pb-2">
									<div class="flex items-center gap-4">
										<div class="font-medium text-sm text-muted-foreground flex items-center gap-2">
											{#if roleIcons[role]}
												{@const Icon = roleIcons[role]}
												<Icon class="size-4" />
											{/if}
											{role}
										</div>
										<Separator class="flex-1" />
									</div>
								</td>
							</tr>
							{#each groupedUsers[role] as user (user.id)}
								<tr class="border-b">
									<td class="p-4">{user.name}</td>
									<td class="p-4">{user.email}</td>
									<td class="p-4">
										<Select selected={user.role} selectedType="string" onSelectedChange={(value : any) => updateRole(user.id, value)}>
											<SelectTrigger class="w-[140px]">
												<div class="flex items-center gap-2">
													{#if roleIcons[user.role]}
														{@const Icon = roleIcons[user.role]}
														<Icon class="size-4" />
													{/if}
													{user.role}
												</div>
											</SelectTrigger>
											<SelectContent>
												{#each roles as roleOption}
													<SelectItem value={roleOption}>
														<div class="flex items-center gap-2">
															{#if roleIcons[roleOption]}
																{@const Icon = roleIcons[roleOption]}
																<Icon class="size-4" />
															{/if}
															{roleOption}
														</div>
													</SelectItem>
												{/each}
											</SelectContent>
										</Select>
									</td>
								</tr>
							{/each}
						{/if}
					{/each}
				</tbody>
			</table>
		</div>
	</CardContent>
</Card>
