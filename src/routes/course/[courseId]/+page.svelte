<script lang="ts">
	import { page } from "$app/stores";
	import { fade, slide } from "svelte/transition";
	import { Button } from "$lib/components/ui/button";
	import {
		Card,
		CardContent,
		CardFooter,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Textarea } from "$lib/components/ui/textarea";
	import {
		Avatar,
		AvatarFallback,
		AvatarImage,
	} from "$lib/components/ui/avatar";
	import {
		Calendar,
		Clock,
		Users,
		UserCircle,
		Trash2,
		Plus,
		Trash2Icon,
		PencilIcon,
		CalendarIcon,
        ClockIcon,
        StarIcon,
        Check,
        MapPin,
		
	} from "lucide-svelte";
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
		SelectValue,
	} from "$lib/components/ui/select";
	import { onMount } from "svelte";
	import { PB } from "@/lib/stores/pocketbase.svelte";
	import { emptySchedule, type Schedule } from "@/lib/types/Schedule";
	import type { User } from "@/lib/types/User";

	let availableOrganizers = $state<Array<User>>([]);
	let courses = $state<Schedule>(emptySchedule);

	// Edit mode state
	let isEditing: boolean = $state(false);

	// New organizer states
	let showAddOrganizer: boolean = $state(false);
	let selectedOrganizerId: any = $state("");

	// Temporary states for editing
	let editedTitle: string = $state("");
	let editedShortDesc: string = $state("");
	let editedDesc: string = $state("");
	let editedStartDate: string = $state("");
	let editedEndDate: string = $state("");
	let editedScore: number = $state(0);

	let schedules: Array<Schedule & { isEditing: boolean }> = $state([]);

	onMount(async () => {
		const course = await PB.getSchedule($page.params.courseId);
		courses = course;

		schedules = (await PB.getSchedules(course.course.id)).map(
			(schedule) => ({
				...schedule,
				isEditing: false,
			}),
		);

		availableOrganizers = await PB.instance
			.collection("users")
			.getFullList();
	});

	/** Initialize edit form */
	const startEditing = () => {
		editedTitle = courses?.course.title ?? "";
		editedShortDesc = courses?.course.shortDescription ?? "";
		editedDesc = courses?.course.description ?? "";
		editedStartDate =
			courses?.startDateTime.toISOString().slice(0, 16) ?? "";
		editedEndDate = courses?.endDateTime.toISOString().slice(0, 16) ?? "";
		editedScore = courses?.points ?? 0;
		isEditing = true;
	};

	/** Save edited course data */
	const saveChanges = async () => {
		const updatedCourse = {
			title: editedTitle,
			shortdescription: editedShortDesc,
			description: editedDesc,
		};
		const updatedSchedule = {
			startDateTime: new Date(editedStartDate),
			endDateTime: new Date(editedEndDate),
			points: editedScore,
		};

		const returnedSchedule = await PB.instance
			.collection("schedule")
			.update(courses.id, updatedSchedule);
		const returnedCourse = await PB.instance
			.collection("course")
			.update(courses?.course.id ?? "", updatedCourse);

		console.log("Updated course:", returnedCourse);
		console.log("Updated schedule:", returnedSchedule);

		courses.course.title = returnedCourse.title;
		courses.course.shortDescription = returnedCourse.shortdescription;
		courses.course.description = returnedCourse.description;
		courses.startDateTime = returnedSchedule.startDateTime;
		courses.endDateTime = returnedSchedule.endDateTime;
		courses.points = returnedSchedule.points;

		isEditing = false;
	};

	/** Remove participant from course */
	const removeParticipant = (userId: string) => {
		courses.participants = courses.participants?.filter(
			(p) => p.id !== userId,
		);

		PB.instance.collection("schedule").update(courses.id, {
			attendees: courses.participants,
		});
	};

	/** Remove organizer from course */
	const removeOrganizer = (userId: string) => {
		courses.organizers = courses.organizers?.filter((o) => o.id !== userId);

		PB.instance.collection("schedule").update(courses.id, {
			organizers: courses.organizers,
		});
	};

	/** Add new organizer */
	const addOrganizer = () => {
		if (selectedOrganizerId) {
			const organizer = availableOrganizers.find(
				(o) => o.id === selectedOrganizerId.value,
			);
			if (
				organizer &&
				!courses.organizers?.some((o) => o.id === organizer.id)
			) {
				courses.organizers = [...(courses.organizers ?? []), organizer];

				console.log("Updated organizers:", courses.organizers);
				PB.instance.collection("schedule").update(courses.id, {
					organizers: courses.organizers.map((o) => o.id),
				});
			}
			selectedOrganizerId = "";
			showAddOrganizer = false;
		}
	};

	// Termin entfernen
	function removeSchedule(schedule: Schedule) {
		schedules = schedules.filter((s) => s.id !== schedule.id);

		PB.instance.collection("schedule").delete(schedule.id);
	}

	// Neuen Termin hinzufügen
	async function addSchedule() {
		const now = new Date();
		// Setze Standardendzeit auf 2 Stunden nach Startzeit
		const endTime = new Date(now.getTime() + 2 * 60 * 60 * 1000);

		let addedSchedule = await PB.instance.collection("schedule").create({
			location: "",
			points: 0,
			course: `${courses.course.id}`,
    		startDateTime: now,
			endDateTime: endTime
		});

		let tmpSchedule = emptySchedule
		tmpSchedule.id = addedSchedule.id;
		tmpSchedule.course = courses.course;
		tmpSchedule.startDateTime = now;
		tmpSchedule.endDateTime = endTime;

		schedules = [
			...schedules,
			{
				...tmpSchedule,
				isEditing: false
			}
			,
		];
	}

	function saveSchedule(schedule: Schedule & { isEditing: boolean }) {
		schedule.isEditing = false;
		PB.instance.collection("schedule").update(schedule.id, {
			location: schedule.location,
			points: schedule.points,
			startDateTime: new Date(schedule.startDateTime),
			endDateTime: new Date(schedule.endDateTime),
		});
	}

	/** Format date to local string */
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleString("de-DE", {
			dateStyle: "medium",
			timeStyle: "short",
		});
	};
