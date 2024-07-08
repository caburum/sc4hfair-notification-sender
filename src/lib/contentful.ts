import contentful from 'contentful-management';
import { CONTENTFUL_MANAGEMENT_TOKEN } from '$env/static/private';

export const client = contentful.createClient(
	{
		accessToken: CONTENTFUL_MANAGEMENT_TOKEN
	},
	{
		type: 'plain',
		defaults: {
			spaceId: 'e34g9w63217k',
			environmentId: 'master'
		}
	}
);

export const POST = 'post';
