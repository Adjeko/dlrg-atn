<script lang="ts">
  import Time from "svelte-time";
  import InDevelopment from '$lib/components/InDevelopment.svelte';
  import { JsonView } from '@zerodevx/svelte-json-view'
	import QR from '@svelte-put/qr/svg/QR.svelte';
	import { ChevronLeft, Icon, PencilSquare, QrCode, Trash, UserCircle } from "svelte-hero-icons";
    import CategorieBadge from '$lib/components/CategorieBadge.svelte';

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
          <dt class="text-sm font-medium leading-6 text-gray-900">Startdatum {data.course.startDate}</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 flex flex-row gap-1">
            <Time timestamp={data.course.startDate} format="DD.MM.YY"/>
            <p>um</p>
            <Time timestamp={data.course.startDate} format="HH:mm"/>
            <p>Uhr</p>
          </dd>
        </div>
        <div class="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
          <dt class="text-sm font-medium leading-6 text-gray-900">Enddatum</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 flex flex-row gap-1">
            <Time timestamp={data.course.endDate} format="DD.MM.YY"/>
            <p>um</p>
            <Time timestamp={data.course.endDate} format="HH:mm"/>
            <p>Uhr</p>
          </dd>
        </div>
        <div class="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
          <dt class="text-sm font-medium leading-6 text-gray-900">Kategorie</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            <CategorieBadge category={data.course.category}/>
          </dd>
        </div>
        <div class="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
          <dt class="text-sm font-medium leading-6 text-gray-900">Lerneinheiten</dt>
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


<button class="fixed bottom-12 right-12 btn bg-[#DC0612] btn-circle" on:click={modal.showModal()}>
	<Icon class="text-[#F5E41D]" src="{QrCode}" size="32"/>
</button>
<dialog class="modal" bind:this={modal}>
  <div class="modal-box">
		<QR
      data="{data.course.id}"
      moduleFill="black"
      anchorOuterFill="black"
      anchorInnerFill="black"
      logo="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAgVBMVEXjBhP/7QD/9QDhABT/8gD/7wDqXhD/8QD/9gDsbg7tcw7xlgzzpgv0ogrsaw770gX93gP3uAjmMhHwiwz0qwr70wTnPRH4wQjymwv/+gD6zQbrZQ/kHRL/6gDpVxDpUBDvhA31sAn82gTueA7oShD5xwf4vwj+5ADugQ3lJhLmNxFojpzrAAADkUlEQVR4nO3ZfVuqMBzGcR42WKSF5hM+pKZl9f5f4KE6IJuMVoLHc13fz5+tH/NWxsbmeQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwvckiarbIRY8TLwy1un1yo4kaO7m5a3STJHeLaO+FtdXrxY3dR5ml7q9RFrhQKh1NKhcKe3qdemrqZebUiQrGDyelt2n+92/K5HzT0HlP+G6kyHrHFGFfr5P3TQlvHTuRgdxo13k7BNKhLFbp8PyEOTUru+8mYX4d9VypW65ix7rYX7aR0M/Kb6qrhL4v5sevcewaMI/4bPsAP0ooyvv0zISiFJ/chWpXlN0ps03GZZ3ZlE3aSCif2km46o0K23tzpMXFjxi+mDGCdNuffeo/mxnFrI2EvijKzkoo07Bi+KRHlKsiodHgi+Q4ZYXeXI9ovU3NhLLpBvJVMRDPTVhtHQZ6J1mRMNU/QDzQypaZ0BzcEspDcQP1RoODMjN2kjA86N3YEgp9tgxvR5q+pXMjYT4IKqKVEfESCWXsljD/B42t89OE1Us8GPdwNwl9LUk8dk3opjGhFxlDpIuE4YPeidoUDZdIuDdmpJYSVh8K+5Ee8DjjWxPWLl9c1zRGwkknCfOhVhJKa6uu2mwJ+8ZD9EtgW/v/k4QWMg7ih8rq3paw9mrl8L3ehFKm09fqq97PEsrrTrjKHe4H21ni/fY3vPKEn5fIR6cI1KB8ZPzPCaU6Cow2sSoi2hIWOwb6uvSqElbmw+UwGpkRB44z/lSL+MuEHc2H+oy/NX4M4bgubSXh4gJrGu/VfLco+rhAwtAcQJ0kTC6dsLJa35mviE0J61xhQrl6mX55mc7lyVaePeFhUOPlrcuEY/2lyzFhdclY947/Zkmo1ZWK3aF2EsZTPYP+FHRO2My6T1NPnZdwbHzFwazy0rs0thqNZ+QvE9r32jpJeLLXJvznYgDMT/baRm0kFOVeyCUSeknNfmnJbMrW9QF/lrAchpdJaG5RNRGt7Hlnt9Zzi3pnJvQmLucyn+LV+ecWUmTHg5kLJfTeD8H3Rxf5S0l2b8vnen6olEh7w4bzw3rFbGGcHyp983ZnXCqrNm7mQjUeICoVP20fG1ZUk2+OgD8OgaPH/bt5BrxOHOz+3jpD45L6Q+HN7FFrDb3hZL3LJbUHydHpRwMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA69Aeo5lGjaT5TXAAAAABJRU5ErkJggg=="
    />
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>