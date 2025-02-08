import { describe, expect, test, vi } from "vitest";
import { addPolicies } from "./addPolicies";
import { flushPolicies } from "./flushPolicies";
import { getAllPolicies } from "./getAllPolicies";

describe("all policies should be removed", () => {
	test("there should be 0 items left after flushing", async () => {
		const SCHEMA_ID = "8e21e686-17ab-4507-a530-edcab0b5416a";

		// check if any policies are present
		const initialResult: any = await getAllPolicies(SCHEMA_ID);
		if (initialResult.length === 0) {
			// if no policies are present, add some
			const data = [
				{
					policy: {
						$allot:
							"you should take advantage of higher yield. If yield is higher at your responsible market, supply more.",
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
		}

		const result: any = await flushPolicies(SCHEMA_ID);

		expect(result).toBeDefined();

		const getResult: any = await getAllPolicies(SCHEMA_ID);
		expect(getResult.length).toBe(0);
	});
});
