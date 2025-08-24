import { useQuery } from '@tanstack/react-query';

import { get } from '.';

interface IUserResponse {
	teamId: unknown;
	companyId: unknown;
}

const getUser = async (): Promise<IUserResponse> => {
	return await get<IUserResponse>('/user');
};

export const useQueryUser = (enabled = true) => {
	return useQuery<IUserResponse, Error>({
		queryKey: ['user'],
		queryFn: getUser,
		enabled,
	});
};
