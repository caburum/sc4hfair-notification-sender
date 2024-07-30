import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { authenticate } from '$lib/auth.server';
import { client as contentful, POST_TYPE, getTags } from '$lib/contentful';

export const actions = {
	auth: async ({ request }) => {
		const data = await request.formData();

		const authRes = authenticate(data);
		if (!authRes.authenticated) return fail(401, authRes);

		return authRes;
	},
	create: async ({ request }) => {
		const res = { action: 'create' };
		const data = await request.formData();

		const authRes = authenticate(data);
		if (!authRes.authenticated) return fail(401, authRes);

		if (!data.has('title') || !data.has('contentText'))
			return fail(400, { ...res, message: 'missing required fields' });
		const title = data.get('title') as string,
			// todo: have markdown editor handle newlines
			contentText = (data.get('contentText') as string).replaceAll('\n', '\n\n');

		const entry = await contentful.entry.create(
			{
				contentTypeId: POST_TYPE
			},
			{
				metadata: {
					tags: getTags().map((tag) => ({
						sys: {
							type: 'Link',
							linkType: 'Tag',
							id: tag
						}
					}))
				},
				fields: {
					title: { 'en-US': title },
					contentText: { 'en-US': contentText }
				}
			}
		);
		await contentful.entry.publish(
			{
				entryId: entry.sys.id
			},
			entry
		);

		return { ...res, message: `successfully created post "${title}"` };
	},
	remove: async ({ request }) => {
		const res = { action: 'remove' };
		const data = await request.formData();

		const authRes = authenticate(data);
		if (!authRes.authenticated) return fail(401, authRes);

		if (!data.has('id')) return fail(400, { ...res, message: 'missing required fields' });
		const id = data.get('id') as string;

		await contentful.entry.unpublish({
			entryId: id
		});

		return { ...res, message: `successfully removed post` };
	}
} satisfies Actions;
