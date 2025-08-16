import axios from 'axios';

interface IApiErrorResponse {
	type: string;
	title: string;
	status: number;
	detail: string;
	instance: string;
}

type TApiResponse<T = unknown> = T | IApiErrorResponse;

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	headers: {
		Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI1IiwiZW1haWwiOiJhbnRqZGdrQGdtYWlsLmNvbSIsIm5hbWUiOiLsnbTrrLTshLEiLCJpYXQiOjE3NTUzMzI0MzAsImV4cCI6MTc1NTQxODgzMH0.7SRscCMGmuCt4QSUFqqpkPJ7tuhmnupsEpKpPsjxR4b_LEqcmgx_rkqlC4EL_m5IrTZxcG047SADKhamHMAtWA`,
	},
});

export const get = async <T = unknown>(url: string, params?: object): Promise<TApiResponse> => {
	const { data } = await api.get<TApiResponse<T>>(url, { params });
	return data;
};

export const post = async <T = unknown>(url: string, body?: object): Promise<TApiResponse> => {
	const { data } = await api.post<TApiResponse<T>>(url, body);
	return data;
};

export const put = async <T = unknown>(url: string, body?: object): Promise<TApiResponse> => {
	const { data } = await api.put<TApiResponse<T>>(url, body);
	return data;
};

export const del = async <T = unknown>(url: string, params?: object): Promise<TApiResponse> => {
	const { data } = await api.delete<TApiResponse<T>>(url, { params });
	return data;
};
