import PocketBase, { AuthModel, ListResult, RecordModel } from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

export function getCurrentUser() : AuthModel {
    return pb.authStore.model;
}


interface Course {
    name: string,
    creator?: string,
    organizer?: string,
    points: number,
}

export async function createCourse(course: Course) {
    
    course.creator = getCurrentUser()?.id

    const record = await pb.collection('courses').create(course);
}

export async function getOrganizerCourses() : Promise<RecordModel[]> {
    const currentUser = getCurrentUser();

    const resultList = await pb.collection('courses').getFullList({
        filter: `creator.id="${currentUser?.id}"`,
    });

    return resultList;
}

export async function getCourse(id: string) : Promise<RecordModel> {
    const record = await pb.collection('courses').getOne(id);
    return record;
}

export async function registerUserAsCourseMember(courseId : string) {
    const currentUser = getCurrentUser();
    
    //add user as member to the course
    const courseData = {
        "members": [
            currentUser?.id
        ]
    };    
    const courseRecord = await pb.collection('courses').update(courseId, courseData);

    //add course to the course list of the user
    const userData = {
        "courses": [
            courseId
        ]
    };    
    const userRecord = await pb.collection('users').update(currentUser?.id + "", userData);
}