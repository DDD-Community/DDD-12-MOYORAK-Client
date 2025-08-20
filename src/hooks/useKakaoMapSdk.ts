// useKakaoMapSdk.ts
import { useEffect, useState } from 'react';

const useKakaoMapSdk = () => {
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		if (window.kakao && window.kakao.maps) {
			setLoaded(true);
			return;
		}

		const script = document.createElement('script');
		script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_KEY}&autoload=false&libraries=services`;
		script.async = true;

		script.onload = () => {
			window.kakao.maps.load(() => {
				setLoaded(true);
			});
		};

		document.head.appendChild(script);
	}, []);

	return loaded ? window.kakao : null;
};

export default useKakaoMapSdk;
