/// <reference types="vite/client" />
export {};

declare global {
	interface Window {
		kakao: any;
	}

	const kakao: any;

	interface ImportMetaEnv {
		readonly VITE_KAKAO_MAP_URL: string;
		readonly VITE_KAKAO_MAP_KEY: string;
		readonly VITE_GOOGLE_AUTH_CLIENT_ID: string;
		readonly VITE_GOOGLE_AUTH_REDIRECT_URI: string;
		readonly VITE_API_URL: string;
	}
}
