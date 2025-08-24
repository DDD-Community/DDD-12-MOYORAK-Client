import { useQuery } from '@tanstack/react-query';

import { get } from '.';

export interface IGetMeMealAloneResponse {
	state: 'ON' | 'OFF';
}

const getMealAlone = async (): Promise<IGetMeMealAloneResponse> => {
	return await get<IGetMeMealAloneResponse>('/me/meal/alone');
};

export const useQueryMealAlone = (enabled = true) => {
	return useQuery({
		queryKey: ['me', 'meal', 'alone'],
		enabled,
		queryFn: getMealAlone,
	});
};
