import contentful from 'contentful-management';
import { SPACE_ID } from './contentful';
import { CONTENTFUL_MANAGEMENT_TOKEN } from '$env/static/private';

export const client = contentful.createClient(
	{
		accessToken: CONTENTFUL_MANAGEMENT_TOKEN
	},
	{
		type: 'plain',
		defaults: {
			spaceId: SPACE_ID,
			environmentId: 'master'
		}
	}
);
