import { useQuery } from '@tanstack/react-query';

import { get } from '.';

const getSearchCompany = async (company: string) => {
	return await get(`/companies?name=${company}`);
};

export const useQuerySearchCompany = (company: string, enabled = true) => {
	return useQuery({
		queryKey: ['companies', company],
		queryFn: () => getSearchCompany(company),
		enabled,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	});
};
