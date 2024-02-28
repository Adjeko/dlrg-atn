<script lang="ts">
  import { applyAction, enhance } from "$app/forms";
    import { invalidateAll } from "$app/navigation";
  import { Input, TextArea } from "$lib/components";
  import CreatedCoursesItem from "$lib/components/CreatedCoursesItem.svelte";
	import { Icon, Plus } from "svelte-hero-icons";

	export let data : any;
	export let form : any;
	let modal : any;

	const submitCreateCourse = () => {
		return async ({ result } : any) => {
			switch (result.type) {
				case 'success':
					await invalidateAll();
					break;
				case 'error':
					break;
				default:
					await applyAction(result);
			}
			
			modal.close()
		};
	};
</script>

<div role="tablist" class="tabs tabs-bordered py-6">
  <a href="/my/timeline" role="tab" class="tab text-xl">Timeline</a>
  <a href="/my/courses" role="tab" class="tab tab-active text-xl">Erstellte Kurse</a>
</div>


<div class="w-full mt-4 flex flex-col items-center">
	{#if data.courses.length === 0}
		<p class="text-center text-3xl">🤫</p>
		<p class="text-center text-3xl">Sieht so aus wie wenn du noch keine Kurse angelegt hättest.</p>
		<p class="text-center text-3xl">Mit dem Plus da unten ↘️ kannst du einen erstellen.</p>
	{:else}
		{#each data.courses as course}
			<CreatedCoursesItem deleteFormActionPath="?/deleteCourse" course={course}/>
			<div class="divider mt-0 mb-2" />
		{/each}
	{/if}
</div>

<button class="fixed bottom-12 right-12 btn bg-[#DC0612] btn-circle" on:click={modal.showModal()}>
	<Icon class="text-[#F5E41D]" src="{Plus}" size="32"/>
</button>
<dialog class="modal" bind:this={modal}>
  <div class="modal-box">
		<div class="flex flex-col w-full h-full p-2">
			<div class="w-full">
				<form
					action="?/createCourse"
					method="POST"
					class="flex flex-col space-y-2 w-full items-center"
					enctype="multipart/form-data"
					use:enhance={submitCreateCourse}
				>
					<h3 class="text-3xl font-bold">Beschreibe deinen Kurs</h3>
					<Input id="name" label="Kursname" value={form?.data?.name} errors={form?.errors?.name} />
					<label for="category" class="form-control w-full">
						<div class="label font-medium pb-1">
							<span class="label-text">Kategorie</span>
						</div>
						<select name="category" id="category" class="select {form?.errors?.name ? "select-error" : "select-bordered"}">
							<option disabled selected>Wähle eine Kategorie!</option>
							<option>Ausbildung</option>
							<option>Fortbildung</option>
							<option>Training</option>
							<option>Tagung</option>
							<option>Online</option>
						</select>
					</label>
					<Input
						id="points"
						label="Lerneinheiten"
						value={form?.data?.points}
						errors={form?.errors?.points}
					/>
					<TextArea
						id="description"
						label="Beschreibung"
						value={form?.data?.description}
						errors={form?.errors?.description}
					/>
					<Input id="startDate" type="date" label="Startdatum" value={form?.data?.startDate} errors={form?.errors?.startDate} />
					<Input id="endDate" type="date" label="Enddatum" value={form?.data?.endDate} errors={form?.errors?.endDate} />
					<div class="w-full max-w-lg pt-3">
						<button type="submit" class="btn btn-primary w-full max-w-lg">Kurs erstellen</button>
					</div>
				</form>
			</div>
		</div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>