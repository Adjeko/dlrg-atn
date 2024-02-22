<script lang="ts">
  import { Icon, PencilSquare, Trash } from "svelte-hero-icons";
  import { JsonView } from '@zerodevx/svelte-json-view'
	export let course : any;
</script>

<a href="/course/{course.id}">
<JsonView json={course} />
</a>

<a href="/course/{course.id}/edit" >
  <Icon src="{PencilSquare}" size="32"/>
</a>

<a href="/course/{course.id}/edit" >
  <Icon src="{Trash}" size="32"/>
</a>