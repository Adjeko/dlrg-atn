<script lang="ts">
  import "../app.pcss";
  import { JsonView } from '@zerodevx/svelte-json-view'
  import { Toaster } from 'svelte-french-toast'
  export let data
</script>

<Toaster></Toaster>
<div class="min-h-full">
  <nav class="navbar bg-[#dc0612] border-b">
    <div class="flex-1">
      <a href="/" class="btn btn-ghost normal-case text-xl text-[#f5e41d]">
        DLRG Fortbildungs Tracker
      </a>
    </div>
    <div class="flex-none">
      {#if !data.user}
        <div class="dropdown dropdown-end">
        </div>
      {:else}
        <div class="dropdown dropdown-end mr-4">
          <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label tabindex="0" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
              <img src="https://ui-avatars.com/api/?name={data.user?.name}" alt="user avatar">
            </div>
          </label>
          <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
          <ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
            <li>
              <a href="/my/settings" class="justify-between">Einstellungen</a>
            </li>
            <li>
              <form action="/logout" method="POST">
                <button type="submit" class="w-full text-start">Abmelden</button>
              </form>
            </li>
          </ul>
        </div>
      {/if}
    </div>
  </nav>
  <div class="py-4">
    <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
      <slot></slot>
    </div>    
  </div>
</div>




