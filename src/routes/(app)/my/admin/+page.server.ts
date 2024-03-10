import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const schema = z.object({
	users: z.object({
		id: z.string(),
  	name: z.string(),
		role: z.string(),
	}).array()
});

export async function load ({ locals } : any) {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	}
	
  const getAllUsers = async () => {
		try {
			const courses = 
				await locals.pb.collection('users').getFullList({
					sort: '+name',
				})
			
			return courses;
		} catch (err : any) {
			console.log('Error: ', err);
			throw error(err.status, err.message);
		}
	};

	const users = await getAllUsers()

	const form = await superValidate({users: users}, zod(schema))

	return {
		form: form,
		userCount: users.length,
	};
};

export const actions = {
	default: async ({ request, locals }) => {
    const form = await superValidate(request, zod(schema));

    if (!form.valid) {
      return fail(400, { form });
    }

		form.data.users.forEach(user => {
			locals.pb.collection("users").update(user.id, {role: user.role})
		});

    return { form: form };
  }
};