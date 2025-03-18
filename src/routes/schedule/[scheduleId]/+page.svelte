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
        Map,
		
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

	let availableOrganizers = $state<Array<User>>([]);
	let schedule = $state<Schedule>(emptySchedule);

	// Edit mode state
	let isEditing: boolean = $state(false);

	// New organizer states
	let showAddOrganizer: boolean = $state(false);
	let selectedOrganizerId: any = $state("");

	// Temporary states for editing
	let editedStartDate: string = $state("");
	let editedEndDate: string = $state("");
	let editedScore: number = $state(0);
	let editedLocation: string = $state("");

	let schedules: Array<Schedule & { isEditing: boolean }> = $state([]);
	let user: User = $state(emptyUser);

	onMount(async () => {
		user = PB.getCurrentUser();
		const readSchedule = await PB.getSchedule($page.params.scheduleId);
		schedule = readSchedule;

		schedules = (await PB.getSchedules(readSchedule.course.id)).map(
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
		editedStartDate =
			schedule?.startDateTime.toISOString().slice(0, 16) ?? "";
		editedEndDate = schedule?.endDateTime.toISOString().slice(0, 16) ?? "";
		editedScore = schedule?.points ?? 0;
		isEditing = true;
	};

	/** Save edited course data */
	const saveChanges = async () => {
		const updatedSchedule = {
			startDateTime: new Date(editedStartDate),
			endDateTime: new Date(editedEndDate),
			location: editedLocation,
			points: editedScore,
		};

		const returnedSchedule = await PB.instance
			.collection("schedule")
			.update(schedule.id, updatedSchedule);

		schedule.startDateTime = returnedSchedule.startDateTime;
		schedule.endDateTime = returnedSchedule.endDateTime;
		schedule.location = returnedSchedule.location;
		schedule.points = returnedSchedule.points;

		isEditing = false;
	};

	/** Remove participant from course */
	const removeParticipant = (userId: string) => {
		schedule.participants = schedule.participants?.filter(
			(p) => p.id !== userId,
		);

		PB.instance.collection("schedule").update(schedule.id, {
			attendees: schedule.participants,
		});
	};

	/** Remove organizer from course */
	const removeOrganizer = (userId: string) => {
		schedule.organizers = schedule.organizers?.filter((o) => o.id !== userId);

		PB.instance.collection("schedule").update(schedule.id, {
			organizers: schedule.organizers,
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
				!schedule.organizers?.some((o) => o.id === organizer.id)
			) {
				schedule.organizers = [...(schedule.organizers ?? []), organizer];

				console.log("Updated organizers:", schedule.organizers);
				PB.instance.collection("schedule").update(schedule.id, {
					organizers: schedule.organizers.map((o) => o.id),
				});
			}
			selectedOrganizerId = "";
			showAddOrganizer = false;
		}
	};

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
				<h1 class="text-2xl font-bold">{schedule?.course.title}</h1>
				{#if isPrivilegedEnough(user?.role, "Moderator")}
					<Button onclick={startEditing} variant="outline"
						>Bearbeiten</Button
					>
				{/if}
			{:else}
				<h1 class="text-2xl font-bold">Termin bearbeiten</h1>
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
				<div class="grid gap-4 md:grid-cols-2">
					<div class="space-y-2">
						<Label for="startDate">Startdatum</Label>
						<Input
							id="startDate"
							type="datetime-local"
							bind:value={editedStartDate}
						/>
					</div>

					<div class="space-y-2">
						<Label for="endDate">Enddatum</Label>
						<Input
							id="endDate"
							type="datetime-local"
							bind:value={editedEndDate}
						/>
					</div>
				</div>

				<div class="space-y-2">
					<Label for="score">Punktzahl</Label>
					<Input id="score" type="number" bind:value={editedScore} />
				</div>

				<div class="space-y-2">
					<Label for="location">Ort</Label>
					<Input id="location" type="text" bind:value={editedLocation} />
				</div>
			</div>
		{:else}
			<div class="space-y-6" transition:fade>
				<!-- Course Info -->
				<div class="space-y-2">
					<p class="text-lg font-medium">
						{schedule?.course.shortDescription}
					</p>
					<p class="text-muted-foreground">
						{schedule?.course.description}
					</p>
				</div>

				<!-- Location -->
				<div class="space-y-2">
					<h2 class="flex items-center gap-2 text-lg font-semibold">
						<MapPin class="h-5 w-5" />
						Ort
					</h2>
					<div class="flex items-center gap-2">
						<span>{schedule?.location}</span>
					</div>
				</div>

				<!-- Dates -->
				<div class="grid gap-4 md:grid-cols-2">
					<div class="flex items-center gap-2">
						<Calendar class="h-5 w-5 text-muted-foreground" />
						<div>
							<p class="font-medium">Startdatum</p>
							<p class="text-sm text-muted-foreground">
								{formatDate(
									schedule?.startDateTime.toString() ?? "",
								)}
							</p>
						</div>
					</div>
					<div class="flex items-center gap-2">
						<Clock class="h-5 w-5 text-muted-foreground" />
						<div>
							<p class="font-medium">Enddatum</p>
							<p class="text-sm text-muted-foreground">
								{formatDate(
									schedule?.endDateTime.toString() ?? "",
								)}
							</p>
						</div>
					</div>
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
								src={schedule.course.creator?.name}
								alt={schedule.course.creator?.name}
							/>
							<AvatarFallback
								>{schedule?.course.creator
									?.name[0]}</AvatarFallback
							>
						</Avatar>
						<span>{schedule?.course.creator?.name}</span>
					</div>
				</div>

				<!-- Organizers -->
				<div class="space-y-4">
					<div class="flex items-center justify-between">
						<h2
							class="flex items-center gap-2 text-lg font-semibold"
						>
							<Users class="h-5 w-5" />
							Organisatoren
						</h2>
						<Button
							variant="outline"
							size="sm"
							onclick={() => (showAddOrganizer = true)}
						>
							<Plus class="mr-2 h-4 w-4" />
							Organisator hinzufügen
						</Button>
					</div>

					{#if showAddOrganizer}
						<div class="flex items-center gap-2" transition:slide>
							<Select bind:selected={selectedOrganizerId}>
								<SelectTrigger class="max-w-xs">
									<SelectValue
										placeholder="Organisator auswählen"
									/>
								</SelectTrigger>
								<SelectContent>
									{#each availableOrganizers as organizer}
										{#if !schedule.organizers?.some((o) => o.id === organizer.id)}
											<SelectItem value={organizer.id}
												>{organizer.name}</SelectItem
											>
										{/if}
									{/each}
								</SelectContent>
							</Select>
							<Button onclick={addOrganizer} size="sm"
								>Hinzufügen</Button
							>
							<Button
								variant="outline"
								size="sm"
								onclick={() => {
									showAddOrganizer = false;
									selectedOrganizerId = "";
								}}
							>
								Abbrechen
							</Button>
						</div>
					{/if}

					<div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
						{#each schedule?.organizers ?? [] as organizer}
							<div
								class="flex items-center justify-between gap-2 rounded-lg border p-2"
								transition:slide
							>
								<div class="flex items-center gap-2">
									<Avatar>
										<AvatarImage
											src={organizer.name}
											alt={organizer.name}
										/>
										<AvatarFallback
											>{organizer.name[0]}</AvatarFallback
										>
									</Avatar>
									<span>{organizer.name}</span>
								</div>
								<Button
									variant="ghost"
									size="icon"
									onclick={() =>
										removeOrganizer(organizer.id)}
								>
									<Trash2 class="h-4 w-4 text-destructive" />
								</Button>
							</div>
						{/each}
					</div>
				</div>

				<!-- Participants -->
				<div class="space-y-2">
					<h2 class="flex items-center gap-2 text-lg font-semibold">
						<Users class="h-5 w-5" />
						Teilnehmer
					</h2>
					<div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
						{#each schedule?.participants ?? [] as participant}
							<div
								class="flex items-center justify-between gap-2 rounded-lg border p-2"
								transition:slide
							>
								<div class="flex items-center gap-2">
									<Avatar>
										<AvatarImage
											src={participant.name}
											alt={participant.name}
										/>
										<AvatarFallback
											>{participant
												.name[0]}</AvatarFallback
										>
									</Avatar>
									<span>{participant.name}</span>
								</div>
								<Button
									variant="ghost"
									size="icon"
									onclick={() =>
										removeParticipant(participant.id)}
								>
									<Trash2 class="h-4 w-4 text-destructive" />
								</Button>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}
	</CardContent>
</Card>
