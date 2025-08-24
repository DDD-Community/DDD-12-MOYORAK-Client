import axios from 'axios';

interface IApiErrorResponse {
	type: string;
	title: string;
	status: number;
	detail: string;
	instance: string;
}

type TApiResponse<T = unknown> = T;

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
});

export const get = async <T = unknown>(url: string, params?: object): Promise<TApiResponse<T>> => {
	const { data } = await api.get<TApiResponse<T>>(url, { params });
	return data;
};

export const post = async <T = unknown>(url: string, body?: object): Promise<T> => {
	const { data } = await api.post<T>(url, body);
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

// // 요청 인터셉터 추가: localStorage에서 토큰을 가져와 Authorization 헤더에 추가
api.interceptors.request.use(
	(config) => {
		const accessToken = localStorage.getItem('accessToken');
		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

api.interceptors.response.use(
	(response) => response,
	(error) => {
		// AxiosError 타입으로 캐스팅하여 detail 필드에 접근 가능
		if (axios.isAxiosError(error) && error.response) {
			const apiError: IApiErrorResponse = error.response.data;
			console.error('API Error:', apiError);
			// 에러를 다시 던져서 호출하는 곳에서 catch 할 수 있도록 합니다.
			return Promise.reject(apiError); // 또는 new Error(apiError.detail) 등
		}
		return Promise.reject(error);
	}
);
