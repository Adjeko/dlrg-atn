import { error, redirect } from '@sveltejs/kit';


export async function load ({ locals } : any) {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	}

	const getJoinedCourses = async (userId : any) => {
		try {
			const courses = 
				await locals.pb.collection('courses').getFullList(undefined, {
					filter: `creator = "t78b293a3r4hrvz"`,
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