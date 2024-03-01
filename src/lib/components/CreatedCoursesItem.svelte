<script lang="ts">
  import Time from "svelte-time";
  import { CalendarDays, Icon, PencilSquare, Trash } from "svelte-hero-icons";
  import { JsonView } from '@zerodevx/svelte-json-view'
    import CategorieBadge from "./CategorieBadge.svelte";
	export let course : any;
  export let deleteFormActionPath : any;
</script>

<div class="w-full flex flex-row">
  <div class="w-full relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-[#F5E41D] focus-within:ring-offset-2 hover:border-gray-400"    >
    <div class="flex-shrink-0">
      <Icon src="{CalendarDays}" size="32" />
    </div>
    <div class="min-w-0">
      <a href="/course/{course.id}" class="focus:outline-none">
        <span class="absolute inset-0" aria-hidden="true" />
        <p class="text-sm font-medium text-gray-900">{course.name}</p>
        <p class="truncate text-sm text-gray-500">{course.description}</p>
      </a>
    </div>
    <div class="min-w-0 flex-1">
      <CategorieBadge category={course.category}/>
    </div>
    <div class="flex-auto">
      <p>Von</p>
      <span class="flex flex-row gap-1">
        <Time timestamp={course.startDate} format="DD.MM.YY"/>
        <p>um</p>
        <Time timestamp={course.startDate} format="HH:mm"/>
        <p>Uhr</p>
      </span>
      <p>bis</p>
      <span class="flex flex-row gap-1">
        <Time timestamp={course.endDate} format="DD.MM.YY"/>
        <p>um</p>
        <Time timestamp={course.endDate} format="HH:mm"/>
        <p>Uhr</p>
      </span>
    </div>
    <div class="min-w-0 flex-0 text-l font-bold">
      <p>{course.points} LE</p>
    </div>
  </div>

  <div class="pl-2 items-center flex flex-row gap-3">
    <a href="/course/{course.id}/edit" >
      <Icon src="{PencilSquare}" size="32"/>
    </a>

    <form action={deleteFormActionPath} method="POST">
      <input type="text" name="courseId" value={course.id} class="hidden"/>
      <button type="submit" >
        <Icon src="{Trash}" size="32"/>
      </button>
    </form>
  </div>
</div>