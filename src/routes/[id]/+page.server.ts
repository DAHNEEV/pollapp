import { db } from '$lib/server/db';
import { polls, pollOptions } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';

export const load: PageServerLoad = async ({ params }) => {
	const [poll] = await db.select().from(polls).where(eq(polls.id, params.id));
	if (!poll) {
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
