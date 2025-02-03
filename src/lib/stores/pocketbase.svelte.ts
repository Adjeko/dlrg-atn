// src/lib/stores/pocketbase.js
import PocketBase from 'pocketbase';
import { toUser, type User } from '../types/User';
import { emptySchedule, toSchedule, type Schedule } from '../types/Schedule';

export class PocketBaseStore {
    instance: PocketBase = new PocketBase('http://127.0.0.1:8090');;

    getCurrentUser(): User | null {
        const user = toUser(this.instance.authStore.record);
        return user;
    }

    async getSchedule(id : string) : Promise<Schedule> {
        const schedule = await this.instance.collection("schedule").getOne(id, {
            expand: 'course, course.creator, attendees, organizers',
        });

        return toSchedule(schedule) ?? emptySchedule;
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

    async getTimelineEntries() : Promise<Schedule[]> {
        const user = this.getCurrentUser();
        const schedulesFromServer = await this.instance.collection("schedule").getFullList({
			expand: 'course, course.creator, attendees, organizers',
			// filter: `course = ${PB().authStore.model.id}`,
		});

        const schedules: Schedule[] = schedulesFromServer
            .map((schedule): Schedule | undefined => toSchedule(schedule))
            .filter((schedule): schedule is Schedule => schedule !== undefined);
        return schedules;
    }

    async getCreatedCourses() : Promise<Schedule[]> {
        const user = this.getCurrentUser();
        const schedulesFromServer = await this.instance.collection("schedule").getFullList({
            expand: 'course, course.creator, attendees, organizers',
        });

        const schedules: Schedule[] = schedulesFromServer
            .map((schedule): Schedule | undefined => toSchedule(schedule))
            .filter((schedule): schedule is Schedule => schedule !== undefined);
        return schedules;
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


