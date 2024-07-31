export const SPACE_ID = 'e34g9w63217k';

export const POST_TYPE = 'post';

export const postTypes = [
	{ id: 'normal', label: 'Normal' },
	{ id: 'emergency', label: 'Emergency Alert' },
	{ id: 'silent', label: 'Silent (no notification, front page only)' }
] as const;
export type PostTypeKey = (typeof postTypes)[number]['id'];

export const getTags = () => {
	const year = new Date().getFullYear();
	if (year < 2022) return [];
	return [year.toString()];
};

// todo: automatically add next year tag on submit if missing
