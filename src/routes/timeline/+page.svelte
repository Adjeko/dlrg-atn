<script>
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { ScrollArea } from "$lib/components/ui/scroll-area";
	import { Book, Code, Palette, Stethoscope, Calculator, Calendar } from "lucide-svelte";;

	let courses = [
		{ icon: Book, title: "Literature", description: "Explore classic and modern literature", score: 85, startDate: new Date("2023-09-01T09:00:00"), endDate: new Date("2023-09-01T10:30:00") },
		{ icon: Code, title: "Programming", description: "Learn to code with various languages", score: 92, startDate: new Date("2023-09-01T11:30:00"), endDate: new Date("2023-09-01T13:00:00") },
		{ icon: Palette, title: "Art History", description: "Discover art through the ages", score: 78, startDate: new Date("2023-09-01T14:00:00"), endDate: new Date("2023-09-01T15:30:00") },
		{ icon: Stethoscope, title: "Medical Science", description: "Introduction to human anatomy", score: 88, startDate: new Date("2023-09-01T16:15:00"), endDate: new Date("2023-09-01T17:45:00") },
		{ icon: Calculator, title: "Mathematics", description: "Advanced calculus and algebra", score: 90, startDate: new Date("2023-09-01T18:30:00"), endDate: new Date("2023-09-01T20:00:00") },
	];

	// @ts-ignore
	function formatDateRange(start, end) {
		const dateFormat = { month: "short", day: "numeric", year: "numeric" };
		const timeFormat = { hour: "numeric", minute: "numeric", hour12: true };

		const startDate = start.toLocaleDateString("en-US", dateFormat);
		const startTime = start.toLocaleTimeString("en-US", timeFormat);
		const endTime = end.toLocaleTimeString("en-US", timeFormat);

		return `${startDate} ${startTime} - ${endTime}`;
	}
</script>

<Card class="w-full max-w-2xl mx-auto">
	<CardHeader>
		<CardTitle>Available Courses</CardTitle>
	</CardHeader>
	<CardContent>
		<ScrollArea class="h-[300px] w-full pr-4">
			<ul class="space-y-4">
				{#each courses as course}
					<li class="flex items-center justify-between p-3 bg-secondary rounded-lg">
						<div class="flex items-center space-x-4">
							<div class="p-2 bg-primary rounded-full">
								<svelte:component this={course.icon} class="w-5 h-5 text-primary-foreground" />
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
		</ScrollArea>
	</CardContent>
</Card>
