import { validateData } from '$lib/utils';
import { error, fail, redirect } from '@sveltejs/kit';
import { serialize } from 'object-to-formdata';

export async function load ({ locals, params } : any) {
	if (!locals.pb.authStore.isValid) {
		throw error(401, 'Unauthorized');
	}

	const getCourse = async (courseId : any) => {
		try {
			const course = await locals.pb.collection('courses').getOne(courseId);
			return course;
		} catch (err : any) {
			console.log('Error: ', err);
			throw error(err.status, err.message);
		}
	};

	return {
		course: await getCourse(params.courseId)
	};
};

export const actions = {
	deleteCourse: async ({ request, locals, params } : any) => {
		const body = await request.formData();

		try {
			await locals.pb.collection('courses').delete(params.courseId);
		} catch (err : any) {
			console.log('Error: ', err);
			throw error(err.status, err.message);
		}

		throw redirect(303, "/my/courses");
	}
}