import DaumPostcode from 'react-daum-postcode';

const PopupAddress = () => {
	const handleComplete = (data: any) => {
		const fullAddress = data.address;
		window.opener.postMessage(
			{
				type: 'selectedAddress',
				payload: fullAddress,
			},
			window.location.origin
		);
	};

	return (
		<div style={{ padding: '20px' }}>
			<h2 style={{ marginBottom: '10px' }}>주소 검색</h2>
			<DaumPostcode onComplete={handleComplete} />
		</div>
	);
};

export default PopupAddress;
