import PocketBase from 'pocketbase';

export function getCurrentUser(){

}


interface Course {
    name: string,
    organizer: string,
    points: number,
}

export async function createCourse(course: Course) {
    const pb = new PocketBase('http://127.0.0.1:8090');
    
    const record = await pb.collection('courses').create(course);
}