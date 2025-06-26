import React from 'react';

interface IButtonProps {
	children: React.ReactNode;
	variant?: 'disabled' | 'general' | 'active' | 'clicked';
	onClick?: () => void;
}

const Button = ({ children, variant = 'general', onClick }: IButtonProps) => {
	const getButtonClasses = () => {
		const baseClasses = 'h-[50px] min-w-[120px] w-full font-[Pretendard] text-base font-medium leading-[150%] tracking-[0.091px] rounded-[10px]';

		//  todo : tailwind.config.js에서 theme.extend.colors에 추가한 후 사용
		switch (variant) {
			case 'disabled':
				return `${baseClasses} bg-[#F0F0F0] text-[#B0B0B0] cursor-not-allowed`;
			case 'general':
				return `${baseClasses} border-[1px] border-solid border-[var(--Grayscale-C4C4C4,#C4C4C4)] bg-[#FFF] text-[#5C5C5C]`;
			case 'active':
				return `${baseClasses} bg-[#9FD926] text-white`;
			case 'clicked':
				return `${baseClasses} border-[1px] border-solid border-[var(--Primary-82DC28,#82DC28)] bg-[#9FD92626] text-[#70CE13]`;
		}
	};

	return (
		<button className={getButtonClasses()} onClick={onClick} disabled={variant === 'disabled'}>
			{children}
		</button>
	);
};

export default Button;

// const ButtonShowcase = () => {
// 	const [formValid, setFormValid] = useState(false); // 폼 유효성 상태
// 	const [isClicked, setIsClicked] = useState(false); // 클릭 상태

// 	const handleFormValidation = () => {
// 		// 폼 요구사항을 만족했다고 가정
// 		setFormValid(true);
// 	};

// 	const handleGeneralClick = () => {
// 		// general ↔ clicked 토글
// 		setIsClicked(!isClicked);
// 	};

// 	return (
// 		<div className="p-8 min-h-screen">
// 			<div className="mb-6">
// 				<button onClick={handleFormValidation} className="px-4 py-2 bg-blue-500 text-white rounded mb-4">
// 					폼 요구사항 만족 (테스트용)
// 				</button>
// 			</div>

// 			<div className="flex gap-4 flex-wrap">
// 				{/* 1. disabled → 조건 만족 시 active */}
// 				<Button variant={formValid ? 'active' : 'disabled'}>버튼1</Button>

// 				{/* 2. general → 클릭 시 clicked */}
// 				<Button variant={isClicked ? 'clicked' : 'general'} onClick={handleGeneralClick}>
// 					버튼2
// 				</Button>

// 				{/* 3. 항상 active 상태 (예시) */}
// 				<Button variant="active">버튼3</Button>

// 				{/* 4. 항상 clicked 상태 (예시) */}
// 				<Button variant="clicked">버튼4</Button>
// 			</div>

// 			<div className="mt-6 text-sm text-gray-600">
// 				<p>• 버튼1: disabled → 조건 만족 시 active</p>
// 				<p>• 버튼2: general ↔ clicked (토글)</p>
// 				<p>• 폼 유효성: {formValid ? '만족' : '불만족'}</p>
// 				<p>• 클릭 상태: {isClicked ? '클릭됨' : '미클릭'}</p>
// 			</div>
// 		</div>
// 	);
// };

// export default ButtonShowcase;
