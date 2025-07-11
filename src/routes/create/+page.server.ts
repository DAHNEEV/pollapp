import type { PageServerLoad } from './$types.js';
import { zod4 } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import { superValidate } from 'sveltekit-superforms';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod4(formSchema))
	};
};
