import { db } from '$lib/server/db';
import { polls, pollOptions, pollVotes } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import { nanoid } from 'nanoid';

export const load: PageServerLoad = async ({ params }) => {
	const [poll] = await db.select().from(polls).where(eq(polls.id, params.id));
	if (!poll) {
		return redirect(302, `/create`);
	}
	if (poll.expiresAt <= new Date()) {
		return redirect(302, `/create`);
	}

	const options = await db.select().from(pollOptions).where(eq(pollOptions.pollId, poll.id));
	if (options.length < 1) {
		return redirect(302, `/create`);
	}

	return {
		poll: poll,
		options: options,
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

		const optionId = form.data.optionId;
		const pollId = event.params.id;
		const validOption = await db
			.select()
			.from(pollOptions)
			.where(and(eq(pollOptions.id, optionId), eq(pollOptions.pollId, pollId)))
			.limit(1);
		if (!validOption) {
			return fail(400, { form });
		}

		const clientAddress = event.getClientAddress();
		const id = nanoid();
		const now = new Date();
		try {
			await db
				.delete(pollVotes)
				.where(and(eq(pollVotes.pollId, pollId), eq(pollVotes.ip, clientAddress)));

			await db.insert(pollVotes).values({
				id: id,
				pollId: pollId,
				optionId: optionId,
				ip: clientAddress,
				votedAt: now
			});
		} catch (error) {
			return fail(400, { form });
		}

		return redirect(302, `/${pollId}/results`);
	}
};
