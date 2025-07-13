import { z } from 'zod/v4';

export const formSchema = z.object({
	optionId: z.string().min(21).max(21)
});

export type FormSchema = typeof formSchema;
