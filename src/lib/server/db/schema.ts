import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';

export const polls = sqliteTable('polls', {
	id: integer().primaryKey({ autoIncrement: true }),
	slug: text().$default(() => nanoid()),
	question: text('question').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const pollOptions = sqliteTable('poll_options', {
	id: integer().primaryKey({ autoIncrement: true }),
	pollId: integer('poll_id')
		.notNull()
		.references(() => polls.id, { onDelete: 'cascade' }),
	text: text('text').notNull()
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
