<script lang="ts">
	import { enhance, applyAction} from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { Icon, Plus } from "svelte-hero-icons";
  import TimelineItem from "$lib/components/TimelineItem.svelte";
	import { Html5Qrcode } from 'html5-qrcode'
  import { onMount } from 'svelte'

  export let data : any;

	let modal : any;

	let scanning = false
	let scannedText : String;
  let html5Qrcode : any

  onMount(init)

  function init() {
    html5Qrcode = new Html5Qrcode('reader')
  }

  function start() {
    html5Qrcode.start(
  		{ facingMode: 'environment' },
      {
        fps: 1,
        qrbox: { width: 250, height: 250 },
      },
      onScanSuccess,
      onScanFailure
    )
    scanning = true
  }

  async function stop() {
    await html5Qrcode.stop()
    scanning = false
  }

  function onScanSuccess(decodedText : any, decodedResult : any) {
		if(scannedText === undefined){
			scannedText = decodedText;
			stop();
		}	
  }

  function onScanFailure(error : any) {
    // console.warn(`Code scan error = ${error}`)
  }

	function openModal(){
		modal.showModal();
		start();
	}

	const submitJoinCourse = () => {
		return async ({ result } : any) => {
			switch (result.type) {
				case 'success':
					await invalidateAll();
					break;
				case 'error':
					break;
				default:
					await applyAction(result);
			}
			
			modal.close()
		};
	};

</script>

<div role="tablist" class="tabs tabs-bordered py-6">
  <a href="/my/timeline" role="tab" class="tab tab-active text-xl">Timeline</a>
  <a href="/my/courses" role="tab" class="tab text-xl">Erstellte Kurse</a>
</div>

<div class="w-full mt-4 flex flex-col items-start">
	{#if data.courses.length === 0}
		<p class="text-center text-3xl">☹️</p>
		<p class="text-center text-3xl">Sieht so aus, wie wenn du noch keinem Kurs beigetreten bist.</p>
	{:else}
		{#each data.courses as course}
			<TimelineItem course={course}/>
			<div class="divider mt-2 mb-2" />
		{/each}
	{/if}
</div>

<button class="fixed bottom-12 right-12 btn bg-[#DC0612] btn-circle" on:click={openModal}>
	<Icon class="text-[#F5E41D]" src="{Plus}" size="32"/>
</button>
<dialog class="modal" bind:this={modal}>
  <div class="modal-box">
    <h3 class="font-bold text-lg">Scanne den QR Code eines Kurses!</h3>
		<div class="flex flex-col items-center justify-center gap-5">
			<reader class="w-full min-h-[500px] bg-black {scanning ? "" : "hidden"}" id="reader"/>
			<div class="{scanning ? "hidden" : ""}">
				<p> Willst du dem Kurs mit der ID beitreten?</p>
				<form method="POST" action="?/joinCourse" use:enhance={submitJoinCourse}>
					<input class="hidden" type="text" id="courseId" name="courseId" value={scannedText}/>
					<button class="btn btn-primary">Beitreten</button>
				</form>
			</div>
		</div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

