import { initialAuthPassword, type AuthRes } from '$lib/auth';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';
import type { Entry, State } from './api/state/+server';

export const load = (async ({ fetch }) => {
	const password = get(initialAuthPassword);

	const res = await fetch('/api/state', {
		method: 'POST',
		// needs to be a string or sveltekit internal fetch will error
		body: new URLSearchParams({ password: password || '' }).toString(),
		headers: {
			'content-type': 'application/x-www-form-urlencoded'
		}
	});
	const data: State | AuthRes = await res.json();

	if (('authenticated' in data && !data.authenticated) || !Array.isArray(data.entries))
		return { authenticated: false, entries: [], webhook: undefined };

	return { authenticated: true, entries: data.entries as Entry[], webhook: data.webhook as boolean };
}) satisfies PageLoad;
