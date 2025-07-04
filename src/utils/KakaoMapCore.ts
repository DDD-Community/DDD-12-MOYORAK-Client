export interface IKakaoMapOptions {
	center?: { lat: number; lng: number };
	level?: number;
	placeName?: string;
}

export default class KakaoMapCore {
	private map: InstanceType<typeof window.kakao.maps.Map> | null = null;
	private markers: InstanceType<typeof window.kakao.maps.Marker>[] = [];

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
		const mapOption = {
			center: new window.kakao.maps.LatLng(center.lat, center.lng),
			level: options?.level || 3,
		};

		this.map = new window.kakao.maps.Map(container, mapOption);
	}

	addMarker(option: IKakaoMapOptions) {
		if (!this.map || !option.center) return;

		const pos = new window.kakao.maps.LatLng(option.center.lat, option.center.lng);
		const marker = new window.kakao.maps.Marker({
			position: pos,
			map: this.map,
		});

		if (option.placeName) {
			const infoWindow = new window.kakao.maps.InfoWindow({
				// TODO: 수연 - 툴팁 컴포넌트 추가 예정
				content: `<div>${option.placeName}</div>`,
				position: pos,
			});

			infoWindow.open(this.map, marker);
		}

		this.markers.push(marker);
	}

	destroyMap() {
		this.markers.forEach((marker) => marker.setMap(null));
		this.markers = [];
		this.map = null;
	}

	getMap() {
		return this.map;
	}
}
