<script lang="ts">
  import { Icon, PencilSquare, Trash } from "svelte-hero-icons";
  import { JsonView } from '@zerodevx/svelte-json-view'
	export let course : any;
  export let deleteFormActionPath : any;
</script>

<a href="/course/{course.id}">
<JsonView json={course} />
</a>

<a href="/course/{course.id}/edit" >
  <Icon src="{PencilSquare}" size="32"/>
</a>

<form action={deleteFormActionPath} method="POST">
  <input type="text" name="courseId" value={course.id} class="hidden"/>
  <button type="submit" >
    <Icon src="{Trash}" size="32"/>
  </button>
</form>