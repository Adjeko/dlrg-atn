<script>
// @ts-nocheck

	import { page } from '$app/stores';
	import { onMount } from "svelte";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Textarea } from "$lib/components/ui/textarea";
	import { Label } from "$lib/components/ui/label";
	import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "$lib/components/ui/card";
	import { Separator } from "$lib/components/ui/separator";
	import { CircleAlert, Save } from "lucide-svelte";;
	import { Alert, AlertDescription, AlertTitle } from "$lib/components/ui/alert";
	import { toast } from "svelte-sonner";
    import { PB } from "@/lib/stores/pocketbase.svelte";

	let course = $state({});

	let isEditing = $state(false);
	let editedCourse = $state({});

	function startEditing() {
		editedCourse = { ...course };
		isEditing = true;
	}

	function cancelEditing() {
		isEditing = false;
	}

	function saveCourse() {
		course = { ...editedCourse };
		isEditing = false;
		toast.success("Kurs erfolgreich aktualisiert");
	}

	$effect(async () => {
		const loadedCourse = await PB.getCourse($page.params.courseId);
		course = loadedCourse;
		if (isEditing) {
			console.log("Bearbeitungsmodus aktiviert");
		}
	});
</script>

<Card class="max-w-3xl mx-auto mt-8">
	<CardHeader>
		<CardTitle>{course?.course?.title}</CardTitle>
		<CardDescription>{course?.course?.description}</CardDescription>
	</CardHeader>
	<CardContent>
		{#if !isEditing}
			<div class="space-y-4">
				<div>
					<strong>Kursleiter:</strong>
					{course?.course?.creator?.name} : {course?.course?.creator?.email}
				</div>
				<div>
					<strong>Termin:</strong>
					{course.duration}
				</div>
				<div>
					<strong>Niveau:</strong>
					{course.level}
				</div>
				<div>
					<strong>Preis:</strong>
					€{course.price}
				</div>
				<div>
					<strong>Teilnehmer:</strong>
					{course.enrolledStudents}
				</div>
			</div>
		{:else}
			<form class="space-y-4">
				<div>
					<Label for="title">Titel</Label>
					<Input id="title" bind:value={editedCourse.title} />
				</div>
				<div>
					<Label for="description">Beschreibung</Label>
					<Textarea id="description" bind:value={editedCourse.description} />
				</div>
				<div>
					<Label for="instructor">Kursleiter</Label>
					<Input id="instructor" bind:value={editedCourse.instructor} />
				</div>
				<div>
					<Label for="duration">Dauer</Label>
					<Input id="duration" bind:value={editedCourse.duration} />
				</div>
				<div>
					<Label for="level">Niveau</Label>
					<Input id="level" bind:value={editedCourse.level} />
				</div>
				<div>
					<Label for="price">Preis</Label>
					<Input id="price" type="number" step="0.01" bind:value={editedCourse.price} />
				</div>
				<div>
					<Label for="enrolledStudents">Eingeschriebene Studenten</Label>
					<Input id="enrolledStudents" type="number" bind:value={editedCourse.enrolledStudents} />
				</div>
				<div>
					<Label for="rating">Bewertung</Label>
					<Input id="rating" type="number" step="0.1" min="0" max="5" bind:value={editedCourse.rating} />
				</div>
			</form>
		{/if}
	</CardContent>
	<Separator />
	<CardFooter class="flex justify-between">
		{#if !isEditing}
			<Button onclick={startEditing}>
				<CircleAlert class="mr-2 h-4 w-4" />
				Bearbeiten
			</Button>
		{:else}
			<Button variant="outline" onclick={cancelEditing}>Abbrechen</Button>
			<Button onclick={saveCourse}>
				<Save class="mr-2 h-4 w-4" />
				Speichern
			</Button>
		{/if}
	</CardFooter>
</Card>

<Alert class="max-w-3xl mx-auto mt-4">
	<CircleAlert class="h-4 w-4" />
	<AlertTitle>Hinweis</AlertTitle>
	<AlertDescription>Änderungen an diesem Kurs werden sofort für alle Studenten sichtbar sein.</AlertDescription>
</Alert>
