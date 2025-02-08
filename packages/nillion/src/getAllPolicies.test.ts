import { describe, expect, test, vi } from "vitest";
import { getAllPolicies } from "./getAllPolicies";

describe("get obj", () => {
	test("should return >0 objects", async () => {
		const SCHEMA_ID = "8e21e686-17ab-4507-a530-edcab0b5416a";

		const result: any = await getAllPolicies(SCHEMA_ID);

		expect(result).toBeDefined();
		expect(result).toBeInstanceOf(Array);
		expect(result.length).toBeGreaterThan(0);
		expect(result[0]._id).toMatch(
			/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
		);
	});
});
