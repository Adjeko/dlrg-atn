
import { error } from '@sveltejs/kit';

export const load = ({ locals, params } : any) => {
	const getProject = async (projectId : any) => {
		try {
			const project = await locals.pb.collection('projects').getOne(projectId);
			return project;
		} catch (err : any) {
			console.log('Error: ', err);
			throw error(err.status, err.message);
		}
	};

	return {
		project: getProject(params.projectId)
	};
};