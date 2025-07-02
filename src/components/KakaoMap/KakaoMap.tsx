import { useEffect, useRef } from 'react';

import KakaoMapCore from '@/utils/KakaoMapCore';

interface IKakaoMapOptions {
	center?: { lat: number; lng: number };
	level?: number;
	placeName?: string;
}

interface IKakaoMapProps {
	optionsList?: IKakaoMapOptions[];
}

const KakaoMap = ({ optionsList = [] }: IKakaoMapProps) => {
	const mapRef = useRef<HTMLDivElement | null>(null);
	const mapInstance = useRef<KakaoMapCore | null>(null);

	useEffect(() => {
		/**
		 * Kakao 지도 초기화 함수
		 *
		 * - Kakao 지도 스크립트를 로드하고, 지도 인스터스를 생성합니다.
		 * - optionList 기반으로 지도를 초기화합니다.
		 * - optionList에 따라 마커와 인포윈도우를 추가합니다.
		 */
		const initialize = async () => {
			if (!mapRef.current) return;

			if (!mapInstance.current) {
				mapInstance.current = new KakaoMapCore();
			}

			try {
				await mapInstance.current.init();

				// optionsList는 사용자의 회사 위도 및 경도 정보
				mapInstance.current.createMap(mapRef.current, optionsList[0]);

				optionsList.forEach((opt) => {
					if (opt.center && mapInstance.current) {
						mapInstance.current.addMarker(opt);
					}
				});
			} catch (error) {
				// TODO) 수연 - 지도 초기화 실패 시, UI 화면 처리
				// TODO) Sentry 에러 로그 추가
				// Alert 으로 지도 로드 실패와 같은 메시지 정의 필요
				console.error(error);
			}
		};

		initialize();

		return () => {
			mapInstance.current?.destroyMap();
			mapInstance.current = null;
		};
	}, [optionsList]);

	return (
		<div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
			<div ref={mapRef} className="w-full h-screen bg-gray-200" />
		</div>
	);
};

export default KakaoMap;
