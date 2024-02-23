<script lang="ts">
  import { JsonView } from '@zerodevx/svelte-json-view'
	// @ts-ignore there are no type definitions for svelte-qrcode
	import QrCodeImage from "svelte-qrcode"
	import { Icon, PencilSquare, QrCode, Trash } from "svelte-hero-icons";

  export let data : any;
	let modal : any;
</script>


<h2 class="text-3xl font-bold">Kurs</h2>
<a href="/course/{data.course.id}/edit" >
  <Icon src="{PencilSquare}" size="32"/>
</a>

<form action="?/deleteCourse" method="POST">
  <input type="text" name="courseId" value={data.course.id} class="hidden"/>
  <button type="submit" >
    <Icon src="{Trash}" size="32"/>
  </button>
</form>

<div class="w-full mt-4 flex flex-col items-center">
	{#if !data.course}
		<p class="text-center text-3xl">☹️</p>
		<p class="text-center text-3xl">Looks like you don't have any projects.</p>
		<a href="/projects/new" class="btn btn-primary max-w-md mt-4">Add One</a>
	{:else}
		<JsonView json={data.course} />
	{/if}
</div>

<button class="fixed bottom-12 right-12 btn btn-primary btn-circle" on:click={modal.showModal()}>
	<Icon src="{QrCode}" size="32"/>
</button>
<dialog class="modal" bind:this={modal}>
  <div class="modal-box">
    <h3 class="font-bold text-lg">Hello!</h3>
    <p class="py-4">Press ESC key or click outside to close</p>
		<QrCodeImage value="{data.course.id}" />
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>