import { useEffect, useRef } from 'react';

interface IKakaoMapOptions {
  center?: { lat: number; lng: number };
  level?: number;
  placeName?: string;
}

interface IKakaoMapProps {
  optionsList?: IKakaoMapOptions[];
}

class KakaoMapCore {
  static init(): Promise<void> {

    return new Promise((resolve) => {
      const KAKAO_MAP_URL = import.meta.env.VITE_KAKAO_MAP_URL;
      const KAKAO_MAP_KEY = import.meta.env.VITE_KAKAO_MAP_KEY;
      const kakaoScript = document.querySelector(`script[src*="${KAKAO_MAP_URL}"]`);

      const onReady = () => {
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => {
            resolve();
          });
        }
      };

      if (!kakaoScript) {
        const script = document.createElement('script');
        script.src = `${KAKAO_MAP_URL}?appkey=${KAKAO_MAP_KEY}&autoload=false`;
        script.async = true;
        script.onload = onReady;
        document.head.appendChild(script);
      } else {
        onReady();
      }
    })
}

  static createMap(container: HTMLDivElement, options: IKakaoMapOptions) {
    const mapOption = {
      center: new window.kakao.maps.LatLng(
        options?.center?.lat || 37.5665,
        options?.center?.lng || 126.9780
      ),
      level: options?.level || 3,
    };

    return new window.kakao.maps.Map(container, mapOption);
  }

  static addMarker(map: KakaoMapCore, opt: IKakaoMapOptions) {
    if (!opt.center) return;
    const pos = new window.kakao.maps.LatLng(opt.center.lat, opt.center.lng);
    const marker = new window.kakao.maps.Marker({ position: pos, map });

    if (opt.placeName) {
      const infoWindow = new window.kakao.maps.InfoWindow({
        // TODO: 수연: 툴팁 컴포넌트 추가 예정
        content: `<div>${opt.placeName}</div>`,
        position: pos,
      });

      infoWindow.open(map, marker);
    }

    return marker;
  }
}

const KakaoMap = ({ optionsList = [] }: IKakaoMapProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<KakaoMapCore | null>(null);

  useEffect(() => {
    const initialize = async () => {
      if (!mapRef.current || optionsList.length === 0) return;

      await KakaoMapCore.init();

      mapInstance.current = KakaoMapCore.createMap(mapRef.current, optionsList[0]);

      optionsList.forEach(opt => {
        if (opt.center) {
          KakaoMapCore.addMarker(mapInstance.current!, opt);
        }
      });
    };

    initialize();
  }, [optionsList]);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <div
        ref={mapRef}
        style={{ width: '100%', height: '100vh' }}
        className="w-full h-96 bg-gray-200"
      />
    </div>
  );
};

export default KakaoMap;