</script>

<Card class="w-full">
	<CardHeader>
		<CardTitle class="flex items-center justify-between">
			{#if !isEditing}
				<h1 class="text-2xl font-bold">{courses?.course.title}</h1>
				<Button onclick={startEditing} variant="outline"
					>Bearbeiten</Button
				>
			{:else}
				<h1 class="text-2xl font-bold">Kurs bearbeiten</h1>
				<div class="space-x-2">
					<Button
						onclick={() => (isEditing = false)}
						variant="outline">Abbrechen</Button
					>
					<Button onclick={saveChanges}>Speichern</Button>
				</div>
			{/if}
		</CardTitle>
	</CardHeader>

	<CardContent class="space-y-6">
		{#if isEditing}
			<div class="space-y-4" transition:fade>
				<div class="space-y-2">
					<Label for="title">Titel</Label>
					<Input id="title" bind:value={editedTitle} />
				</div>

				<div class="space-y-2">
					<Label for="shortDesc">Kurzbeschreibung</Label>
					<Input id="shortDesc" bind:value={editedShortDesc} />
				</div>

				<div class="space-y-2">
					<Label for="desc">Beschreibung</Label>
					<Textarea id="desc" bind:value={editedDesc} />
				</div>
			</div>
		{:else}
			<div class="space-y-6" transition:fade>
				<!-- Course Info -->
				<div class="space-y-2">
					<p class="text-lg font-medium">
						{courses?.course.shortDescription}
					</p>
					<p class="text-muted-foreground">
						{courses?.course.description}
					</p>
				</div>

				<!-- Creator -->
				<div class="space-y-2">
					<h2 class="flex items-center gap-2 text-lg font-semibold">
						<UserCircle class="h-5 w-5" />
						Kursersteller
					</h2>
					<div class="flex items-center gap-2">
						<Avatar>
							<AvatarImage
								src={courses.course.creator?.name}
								alt={courses.course.creator?.name}
							/>
							<AvatarFallback
								>{courses?.course.creator
									?.name[0]}</AvatarFallback
							>
						</Avatar>
						<span>{courses?.course.creator?.name}</span>
					</div>
				</div>

				<!-- Termine -->
				<div class="space-y-4">
					<div class="flex items-center justify-between">
						<h3 class="text-lg font-semibold">Termine</h3>
						<Button
							type="button"
							variant="outline"
							onclick={addSchedule}
						>
							<Plus class="size-4 mr-2" />
							Termin hinzufügen
						</Button>
					</div>

					{#if schedules.length === 0}
						<p class="text-muted-foreground text-sm">
							Noch keine Termine hinzugefügt
						</p>
					{/if}

					{#each schedules as session, index}
						{#if session.isEditing}
							<div
								class="space-y-4 p-4 border rounded-lg relative"
							>
								<div class="absolute right-2 top-2 flex items-center gap-1">
									<Button
										type="button"
										variant="ghost"
										onclick={() => removeSchedule(session)}
									>
										<Trash2Icon
											class="size-4 text-destructive"
										/>
									</Button>
									<Button
										type="button"
										variant="ghost"
										onclick={() => saveSchedule(session)}
									>
										<Check class="size-4 text-green-500" />
									</Button>
								</div>

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
												value={session.startDateTime.toISOString().slice(0, 16) ?? ""}
												oninput={(e : any) => session.startDateTime = new Date(e.target?.value)}
											/>
										</div>
										<div class="space-y-2">
											<Label for="endDate-{index}"
												>Enddatum</Label
											>
											<Input
												id="endDate-{index}"
												type="datetime-local"
												bind:value={session.endDateTime}
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
						{:else}
						<Card class="w-full hover:shadow-lg transition-shadow">
							<CardContent class="p-6">
								<div class="flex items-start justify-between gap-4">
									<!-- Ort -->
									<div class="flex items-center gap-2 text-muted-foreground">
										<MapPin class="size-4" />
										<span>{session.location}</span>
									</div>

									<!-- StartZeit -->
									<div class="flex flex-row gap-3">
										<!-- Datum -->
										<div class="flex items-center gap-2 text-muted-foreground">
											<CalendarIcon class="size-4" />
											<span class="font-medium">{new Intl.DateTimeFormat('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(session.startDateTime))}</span>
										</div>
						
										<!-- Uhrzeiten -->
										<div class="flex items-center gap-2 text-muted-foreground">
											<ClockIcon class="size-4" />
											<span>{new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(session.startDateTime))} Uhr</span>
										</div>
									</div>

									<!-- Endzeit -->
									<div class="flex flex-row gap-3">
										<!-- Datum -->
										<div class="flex items-center gap-2 text-muted-foreground">
											<CalendarIcon class="size-4" />
											<span class="font-medium">{new Intl.DateTimeFormat('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(session.endDateTime))}</span>
										</div>
						
										<!-- Uhrzeiten -->
										<div class="flex items-center gap-2 text-muted-foreground">
											<ClockIcon class="size-4" />
											<span>{new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(session.endDateTime))} Uhr</span>
										</div>
									</div>
						
									<div class="flex items-center gap-2">
										<!-- Punkte -->
										<div class="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full">
											<StarIcon class="size-4" />
											<span class="font-medium">{session.points} Punkte</span>
										</div>
						
										<!-- Edit Button -->
										<Button variant="ghost" size="icon" class="size-9" onclick={() => session.isEditing = true}>
											<PencilIcon class="size-4" />
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
						{/if}
					{/each}
				</div>
			</div>
		{/if}
	</CardContent>
</Card>
