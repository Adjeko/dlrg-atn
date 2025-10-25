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
		QrCodeIcon,
        ArrowRightIcon,
		
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
	import { emptyUser, isPrivilegedEnough, type User } from "@/lib/types/User";
	import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/lib/components/ui/dialog";
	import QrCode from "svelte-qrcode"
	import { emptyCourse, type Course } from "@/lib/types/Course";

	let availableOrganizers = $state<Array<User>>([]);
	let course = $state<Course>(emptyCourse);

	// Edit mode state
	let isEditing: boolean = $state(false);

	// New organizer states
	let showAddOrganizer: boolean = $state(false);
	let selectedOrganizerId: any = $state("");

	// Temporary states for editing
	let editedTitle: string = $state("");
	let editedShortDesc: string = $state("");
	let editedDesc: string = $state("");
	
	let schedules: Array<Schedule & { isEditing: boolean }> = $state([]);

	let user: User = $state(emptyUser);

	onMount(async () => {
		user = PB.getCurrentUser();
		const returnedCourse : Course = await PB.getCourse($page.params.courseId);
		course = returnedCourse;

		schedules = (await PB.getSchedules(course.id)).map(
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
		editedTitle = course.title ?? "";
		editedShortDesc = course.shortDescription ?? "";
		editedDesc = course.description ?? "";
		isEditing = true;
	};

	/** Save edited course data */
	const saveChanges = async () => {
		const updatedCourse = {
			title: editedTitle,
			shortdescription: editedShortDesc,
			description: editedDesc,
		};
		
		const returnedCourse = await PB.instance
			.collection("course")
			.update(course.id ?? "", updatedCourse);

		console.log("Updated course:", returnedCourse);

		course.title = returnedCourse.title;
		course.shortDescription = returnedCourse.shortdescription;
		course.description = returnedCourse.description;
		isEditing = false;
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
			course: `${course.id}`,
			startDateTime: now,
			endDateTime: endTime
		});

		let tmpSchedule = emptySchedule
		tmpSchedule.id = addedSchedule.id;
		tmpSchedule.course = course;
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
</script>

<Card class="w-full">
	<CardHeader>
		<CardTitle class="flex items-center justify-between">
			{#if !isEditing}
				<h1 class="text-2xl font-bold">{course.title}</h1>
				{#if isPrivilegedEnough(user?.role, "Moderator")}
					<Button onclick={startEditing} variant="outline"
						>Bearbeiten</Button
					>
				{/if}
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
						{course.shortDescription}
					</p>
					<p class="text-muted-foreground">
						{course.description}
					</p>
				</div>

				<!-- Creator -->
				<div class="space-y-2">
					<h2 class="flex items-center gap-2 text-lg font-semibold">
						<!-- <UserCircle class="h-5 w-5" /> -->
						Kursersteller
					</h2>
					<div class="flex items-center gap-2">
						<Avatar>
							<AvatarImage
								src={course.creator?.name}
								alt={course.creator?.name}
							/>
							<AvatarFallback
								>{course.creator
									?.name[0]}</AvatarFallback
							>
						</Avatar>
						<span>{course.creator?.name}</span>
					</div>
				</div>

				<!-- Termine -->
				<div class="space-y-4">
					<div class="flex items-center justify-between">
						<h3 class="text-lg font-semibold">Termine</h3>
						{#if isPrivilegedEnough(user?.role, "Moderator")}
							<Button
								type="button"
								variant="outline"
								onclick={addSchedule}
							>
								<Plus class="size-4 mr-2" />
								Termin hinzufügen
							</Button>
						{/if}
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
											class="size-4 text-[#e30613]"
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
												value={session.endDateTime.toISOString().slice(0, 16) ?? ""}
												oninput={(e : any) => session.endDateTime = new Date(e.target?.value)}
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
								<div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
									<!-- Ort -->
									<div class="flex items-center gap-2 text-muted-foreground min-w-0">
										<MapPin class="size-4 shrink-0" />
										<span class="truncate">{session.location}</span>
									</div>

									<!-- StartZeit -->
									<div class="flex flex-row gap-3 min-w-0">
										<!-- Datum -->
										<div class="flex items-center gap-2 text-muted-foreground">
											<CalendarIcon class="size-4 shrink-0" />
											<span class="font-medium truncate">{new Intl.DateTimeFormat('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(session.startDateTime))}</span>
										</div>
							
										<!-- Uhrzeiten -->
										<div class="flex items-center gap-2 text-muted-foreground">
											<ClockIcon class="size-4 shrink-0" />
											<span>{new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(session.startDateTime))} Uhr</span>
										</div>
									</div>

									<!-- Endzeit -->
									<div class="flex flex-row gap-3 min-w-0">
										<!-- Datum -->
										<div class="flex items-center gap-2 text-muted-foreground">
											<CalendarIcon class="size-4 shrink-0" />
											<span class="font-medium truncate">{new Intl.DateTimeFormat('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(session.endDateTime))}</span>
										</div>
							
										<!-- Uhrzeiten -->
										<div class="flex items-center gap-2 text-muted-foreground">
											<ClockIcon class="size-4 shrink-0" />
											<span>{new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(session.endDateTime))} Uhr</span>
										</div>
									</div>
							
									<!-- QR-Code -->
									<div class="flex items-center gap-2">
										<Dialog>
											<DialogTrigger>
												<Button>
													<QrCodeIcon class="mr-2 h-4 w-4" />
													QR Code anzeigen
												</Button>
											</DialogTrigger>
											<DialogContent>
												<DialogHeader>
													<DialogTitle>QR Code</DialogTitle>
												</DialogHeader>
												<div class="flex items-center justify-center p-4">
													<div class="h-96 w-96 rounded-lg bg-muted">
														<QrCode value={session.id} size={384} />
													</div>
												</div>
											</DialogContent>
										</Dialog>
									 </div>

									<div class="flex items-center gap-2">
										<!-- Punkte -->
										<div class="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full">
											<StarIcon class="size-4" />
											<span class="font-medium">{session.points} Punkte</span>
										</div>
						
									   <!-- Edit Button -->
									   {#if isPrivilegedEnough(user?.role, "Moderator")}
										   <Button variant="ghost" size="icon" class="size-9" onclick={() => session.isEditing = true}>
											   <PencilIcon class="size-4" />
										   </Button>
									   {/if}
									   <a href={`/schedule/${session.id}`}>
										   <Button variant="ghost" size="icon" class="size-9" title="Zur Session navigieren">
											   <ArrowRightIcon class="size-4" />
										   </Button>
										</a>
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
