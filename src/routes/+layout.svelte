<script lang="ts">
	import '../app.css';
	import { Button } from "$lib/components/ui/button";
	import { Sheet, SheetContent, SheetTrigger } from "$lib/components/ui/sheet";
	import { Avatar, AvatarImage, AvatarFallback } from "$lib/components/ui/avatar";
	import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "$lib/components/ui/dropdown-menu";
	import { Settings, Users, Menu, ChevronLeft, ChevronRight, LogOut, CircleAlert } from "lucide-svelte";;
    import { goto } from "$app/navigation";	
    import { PB } from "@/lib/stores/pocketbase.svelte";


	let { children } = $props();
	let sidebarExpanded = $state(false);
	let isMobile = $state(false);

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
		{ icon: CircleAlert, label: "Dashboard", href: "/timeline" },
		{ icon: ChevronRight, label: "Meine Kurse", href: "/createdCourses" },
		{ icon: Users, label: "Users", href: "/admin" },
		{ icon: Settings, label: "Settings", href: "/settings" },
	];

	function logout(event: Event){
		event.preventDefault();
		PB.instance.authStore.clear();
		goto('/login', { replaceState: true });
	}
</script>

<div class="flex h-screen bg-gray-100">
	{#if isMobile}
		<header class="fixed top-0 left-0 right-0 bg-white shadow-sm p-4 flex justify-between items-center z-10">
			<Sheet>
				<SheetTrigger>
					<Button variant="outline" size="icon">
						<Menu class="h-[1.2rem] w-[1.2rem]" />
					</Button>
				</SheetTrigger>
				<SheetContent side="left" class="w-[250px] sm:w-[300px]">
					<nav class="flex flex-col gap-4">
						{#each navItems as item}
							<Button variant="ghost" class="justify-start" href={item.href}	>
								<item.icon class="mr-2 h-4 w-4" />
								{item.label}
							</Button>
						{/each}
					</nav>
				</SheetContent>
			</Sheet>
			<h1 class="text-xl font-semibold">Dashboard</h1>
			<DropdownMenu>
				<DropdownMenuTrigger>
					<Button variant="ghost" class="relative h-8 w-8 rounded-full">
						<Avatar class="h-8 w-8">
							<AvatarImage src="https://github.com/shadcn.png" alt="User" />
							<AvatarFallback>U</AvatarFallback>
						</Avatar>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent class="w-56" align="end">
					<DropdownMenuLabel class="font-normal">
						<div class="flex flex-col space-y-1">
							<p class="text-sm font-medium leading-none">John Doe</p>
							<p class="text-xs leading-none text-muted-foreground">john@example.com</p>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem>
						<Settings class="mr-2 h-4 w-4" />
						<span>Settings</span>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<LogOut class="mr-2 h-4 w-4" />
						<span>Log out</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</header>
	{:else}
		<aside class="{sidebarExpanded ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out bg-white shadow-md">
			<nav class="flex flex-col h-full p-4">
				<Button variant="ghost" onclick={toggleSidebar} class="self-end mb-6">
					{#if sidebarExpanded}
						<ChevronLeft />
					{:else}
						<ChevronRight />
					{/if}
				</Button>
				{#each navItems as item}
					<Button variant="ghost" class="justify-start mb-2" href={item.href}>
						<item.icon class="h-5 w-5" />
						{#if sidebarExpanded}
							<span class="ml-4">{item.label}</span>
						{/if}
					</Button>
				{/each}
			</nav>
		</aside>
	{/if}

	<main class="flex-1 flex flex-col overflow-hidden {isMobile ? 'pt-16' : ''}">
		{#if !isMobile}
			<header class="bg-white shadow-sm p-4 flex justify-between items-center">
				<h1 class="text-xl font-semibold">Dashboard</h1>
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Button variant="ghost" class="relative h-8 w-8 rounded-full">
							<Avatar class="h-8 w-8">
								<AvatarImage src="https://github.com/shadcn.png" alt="User" />
								<AvatarFallback>U</AvatarFallback>
							</Avatar>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent class="w-56" align="end">
						<DropdownMenuLabel class="font-normal">
							<div class="flex flex-col space-y-1">
								<p class="text-sm font-medium leading-none">John Doe</p>
								<p class="text-xs leading-none text-muted-foreground">john@example.com</p>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<Settings class="mr-2 h-4 w-4" />
							<span>Settings</span>
						</DropdownMenuItem>
						<DropdownMenuItem onclick={logout}>
							<LogOut class="mr-2 h-4 w-4" />
							<span>Log out</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</header>
		{/if}
		<div class="flex-1 overflow-auto p-6">
			{@render children()}
		</div>
	</main>
</div>
