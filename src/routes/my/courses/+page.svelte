<script lang="ts">
    import CreatedCoursesItem from "$lib/components/CreatedCoursesItem.svelte";

	export let data : any;
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

