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

    async getCourse(id : string) : Promise<Schedule> {
        const schedule = await this.instance.collection("schedule").getOne(id, {
            expand: 'course, course.creator, days, attendees, organizers',
        });

        return toSchedule(schedule) ?? emptySchedule;
    }

    async getTimelineEntries() : Promise<Schedule[]> {
        const user = this.getCurrentUser();
        const schedulesFromServer = await this.instance.collection("schedule").getFullList({
			expand: 'course, course.creator, days, attendees, organizers',
			// filter: `course = ${PB().authStore.model.id}`,
		});

        const schedules: Schedule[] = schedulesFromServer
            .map((schedule): Schedule | undefined => toSchedule(schedule))
            .filter((schedule): schedule is Schedule => schedule !== undefined);
        return schedules;
    }
}

export const PB = new PocketBaseStore();


