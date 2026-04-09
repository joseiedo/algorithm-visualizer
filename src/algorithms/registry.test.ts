import { describe, expect, test } from "vitest";
import { getAlgorithmsByCategory } from "@/algorithms/registry";
import type { AlgorithmCategory } from "./types";

describe("AlgorithmRegistry", () => {

	test("get algorithm by category filtering correctly", () => {
		const category: AlgorithmCategory = "sorting";
		const algorithms = getAlgorithmsByCategory(category);

		expect(algorithms.length).toBeGreaterThan(0);
		algorithms.forEach((algo) => {
			expect(algo.category).toBe(category);
		})
	})
})
