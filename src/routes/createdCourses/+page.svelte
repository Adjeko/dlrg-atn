<script lang=ts>
		// @ts-nocheck
	
		import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
		import { Button } from "$lib/components/ui/button";
		import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "$lib/components/ui/dialog";
		import { Book, Code, Palette, Stethoscope, Calculator, Calendar, QrCode, Trophy, Star, Tag } from "lucide-svelte";;
		import { Separator } from "$lib/components/ui/separator";
		import { Badge } from "$lib/components/ui/badge";
		import { onMount } from "svelte";
		import { Label } from "$lib/components/ui/label";
		import { Input } from "$lib/components/ui/input";
		import { Textarea } from "$lib/components/ui/textarea";
		import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "$lib/components/ui/select";
    	import { PB } from "@/lib/stores/pocketbase.svelte";
		import AddCourseForm from "./AddCourseForm.svelte";
	
		let courses = [
			{ icon: Book, title: "Literature", description: "Explore classic and modern literature", score: 85, startDate: new Date("2023-09-01T09:00:00"), endDate: new Date("2023-09-01T10:30:00"), tags: ["Humanities", "Reading"] },
			{ icon: Code, title: "Programming", description: "Learn to code with various languages", score: 92, startDate: new Date("2023-09-01T11:30:00"), endDate: new Date("2023-09-01T13:00:00"), tags: ["Computer Science", "Practical"] },
			{ icon: Palette, title: "Art History", description: "Discover art through the ages", score: 78, startDate: new Date("2023-09-01T14:00:00"), endDate: new Date("2023-09-01T15:30:00"), tags: ["Arts", "History"] },
			{ icon: Stethoscope, title: "Medical Science", description: "Introduction to human anatomy", score: 88, startDate: new Date("2024-02-15T16:15:00"), endDate: new Date("2024-02-15T17:45:00"), tags: ["Science", "Health"] },
			{ icon: Calculator, title: "Mathematics", description: "Advanced calculus and algebra", score: 90, startDate: new Date("2024-03-10T18:30:00"), endDate: new Date("2024-03-10T20:00:00"), tags: ["STEM", "Analytical"] },
		];
	
		// Group courses by year
		let groupedCourses = $derived(
			courses.reduce((acc, course) => {
				const year = course.startDate.getFullYear();
				if (!acc[year]) {
					acc[year] = [];
				}
				acc[year].push(course);
				return acc;
			}, {})
		);

		let title: string = $state("");
		let description: string = $state("");
		let shortDescription: string = $state("");
		let category: string = $state("");

		const categories = [
		{ value: "Ausbildung", label: "Ausbildung" },
		{ value: "Fortbildung", label: "Fortbildung" },
		{ value: "Training", label: "Training" },
		{ value: "Tagung", label: "Tagung" },
		{ value: "Online", label: "Online" },
		];

		function formatDateRange(start, end) {
			const dateFormat = { month: "short", day: "numeric", year: "numeric" };
			const timeFormat = { hour: "numeric", minute: "numeric", hour12: true };
	
			const startDate = start.toLocaleDateString("en-US", dateFormat);
			const startTime = start.toLocaleTimeString("en-US", timeFormat);
			const endTime = end.toLocaleTimeString("en-US", timeFormat);
	
			return `${startDate} ${startTime} - ${endTime}`;
		}

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		const data = {
    		"title": title,
    		"description": description,
    		"shortdescription": shortDescription,
    		"creator": PB().authStore.model.id,
    		"category": category
		};

		const record = await PB().collection('course').create(data);

		// Reset form
		title = "";
		description = "";
		shortDescription = "";
		category = "";
	};

	const handleClose = () => {
		value = false;
		title = "";
		description = "";
		shortDescription = "";
		category = "";
	};
	
	</script>
	
	<Card class="w-full max-w-2xl mx-auto">
		<CardHeader>
			<CardTitle>Course Dashboard</CardTitle>
		</CardHeader>
		<CardContent>
			<Dialog>
				<DialogTrigger>
					<Button class="mt-4 w-full">
						<QrCode class="w-4 h-4 mr-2" />
						Erstelle einen neuen Kurs
					</Button>
				</DialogTrigger>
				<DialogContent class="sm:max-w-[500px]">
					<AddCourseForm />
				</DialogContent>
			</Dialog>
	
			<h3 class="text-lg font-semibold my-4">Available Courses</h3>
			{#each Object.entries(groupedCourses).sort(([a], [b]) => b - a) as [year, yearCourses]}
				<div class="mb-4">
					<h4 class="text-md font-semibold mb-2">{year}</h4>
					<Separator class="mb-2" />
					<ul class="space-y-4">
						{#each yearCourses as course}
							<li class="flex flex-col p-3 bg-secondary rounded-lg">
								<div class="flex items-center justify-between">
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
								</div>
								<div class="mt-2 flex flex-wrap gap-2">
									{#each course.tags as tag}
										<Badge variant="secondary" class="flex items-center">
											<Tag class="w-3 h-3 mr-1" />
											{tag}
										</Badge>
									{/each}
								</div>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
	
		</CardContent>
	</Card>
	