import { error } from '@sveltejs/kit';

export const actions = {
	updateProfile: async ({ request, locals } : any) => {
		let data = await request.formData();

    //wenn der Avatar noch nicht gesetzt ist, soll auch keiner an Pocketbase gesendet werden
    const userAvatar = data.get('avatar');
		if (userAvatar.size === 0) {
			data.delete('avatar');
		}

		try {
			const { name, avatar } = await locals.pb.collection('users').update(locals?.user?.id, data);

			locals.user.name = name;
			locals.user.avatar = avatar;
		} catch (err) {
			console.log('Error: ', err);

			throw error(400, 'Something went wrong updating your profile');
		}

		return {
			success: true
		};
	}
};