import { db } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import { polls, pollOptions, pollVotes } from '$lib/server/db/schema';
import { count, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const [poll] = await db
		.select({ question: polls.question, id: polls.id })
		.from(polls)
		.where(eq(polls.id, params.id));
	if (!poll) {
		return redirect(302, `/create`);
	}

	const votes = await db
		.select({
			optionId: pollOptions.id,
			text: pollOptions.text,
			count: count()
		})
		.from(pollVotes)
		.innerJoin(pollOptions, eq(pollVotes.optionId, pollOptions.id))
		.where(eq(pollVotes.pollId, poll.id))
		.groupBy(pollVotes.optionId);

	return {
		poll: poll,
		votes: votes
	};
};
