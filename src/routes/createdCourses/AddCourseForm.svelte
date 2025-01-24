<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Textarea } from "$lib/components/ui/textarea";
	import { Select, SelectContent, SelectItem, SelectTrigger } from "$lib/components/ui/select";
	import { Plus, Trash2Icon } from "lucide-svelte";
    import { PB } from "@/lib/stores/pocketbase.svelte";

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
		console.log(JSON.stringify(sessions));

		let createdCourse = await PB.instance.collection("course").create({
			title: title,
			shortdescription: shortDescription,
			description: description,
			category: category,
			creator: PB.instance.authStore.record?.id
		});

		sessions.forEach(async (session) => {
			await PB.instance.collection("schedule").create({
			course: createdCourse.id,
			startDateTime: new Date(session.startDate),
			endDateTime: new Date(session.endDate),
			points: session.points,
			location: session.location
			}, {requestKey: null})
		})
	}
</script>

<form
	onsubmit={(e) => {
		e.preventDefault();
		handleSubmit();
	}}
	class="space-y-6"
>
	<div class="space-y-4">
		<h2 class="text-lg font-semibold">Neuen Kurs erstellen</h2>

		<!-- Kursdetails -->
		<div class="space-y-4">
			<div class="space-y-2">
				<Label for="title">Titel</Label>
				<Input id="title" bind:value={title} placeholder="Kurstitel eingeben" />
			</div>

			<div class="space-y-2">
				<Label for="shortDescription">Kurzbeschreibung</Label>
				<Input id="shortDescription" bind:value={shortDescription} placeholder="Kurze Beschreibung eingeben" />
			</div>

			<div class="space-y-2">
				<Label for="description">Beschreibung</Label>
				<Textarea id="description" bind:value={description} placeholder="Ausführliche Beschreibung eingeben" />
			</div>

			<div class="space-y-2">
				<Label>Kategorie</Label>
				<Select onSelectedChange={(value) => value && (category = value.value as string)}>
					<SelectTrigger>{category}</SelectTrigger>
					<SelectContent>
						<SelectItem value="Ausbildung">Ausbildung</SelectItem>
						<SelectItem value="Fortbildung">Fortbildung</SelectItem>
						<SelectItem value="Training">Training</SelectItem>
						<SelectItem value="Tagung">Tagung</SelectItem>
						<SelectItem value="Online">Online</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>

		<!-- Termine -->
		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<h3 class="text-lg font-semibold">Termine</h3>
				<Button type="button" variant="outline" onclick={addSession}>
					<Plus class="size-4 mr-2" />
					Termin hinzufügen
				</Button>
			</div>

			{#if sessions.length === 0}
				<p class="text-muted-foreground text-sm">Noch keine Termine hinzugefügt</p>
			{/if}
			<p> {JSON.stringify(sessions) }</p>
			{#each sessions as session, index}
				<div class="space-y-4 p-4 border rounded-lg relative">
					<Button type="button" variant="ghost" onclick={() => removeSession(index)} class="absolute right-2 top-2">
						<Trash2Icon class="size-4 text-destructive" />
					</Button>

					<div class="space-y-4">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div class="space-y-2">
								<Label for="startDate-{index}">Startdatum</Label>
								<Input id="startDate-{index}" type="datetime-local" bind:value={session.startDate} />
							</div>
							<div class="space-y-2">
								<Label for="endDate-{index}">Enddatum</Label>
								<Input id="endDate-{index}" type="datetime-local" bind:value={session.endDate} />
							</div>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div class="space-y-2">
								<Label for="location-{index}">Ort</Label>
								<Input id="location-{index}" bind:value={session.location} placeholder="Ort eingeben" />
							</div>
							<div class="space-y-2">
								<Label for="points-{index}">Punktzahl</Label>
								<Input id="points-{index}" type="number" bind:value={session.points} min="0" />
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
