<script lang="ts">
  import InDevelopment from '$lib/components/InDevelopment.svelte';
  import { JsonView } from '@zerodevx/svelte-json-view'
	// @ts-ignore there are no type definitions for svelte-qrcode
	import QrCodeImage from "svelte-qrcode"
	import { ChevronLeft, Icon, PencilSquare, QrCode, Trash, UserCircle } from "svelte-hero-icons";

  export let data : any;
	let modal : any;
</script>

<div class="flex flex-row gap-10">
  <a href="/my/timeline" >
    <Icon src="{ChevronLeft}" size="32"/>
  </a>

  <h2 class="text-3xl font-bold">{data.course.name}</h2>
  <a href="/course/{data.course.id}/edit" >
    <Icon src="{PencilSquare}" size="32"/>
  </a>

  <form action="?/deleteCourse" method="POST">
    <input type="text" name="courseId" value={data.course.id} class="hidden"/>
    <button type="submit" >
      <Icon src="{Trash}" size="32"/>
    </button>
  </form>
</div>

<div class="w-full mt-4 flex flex-col items-center">
	<!-- <JsonView json={data.course} /> -->
    <div class="w-full mt-6 border-t border-gray-100">
      <dl class="divide-y divide-gray-100">
        <div class="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
          <dt class="text-sm font-medium leading-6 text-gray-900">Ersteller</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            <InDevelopment/>
          </dd>
        </div>
        <div class="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
          <dt class="text-sm font-medium leading-6 text-gray-900">Veranstalter</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            <InDevelopment/>
          </dd>
        </div>
        <div class="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
          <dt class="text-sm font-medium leading-6 text-gray-900">Startdatum</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{data.course.startDate}</dd>
        </div>
        <div class="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
          <dt class="text-sm font-medium leading-6 text-gray-900">Enddatum</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{data.course.endDate}</dd>
        </div>
        <div class="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
          <dt class="text-sm font-medium leading-6 text-gray-900">Leistungspunkte</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{data.course.points}</dd>
        </div>
        <div class="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
          <dt class="text-sm font-medium leading-6 text-gray-900">Beschreibung</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            {data.course.description}
          </dd>
        </div>
      </dl>
    </div>
</div>

<div class="w-full py-12">
  <h2 class="text-2xl font-bold">Teilnehmer</h2>
  <ul role="list" class="divide-y divide-gray-100">
    {#each data.member as member}
      {#if member.expand}
      <li class="flex gap-x-4 py-5">
        <Icon src={UserCircle} size="32"/>
        <div class="min-w-0">
          <p class="text-sm font-semibold leading-6 text-gray-900">{member.expand.user.name}</p>
          <p class="mt-1 truncate text-xs leading-5 text-gray-500">{member.expand.user.email}</p>
        </div>
      </li>
      {/if}      
    {/each}
  </ul>
</div>


<button class="fixed bottom-12 right-12 btn btn-primary btn-circle" on:click={modal.showModal()}>
	<Icon src="{QrCode}" size="32"/>
</button>
<dialog class="modal" bind:this={modal}>
  <div class="modal-box">
    <h3 class="font-bold text-lg">Hello!</h3>
		<QrCodeImage value="{data.course.id}" />
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>