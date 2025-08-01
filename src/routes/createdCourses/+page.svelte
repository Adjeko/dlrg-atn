<script lang="ts">
	// @ts-nocheck

	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import {
		Dialog,
		DialogContent,
		DialogHeader,
		DialogTitle,
		DialogTrigger,
		DialogFooter,
	} from "$lib/components/ui/dialog";
	import {
		Book,
		Code,
		Palette,
		Stethoscope,
		Calculator,
		Calendar,
		CirclePlus,
		Trophy,
		Star,
		Tag,
		Plus,
		Trash2Icon,
	} from "lucide-svelte";
	import { Separator } from "$lib/components/ui/separator";
	import { Badge } from "$lib/components/ui/badge";
	import { onMount } from "svelte";
	import { Label } from "$lib/components/ui/label";
	import { Input } from "$lib/components/ui/input";
	import { Textarea } from "$lib/components/ui/textarea";
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
		SelectValue,
	} from "$lib/components/ui/select";
	import { PB } from "@/lib/stores/pocketbase.svelte";
    import { CourseSchema, toCourse } from "@/lib/types/Course";

	let dialogIsOpen = $state(false);

	let courses = $state<Course[]>([]);

	// Group courses by year
	let groupedCourses = $derived(
		Object.entries(
			courses?.reduce((acc, course) => {
				const year = course.created.getFullYear();
				if (!acc[year]) {
					acc[year] = [];
				}
				acc[year].push(course);
				return acc;
			}, {})
		)
		// Sortiere die Jahre absteigend
		.sort(([a], [b]) => Number(b) - Number(a))
		// Innerhalb jedes Jahres: Kurse nach created absteigend sortieren (neueste zuerst)
		.map(([year, courses]) => [
			year,
			courses.sort((a, b) => b.created - a.created)
		])
		// Wieder in ein Objekt umwandeln
		.reduce((acc, [year, courses]) => {
			acc[year] = courses;
			return acc;
		}, {})
	);



	onMount(async () => {
		const user = PB.getCurrentUser();
		const createdCourses : Course[] = await PB.getCreatedCourses();

		courses = createdCourses;
	});

	function formatDateRange(start, end) {
		const dateFormat = { month: "short", day: "numeric", year: "numeric" };
		const timeFormat = { hour: "numeric", minute: "numeric", hour12: true };

		const startDate = start.toLocaleDateString("de-DE", dateFormat);
		const startTime = start.toLocaleTimeString("de-DE", timeFormat);
		const endTime = end.toLocaleTimeString("de-DE", timeFormat);

		return `${startDate} ${startTime} - ${endTime}`;
	}

	// Kursdetails
	let title: string = $state("");
	let shortDescription: string = $state("");
	let description: string = $state("");
	let category: string = $state("Ausbildung");

	// Termine
	type Session = {
		startDate: Date;
		endDate: Date;
		location: string;
		points: number;
	};

	let sessions: Session[] = $state([]);

	// Neuen Termin hinzufügen
	function addSession() {
		const now = new Date();
		// Setze Standardendzeit auf 2 Stunden nach Startzeit
		const endTime = new Date(now.getTime() + 2 * 60 * 60 * 1000);

		sessions = [
			...sessions,
			{
				startDate: now,
				endDate: endTime,
				location: "",
				points: 0,
			},
		];
	}

	// Termin entfernen
	function removeSession(index: number) {
		sessions = sessions.filter((_, i) => i !== index);
	}

	// Formular absenden
	async function handleSubmit() {
		let createdCourse = await PB.instance.collection("course").create({
			title: title,
			shortdescription: shortDescription,
			description: description,
			category: category,
			creator: PB.instance.authStore.record?.id,
		});

		let createdSessions;

		sessions.forEach(async (session) => {
			returnedSession =await PB.instance.collection("schedule").create(
				{
					course: createdCourse.id,
					startDateTime: new Date(session.startDate),
					endDateTime: new Date(session.endDate),
					points: session.points,
					location: session.location,
				},
				{ requestKey: null },
			);

			createdSessions.push(returnedSession);
		});

		courses = [...courses, toCourse(createdCourse)];
	}
</script>

