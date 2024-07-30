import { initialAuthPassword, type AuthRes } from '$lib/auth';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';
import type { Entry } from './api/entries/+server';

export const load = (async ({ fetch }) => {
	const password = get(initialAuthPassword);

	const res = await fetch('/api/entries', {
		method: 'POST',
		// needs to be a string or sveltekit internal fetch will error
		body: new URLSearchParams({ password: password || '' }).toString(),
		headers: {
			'content-type': 'application/x-www-form-urlencoded'
		}
	});
	const data: AuthRes | Entry[] = await res.json();

	if (('authenticated' in data && !data.authenticated) || !Array.isArray(data))
		return { authenticated: false, entries: [] };

	return { authenticated: true, entries: data };
}) satisfies PageLoad;
