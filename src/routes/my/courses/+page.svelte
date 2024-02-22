<script lang="ts">
	import { JsonView } from '@zerodevx/svelte-json-view'
  export let data : any;
</script>


<h2 class="text-3xl font-bold">Deine erstellten Kurse</h2>
<div class="w-full mt-4 flex flex-col items-center">
	{#if data.courses.length === 0}
		<p class="text-center text-3xl">☹️</p>
		<p class="text-center text-3xl">Looks like you don't have any projects.</p>
		<a href="/projects/new" class="btn btn-primary max-w-md mt-4">Add One</a>
	{:else}
		{#each data.courses as course}
			<!-- <JsonView json={data.courses} /> -->
			<p>{course.name}</p>
			<div class="divider mt-0 mb-2" />
		{/each}
	{/if}
</div>

