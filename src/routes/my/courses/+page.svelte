<script lang="ts">
  import CreatedCoursesItem from "$lib/components/CreatedCoursesItem.svelte";
	import { Icon, Plus } from "svelte-hero-icons";

	export let data : any;
	let modal : any;
</script>


<h2 class="text-3xl font-bold">Deine erstellten Kurse</h2>
<div role="tablist" class="tabs tabs-lifted">
  <a href="/my/timeline" role="tab" class="tab">Timeline</a>
  <a href="/my/courses" role="tab" class="tab tab-active">Erstellte Kurse</a>
</div>

<div class="w-full mt-4 flex flex-col items-center">
	{#if data.courses.length === 0}
		<p class="text-center text-3xl">☹️</p>
		<p class="text-center text-3xl">Looks like you don't have any projects.</p>
		<a href="/projects/new" class="btn btn-primary max-w-md mt-4">Add One</a>
	{:else}
		{#each data.courses as course}
			<CreatedCoursesItem course={course}/>
			<a href="/course/{course.id}" class="btn btn-primary max-w-md mt-4">{course.name}</a>
			<div class="divider mt-0 mb-2" />
		{/each}
	{/if}
</div>

<button class="fixed bottom-12 right-12 btn btn-primary btn-circle" on:click={modal.showModal()}>
	<Icon src="{Plus}" size="32"/>
</button>
<dialog class="modal" bind:this={modal}>
  <div class="modal-box">
    <h3 class="font-bold text-lg">Hello!</h3>
    <p class="py-4">Press ESC key or click outside to close</p>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>