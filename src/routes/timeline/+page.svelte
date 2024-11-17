<script>
// @ts-nocheck

	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "$lib/components/ui/dialog";
	import { Book, Code, Palette, Stethoscope, Calculator, Calendar, QrCode, Trophy, Star } from "lucide-svelte";;
	import { Separator } from "$lib/components/ui/separator";
	import { onMount } from "svelte";

	let courses = [
		{ icon: Book, title: "Literature", description: "Explore classic and modern literature", score: 85, startDate: new Date("2023-09-01T09:00:00"), endDate: new Date("2023-09-01T10:30:00") },
		{ icon: Code, title: "Programming", description: "Learn to code with various languages", score: 92, startDate: new Date("2023-09-01T11:30:00"), endDate: new Date("2023-09-01T13:00:00") },
		{ icon: Palette, title: "Art History", description: "Discover art through the ages", score: 78, startDate: new Date("2023-09-01T14:00:00"), endDate: new Date("2023-09-01T15:30:00") },
		{ icon: Stethoscope, title: "Medical Science", description: "Introduction to human anatomy", score: 88, startDate: new Date("2024-02-15T16:15:00"), endDate: new Date("2024-02-15T17:45:00") },
		{ icon: Calculator, title: "Mathematics", description: "Advanced calculus and algebra", score: 90, startDate: new Date("2024-03-10T18:30:00"), endDate: new Date("2024-03-10T20:00:00") },
	];

	// Group courses by year
	let groupedCourses = $derived(
		courses.reduce((acc, course) => {
			const year = course.startDate.getFullYear();
			// @ts-ignore
			if (!acc[year]) {
				// @ts-ignore
				acc[year] = [];
			}
			// @ts-ignore
			acc[year].push(course);
			return acc;
		}, {})
	);

	// Statistics
	let joinedCourses = $state(3);
	let totalPoints = $state(265);

	// @ts-ignore
	function formatDateRange(start, end) {
		const dateFormat = { month: "short", day: "numeric", year: "numeric" };
		const timeFormat = { hour: "numeric", minute: "numeric", hour12: true };

		const startDate = start.toLocaleDateString("en-US", dateFormat);
		const startTime = start.toLocaleTimeString("en-US", timeFormat);
		const endTime = end.toLocaleTimeString("en-US", timeFormat);

		return `${startDate} ${startTime} - ${endTime}`;
	}

	// @ts-ignore
	let videoStream;
	// @ts-ignore
	let qrCodeReader;

	onMount(() => {
		import("html5-qrcode").then((module) => {
			qrCodeReader = new module.Html5Qrcode("qr-reader");
		});
	});

	function startQrScanner() {
		// @ts-ignore
		if (qrCodeReader) {
			qrCodeReader.start({ facingMode: "environment" }, { fps: 10, qrbox: 250 }, onScanSuccess, onScanFailure);
		}
	}

	function stopQrScanner() {
		// @ts-ignore
		if (qrCodeReader) {
			qrCodeReader
				.stop()
				.then(() => {
					console.log("QR Code scanning stopped");
				})
				// @ts-ignore
				.catch((err) => {
					console.error("Failed to stop QR Code scanning", err);
				});
		}
	}

	// @ts-ignore
	function onScanSuccess(decodedText, decodedResult) {
		console.log(`Code scanned = ${decodedText}`, decodedResult);
		alert(`Joining course with code: ${decodedText}`);
		stopQrScanner();
	}

	// @ts-ignore
	function onScanFailure(error) {
		console.warn(`QR Code scanning failed: ${error}`);
	}
</script>

<Card class="w-full max-w-2xl mx-auto">
	<CardHeader>
		<CardTitle>Course Dashboard</CardTitle>
	</CardHeader>
	<CardContent>
		<div class="grid grid-cols-2 gap-4 mb-6">
			<Card>
				<CardContent class="pt-6">
					<div class="flex items-center justify-between">
						<div class="flex flex-col">
							<span class="text-2xl font-bold">{joinedCourses}</span>
							<span class="text-sm text-muted-foreground">Courses Joined</span>
						</div>
						<Trophy class="w-8 h-8 text-primary" />
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardContent class="pt-6">
					<div class="flex items-center justify-between">
						<div class="flex flex-col">
							<span class="text-2xl font-bold">{totalPoints}</span>
							<span class="text-sm text-muted-foreground">Total Points</span>
						</div>
						<Star class="w-8 h-8 text-yellow-400" />
					</div>
				</CardContent>
			</Card>
		</div>

		<h3 class="text-lg font-semibold mb-4">Available Courses</h3>
		{#each Object.entries(groupedCourses).sort(([a], [b]) => b - a) as [year, yearCourses]}
			<div class="mb-4">
				<h4 class="text-md font-semibold mb-2">{year}</h4>
				<Separator class="mb-2" />
				<ul class="space-y-4">
					{#each yearCourses as course}
						<li class="flex items-center justify-between p-3 bg-secondary rounded-lg">
							<div class="flex items-center space-x-4">
								<div class="p-2 bg-primary rounded-full">
									<course.icon class="w-5 h-5 text-primary-foreground" />
								</div>
								<div>
									<h3 class="font-semibold">{course.title}</h3>
									<p class="text-sm text-muted-foreground">{course.description}</p>
									<div class="flex items-center mt-1 text-xs text-muted-foreground">
										<Calendar class="w-3 h-3 mr-1" />
										{formatDateRange(course.startDate, course.endDate)}
									</div>
								</div>
							</div>
							<span class="text-lg font-bold">{course.score}</span>
						</li>
					{/each}
				</ul>
			</div>
		{/each}

		<Dialog>
			<DialogTrigger>
				<Button class="mt-4 w-full">
					<QrCode class="w-4 h-4 mr-2" />
					Join Course via QR Code
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Scan QR Code to Join Course</DialogTitle>
				</DialogHeader>
				<div id="qr-reader" class="w-full h-64"></div>
				<Button onclick={startQrScanner}>Start Scanning</Button>
				<Button variant="outline" onclick={stopQrScanner}>Stop Scanning</Button>
			</DialogContent>
		</Dialog>
	</CardContent>
</Card>
