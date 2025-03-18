<script lang="ts">
// @ts-nocheck

	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "$lib/components/ui/dialog";
	import { Book, Code, Palette, Stethoscope, Calculator, Calendar, QrCode, Trophy, Star, Tag } from "lucide-svelte";
	import { Separator } from "$lib/components/ui/separator";
	import { Badge } from "$lib/components/ui/badge";
	import { onMount } from "svelte";
    import { PB } from "@/lib/stores/pocketbase.svelte";
    import type { Schedule } from "@/lib/types/Schedule";
	import { Html5Qrcode } from 'html5-qrcode';
    import QrScanner from "./qrScanner.svelte";

	let courses = $state<Schedule[]>([]);
	let qrDialogOpen = $state(false);

	// Group courses by year
	let groupedCourses = $derived(
		courses?.reduce((acc, course) => {
			const year = course.startDateTime.getFullYear();
			if (!acc[year]) {
				acc[year] = [];
			}
			acc[year].push(course);
			return acc;
		}, {})
	);

	// Statistics
	let joinedCourses = $state(3);
	let totalPoints = $state(265);

	function formatDateRange(start : Date, end : Date) {
		const format = { month: "short", day: "numeric", hour: "numeric", minute: "numeric", hour12: false };

		const startString = start.toLocaleString("de-DE", format);
		const endString = end.toLocaleString("de-DE", format);

		return `${startString} - ${endString}`;
	}


	onMount(async () => {
		const user = PB.getCurrentUser();
		const schedules : Schedule[] = await PB.getTimelineEntries();

		courses = schedules;
	});

</script>

<Card class="w-full max-w-2xl mx-auto">
	<CardHeader>
		<CardTitle>Course Dashboard</CardTitle>
	</CardHeader>
	<CardContent>
		<div class="grid grid-cols-2 gap-4 mb-6">
			<Card>
				<CardContent class="pt-6">
					<div class="flex items-center justify-between">
						<div class="flex flex-col">
							<span class="text-2xl font-bold">{joinedCourses}</span>
							<span class="text-sm text-muted-foreground">Courses Joined</span>
						</div>
						<Trophy class="w-8 h-8 text-primary" />
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardContent class="pt-6">
					<div class="flex items-center justify-between">
						<div class="flex flex-col">
							<span class="text-2xl font-bold">{totalPoints}</span>
							<span class="text-sm text-muted-foreground">Total Points</span>
						</div>
						<Star class="w-8 h-8 text-yellow-400" />
					</div>
				</CardContent>
			</Card>
		</div>

		<Dialog bind:open={qrDialogOpen}>
			<DialogTrigger>
				<Button class="mt-4 w-full">
					<QrCode class="w-4 h-4 mr-2" />
					Join Course via QR Code
				</Button>
			</DialogTrigger>
			<DialogContent class="h-[500px]">
				<DialogHeader>
					<DialogTitle>Scan QR Code to Join Course</DialogTitle>
				</DialogHeader>
				{#if qrDialogOpen}
					<QrScanner bind:dialogOpen={qrDialogOpen} />
				{/if}
			</DialogContent>
		</Dialog>

		<h3 class="text-lg font-semibold my-4">Available Courses</h3>
		{#each Object.entries(groupedCourses).sort(([a], [b]) => b - a) as [year, yearCourses]}
			<div class="mb-4">
				<h4 class="text-md font-semibold mb-2">{year}</h4>
				<Separator class="mb-2" />
				<ul class="space-y-4">
					{#each yearCourses as schedule}
						
						<li class="flex flex-col p-3 bg-secondary rounded-lg">
							<a href="/schedule/{schedule.id}">
								<div class="flex items-center justify-between">
									<div class="flex items-center space-x-4">
										<div class="p-2 bg-primary rounded-full">
											<Code class="w-5 h-5 text-primary-foreground" />
										</div>
										<div>
											<h3 class="font-semibold">{schedule.course.title}</h3>
											<p class="text-sm text-muted-foreground">{schedule.course.shortDescription}</p>
											<div class="flex items-center mt-1 text-xs text-muted-foreground">
												<Calendar class="w-3 h-3 mr-1" />
												{formatDateRange(schedule.startDateTime, schedule.endDateTime)}
											</div>
										</div>
									</div>
									<span class="text-lg font-bold">{schedule.points}</span>
								</div>
								<div class="mt-2 flex flex-wrap gap-2">
									{#each schedule.category as category}
										<Badge variant="secondary" class="flex items-center">
											<Tag class="w-3 h-3 mr-1" />
											{category}
										</Badge>
									{/each}
								</div>
							</a>
						</li>
						
					{/each}
				</ul>
			</div>
		{/each}
	</CardContent>
</Card>
