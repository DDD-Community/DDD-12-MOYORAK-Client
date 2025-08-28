import Icon from '@/components/Icon';

interface IPaginationProps {
	currentPage: number;
	totalCount: number;
	size: number;
	onPageChange: (page: number) => void;
	className?: string;
	variant?: 'default' | 'large';
}

const Pagination = ({ currentPage, totalCount, size, onPageChange, className = '', variant = 'default' }: IPaginationProps) => {
	const totalPages = Math.ceil(totalCount / size);

	if (totalCount <= size) {
		return null;
	}

	const isLarge = variant === 'large';
	const buttonSize = isLarge ? 'px-3 py-2' : 'px-2 py-1';
	const iconSize = isLarge ? 20 : 16;
	const textSize = isLarge ? 'text-sm' : 'text-xs';
	const activeColor = isLarge ? 'text-white' : 'text-gray-10';

	return (
		<div className={`flex justify-center items-center gap-2 ${className}`}>
			<button
				onClick={() => onPageChange(Math.max(1, currentPage - 1))}
				disabled={currentPage === 1}
				className={`${buttonSize} rounded ${currentPage === 1 ? 'text-gray-04 cursor-not-allowed' : 'text-gray-08 hover:text-gray-10'}`}
			>
				{isLarge ? <Icon name="back" size={iconSize} /> : <Icon name="arrowRight" size={iconSize} className="rotate-180" />}
			</button>

			<div className="flex gap-1">
				{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
					<button
						key={page}
						onClick={() => onPageChange(page)}
						className={`${buttonSize} rounded ${textSize} font-medium ${
							currentPage === page ? `bg-primary-200 ${activeColor}` : 'text-gray-08 hover:text-gray-10 hover:bg-gray-02'
						}`}
					>
						{page}
					</button>
				))}
			</div>

			<button
				onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
				disabled={currentPage === totalPages}
				className={`${buttonSize} rounded ${currentPage === totalPages ? 'text-gray-04 cursor-not-allowed' : 'text-gray-08 hover:text-gray-10'}`}
			>
				<Icon name="arrowRight" size={iconSize} />
			</button>
		</div>
	);
};

export default Pagination;
