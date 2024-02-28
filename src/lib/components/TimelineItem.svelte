<script lang="ts">
  import { Icon, CalendarDays } from 'svelte-hero-icons';
    import CategorieBadge from './CategorieBadge.svelte';
	export let course : any;
</script>

<div class="w-full relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-[#F5E41D] focus-within:ring-offset-2 hover:border-gray-400"    >
  <div class="flex-shrink-0">
    <Icon src="{CalendarDays}" size="32" />
  </div>
  <div class="min-w-0">
    <a href="/course/{course.course}" class="focus:outline-none">
      <span class="absolute inset-0" aria-hidden="true" />
      <p class="text-sm font-medium text-gray-900">{course.expand.course.name}</p>
      <p class="truncate text-sm text-gray-500">{course.expand.course.description}</p>
    </a>
  </div>
  <div class="min-w-0 flex-1">
    <CategorieBadge category={course.expand.course.category}/>
  </div>
  <div class="flex-auto">
    <p>{course.expand.course.startDate.substring(0,10)}</p>
    <p>bis</p>
    <p>{course.expand.course.endDate.substring(0,10)}</p>
  </div>
  <div class="min-w-0 flex-0 text-l font-bold">
    <p>{course.expand.course.points} LP</p>
  </div>
</div>