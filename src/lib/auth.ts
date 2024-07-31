import { browser } from '$app/environment';
import { writable, type Writable } from 'svelte/store';

export interface AuthRes extends Record<string, unknown> {
	authenticated: boolean;
	message: string;
}

// first password prompt allows access to page, additional prompts to make changes
// this isn't secured very securely, but it doesn't really matter
export const initialAuthPassword: Writable<string | undefined> = writable(
	(browser && atob(sessionStorage.getItem('password') || '')) || undefined
);
initialAuthPassword.subscribe((password) => browser && sessionStorage.setItem('password', btoa(password || '')));

// only dialog should read
export const reAuthenticateCallback: Writable<((password: string | undefined) => void) | undefined> =
	writable(undefined);

export const requireAuth = () => {
	return new Promise<string | undefined>((resolve) => {
		reAuthenticateCallback.set((password) => {
			if (password) resolve(password);
			else resolve(undefined);
			reAuthenticateCallback.set(undefined);
		});
	});
};
