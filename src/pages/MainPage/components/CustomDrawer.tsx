import { type ReactNode, useEffect, useRef, useState } from 'react';

import { useQueryTeamRestaurantList } from '@/apis/useQueryTeamRestaurantList';
import Pagination from '@/components/Pagination/Pagination';

import Empty from '../Empty';

import RestaurantReview from './RestaurantReview';

const BASIC_HEIGHT = 300;
const MIN_HEIGHT = 120;

const UP_THRESHOLD = 8;
const DOWN_THRESHOLD = 8;

export const FILTER_TYPES = {
	DISTANCE: '거리순',
	RATING: '평점순',
	LATEST: '최신순',
} as const;

export type FilterType = (typeof FILTER_TYPES)[keyof typeof FILTER_TYPES];

// 필터 타입을 API 파라미터로 매핑
const getApiSortOption = (filterType: FilterType): string => {
	switch (filterType) {
		case FILTER_TYPES.DISTANCE:
			return 'DISTANCE';
		case FILTER_TYPES.RATING:
			return 'RATING';
		case FILTER_TYPES.LATEST:
			return 'RECENT';
		default:
			return 'DISTANCE';
	}
};

interface ICustomDrawerProps {
	header: ReactNode;
	filterType: FilterType;
}

const CustomDrawer = ({ header, filterType }: ICustomDrawerProps) => {
	const teamId = localStorage.getItem('teamId');
	const [currentPage, setCurrentPage] = useState(1);
	const size = 5;
	const sortOption = getApiSortOption(filterType);
	const { data: restaurantList } = useQueryTeamRestaurantList(String(teamId), sortOption, size, currentPage);

	const [height, setHeight] = useState(BASIC_HEIGHT);
	const dragging = useRef(false);
	const startY = useRef(0);
	const startHeight = useRef(BASIC_HEIGHT);
	const animationFrame = useRef<number | null>(null);
	const [disableTransition, setDisableTransition] = useState(false);
	const [isDragging, setIsDragging] = useState(false);

	const fullHeightRef = useRef(window.innerHeight);
	const maxHeightRef = useRef(window.innerHeight * 0.9);
	const newHeight = useRef(height);

	// 핸들 영역 ref
	const handleRef = useRef<HTMLDivElement>(null);

	// 드래그 관련 공통 로직 (마우스/터치에서 호출)
	const handleDragMove = (clientY: number) => {
		if (!dragging.current) return;
		const diff = startY.current - clientY;
		let calcHeight = startHeight.current + diff;

		if (calcHeight > fullHeightRef.current) calcHeight = fullHeightRef.current;
		if (calcHeight < MIN_HEIGHT) calcHeight = MIN_HEIGHT;

		newHeight.current = calcHeight;

		if (!animationFrame.current) {
			animationFrame.current = requestAnimationFrame(() => {
				setHeight(newHeight.current);
				animationFrame.current = null;
			});
		}
	};

	const handleDragEnd = () => {
		if (!dragging.current) return;
		dragging.current = false;
		document.body.style.userSelect = '';
		setIsDragging(false);
		setDisableTransition(false);

		if (animationFrame.current) {
			cancelAnimationFrame(animationFrame.current);
			animationFrame.current = null;
		}
		setHeight(newHeight.current);

		const diff = newHeight.current - startHeight.current;

		if (diff > UP_THRESHOLD) {
			setHeight(fullHeightRef.current);
		} else if (diff < -DOWN_THRESHOLD) {
			setHeight(BASIC_HEIGHT);
		} else {
			setHeight(startHeight.current);
		}

		// 마우스 이벤트 리스너 제거
		window.removeEventListener('mousemove', onMouseMove);
		window.removeEventListener('mouseup', onMouseUp);
	};

	// 마우스 이벤트
	const onMouseMove = (e: MouseEvent) => {
		handleDragMove(e.clientY);
	};

	const onMouseUp = () => {
		handleDragEnd();
	};

	// 터치 이벤트
	const onTouchMove = (e: React.TouchEvent) => {
		handleDragMove(e.touches[0].clientY);
	};
	const onTouchEnd = () => {
		handleDragEnd();
	};

	// 드래그 시작 (마우스)
	const onDragStartMouse = (e: React.MouseEvent, isHandleArea: boolean) => {
		e.preventDefault();
		dragging.current = true;
		setIsDragging(true);
		setDisableTransition(true);
		startY.current = e.clientY;
		startHeight.current = height;
		newHeight.current = height;
		document.body.style.userSelect = 'none';

		// 핸들 영역 드래그일 때만 window에 mousemove, mouseup 붙임
		if (isHandleArea) {
			window.addEventListener('mousemove', onMouseMove);
			window.addEventListener('mouseup', onMouseUp);
		}
	};

	// 드래그 시작 (터치)
	const onDragStartTouch = (e: React.TouchEvent) => {
		dragging.current = true;
		setIsDragging(true);
		setDisableTransition(true);
		startY.current = e.touches[0].clientY;
		startHeight.current = height;
		newHeight.current = height;
		document.body.style.userSelect = 'none';
	};

	// 바텀시트 전체에서 마우스 드래그 시작 (핸들 숨겨진 상태에서 아래로 내리는 용)
	const onMouseDownSheet = (e: React.MouseEvent) => {
		// 핸들 숨겨져있으면(풀스크린 상태) 전체 영역 드래그 가능
		if (height === fullHeightRef.current) {
			onDragStartMouse(e, false);
			window.addEventListener('mousemove', onMouseMove);
			window.addEventListener('mouseup', onMouseUp);
		}
	};

	useEffect(() => {
		// 윈도우 크기 변경 시 최신화
		const onResize = () => {
			fullHeightRef.current = window.innerHeight;
			maxHeightRef.current = window.innerHeight * 0.9;
		};
		window.addEventListener('resize', onResize);

		// 자동 초기 높이 설정
		const timer = setTimeout(() => {
			setHeight(BASIC_HEIGHT);
		}, 500);

		return () => {
			window.removeEventListener('resize', onResize);
			clearTimeout(timer);
		};
	}, []);

	// 필터 변경 시 첫 페이지로 이동
	useEffect(() => {
		setCurrentPage(1);
	}, [filterType]);

	return (
		<div
			style={{
				height,
				bottom: 0,
				borderTopLeftRadius: height === fullHeightRef.current ? 0 : 30,
				borderTopRightRadius: height === fullHeightRef.current ? 0 : 30,
			}}
			className={`fixed left-0 right-0 bg-white shadow-lg z-50 flex flex-col ${disableTransition ? '' : 'transition-[height] duration-300 ease-out'}`}
			onTouchStart={onDragStartTouch}
			onTouchMove={onTouchMove}
			onTouchEnd={onTouchEnd}
			onTouchCancel={onTouchEnd}
			onMouseDown={onMouseDownSheet}
		>
			{/* 커서칩 */}
			{height < fullHeightRef.current && (
				<div ref={handleRef} className="flex justify-center pt-[10px] cursor-grab" onMouseDown={(e) => onDragStartMouse(e, true)}>
					<div className="w-14 h-1.5 bg-gray-300 rounded-full" />
				</div>
			)}

			<header className="px-[18px] pt-[20px] pb-[10px]">{header && header}</header>

			{/* 내용 */}
			<div className={`flex-1 p-4.5 ${isDragging ? 'overflow-hidden' : 'overflow-auto'}`}>
				{restaurantList?.data.length === 0 ? (
					<Empty />
				) : (
					<>
						<ul className="flex flex-col gap-5">
							{restaurantList?.data.map((item, id) => (
								<RestaurantReview key={id} item={item} />
							))}
						</ul>

						{/* 페이지네이션 */}
						{restaurantList && (
							<Pagination currentPage={currentPage} totalCount={restaurantList.totalCount} size={size} onPageChange={setCurrentPage} className="mt-6" />
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default CustomDrawer;
