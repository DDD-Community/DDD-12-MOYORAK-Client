import { useMutation } from '@tanstack/react-query';

import { put } from '.';

const postMeMealAlone = async (userId: number) => {
	return await put('/me/meal/alone', { userId: userId });
};

export const useMutationMealAlone = (userId: number) =>
	useMutation<any, Error, void>({
		mutationKey: ['me', 'meal', 'alone'],
		mutationFn: () => postMeMealAlone(userId),
	});
