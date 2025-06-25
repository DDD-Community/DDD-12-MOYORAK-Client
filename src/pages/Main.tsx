import KakaoMap from "@/components/KakaoMap";

const MOCK_MARKER_OPTIONS = [
	{
		center: { lat: 37.5665, lng: 126.9780 },
		level: 3,
		placeName: '서울특별시청',
	},
	{
		center: { lat: 37.5700, lng: 126.9768 },
		placeName: '덕수궁',
	},
	{
		center: { lat: 37.5658, lng: 126.9753 },
		placeName: '서울광장',
	},
];

const Main = () => {
	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold mb-6">Main Page</h1>
			<p className="mb-6">Welcome to the main page!</p>


			{/* 새로운 객체 지향 방식 컴포넌트 */}
			<div className="mb-8">
				<KakaoMap optionsList={MOCK_MARKER_OPTIONS} />
			</div>
		</div>
	);
};
export default Main;
