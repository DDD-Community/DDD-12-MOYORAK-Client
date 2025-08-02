import { useQuery } from '@tanstack/react-query';

import { get } from '.';

const getSearchTeam = async (companyId: number) => {
	return await get(`/companies/${companyId}`);
};

export const useQuerySearchTeam = (companyId: number) => {
	return useQuery({
		queryKey: ['companies'],
		queryFn: () => getSearchTeam(companyId),
	});
};
