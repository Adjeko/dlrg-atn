<script lang="ts">
	import { Icon, Plus } from "svelte-hero-icons";
  import TimelineItem from "$lib/components/TimelineItem.svelte";
  export let data : any;

	let modal : any;
</script>

<h2 class="text-3xl font-bold">Timeline</h2>
<div role="tablist" class="tabs tabs-lifted">
  <a href="/my/timeline" role="tab" class="tab tab-active">Timeline</a>
  <a href="/my/courses" role="tab" class="tab">Erstellte Kurse</a>
</div>

<div class="w-full mt-4 flex flex-col items-center">
	{#if data.courses.length === 0}
		<p class="text-center text-3xl">☹️</p>
		<p class="text-center text-3xl">Looks like you don't have any projects.</p>
		<a href="/projects/new" class="btn btn-primary max-w-md mt-4">Add One</a>
	{:else}
		{#each data.courses as course}
			<TimelineItem course={course}/>
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
