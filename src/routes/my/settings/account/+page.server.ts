import { error } from '@sveltejs/kit';

export const actions = {
	updateEmail: async ({ request, locals } : any) => {
		const data = Object.fromEntries(await request.formData());

		try {
			await locals.pb.collection('users').requestEmailChange(data.email);
		} 
    catch (err : any) {
			throw error(err.status, err.message);
		}

		return {
			success: true
		};
	},
	updateUsername: async ({ request, locals } : any) => {
		const data = Object.fromEntries(await request.formData());

		try {
			await locals.pb.collection('users').getFirstListItem(`username = "${data.username}"`);
		} 
    catch (err :any) {
			if (err.status === 404) {
				try {
					const { username } = await locals.pb
						.collection('users')
						.update(locals.user.id, { username: data.username });
					locals.user.username = username;
					return {
						success: true
					};
				} 
        catch (err : any) {
					console.log('Error: ', err);
					throw error(err.status, err.message);
				}
			}
			console.log('Error: ', err);
			throw error(err.status, err.message);
		}
	}
};