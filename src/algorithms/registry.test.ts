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
		});
	});

	test("returns curve algorithms when filtering by curves", () => {
		const category: AlgorithmCategory = "curves";
		const algorithms = getAlgorithmsByCategory(category);

		expect(algorithms.some((algo) => algo.id === "quadratic-bezier")).toBe(true);
		algorithms.forEach((algo) => {
			expect(algo.category).toBe(category);
		});
	});
})
