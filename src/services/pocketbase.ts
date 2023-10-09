import PocketBase, { AuthModel, ListResult, RecordModel } from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
pb.autoCancellation(false)

export function getCurrentUser() : AuthModel {
    return pb.authStore.model;
}


interface Course {
    name: string,
    creator?: string,
    organizer?: string,
    points: number,
    startDate: Date,
    endDate: Date,
    description?: string,
    isLongRunning: boolean,
    category: string,
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

export async function registerUserAsCourseMember(courseId : string) : Promise<void> {
    const currentUser = getCurrentUser();
    
    const data = {
        "user": currentUser?.id,
        "course": courseId
    };   
    const record = await pb.collection('isMemberOf').create(data);
}

export async function getCourseListOfUser() : Promise<RecordModel[]> {
    const currentUser = getCurrentUser();

    const records = await pb.collection('isMemberOf').getFullList({
        filter: `user.id="${currentUser?.id}"`,
        expand: 'course',
        sort: '-created',
    });

    return records;
}

export async function getMembersOfCourse(courseId : string) : Promise<RecordModel[]> {
    const records = await pb.collection('isMemberOf').getFullList({
        filter: `course.id="${courseId}"`,
        expand: 'user',
        sort: '-created',
    });

    return records;
}

interface Feedback {
    user: string,
    text: string,
}

export async function createFeedback(text: string) : Promise<void> {

    let feedback : Feedback = {user: "", text: ""};
    feedback.user = getCurrentUser()?.id ?? "";
    feedback.text = text;

    const record = await pb.collection('feedback').create(feedback);
}