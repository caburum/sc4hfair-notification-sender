import { authenticate } from '$lib/auth.server';
import { POST_TYPE, WEBHOOK_ID, getTags, type PostTypeKey } from '$lib/contentful';
import { client as contentful } from '$lib/contentful.server';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export interface Entry {
	id: string;
	title: string;
	contentText: string;
	type: PostTypeKey;
}

export type State = {
	entries: Entry[];
	webhook: boolean;
};

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.formData();

	const authRes = authenticate(data);
	if (!authRes.authenticated) return error(401, authRes);

	const [entries, webhook] = await Promise.allSettled([
		contentful.entry.getMany({
			query: {
				content_type: POST_TYPE,
				'sys.archivedAt[exists]': 'false', // hide old
				'sys.publishedAt[exists]': 'true', // hide removed // todo: allow republishing
				'metadata.tags.sys.id[in]': getTags().join(',')
			}
		}),
		contentful.webhook.get({
			webhookDefinitionId: WEBHOOK_ID
		})
	]);

	if (entries.status !== 'fulfilled') return error(500, String(entries.reason));

	return json({
		entries: entries.value.items.map((e) => ({
			id: e.sys.id,
			title: e.fields.title['en-US'],
			contentText: e.fields.contentText['en-US'],
			type: e.fields.type['en-US'] as PostTypeKey
		})),
		webhook: webhook.status === 'fulfilled' && webhook.value.active
	});
};
