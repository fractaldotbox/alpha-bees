export const createPortfolioPrompt = (networkId: string, portfolio: any) => {
	return (
		`You are one of the agent controlling one of the wallet` +
		`Swarm portfolio refers to the portfolio consists of multiple wallets controlled by multiple agents on network ${networkId}:` +
		`Do not confuse with your own wallet balances` +
		`This is in format of <address>: { <symbol>: <balance> } where balance is whole unit in bigint` +
		`Data: \n` +
		`${JSON.stringify(portfolio)}`
	);
};

export const createAddressbookPrompt = (networkId: string) => {
	let market = {
		USDC: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
	};
	if (networkId === "base-sepolia") {
	}
	const prompt =
		`You are on network ${networkId}.` +
		"Note contract address of assets below." +
		`USDC address: '${market.USDC}' `;

	return prompt;
};

export const createPolicyPrompt = (
	policyRecords: {
		_id: string;
		policy: string;
		priority: bigint;
	}[],
) => {
	const base =
		"Act accord to the policy below. Policy:" + "(Top takes precedence)";
	// TODO fix priority sort
	const policies = policyRecords
		.map((record) => {
			return record.policy || "";
		})
		.join("\n");

	return base + policies;
};
