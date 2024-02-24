import { error, redirect } from '@sveltejs/kit';

export async function load ({ locals, params } : any) {
	if (!locals.pb.authStore.isValid) {
		throw error(401, 'Unauthorized');
	}

	const getCourse = async (courseId : any) => {
		try {
			const course = await locals.pb.collection('courses').getOne(courseId, {
				expand: 'creator',
			});
			return course;
		} catch (err : any) {
			console.log('Error: ', err);
			throw error(err.status, err.message);
		}
	};

	const getMember = async (courseId : any) => {
		try {
			const course = await locals.pb.collection('isMemberOf').getFullList({
				filter: `course="${courseId}"`,
				expand: 'user',
			});
			return course;
		} catch (err : any) {
			console.log('Error: ', err);
			throw error(err.status, err.message);
		}
	};

	return {
		course: await getCourse(params.courseId),
		member: await getMember(params.courseId)
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