interface FundProps {
	recipientAddress: `0x${string}`;
}

export function Fund({ recipientAddress }: FundProps) {
	return (
		<div className="w-[400px] h-[200px] bg-white rounded-lg shadow flex flex-col items-center justify-center gap-4">
			<div className="flex items-center gap-2">
				Fund the agent by sending funds to: {recipientAddress}
			</div>
		</div>
	);
}
