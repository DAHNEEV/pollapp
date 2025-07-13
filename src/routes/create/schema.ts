import { z } from 'zod/v4';

export const formSchema = z.object({
	question: z.string().min(1),
	options: z.array(z.string()).min(1).max(12).default(['', '']),
	expired: z.number()
});

export type FormSchema = typeof formSchema;
