import { SecretVaultWrapper } from "nillion-sv-wrappers";
import { config } from "./config";

export const addPolicies = async (
	data,
	schemaId: any = "8e21e686-17ab-4507-a530-edcab0b5416a",
) => {
	try {
		const collection = new SecretVaultWrapper(
			config.nodes,
			config.orgCredentials,
			schemaId,
		);
		await collection.init();
		console.log("✅ Collection initialized");
		const dataWritten = await collection.writeToNodes(data);
		console.log(dataWritten);
		console.log(
			"👀 Data written to nodes:",
			JSON.stringify(dataWritten, null, 2),
		);

		const newIds = [
			...new Set(
				dataWritten.map((item: any) => item.result.data.created).flat(),
			),
		];
		console.log("uploaded record ids:", newIds);

		return newIds;
	} catch (error: any) {
		console.error("❌ SecretVaultWrapper error:", error.message);
		process.exit(1);
	}
};
