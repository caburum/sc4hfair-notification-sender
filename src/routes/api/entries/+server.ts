import { authenticate } from '$lib/auth.server';
import { client as contentful, POST_TYPE, getTags } from '$lib/contentful';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export interface Entry {
	id: string;
	title: string;
	contentText: string;
}

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.formData();

	const authRes = authenticate(data);
	if (!authRes.authenticated) return error(401, authRes);

	const entries = await contentful.entry.getMany({
		query: {
			content_type: POST_TYPE,
			'sys.archivedAt[exists]': 'false', // hide old
			'sys.publishedAt[exists]': 'true', // hide removed // todo: allow republishing
			'metadata.tags.sys.id[in]': getTags().join(',')
		}
	});

	return json(
		entries.items.map((e) => ({
			id: e.sys.id,
			title: e.fields.title['en-US'],
			contentText: e.fields.contentText['en-US']
		}))
	);
};
