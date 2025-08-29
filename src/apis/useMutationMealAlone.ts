import { useMutation } from '@tanstack/react-query';

import { post } from '.';

const postMeMealAlone = async (userId: number) => {
	return await post('/me/meal/alone', { userId: userId });
};

export const useMutationMealAlone = (userId: number) =>
	useMutation<any, Error, void>({
		mutationKey: ['me', 'meal', 'alone'],
		mutationFn: () => postMeMealAlone(userId),
	});