<Card class="w-full max-w-2xl mx-auto">
	<CardHeader>
		<CardTitle>Von dir erstellte oder verwaltete Kurse</CardTitle>
	</CardHeader>
	<CardContent>
		<Dialog bind:open={dialogIsOpen}>
			<DialogTrigger>
				<Button class="w-full bg-[#e30613]">
					<CirclePlus class="w-4 h-4 mr-2" />
					Erstelle einen neuen Kurs
				</Button>
			</DialogTrigger>
			<DialogContent class="sm:max-w-[500px]">
				<form
					onsubmit={(e) => {
						e.preventDefault();
						handleSubmit();

						dialogIsOpen = false;
					}}
					class="space-y-6"
				>
					<div class="space-y-4">
						<h2 class="text-lg font-semibold">
							Neuen Kurs erstellen
						</h2>

						<!-- Kursdetails -->
						<div class="space-y-4">
							<div class="space-y-2">
								<Label for="title">Titel</Label>
								<Input
									id="title"
									bind:value={title}
									placeholder="Kurstitel eingeben"
								/>
							</div>

							<div class="space-y-2">
								<Label for="shortDescription"
									>Kurzbeschreibung</Label
								>
								<Input
									id="shortDescription"
									bind:value={shortDescription}
									placeholder="Kurze Beschreibung eingeben"
								/>
							</div>

							<div class="space-y-2">
								<Label for="description">Beschreibung</Label>
								<Textarea
									id="description"
									bind:value={description}
									placeholder="Ausführliche Beschreibung eingeben"
								/>
							</div>

							<div class="space-y-2">
								<Label>Kategorie</Label>
								<Select
									onSelectedChange={(value) =>
										value &&
										(category = value.value as string)}
								>
									<SelectTrigger>{category}</SelectTrigger>
									<SelectContent>
										<SelectItem value="Ausbildung"
											>Ausbildung</SelectItem
										>
										<SelectItem value="Fortbildung"
											>Fortbildung</SelectItem
										>
										<SelectItem value="Training"
											>Training</SelectItem
										>
										<SelectItem value="Tagung"
											>Tagung</SelectItem
										>
										<SelectItem value="Online"
											>Online</SelectItem
										>
									</SelectContent>
								</Select>
							</div>
						</div>

						<!-- Termine -->
						<div class="space-y-4">
							<div class="flex items-center justify-between">
								<h3 class="text-lg font-semibold">Termine</h3>
								<Button
									type="button"
									variant="outline"
									onclick={addSession}
								>
									<Plus class="size-4 mr-2" />
									Termin hinzufügen
								</Button>
							</div>

							{#if sessions.length === 0}
								<p class="text-muted-foreground text-sm">
									Noch keine Termine hinzugefügt
								</p>
							{/if}

							{#each sessions as session, index}
								<div
									class="space-y-4 p-4 border rounded-lg relative"
								>
									<Button
										type="button"
										variant="ghost"
										onclick={() => removeSession(index)}
										class="absolute right-2 top-2"
									>
										<Trash2Icon
											class="size-4 text-destructive"
										/>
									</Button>

									<div class="space-y-4">
										<div
											class="grid grid-cols-1 md:grid-cols-2 gap-4"
										>
											<div class="space-y-2">
												<Label for="startDate-{index}"
													>Startdatum</Label
												>
												<Input
													id="startDate-{index}"
													type="datetime-local"
													bind:value={session.startDate}
												/>
											</div>
											<div class="space-y-2">
												<Label for="endDate-{index}"
													>Enddatum</Label
												>
												<Input
													id="endDate-{index}"
													type="datetime-local"
													bind:value={session.endDate}
												/>
											</div>
										</div>

										<div
											class="grid grid-cols-1 md:grid-cols-2 gap-4"
										>
											<div class="space-y-2">
												<Label for="location-{index}"
													>Ort</Label
												>
												<Input
													id="location-{index}"
													bind:value={session.location}
													placeholder="Ort eingeben"
												/>
											</div>
											<div class="space-y-2">
												<Label for="points-{index}"
													>Punktzahl</Label
												>
												<Input
													id="points-{index}"
													type="number"
													bind:value={session.points}
													min="0"
												/>
											</div>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</div>

					<div class="flex justify-end gap-2">
						<Button type="submit">Kurs erstellen</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>

		<div class="my-5">
			{#each Object.entries(groupedCourses).sort(([a], [b]) => b - a) as [year, yearCourses]}
				<div class="mb-4">
					<h4 class="text-md font-semibold mb-2">{year}</h4>
					<Separator class="mb-2" />
					<ul class="space-y-4">
						{#each yearCourses as course}

							<li class="flex flex-col p-3 bg-secondary rounded-lg">
								<a href="/course/{course.id}">
									<div class="flex items-center justify-between">
										<div class="flex items-center space-x-4">
											<div class="p-2 bg-primary rounded-full">
												<Code class="w-5 h-5 text-primary-foreground" />
											</div>
											<div>
												<h3 class="font-semibold">{course.title}</h3>
												<p class="text-sm text-muted-foreground">{course.shortDescription}</p>
											</div>
										</div>
									</div>
									<div class="mt-2 flex flex-wrap gap-2">
										<Badge variant="secondary" class="flex items-center">
											<Tag class="w-3 h-3 mr-1" />
											{course.category}
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
