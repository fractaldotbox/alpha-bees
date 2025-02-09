import { beforeAll, describe, expect, test, vi } from "vitest";
import { addPolicies } from "./addPolicies";
import { SCHEMA_ID } from "./fixture";
import { getAllPolicies } from "./getAllPolicies";

describe("get obj", () => {
	// TODO separate vault from flush test

	beforeAll(async () => {
		const data = [
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
		console.log("added", results);
	});

	test("should return >0 objects", async () => {
		const result: any = await getAllPolicies(SCHEMA_ID);
		console.log("policies", result);
		expect(result).toBeDefined();
		expect(result).toBeInstanceOf(Array);
		expect(result.length).toBeGreaterThan(0);
		expect(result[0]._id).toMatch(
			/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
		);
	});
}, 10000);
