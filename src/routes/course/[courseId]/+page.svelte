<script lang="ts">
  import { JsonView } from '@zerodevx/svelte-json-view'
  export let data : any;
</script>


<h2 class="text-3xl font-bold">Kurs</h2>
<a href="/course/${data.course.id}/edit" class="btn btn-primary">Bearbeiten</a>
<div class="w-full mt-4 flex flex-col items-center">
	{#if !data.course}
		<p class="text-center text-3xl">☹️</p>
		<p class="text-center text-3xl">Looks like you don't have any projects.</p>
		<a href="/projects/new" class="btn btn-primary max-w-md mt-4">Add One</a>
	{:else}
		<JsonView json={data.course} />
	{/if}
</div>

