// src/lib/stores/pocketbase.js
import PocketBase from 'pocketbase';
import { emptyUser, toUser, type User } from '../types/User';
import { emptySchedule, toSchedule, type Schedule } from '../types/Schedule';
import { emptyCourse, toCourse, type Course } from '../types/Course';

export class PocketBaseStore {
    // instance: PocketBase = new PocketBase('http://127.0.0.1:8090');
    // instance: PocketBase = new PocketBase('http://192.168.68.69:8090');
    instance: PocketBase = new PocketBase('https://db.dlrgatn.de');

    getCurrentUser(): User {
        const user = toUser(this.instance.authStore.record);
        return user ?? emptyUser;
    }

    async getSchedule(id : string) : Promise<Schedule> {
        const schedule = await this.instance.collection("schedule").getOne(id, {
            expand: 'course, course.creator, attendees, organizers',
        });

        return toSchedule(schedule) ?? emptySchedule;
    }

    async getCourse(id : string) : Promise<Course> {
        const course = await this.instance.collection("course").getOne(id, {
            expand: 'creator',
        });

        return toCourse(course) ?? emptyCourse;
    }

    async getSchedules(courseId : string) : Promise<Schedule[]> {
        const schedulesFromServer = await this.instance.collection("schedule").getFullList({
            expand: 'course',
            filter: `course.id = '${courseId}'`,
        });

        const schedules: Schedule[] = schedulesFromServer
            .map((schedule): Schedule | undefined => toSchedule(schedule))
            .filter((schedule): schedule is Schedule => schedule !== undefined);
        return schedules;
    }

    async joinSchedule(scheduleId : string) {
        let scannedSchedule = await this.instance.collection("schedule").getOne(scheduleId);
        let newAttendees = [...scannedSchedule.attendees, this.getCurrentUser()?.id];
        this.instance.collection("schedule").update(scheduleId, {
            attendees: newAttendees,
        });
    }

    async getTimelineEntries() : Promise<Schedule[]> {
        const user = this.getCurrentUser();
        const schedulesFromServer = await this.instance.collection("schedule").getFullList({
			expand: 'course, course.creator, attendees, organizers',
		});

        const schedules: Schedule[] = schedulesFromServer
            .map((schedule): Schedule | undefined => toSchedule(schedule))
            .filter((schedule): schedule is Schedule => schedule !== undefined)
            .filter((schedule) => schedule.participants?.some((participant) => participant.id === user?.id));

            console.log(schedules);
        return schedules;
    }

    async getPDFEntries(start : Date, end : Date) : Promise<Schedule[]> {
        console.log(start, end);
        const user = this.getCurrentUser();
        const schedulesFromServer = await this.instance.collection("schedule").getFullList({
            expand: 'course, course.creator, attendees, organizers',
            filter: `startDateTime >= '${start}' && endDateTime <= '${end}'`,
        });

        const schedules: Schedule[] = schedulesFromServer
            .map((schedule): Schedule | undefined => toSchedule(schedule))
            .filter((schedule): schedule is Schedule => schedule !== undefined)
            .filter((schedule) => schedule.participants?.some((participant) => participant.id === user?.id));
        return schedules;
    }

    async getCreatedCourses() : Promise<Course[]> {
        const user = this.getCurrentUser();
        const coursesFromServer = await this.instance.collection("course").getFullList({
            expand: 'creator',
        });

        console.log
        console.log("Courses From Server:",coursesFromServer);

        const courses: Course[] = coursesFromServer
            .map((course): Course | undefined => toCourse(course))
            .filter((course): course is Course => course !== undefined);

        console.log("ToCourses:", courses);
        return courses;
    }

    async getAllUsers() : Promise<User[]> {
        const usersFromServer = await this.instance.collection("users").getFullList();
        const users: User[] = usersFromServer
            .map((user): User | undefined => toUser(user))
            .filter((user): user is User => user !== undefined);
        return users;
    }
}

export const PB = new PocketBaseStore();


