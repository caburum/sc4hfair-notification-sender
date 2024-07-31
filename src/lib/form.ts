import { applyAction, deserialize } from '$app/forms';
import { invalidateAll } from '$app/navigation';
import { requireAuth } from '$lib/auth';
import type { ActionResult } from '@sveltejs/kit';
import { writable, type Writable } from 'svelte/store';

export const loading = writable(false);

export async function handleSubmit(event: { currentTarget: EventTarget & HTMLFormElement }) {
	const body = new FormData(event.currentTarget),
		formElement = event.currentTarget;

	const password = await requireAuth();
	if (password === undefined) {
		// password prompt exited
		return;
	}

	body.append('password', password);

	loading.set(true);
	const response = await fetch(formElement.action, {
		method: 'POST',
		body
	});

	if (!response.ok) {
		applyAction({
			type: 'failure',
			status: 500,
			data: {
				message: `${response.status} ${response.statusText}: ${await response.clone().text()}` as any,
				action: formElement.action.split('?/')[1] as any
			}
		});
		loading.set(false);
		return;
	}

	const result: ActionResult = deserialize(await response.text());

	if (result.type === 'success') {
		HTMLFormElement.prototype.reset.call(formElement);
		// rerun all `load` functions, following the successful update
		await invalidateAll();
	}

	applyAction(result);

	loading.set(false);
}

export const editingForm: Writable<Record<string, any> | undefined> = writable(undefined);
