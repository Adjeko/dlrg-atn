import { error } from '@sveltejs/kit';

export async function load ({ locals, params } : any) {
	const getCourse = async (courseId : any) => {
		try {
			const project = await locals.pb.collection('courses').getOne(courseId);
			return project;
		} catch (err : any) {
			console.log('Error: ', err);
			throw error(err.status, err.message);
		}
	};

	return {
		course: await getCourse(params.courseId)
	};
};