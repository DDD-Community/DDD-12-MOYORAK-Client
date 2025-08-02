import location from '@/assets/location.png';
import userCompany from '@/assets/userCompany.png';

export interface IKakaoMapOptions {
	center?: { lat: number; lng: number };
	level?: number;
	placeName?: string;
}

export default class KakaoMapCore {
	private map: any = null;
	private markers: any[] = [];

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

	addMarker(option: IKakaoMapOptions, index: number) {
		if (!this.map || !option.center) return;

		const pos = new kakao.maps.LatLng(option.center.lat, option.center.lng);

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
		label.textContent = option.placeName ?? '';
		label.style.marginTop = '4px';
		label.style.fontSize = '14px';
		label.style.background = 'white';
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
	}

	addCompanyMarker(option: IKakaoMapOptions) {
		if (!this.map || !option.center) return;

		const pos = new kakao.maps.LatLng(option.center.lat, option.center.lng);
		const imageSize = new kakao.maps.Size(100, 115);
		const markerImage = new kakao.maps.MarkerImage(userCompany, imageSize);

		const marker = new kakao.maps.Marker({
			position: pos,
			image: markerImage,
			map: this.map,
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
