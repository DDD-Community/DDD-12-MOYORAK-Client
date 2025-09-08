import { useQuery } from '@tanstack/react-query';

import { get } from '.';

interface MealTag {
	id: number;
	item: string;
}

interface MealTagsResponse {
	dislikes: MealTag[];
	allergies: MealTag[];
}

const getMealTags = async (): Promise<MealTagsResponse> => {
	return await get<MealTagsResponse>('/me/meal/tags');
};

export const useQueryMealTags = (enabled = true) => {
	return useQuery({
		queryKey: ['meal-tags'],
		queryFn: getMealTags,
		enabled,
		staleTime: 0,
		gcTime: 0,
	});
};
