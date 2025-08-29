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
	return await put<unknown>('/api/me/meal/tags', data);
};

export const useMutationMealTags = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ['meal-tags'],
		mutationFn: putMealTags,
		onSuccess: () => {
			// 음식 태그 쿼리 무효화하여 최신 정보 업데이트
			queryClient.invalidateQueries({
				queryKey: ['meal-tags'],
			});
		},
	});
};
