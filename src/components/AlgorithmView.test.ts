import { describe, expect, test } from "vitest";
import { resolveAlgorithmView, toggleLayoutDirection } from "./algorithm-view-utils";

describe("resolveAlgorithmView", () => {
	test("returns the requested algorithm when the route id is valid", () => {
		const result = resolveAlgorithmView("bubble-sort");

		expect(result.shouldRedirect).toBe(false);
		expect(result.algorithm.id).toBe("bubble-sort");
	});

	test("falls back to the default algorithm and redirects when the route id is invalid", () => {
		const result = resolveAlgorithmView("does-not-exist");

		expect(result.shouldRedirect).toBe(true);
		expect(result.algorithm.id).toBe("bubble-sort");
	});

	test("falls back to the default algorithm without redirect when the route id is missing", () => {
		const result = resolveAlgorithmView(undefined);

		expect(result.shouldRedirect).toBe(false);
		expect(result.algorithm.id).toBe("bubble-sort");
	});
});

describe("toggleLayoutDirection", () => {
	test("switches between vertical and horizontal layouts", () => {
		expect(toggleLayoutDirection("vertical")).toBe("horizontal");
		expect(toggleLayoutDirection("horizontal")).toBe("vertical");
	});
});
