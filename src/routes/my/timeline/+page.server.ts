import { error, redirect } from '@sveltejs/kit';


export async function load ({ locals } : any) {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	}

	const getJoinedCourses = async (userId : any) => {
		try {
			const projects = 
				await locals.pb.collection('isMemberOf').getFullList(undefined, {
					filter: `user = "${userId}"`,
          expand: `course`
				})
			
			return projects;
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
	joinCourse: async ({ request, locals } : any) => {
		const body = await request.formData();

		console.log(body.get("courseId"))
		console.log(locals.user.id)
	},
};