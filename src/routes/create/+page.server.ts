import type { Actions, PageServerLoad } from './$types.js';
import { zod4 } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import { fail, superValidate } from 'sveltekit-superforms';
import { db } from '$lib/server/db/index.js';
import { polls, pollOptions } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { nanoid } from 'nanoid';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod4(formSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod4(formSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const now = new Date();
		const expiresIn = new Date(now.getTime() + form.data.expired * 60 * 60 * 1000);
		const id = nanoid();

		try {
			const poll: any = {
				id: id,
				question: form.data.question,
				createdAt: now,
				expiresAt: expiresIn
			};

			await db.insert(polls).values(poll);

			await db.insert(pollOptions).values(
				form.data.options.map((optionText) => ({
					pollId: id,
					text: optionText
				}))
			);
		} catch (error) {
			return fail(500, {
				form,
				message: 'Error'
			});
		}

		return redirect(302, `/${id}/results`);
	}
};
