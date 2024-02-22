<script lang="ts">
  import { JsonView } from '@zerodevx/svelte-json-view'
	export let course : any;
</script>

<a href="/course/{course.course}">
<JsonView json={course} />
</a>