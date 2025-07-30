<script lang="ts">
	import '../app.css';
	import { Button } from "$lib/components/ui/button";
	import { Sheet, SheetContent, SheetTrigger } from "$lib/components/ui/sheet";
	import { Avatar, AvatarImage, AvatarFallback } from "$lib/components/ui/avatar";
	import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "$lib/components/ui/dropdown-menu";
	import { Settings, Users, Menu, ChevronLeft, ChevronRight, LogOut, CircleAlert } from "lucide-svelte";;
    import { goto } from "$app/navigation";	
    import { PB } from "@/lib/stores/pocketbase.svelte";
    import { onMount } from 'svelte';
    import { emptyUser, isPrivilegedEnough, type User } from '@/lib/types/User';
	import {logo} from "@/lib/logo";


	let { children } = $props();
	let sidebarExpanded = $state(false);
	let isMobile = $state(false);
	let user: User = $state(emptyUser);

	onMount(async () => {
		user = PB.getCurrentUser();
	});

	$effect(() => {
		const checkMobile = () => {
			isMobile = window.innerWidth < 768;
			if (isMobile) sidebarExpanded = false;
		};
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	});

	const toggleSidebar = () => {
		sidebarExpanded = !sidebarExpanded;
	};

	const navItems = [
		{ icon: CircleAlert, label: "Dashboard", href: "/timeline", role: "Mitglied" },
		{ icon: ChevronRight, label: "Meine Kurse", href: "/createdCourses", role: "Moderator" },
		{ icon: Users, label: "Users", href: "/admin", role: "Admin" },
		// { icon: Settings, label: "Settings", href: "/settings", role: "Mitglied" },
	];

	function logout(event: Event){
		event.preventDefault();
		PB.instance.authStore.clear();
		goto('/login', { replaceState: true });
	}

	function getInitials(inputString: string) {
    	// Entfernt zusätzliche Leerzeichen am Anfang oder Ende
    	inputString = inputString.trim();

    	// Teilt den String in einzelne Wörter
    	const words = inputString.split(' ');

    	// Erstellt die Initialen
    	const initials = words.map(word => word.charAt(0).toUpperCase()).join('');

    	return initials;
	}
</script>

<div class="flex h-screen bg-gray-100">
	

	<main class="flex-1 flex flex-col overflow-hidden {isMobile ? 'pt-16' : ''}">
		{#if !isMobile}
			<header class="bg-white shadow-sm flex justify-between items-center pr-4">
				<div class="flex items-center gap-4">
					<img src={logo} alt="Logo" class="h-20 w-auto" />
					<h1 class="text-xl font-bold text-[#e30613]">Ausbildungs- und<br />Tätigskeitsnachweis</h1>
				</div>				
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Button variant="ghost" class="relative h-8 w-8 rounded-full">
							<Avatar class="h-10 w-10">
								<AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
							</Avatar>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent class="w-56" align="end">
						<DropdownMenuLabel class="font-normal">
							<div class="flex flex-col space-y-1">
								<p class="text-sm font-medium leading-none">{user?.name}</p>
								<p class="text-xs leading-none text-muted-foreground">{user?.email}</p>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<!-- <DropdownMenuItem>
							<Settings class="mr-2 h-4 w-4" />
							<span>Settings</span>
						</DropdownMenuItem> -->
						<DropdownMenuItem onclick={logout}>
							<LogOut class="mr-2 h-4 w-4" />
							<span>Log out</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</header>
		{/if}

		<div class="flex-1 overflow-auto h-full">

			<div class="flex h-full">
				<div class="{isMobile ? 'w-0' : sidebarExpanded ? 'w-64' : 'w-20'} h-full border-r border-gray-200">
					{#if isMobile}
		<header class="fixed top-0 left-0 right-0 bg-white shadow-sm flex justify-between items-center z-10 px-4">
			<Sheet>
				<SheetTrigger>
					<Button variant="outline" size="icon">
						<Menu class="h-[1.2rem] w-[1.2rem]" />
					</Button>
				</SheetTrigger>
				<SheetContent side="left" class="w-[250px] sm:w-[300px]">
					<nav class="flex flex-col gap-4">
						{#each navItems as item}
							{#if isPrivilegedEnough(user?.role, item.role)}
								<Button variant="ghost" class="justify-start" href={item.href}	>
									<item.icon class="mr-2 h-4 w-4" />
									{item.label}
								</Button>
							{/if}
						{/each}
					</nav>
				</SheetContent>
			</Sheet>
			<div class="flex items-center gap-4">
				<img src={logo} alt="Logo" class="h-20 w-auto" />
				<h1 class="text-l font-bold text-[#e30613]">Ausbildungs- und<br />Tätigskeitsnachweis</h1>
			</div>
			<DropdownMenu>
				<DropdownMenuTrigger>
					<Button variant="ghost" class="relative h-8 w-8 rounded-full">
						<Avatar class="h-10 w-10">
							<AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
						</Avatar>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent class="w-56" align="end">
					<DropdownMenuLabel class="font-normal">
						<div class="flex flex-col space-y-1">
							<p class="text-sm font-medium leading-none">{user?.name}</p>
							<p class="text-xs leading-none text-muted-foreground">{user?.email}</p>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<!-- <DropdownMenuItem>
						<Settings class="mr-2 h-4 w-4" />
						<span>Settings</span>
					</DropdownMenuItem> -->
					<DropdownMenuItem>
						<LogOut class="mr-2 h-4 w-4" />
						<span>Log out</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</header>
			{:else}
		<aside class=" transition-all duration-300 ease-in-out bg-white shadow-md h-full">
			<nav class="flex flex-col h-full p-2">
				<Button variant="ghost" onclick={toggleSidebar} class="self-end mb-24">
					{#if sidebarExpanded}
						<ChevronLeft />
					{:else}
						<ChevronRight />
					{/if}
				</Button>
				{#each navItems as item}
					{#if isPrivilegedEnough(user?.role, item.role)}
						<Button variant="ghost" class="justify-start mb-4" href={item.href}>
							<item.icon class="h-6 w-6" />
							{#if sidebarExpanded}
								<span class="ml-4">{item.label}</span>
							{/if}
						</Button>
					{/if}
				{/each}
			</nav>
		</aside>
			{/if}
				</div>
				<div class="w-full h-full">
					{@render children()}
				</div>
			</div>
			
		</div>
	</main>
</div>
