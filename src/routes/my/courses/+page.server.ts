import { createCourseSchema } from '$lib/schema.js';
import { validateData } from '$lib/utils';
import { error, fail, redirect } from '@sveltejs/kit';
import { serialize } from 'object-to-formdata';


export async function load ({ locals } : any) {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	}

	const getJoinedCourses = async (userId : any) => {
		try {
			const courses = 
				await locals.pb.collection('courses').getFullList(undefined, {
					filter: `creator = "${userId}"`,
          expand: `parent`
				})
			
			return courses;
		} catch (err : any) {
			console.log('Error: ', err);
			throw error(err.status, err.message);
		}
	};

	return {
		courses: await getJoinedCourses(locals.user.id)
	};
};

export const actions = {
	createCourse: async ({ request, locals } : any) => {
		const body = await request.formData();

		body.set("points", 3)
		body.append('creator', locals.user.id);
		body.append('organizer', locals.user.id);
		body.set("startDate", new Date(body.get("startDate")).toISOString())
		body.set("endDate", new Date(body.get("endDate")).toISOString())

		const { formData, errors } = await validateData(body, createCourseSchema);
		
		if (errors) {
			return fail(400, {
				data: formData,
				errors: errors.fieldErrors
			});
		}

		try {
			await locals.pb.collection('courses').create(serialize(formData));
		} catch (err : any) {
			console.log('Error: ', err);
			throw error(err.status, err.message);
		}

		throw redirect(303, '/my/courses');
	},
	deleteCourse: async ({ request, locals } : any) => {
		const body = await request.formData();

		try {
			await locals.pb.collection('courses').delete(body.get("courseId"));
		} catch (err : any) {
			console.log('Error: ', err);
			throw error(err.status, err.message);
		}
	}
}