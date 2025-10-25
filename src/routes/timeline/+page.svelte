<script lang="ts">
// @ts-nocheck

	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "$lib/components/ui/dialog";
	import { Book, Palette, Stethoscope, Calculator, Calendar, QrCode, Trophy, Star, Tag, FileText } from "lucide-svelte";
	import { Separator } from "$lib/components/ui/separator";
	import { Badge } from "$lib/components/ui/badge";
	import { onMount } from "svelte";
    import { PB } from "@/lib/stores/pocketbase.svelte";
    import type { Schedule } from "@/lib/types/Schedule";
	import { Html5Qrcode } from 'html5-qrcode';
    import QrScanner from "./qrScanner.svelte";
	import { generateStyledPDF } from "@/lib/pdfGeneration";
	import { Label } from "$lib/components/ui/label";
	import { Input } from "$lib/components/ui/input";

	let schedules = $state<Schedule[]>([]);
	let qrDialogOpen = $state(false);
	let pdfDialogOpen = $state(false);

	let pdfStartDate = $state(new Date(new Date().getFullYear(), 0, 2).toISOString().slice(0, 7));
	let pdfEndDate = $state(new Date(new Date().getFullYear(), 11, 31).toISOString().slice(0, 7));

	// Group and sort courses by year (newest first within each year)
	let groupedSchedules = $derived(
		(() => {
			const grouped = schedules?.reduce((acc, course) => {
				const year = course.startDateTime.getFullYear();
				if (!acc[year]) {
					acc[year] = [];
				}
				acc[year].push(course);
				return acc;
			}, {}) || {};
			return Object.fromEntries(
				Object.entries(grouped).map(([year, courses]) => [
					year,
					[...courses].sort((a, b) => new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime())
				])
			);
		})()
	);

	// Statistics
	let joinedCourses = $derived(schedules?.length);
	let totalPoints = $derived(schedules?.reduce((acc, course) => acc + course.points, 0));

	function formatDateRange(start : Date, end : Date) {
		const format = { month: "short", day: "numeric", hour: "numeric", minute: "numeric", hour12: false };

		const startString = start.toLocaleString("de-DE", format);
		const endString = end.toLocaleString("de-DE", format);

		return `${startString} - ${endString}`;
	}


	onMount(async () => {
		const user = PB.getCurrentUser();
		const returnedSchedules : Schedule[] = await PB.getTimelineEntries();

		schedules = returnedSchedules;
	});

	async function createPDF() {
		const schedules : Schedule[] = await PB.getPDFEntries(pdfStartDate, pdfEndDate);
		const user : User = PB.getCurrentUser();

		generateStyledPDF(user, pdfStartDate, pdfEndDate, schedules);
	}
</script>

<Card class="w-full max-w-2xl mx-auto">
	<CardHeader>
		<CardTitle>Deine Übersicht</CardTitle>
	</CardHeader>
	<CardContent>
		<div class="grid grid-cols-2 gap-4 mb-6">
			<Card>
				<CardContent class="pt-6">
					<div class="flex items-center justify-between">
						<div class="flex flex-col">
							<span class="text-2xl font-bold">{joinedCourses}</span>
							<span class="text-sm text-muted-foreground">Kurse beigetreten</span>
						</div>
						<Trophy class="w-8 h-8 text-yellow-400" />
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardContent class="pt-6">
					<div class="flex items-center justify-between">
						<div class="flex flex-col">
							<span class="text-2xl font-bold">{totalPoints}</span>
							<span class="text-sm text-muted-foreground">Punkte gesamt</span>
						</div>
						<Star class="w-8 h-8 text-yellow-400" />
					</div>
				</CardContent>
			</Card>
		</div>

		<div class="flex justify-between mt-4">
			<Dialog bind:open={qrDialogOpen}>
				<DialogTrigger>
					<Button class="w-full bg-[#e30613] hover:bg-[#b8000f] text-white">
						<QrCode class="w-4 h-4 mr-2" />
						Kurs beitreten
					</Button>
				</DialogTrigger>
				<DialogContent class="h-[500px]">
					<DialogHeader>
						<DialogTitle>Scan den QR Code um einem Kurs beizutretten.</DialogTitle>
					</DialogHeader>
					{#if qrDialogOpen}
						<QrScanner bind:dialogOpen={qrDialogOpen} bind:schedules={schedules}/>
					{/if}
				</DialogContent>
			</Dialog>

			<Dialog bind:open={pdfDialogOpen}>
				<DialogTrigger>
					<Button class="w-full bg-[#e30613] hover:bg-[#b8000f] text-white">
						<FileText class="w-4 h-4 mr-2" />
						Erstelle eine Bericht
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Exportiere einen PDF Bericht</DialogTitle>
					</DialogHeader>
					{#if pdfDialogOpen}
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div class="space-y-2">
								<Label for="pdfStartDate">Von</Label>
								<Input
									id="pdfStartDate"
									type="month"
									bind:value={pdfStartDate}
								/>
							</div>
							<div class="space-y-2">
								<Label for="pdfEndDate">Bis</Label>
								<Input
									id="pdfEnddate"
									type="month"
									bind:value={pdfEndDate}
								/>
							</div>
						</div>
						<Button onclick={createPDF} class="bg-[#e30613] hover:bg-[#b8000f] text-white">Bericht generieren</Button>
					{/if}
				</DialogContent>
			</Dialog>
		</div>

		<div class="my-5">
			{#each Object.entries(groupedSchedules).sort(([a], [b]) => b - a) as [year, yearCourses]}
				<div class="mb-4">
					<h4 class="text-md font-semibold mb-2">{year}</h4>
					<Separator class="mb-2" />
					<ul class="space-y-4">
						{#each yearCourses as schedule}

							<li class="flex flex-col p-3 bg-card border border-border rounded-lg hover:shadow-sm hover:bg-[#ffecec] transition-colors">
								<a href="/schedule/{schedule.id}" class="block">
									<div class="flex items-center justify-between">
										<div class="flex-1 min-w-0">
											<div class="min-w-0">
												<h3 class="font-semibold text-foreground truncate text-base md:text-lg">{schedule.course.title}</h3>
												<p class="text-sm text-muted-foreground mt-1 truncate">{schedule.course.shortDescription}</p>
												<div class="mt-2 flex items-center text-xs text-muted-foreground">
													<Calendar class="w-3 h-3 mr-2" />
													<span class="whitespace-nowrap">{formatDateRange(schedule.startDateTime, schedule.endDateTime)}</span>
												</div>
											</div>
										</div>
										<span class="ml-4 flex-shrink-0">
											<span class="inline-flex items-center px-3 py-1 rounded-full bg-[#e30613] text-white text-sm font-semibold">{schedule.points}</span>
										</span>
									</div>
									<div class="mt-2 flex flex-wrap gap-2">
										<Badge variant="secondary" class="flex items-center bg-transparent text-muted-foreground border border-border">
											<Tag class="w-3 h-3 mr-1 text-muted-foreground" />
											{schedule.course.category}
										</Badge>
									</div>
								</a>
							</li>

						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</CardContent>
</Card>
