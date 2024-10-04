import { error, fail, redirect } from "@sveltejs/kit";
import { validateData } from "$lib/utils";
import { loginUserSchema } from "$lib/schema";

export const actions = {
	login: async ({ request, locals } : any) => {
		const { formData, errors } = await validateData(
			await request.formData(),
			loginUserSchema,
		);

		if (errors) {
			return fail(400, {
				data: formData,
				errors: errors.fieldErrors,
			});
		}

		try {
			await locals.pb
				.collection("users")
				.authWithPassword(formData.email, formData.password);
			if (!locals.pb?.authStore?.model?.verified) {
				locals.pb.authStore.clear();
				return {
					notVerified: true,
				};
			}
		} catch (err : any) {
			console.log("Error: ", err);
			throw error(err.status, JSON.stringify(err));
		}

		throw redirect(303, "/");
	},
};