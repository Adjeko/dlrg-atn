<script>
	import { page } from '$app/stores';
    import { ChevronLeft, Icon } from 'svelte-hero-icons';
	const navigation = [
		{
			title: 'Profil',
			href: '/my/settings/profile'
		},
		{
			title: 'Account',
			href: '/my/settings/account'
		},
		{
			title: 'Sicherheit',
			href: '/my/settings/security'
		}
	];
</script>

<div class="w-full h-full px-2">
	<div class="flex flex-row gap-10">
		<a href="/my/timeline" >
			<Icon src="{ChevronLeft}" size="32"/>
			<h3 class="text-2xl font-medium">Einstellungen</h3>
		</a>
	</div>
	<div class="divider" />
</div>
<div class="flex w-full h-full space-x-4">
	<ul class="menu bg-base-100 w-56 p-2 rounded-box">
		{#each navigation as navItem}
			<li>
				<a
					href={navItem.href}
					class="font-medium {$page.url.pathname === navItem.href ? 'active' : ''}"
					>{navItem.title}</a
				>
			</li>
		{/each}
	</ul>
	<div class="w-full">
		<slot />
	</div>
</div>