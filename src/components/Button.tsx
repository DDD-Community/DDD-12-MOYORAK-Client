import React, { useState } from 'react';

interface ButtonProps {
	children: React.ReactNode;
	variant?: 'disabled' | 'general' | 'active' | 'clicked';
	onClick?: () => void;
	disabled?: boolean;
}

const Button = ({ children, variant = 'general', onClick, disabled }: ButtonProps) => {
	const getButtonClasses = () => {
		const baseClasses = 'h-[50px] px-6 rounded-lg font-medium transition-all duration-200 text-sm';

		switch (variant) {
			case 'disabled':
				return `${baseClasses} bg-gray-300 text-gray-500 cursor-not-allowed`;
			case 'general':
				return `${baseClasses} bg-black text-gray-700 border border-gray-300 hover:bg-gray-50`;
			case 'active':
				return `${baseClasses} bg-green-500 text-white hover:bg-green-600`;
			case 'clicked':
				return `${baseClasses} bg-green-300 text-green-800`;
		}
	};

	return (
		<button className={getButtonClasses()} onClick={onClick} disabled={disabled || variant === 'disabled'}>
			{children}
		</button>
	);
};

const ButtonShowcase = () => {
	const [clickedStates, setClickedStates] = useState({
		general: false,
		active: false,
		clicked: false,
		disabled: false,
	});

	const handleClick = (buttonType: string) => {
		setClickedStates((prev) => ({
			...prev,
			[buttonType]: true,
		}));
	};

	return (
		<div className="p-8 bg-gray-100 min-h-screen">
			<div className="flex gap-4 flex-wrap">
				<Button variant="disabled" disabled>
					버튼
				</Button>

				<Button variant={clickedStates.general ? 'clicked' : 'general'} onClick={() => handleClick('general')}>
					버튼
				</Button>

				<Button variant={clickedStates.active ? 'clicked' : 'active'} onClick={() => handleClick('active')}>
					버튼
				</Button>

				<Button variant="clicked">버튼</Button>
			</div>
		</div>
	);
};

export default ButtonShowcase;
