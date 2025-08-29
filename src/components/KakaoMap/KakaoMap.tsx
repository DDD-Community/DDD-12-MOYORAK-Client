import { useEffect, useRef } from 'react';

import type { ITeamRestaurantLocationItem } from '@/apis/useQueryTeamRestaurantsLocations';
import KakaoMapCore from '@/utils/KakaoMapCore';

interface IKakaoMapOptions {
	center?: { lat: number; lng: number };
	level?: number;
	placeName?: string;
}

interface IKakaoMapProps {
	companyLocation: IKakaoMapOptions;
	optionsList?: ITeamRestaurantLocationItem[];
}

const KakaoMap = ({ companyLocation, optionsList = [] }: IKakaoMapProps) => {
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
			if (!mapRef.current) {
				return;
			}

			if (!mapInstance.current) {
				mapInstance.current = new KakaoMapCore();
			}

			try {
				await mapInstance.current.init();

				// optionsList는 사용자의 회사 위도 및 경도 정보
				mapInstance.current.createMap(mapRef.current, companyLocation);

				// 회사 마커 생성
				mapInstance.current.addCompanyMarker(companyLocation);

				// navigate 마커 생성 (회사 위치에)
				mapInstance.current.addNavigateMarker(companyLocation);

				// 일반 마커 생성
				optionsList.forEach((opt, idx) => {
					mapInstance.current?.addMarker(opt, idx);
				});
			} catch (error) {
				console.error('KakaoMap - 지도 초기화 에러:', error);
			}
		};

		initialize();

		return () => {
			mapInstance.current?.destroyMap();
			mapInstance.current = null;
		};
	}, [optionsList, companyLocation]);

	return (
		<div className="absolute inset-0 w-full h-full">
			<div ref={mapRef} className="w-full h-full bg-gray-200">
				<div className="flex items-center justify-center h-full text-gray-500">
					<div className="text-center">
						<div className="text-lg mb-2">🗺️</div>
						<div className="text-sm">지도를 로딩 중입니다...</div>
						<div className="text-xs mt-1">
							환경변수가 설정되지 않은 경우
							<br />
							VITE_KAKAO_MAP_KEY를 설정해주세요
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default KakaoMap;
