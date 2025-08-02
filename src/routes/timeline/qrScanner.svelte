<script lang="ts">
    import { Button } from "@/lib/components/ui/button";
    import { PB } from "@/lib/stores/pocketbase.svelte";
    import { Html5Qrcode } from "html5-qrcode";
    import { onMount } from "svelte";

    let { dialogOpen = $bindable(), schedules = $bindable() } = $props();
	let html5Qrcode : any;
	let scanning = $state(true);

    onMount(() => {
        html5Qrcode = new Html5Qrcode('reader')
        startQrScanner();
        console.log(dialogOpen)
        return () => {
            stopQrScanner();
        }
    });


    function startQrScanner() {
		html5Qrcode.start(
            { facingMode: 'environment' },
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
            },
            onScanSuccess,
            onScanFailure
        )
        scanning = true
	}

	async function stopQrScanner() {
		await html5Qrcode.stop()
        scanning = false
	}

	async function onScanSuccess(decodedText: any, decodedResult: any): Promise<void> {
        const returnedSchedule = await PB.joinSchedule(decodedResult.decodedText);
        schedules = [...schedules, returnedSchedule];
        stopQrScanner();

        setTimeout(() => dialogOpen = false, 1500);
	}

	function onScanFailure(error: any) {
	}

</script>


<reader id="reader" class="w-full h-64"></reader>
{#if scanning}
	<Button variant="outline" onclick={stopQrScanner}>Stop Scanning</Button>
{:else}
	<Button onclick={startQrScanner}>Start Scanning</Button>
{/if}