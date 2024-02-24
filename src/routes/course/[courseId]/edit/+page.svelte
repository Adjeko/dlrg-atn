<script lang="ts">
	import { enhance } from '$app/forms';
  import { JsonView } from '@zerodevx/svelte-json-view'
	import { Input, TextArea } from '$lib/components';
    import { ChevronLeft, Icon } from 'svelte-hero-icons';
  export let data : any;
  export let form : any;
</script>

<div class="flex flex-col w-full h-full p-2">
	<div class="w-full">
		<form
			action="?/updateCourse"
			method="POST"
			class="flex flex-col space-y-2 w-full items-center"
			use:enhance
		>
		<div class="flex flex-row gap-10">
			<a href="/course/{data.course.id}" >
				<Icon src="{ChevronLeft}" size="32"/>
			</a>
				<h3 class="text-3xl font-bold">Kurs editieren</h3>
		</div>
		
			<Input 
        id="name" 
        label="Kursname" 
        value={form?.data?.name ? form?.data?.name : data.course.name} 
        errors={form?.errors?.name} />
			<Input
				id="points"
				label="Leistungspunkte"
				value={form?.data?.points ? form?.data?.points : data.course.points}
				errors={form?.errors?.points}
			/>
			<TextArea
				id="description"
				label="Beschreibung"
				value={form?.data?.description ? form?.data?.description : data.course.description}
				errors={form?.errors?.description}
			/>
			<Input 
        id="startDate" 
        type="date" 
        label="Startdatum" 
        value={form?.data?.startDate ? form?.data?.startDate : data.course.startDate.substring(0,10)} 
        errors={form?.errors?.startDate} />
			<Input 
        id="endDate" 
        type="date" 
        label="Enddatum" 
        value={form?.data?.endDate ? form?.data?.endDate : data.course.endDate.substring(0,10)} 
        errors={form?.errors?.endDate} />
      <input name="creator" type="text" value={data.course.creator} class="hidden"/>
      <input name="organizer" type="text" value={data.course.organizer} class="hidden"/>
      <input name="courseId" type="text" value={data.course.id} class="hidden"/>
			<div class="w-full max-w-lg pt-3">
				<button type="submit" class="btn btn-primary w-full max-w-lg">Kurs ändern</button>
			</div>
		</form>
	</div>
</div>