import type { AuthRes } from './auth';
import { get as getEdgeConfig } from '@vercel/edge-config';

// todo: better auth?
// this needs to be secure enough that random people on the internet can't use it
// but not so secure that it's difficult to give 4-h people access
export const authenticate = async (data: FormData | string | undefined): Promise<AuthRes> => {
	const passwords = (await getEdgeConfig<string[]>('passwords')) || [];

	let password;
	if (typeof data === 'string') password = data;
	else if (!data || !data.has('password')) return { authenticated: false, message: 'missing required fields' };
	else password = data.get('password') as string;

	if (passwords.includes(password)) {
		return { authenticated: true, message: 'successfully authenticated' };
	} else {
		return { authenticated: false, message: 'incorrect password' };
	}
};
