import { useQuery } from '@tanstack/react-query';

import { get } from '.';

interface ISearchCompanyResponse {
	searchResponses: string[];
}

const getSearchCompany = async (company: string): Promise<ISearchCompanyResponse> => {
	return await get<ISearchCompanyResponse>('/companies', { name: company });
};

export const useQuerySearchCompany = (company: string, enabled = true) => {
	return useQuery<ISearchCompanyResponse, Error>({
		queryKey: ['companies', company],
		queryFn: () => getSearchCompany(company),
		enabled,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	});
};
