import { redirect } from '@sveltejs/kit';

export const POST = ({ locals } : any) => {
	locals.pb.authStore.clear();
	locals.user = undefined;

	throw redirect(303, '/login');
};