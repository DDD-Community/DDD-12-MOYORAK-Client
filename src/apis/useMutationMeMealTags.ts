import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { IUserSignUpResponse } from './useMutationAuthSignUp';
import { put } from '.';

interface IMeMeatlTagsRequest extends IUserSignUpResponse {
	details: {
		type: 'DISLIKE' | 'ALLERGY';
		item: string;
	}[];
}

const putMeMealTags = async (request: IMeMeatlTagsRequest) => {
	return await put('/me/meal/tags', request);
};

export const useMutationMeMealTags = () => {
	const queryClient = useQueryClient();

	useMutation<any, Error, IMeMeatlTagsRequest>({
		mutationKey: ['me', 'meal', 'tags'],
		mutationFn: putMeMealTags,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['meal-tags'],
			});
		},
	});
};
