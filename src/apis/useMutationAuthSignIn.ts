import { useMutation } from '@tanstack/react-query';

import { post } from '.';

const postAuthSignIn = async (id: string) => {
	return await post('/api/auth/sign-in', { userId: id });
};

export const useMutationAuthSignIn = () =>
	useMutation({
		mutationKey: ['auth', 'signIn'],
		mutationFn: postAuthSignIn,
	});
