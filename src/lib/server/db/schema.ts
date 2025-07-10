import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { generateUniqueString } from '$lib/utils.js';

export const polls = sqliteTable('polls', {
	id: integer().primaryKey({ autoIncrement: true }),
	slug: text().$default(() => generateUniqueString()),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const pollOptions = sqliteTable('poll_options', {
	id: integer().primaryKey({ autoIncrement: true }),
	pollId: integer('poll_id')
		.notNull()
		.references(() => polls.id, { onDelete: 'cascade' }),
	text: text('text').notNull(),
	votes: integer('votes').notNull().default(0)
});

export const pollVotes = sqliteTable('poll_votes', {
	id: integer().primaryKey({ autoIncrement: true }),
	pollId: integer('poll_id')
		.notNull()
		.references(() => polls.id, { onDelete: 'cascade' }),
	optionId: integer('option_id')
		.notNull()
		.references(() => pollOptions.id, { onDelete: 'cascade' }),
	ip: text('ip'),
	votedAt: integer('voted_at', { mode: 'timestamp' }).notNull()
});
