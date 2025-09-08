import { useMutation, useQueryClient } from '@tanstack/react-query';

import { post } from '.';

const logout = async (): Promise<unknown> => {
	return await post<unknown>('/auth/sign-out');
};

export const useMutationLogout = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ['logout'],
		mutationFn: logout,
		onSuccess: () => {
			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');
			localStorage.removeItem('userId');
			localStorage.removeItem('teamId');
			localStorage.removeItem('email');
			localStorage.removeItem('name');
			queryClient.clear();

			window.location.href = '/';
		},
	});
};
