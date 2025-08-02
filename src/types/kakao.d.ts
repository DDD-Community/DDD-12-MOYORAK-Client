// src/types/kakao.d.ts
export {};

declare global {
	namespace kakao {
		namespace maps {
			class Map {
				constructor(container: HTMLElement, options: object);
			}

			class Marker {
				constructor(options: object);
				setMap(map: Map | null): void;
				setClickable(clickable: boolean): void;
			}

			class LatLng {
				constructor(lat: number, lng: number);
			}

			class MarkerImage {
				constructor(src: string, size: Size);
			}

			class Size {
				constructor(width: number, height: number);
			}

			class CustomOverlay {
				constructor(options: object);
				setMap(map: Map | null): void;
			}

			function load(callback: () => void): void;
		}
	}

	interface Window {
		kakao: typeof kakao;
	}
}
