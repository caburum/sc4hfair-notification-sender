import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { client as contentful, POST } from '$lib/contentful';

export const load: PageServerLoad = async ({}) => {
	const entries = await contentful.entry.getPublished({
		query: {
			content_type: POST
		}
	});
	console.log(entries);

	return {
		entries: entries.items.map((e) => ({
			id: e.sys.id,
			title: e.fields.title['en-US'],
			contentText: e.fields.contentText['en-US']
		}))
	};
};

export const actions = {
	create: async ({ request }) => {
		const res = { action: 'create' };
		const data = await request.formData();

		if (!data.has('title') || !data.has('contentText'))
			return fail(400, { ...res, message: 'Missing required fields' });
		const title = data.get('title') as string,
			contentText = data.get('contentText') as string;

		const entry = await contentful.entry.create(
			{
				contentTypeId: 'post'
			},
			{
				fields: {
					title: { 'en-US': title },
					contentText: { 'en-US': contentText }
				}
			}
		);
		console.log(entry);
		await contentful.entry.publish(
			{
				entryId: entry.sys.id
			},
			entry
		);

		return { ...res, message: `Successfully created post "${title}"` };
	},
	remove: async ({ request }) => {
		const res = { action: 'remove' };
		const data = await request.formData();

		if (!data.has('id')) return fail(400, { ...res, message: 'Missing required fields' });
		const id = data.get('id') as string;

		await contentful.entry.unpublish({
			entryId: id
		});
		// await contentful.entry.archive({
		// 	entryId: id
		// });

		return { ...res, message: `Successfully removed post` };
	}
} satisfies Actions;
