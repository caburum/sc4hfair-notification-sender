import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { authenticate } from '$lib/auth.server';
import { POST_TYPE, getTags, type PostTypeKey } from '$lib/contentful';
import { client as contentful } from '$lib/contentful.server';

export const actions = {
	auth: async ({ request }) => {
		const data = await request.formData();

		const authRes = await authenticate(data);
		if (!authRes.authenticated) return fail(401, authRes);

		return authRes;
	},
	create: async ({ request }) => {
		const res = { action: 'create' };
		const data = await request.formData();

		const authRes = await authenticate(data);
		if (!authRes.authenticated) return fail(401, authRes);

		if (!data.has('title') || !data.has('contentText') || !data.has('type'))
			return fail(400, { ...res, message: 'missing required fields' });
		const title = data.get('title') as string,
			// todo: have markdown editor handle newlines
			contentText = (data.get('contentText') as string).replaceAll('\n', '\n\n'),
			type = data.get('type') as PostTypeKey;

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
					contentText: { 'en-US': contentText },
					type: { 'en-US': type }
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
	edit: async ({ request }) => {
		const res = { action: 'edit' };
		const data = await request.formData();

		const authRes = await authenticate(data);
		if (!authRes.authenticated) return fail(401, authRes);

		if (!data.has('id') || !data.has('title') || !data.has('contentText'))
			return fail(400, { ...res, message: 'missing required fields' });

		const id = data.get('id') as string,
			title = data.get('title') as string,
			contentText = (data.get('contentText') as string).replaceAll('\n', '\n\n');

		const entry = await contentful.entry.get({
			entryId: id
		});
		entry.fields.title['en-US'] = title;
		entry.fields.contentText['en-US'] = contentText;
		const newEntry = await contentful.entry.update({ entryId: id }, entry);
		await contentful.entry.publish({ entryId: id }, newEntry);

		return { ...res, message: `successfully edited post "${title}"` };
	},
	remove: async ({ request }) => {
		const res = { action: 'remove' };
		const data = await request.formData();

		const authRes = await authenticate(data);
		if (!authRes.authenticated) return fail(401, authRes);

		if (!data.has('id')) return fail(400, { ...res, message: 'missing required fields' });
		const id = data.get('id') as string;

		await contentful.entry.unpublish({
			entryId: id
		});

		return { ...res, message: `successfully removed post` };
	}
} satisfies Actions;
