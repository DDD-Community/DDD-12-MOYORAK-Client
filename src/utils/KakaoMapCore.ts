import type { ITeamRestaurantLocationItem } from '@/apis/useQueryTeamRestaurantsLocations';
import location from '@/assets/location.png';
import 회사핀 from '@/assets/회사핀.png';

export interface IKakaoMapOptions {
	center?: { lat: number; lng: number };
	level?: number;
	placeName?: string;
}

export default class KakaoMapCore {
	private map: any = null;
	private markers: any[] = [];
	private selectedMarkerElement: HTMLImageElement | null = null;
	private selectedOverlay: any = null;

	async init(): Promise<void> {
		return new Promise((resolve, reject) => {
			const KAKAO_MAP_URL = import.meta.env.VITE_KAKAO_MAP_URL;
			const KAKAO_MAP_KEY = import.meta.env.VITE_KAKAO_MAP_KEY;
			const kakaoScript = document.querySelector(`script[src*="${KAKAO_MAP_URL}"]`);

			if (!KAKAO_MAP_KEY || !KAKAO_MAP_URL) {
				return reject(new Error('Kakao Map URL 또는 KEY가 설정되지 않았습니다.'));
			}

			const onReady = () => {
				if (!window.kakao || !window.kakao.maps) {
					return reject(new Error('Kakao 지도 객체가 로드되지 않았습니다.'));
				}
				window.kakao.maps.load(() => resolve());
			};

			if (!kakaoScript) {
				const script = document.createElement('script');
				script.src = `${KAKAO_MAP_URL}?appkey=${KAKAO_MAP_KEY}&autoload=false`;
				script.async = true;
				script.onload = onReady;
				script.onerror = () => reject(new Error('Kakao 지도 스크립트 로드에 실패했습니다.'));
				document.head.appendChild(script);
			} else {
				onReady();
			}
		});
	}

	createMap(container: HTMLDivElement, options?: IKakaoMapOptions) {
		const center = options?.center || { lat: 37.5665, lng: 126.978 };

		// 지도 중앙을 살짝 위로 올리기 위한 보정
		const ADJUSTED_CENTER = {
			lat: center.lat - 0.0005,
			lng: center.lng,
		};

		const mapOption = {
			center: new window.kakao.maps.LatLng(ADJUSTED_CENTER.lat, ADJUSTED_CENTER.lng),
			level: options?.level || 2,
		};
		this.map = new window.kakao.maps.Map(container, mapOption);
	}

	addMarker(option: ITeamRestaurantLocationItem, index: number) {
		if (!this.map || !option) return;

		const pos = new kakao.maps.LatLng(option.latitude, option.longitude);

		// 마커로 사용할 HTML 요소 생성
		const content = document.createElement('div');
		content.style.display = 'flex';
		content.style.flexDirection = 'column';
		content.style.alignItems = 'center';
		content.style.textAlign = 'center';
		content.style.cursor = 'pointer';

		// 이미지 마커
		const img = document.createElement('img');
		img.src = location;
		img.style.width = '32px';
		img.style.height = '32px';

		// 텍스트 라벨
		const label = document.createElement('div');
		label.textContent = option.name ?? '';
		label.style.color = 'var(--Grayscale-121212, #121212)';
		label.style.textAlign = 'center';
		// 중앙사이드 스트로크 효과를 위한 text-shadow (8방향 그림자로 중앙사이드 효과 생성)
		label.style.textShadow = `
			0px -1px 0 var(--Grayscale-FFFFFF, #FFF),
			0px 1px 0 var(--Grayscale-FFFFFF, #FFF),
			-1px 0px 0 var(--Grayscale-FFFFFF, #FFF),
			1px 0px 0 var(--Grayscale-FFFFFF, #FFF),
			-0.5px -0.5px 0 var(--Grayscale-FFFFFF, #FFF),
			0.5px -0.5px 0 var(--Grayscale-FFFFFF, #FFF),
			-0.5px 0.5px 0 var(--Grayscale-FFFFFF, #FFF),
			0.5px 0.5px 0 var(--Grayscale-FFFFFF, #FFF)
		`;
		label.style.fontFamily = 'Pretendard';
		label.style.fontSize = '14px';
		label.style.fontStyle = 'normal';
		label.style.fontWeight = '600';
		label.style.lineHeight = '143%';
		label.style.letterSpacing = '0.14px';
		label.style.padding = '2px 6px';
		label.style.whiteSpace = 'nowrap';

		content.appendChild(img);
		content.appendChild(label);

		const customOverlay = new kakao.maps.CustomOverlay({
			position: pos,
			content,
			yAnchor: 1,
		});

		customOverlay.setMap(this.map);
		// 마커 리스트에는 overlay만 저장
		this.markers.push({ marker: customOverlay, index });

		content.onclick = () => {
			// 이전 마커 크기 원복
			if (this.selectedMarkerElement) {
				this.selectedMarkerElement.style.width = '32px';
				this.selectedMarkerElement.style.height = '32px';
			}

			// 현재 마커 크기 확대
			img.style.width = '48px';
			img.style.height = '48px';

			// 현재 마커 저장
			this.selectedMarkerElement = img;

			// 팝업 표시
			this.showInfoOverlay(option, pos);
		};
	}

	private showInfoOverlay(option: ITeamRestaurantLocationItem, position: any) {
		// 기존 팝업 제거
		if (this.selectedOverlay) {
			this.selectedOverlay.setMap(null);
		}

		const infoOverlay = new kakao.maps.CustomOverlay({
			content: option.name ?? '',
			position,
			yAnchor: 1.3,
		});

		infoOverlay.setMap(this.map);
		this.selectedOverlay = infoOverlay;
	}

	addCompanyMarker(option: IKakaoMapOptions) {
		if (!this.map || !option.center) return;

		const pos = new kakao.maps.LatLng(option.center.lat, option.center.lng);
		const imageSize = new kakao.maps.Size(110, 110);
		const markerImage = new kakao.maps.MarkerImage(회사핀, imageSize);

		const marker = new kakao.maps.Marker({
			position: pos,
			image: markerImage,
			map: this.map,
			zIndex: 1000,
		});

		marker.setClickable(false);
	}

	destroyMap() {
		this.markers.forEach(({ marker }) => marker.setMap(null));
		this.markers = [];
		this.map = null;
	}

	getMap() {
		return this.map;
	}
}
