import { useMutation } from '@tanstack/react-query';

import { post } from '.';

export interface IAuthSignInResponse {
	accessToken: string;
	refreshToken: string;
}

const postAuthSignIn = async (id: number): Promise<IAuthSignInResponse> => {
	return await post<IAuthSignInResponse>('/auth/sign-in', { userId: id });
};

export const useMutationAuthSignIn = () =>
	useMutation({
		mutationKey: ['auth', 'signIn'],
		mutationFn: postAuthSignIn,
		onSuccess: (data) => {
			localStorage.setItem('accessToken', data.accessToken);
			localStorage.setItem('refreshToken', data.refreshToken);
		},
	});
