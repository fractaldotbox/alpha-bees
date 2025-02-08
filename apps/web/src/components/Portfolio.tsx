import React from "react";

const Portfolio = () => {
	// Example portfolio data. In a real app, this would come from an API.
	const portfolioData = [
		{ symbol: "AAPL", shares: 10, value: "$1500" },
		{ symbol: "GOOGL", shares: 5, value: "$2700" },
		{ symbol: "AMZN", shares: 2, value: "$3300" },
	];

	return (
		<div className="bg-white rounded-lg shadow p-4">
			{portfolioData.map((item, index) => (
				<div
					key={index}
					className="flex justify-between border-b border-gray-200 py-2 last:border-0"
				>
					<div>
						<span className="font-semibold">{item.symbol}</span> — {item.shares}{" "}
						shares
					</div>
					<div>{item.value}</div>
				</div>
			))}
		</div>
	);
};

export default Portfolio;
