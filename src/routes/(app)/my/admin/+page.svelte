<script lang="ts">
  import { JsonView } from "@zerodevx/svelte-json-view";
  import { superForm } from 'sveltekit-superforms';
  import SuperDebug from 'sveltekit-superforms';

  export let data : any

  const { form, errors, enhance } = superForm(data.form, {
    dataType: 'json',
    applyAction: true,
    invalidateAll: false,
    resetForm: false
  })
</script>

<div role="tablist" class="tabs tabs-bordered py-6">
  <a href="/my/timeline" role="tab" class="tab text-xl">Timeline</a>
  <a href="/my/courses" role="tab" class="tab text-xl">Erstellte Kurse</a>
	{#if data.user.role == "admin"}
		<a href="/my/admin" role="tab" class="tab tab-active text-xl">Admin</a>
	{/if}
</div>

<div class="stats stats-vertical lg:stats-horizontal shadow">
  
  <div class="stat">
    <div class="stat-title">Angemeldete Nutzer</div>
    <div class="stat-value">{data.userCount}</div>
  </div>
  
  <!-- <div class="stat">
    <div class="stat-title">New Users</div>
    <div class="stat-value">4,200</div>
    <div class="stat-desc">↗︎ 400 (22%)</div>
  </div>
  
  <div class="stat">
    <div class="stat-title">New Registers</div>
    <div class="stat-value">1,200</div>
    <div class="stat-desc">↘︎ 90 (14%)</div>
  </div> -->
  
</div>

<div>
  <form method="POST" use:enhance>
    <button class="btn btn-primary">Rollen ändern</button>
    <ul role="list" class="divide-y divide-gray-100">
      {#each $form.users as user, i }
        <li class="flex items-center justify-between gap-x-6 py-5">
          <div class="flex min-w-0 gap-x-4">
            <img class="h-12 w-12 flex-none rounded-full bg-gray-50" src="https://ui-avatars.com/api/?name={user.name}" alt="user avatar" />
            <div class="min-w-0 flex-auto">
              <p class="text-sm font-semibold leading-6 text-gray-900">{user.name}</p>
            </div>
          </div>
          
          <div>
            <label class="font-bold" for="role">Rolle: </label>
            <select bind:value={$form.users[i].role} name="role" id="role" class="select select-bordered" >
              <option value="">Wähle eine Rolle</option>
              <option value="member">Teilnehmer</option>
              <option value="organizer">Veranstalter</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </li>
        {/each}
    </ul>
  </form>
</div>