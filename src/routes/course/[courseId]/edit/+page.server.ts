import { error, fail, redirect } from '@sveltejs/kit';
import { validateData } from '$lib/utils';
import { createCourseSchema, updateProjectSchema } from '$lib/schema';
import { serialize } from 'object-to-formdata';

export const load = async ({ locals, params } : any) => {
	if (!locals.pb.authStore.isValid) {
		throw error(401, 'Unauthorized');
	}

	const getCourse = async (courseId : any) => {
		try {
			const course = await locals.pb.collection('courses').getOne(courseId, {
				expand: 'creator, organizer'
			});
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
	updateCourse: async ({ request, locals, params } : any) => {
		const body = await request.formData();

		const { formData, errors } = await validateData(body, createCourseSchema);

		if (errors) {
			return fail(400, {
				data: formData,
				errors: errors.fieldErrors
			});
		}

		try {
			await locals.pb.collection('courses').update(params.courseId, serialize(formData));
		} catch (err : any) {
			console.log('Error: ', err);
			throw error(err.status, err.message);
		}

		throw redirect(303, `/course/${params.courseId}`);
	},
};