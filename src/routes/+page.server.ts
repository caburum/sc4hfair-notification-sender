import type { Actions } from './$types';

export const actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		console.log('create', data);

		return { message: 'Successfully created post' };
	}
} satisfies Actions;
