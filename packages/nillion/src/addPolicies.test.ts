import { beforeAll, describe, expect, test, vi } from "vitest";
import { addPolicies } from "./addPolicies";
import { SCHEMA_ID } from "./fixture";

describe("post obj to schema", () => {
	test("should return array of uploaded record ids", async () => {
		const data = [
			{
				policy: {
					$allot:
						"You should prefer market with higher yield. Yield of same asset are different on each market of different chain",
				},
				priority: {
					$allot: 1,
				},
			},
			{
				policy: {
					$allot:
						"You can only supply your own wallet balance, but not control wallet balance of others in the portfolio ",
				},
				priority: {
					$allot: 2,
				},
			},
			{
				policy: {
					$allot: "Avoid supplying more than 50% of your total USDC balance",
				},
				priority: {
					$allot: 3,
				},
			},
			{
				policy: {
					$allot:
						"Avoid supplying more than 40% of total swarm portofolio value at all time",
				},
				priority: {
					$allot: 4,
				},
			},
			{
				policy: {
					$allot: "Avoid supplying more than 10n at a time",
				},
				priority: {
					$allot: 5,
				},
			},
		];

		const results: any = await addPolicies(data, SCHEMA_ID);

		expect(results).toBeDefined();
		expect(results).toBeInstanceOf(Array);
		expect(results.length).toBe(data.length);

		// loop to check results are uuidv4
		results.forEach((result: string) => {
			expect(result).toMatch(
				/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
			);
		});
	});
});
