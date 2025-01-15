<script lang="ts">
	import { fade, slide } from "svelte/transition";
	import { Button } from "$lib/components/ui/button";
	import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Textarea } from "$lib/components/ui/textarea";
	import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar";
	import { Calendar, Clock, Users, UserCircle, Trash2, Plus } from "lucide-svelte";
	import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "$lib/components/ui/select";

	// Course data passed as prop
	let course = $state({
		id: "1",
		title: "Einführung in die Webentwicklung",
		shortDescription: "Grundlagen der modernen Webentwicklung",
		description: "In diesem Kurs lernen Sie die Grundlagen der Webentwicklung kennen. Wir behandeln HTML, CSS und JavaScript.",
		startDate: "2024-02-01T09:00",
		endDate: "2024-05-30T17:00",
		score: 100,
		creator: {
			id: "1",
			name: "Dr. Schmidt",
			avatar: "$assets/ui-user.png",
		},
		organizers: [
			{ id: "2", name: "Anna Meyer", avatar: "$assets/ui-user.png" },
			{ id: "3", name: "Max Weber", avatar: "$assets/ui-user.png" },
		],
		participants: [
			{ id: "4", name: "Lisa Müller", avatar: "$assets/ui-user.png" },
			{ id: "5", name: "Tom Fischer", avatar: "$assets/ui-user.png" },
			{ id: "6", name: "Sarah Koch", avatar: "$assets/ui-user.png" },
		],
	});

    const availableOrganizers = [
	{
		id: "org1",
		name: "Julia Wagner",
		avatar: "$assets/ui-user.png",
	},
	{
		id: "org2",
		name: "Michael Bauer",
		avatar: "$assets/ui-user.png",
	},
	{
		id: "org3",
		name: "Sophie Klein",
		avatar: "$assets/ui-user.png",
	},
	{
		id: "org4",
		name: "David Hoffmann",
		avatar: "$assets/ui-user.png",
	},
	{
		id: "org5",
		name: "Emma Schneider",
		avatar: "$assets/ui-user.png",
	},
    ];
    
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

	/** Initialize edit form */
	const startEditing = () => {
		editedTitle = course.title;
		editedShortDesc = course.shortDescription;
		editedDesc = course.description;
		editedStartDate = course.startDate;
		editedEndDate = course.endDate;
		editedScore = course.score;
		isEditing = true;
	};

	/** Save edited course data */
	const saveChanges = () => {
		course = {
			...course,
			title: editedTitle,
			shortDescription: editedShortDesc,
			description: editedDesc,
			startDate: editedStartDate,
			endDate: editedEndDate,
			score: editedScore,
		};
		isEditing = false;
	};

	/** Remove participant from course */
	const removeParticipant = (userId: string) => {
		course.participants = course.participants.filter((p) => p.id !== userId);
	};

	/** Remove organizer from course */
	const removeOrganizer = (userId: string) => {
		course.organizers = course.organizers.filter((o) => o.id !== userId);
	};

	/** Add new organizer */
	const addOrganizer = () => {
		if (selectedOrganizerId) {
            const organizer = availableOrganizers.find((o) => o.id === selectedOrganizerId.value);
            if (organizer && !course.organizers.some((o) => o.id === organizer.id)) {
                console.log("HI")
				course.organizers = [...course.organizers, organizer];
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
				<h1 class="text-2xl font-bold">{course.title}</h1>
				<Button onclick={startEditing} variant="outline">Bearbeiten</Button>
			{:else}
				<h1 class="text-2xl font-bold">Kurs bearbeiten</h1>
				<div class="space-x-2">
					<Button onclick={() => (isEditing = false)} variant="outline">Abbrechen</Button>
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

				<div class="grid gap-4 md:grid-cols-2">
					<div class="space-y-2">
						<Label for="startDate">Startdatum</Label>
						<Input id="startDate" type="datetime-local" bind:value={editedStartDate} />
					</div>

					<div class="space-y-2">
						<Label for="endDate">Enddatum</Label>
						<Input id="endDate" type="datetime-local" bind:value={editedEndDate} />
					</div>
				</div>

				<div class="space-y-2">
					<Label for="score">Punktzahl</Label>
					<Input id="score" type="number" bind:value={editedScore} />
				</div>
			</div>
		{:else}
			<div class="space-y-6" transition:fade>
				<!-- Course Info -->
				<div class="space-y-2">
					<p class="text-lg font-medium">{course.shortDescription}</p>
					<p class="text-muted-foreground">{course.description}</p>
				</div>

				<!-- Dates -->
				<div class="grid gap-4 md:grid-cols-2">
					<div class="flex items-center gap-2">
						<Calendar class="h-5 w-5 text-muted-foreground" />
						<div>
							<p class="font-medium">Startdatum</p>
							<p class="text-sm text-muted-foreground">{formatDate(course.startDate)}</p>
						</div>
					</div>
					<div class="flex items-center gap-2">
						<Clock class="h-5 w-5 text-muted-foreground" />
						<div>
							<p class="font-medium">Enddatum</p>
							<p class="text-sm text-muted-foreground">{formatDate(course.endDate)}</p>
						</div>
					</div>
				</div>

				<!-- Score -->
				<div class="flex items-center gap-2">
					<p class="font-medium">Punktzahl:</p>
					<span class="rounded-full bg-primary/10 px-2 py-1 text-sm font-medium text-primary">
						{course.score} Punkte
					</span>
				</div>

				<!-- Creator -->
				<div class="space-y-2">
					<h2 class="flex items-center gap-2 text-lg font-semibold">
						<UserCircle class="h-5 w-5" />
						Ersteller
					</h2>
					<div class="flex items-center gap-2">
						<Avatar>
							<AvatarImage src={course.creator.avatar} alt={course.creator.name} />
							<AvatarFallback>{course.creator.name[0]}</AvatarFallback>
						</Avatar>
						<span>{course.creator.name}</span>
					</div>
				</div>

				<!-- Organizers -->
				<div class="space-y-4">
					<div class="flex items-center justify-between">
						<h2 class="flex items-center gap-2 text-lg font-semibold">
							<Users class="h-5 w-5" />
							Organisatoren
						</h2>
						<Button variant="outline" size="sm" onclick={() => (showAddOrganizer = true)}>
							<Plus class="mr-2 h-4 w-4" />
							Organisator hinzufügen
						</Button>
					</div>

					{#if showAddOrganizer}
						<div class="flex items-center gap-2" transition:slide>
							<Select bind:selected={selectedOrganizerId}>
								<SelectTrigger class="max-w-xs">
									<SelectValue placeholder="Organisator auswählen" />
								</SelectTrigger>
								<SelectContent>
									{#each availableOrganizers as organizer}
										{#if !course.organizers.some((o) => o.id === organizer.id)}
											<SelectItem value={organizer.id}>{organizer.name}</SelectItem>
										{/if}
									{/each}
								</SelectContent>
							</Select>
							<Button onclick={addOrganizer} size="sm">Hinzufügen</Button>
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
						{#each course.organizers as organizer}
							<div class="flex items-center justify-between gap-2 rounded-lg border p-2" transition:slide>
								<div class="flex items-center gap-2">
									<Avatar>
										<AvatarImage src={organizer.avatar} alt={organizer.name} />
										<AvatarFallback>{organizer.name[0]}</AvatarFallback>
									</Avatar>
									<span>{organizer.name}</span>
								</div>
								<Button variant="ghost" size="icon" onclick={() => removeOrganizer(organizer.id)}>
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
						{#each course.participants as participant}
							<div class="flex items-center justify-between gap-2 rounded-lg border p-2" transition:slide>
								<div class="flex items-center gap-2">
									<Avatar>
										<AvatarImage src={participant.avatar} alt={participant.name} />
										<AvatarFallback>{participant.name[0]}</AvatarFallback>
									</Avatar>
									<span>{participant.name}</span>
								</div>
								<Button variant="ghost" size="icon" onclick={() => removeParticipant(participant.id)}>
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