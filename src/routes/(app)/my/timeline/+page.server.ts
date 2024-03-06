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
          expand: `course`,
					sort: '-created',
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

		const courseId = body.get("courseId")
		console.log(body.get("courseId"))
		console.log(locals.user.id)

		try{
			await locals.pb.collection('isMemberOf').getFirstListItem(`user="${locals.user.id}" && course="${courseId}"`)
			return {
				hasAlreadyJoined: true
			}
		} catch(err : any) {
			//wenn der Request mit 404 zurück kommt, war der user noch nicht diesem Kurs beigetreten
			if(err.status != 404){
				throw error(err.status, err.message);
			}
		}

		try {
			await locals.pb.collection('isMemberOf').create({
				user: locals.user.id,
				course: courseId
			})
		}
		catch (err : any) {
			throw error(err.status, err.message);
		}
	},
};