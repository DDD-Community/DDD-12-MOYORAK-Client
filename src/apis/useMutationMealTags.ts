import { useMutation, useQueryClient } from '@tanstack/react-query';

import { put } from '.';

interface MealTagDetail {
	type: 'DISLIKE' | 'ALLERGY';
	item: string;
}

interface MealTagsRequest {
	userId: number;
	details: MealTagDetail[];
}

const putMealTags = async (data: MealTagsRequest): Promise<unknown> => {
	return await put<unknown>('/me/meal/tags', data);
};

export const useMutationMealTags = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ['meal-tags'],
		mutationFn: putMealTags,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['meal-tags'],
			});
		},
	});
};
