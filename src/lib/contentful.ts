import { writable, type Writable } from 'svelte/store';

export const SPACE_ID = 'e34g9w63217k';
export const WEBHOOK_ID = '2mrAMviYhfVoiUqsTb8R1m';

export const POST_TYPE = 'post';

export const postTypes = {
	normal: 'Normal Post',
	emergency: 'Emergency Alert',
	silent: 'Silent (no notification, front page only)'
} as const;
export type PostTypeKey = keyof typeof postTypes;

export const getTags = () => {
	const year = new Date().getFullYear();
	if (year < 2022) return [];
	return [year.toString()];
};

// todo: automatically add next year tag on submit if missing

export const webhook: Writable<boolean | undefined> = writable(undefined);
