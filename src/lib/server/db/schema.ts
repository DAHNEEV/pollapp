import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';

export const polls = sqliteTable('polls', {
	id: text()
		.primaryKey()
		.$default(() => nanoid()),
	question: text('question').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const pollOptions = sqliteTable('poll_options', {
	id: text()
		.primaryKey()
		.$default(() => nanoid()),
	pollId: text('poll_id')
		.notNull()
		.references(() => polls.id, { onDelete: 'cascade' }),
	text: text('text').notNull()
});

export const pollVotes = sqliteTable('poll_votes', {
	id: text()
		.primaryKey()
		.$default(() => nanoid()),
	pollId: text('poll_id')
		.notNull()
		.references(() => polls.id, { onDelete: 'cascade' }),
	optionId: text('option_id')
		.notNull()
		.references(() => pollOptions.id, { onDelete: 'cascade' }),
	ip: text('ip'),
	votedAt: integer('voted_at', { mode: 'timestamp' }).notNull()
});
