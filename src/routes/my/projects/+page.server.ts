import { error, redirect } from '@sveltejs/kit';

export const load = ({ locals } : any) => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	}

	const getUsersProjects = async (userId : any) => {
		try {
			const projects = await locals.pb.collection('projects').getFullList(undefined, {
					filter: `user = "${userId}"`
				})
			
			return projects;
		} catch (err : any) {
			console.log('Error: ', err);
			throw error(err.status, err.message);
		}
	};

	return {
		projects: getUsersProjects(locals.user.id)
	};
};

export const actions = {
	deleteProject: async ({ request, locals } : any) => {
		const { id } = Object.fromEntries(await request.formData());

		try {
			await locals.pb.collection('projects').delete(id);
		} catch (err : any) {
			console.log('Error: ', err);
			throw error(err.status, err.message);
		}
		return {
			success: true
		};
	}
};