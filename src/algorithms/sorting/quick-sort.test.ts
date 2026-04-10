import { describe, expect, test } from "vitest";
import { quickSort } from "./quick-sort";

describe("quickSort.computeSteps", () => {
	test("starts from the unsorted input and ends with a fully sorted final step", () => {
		const steps = quickSort.computeSteps([3, 1, 2]);
		const firstStep = steps[0];
		const lastStep = steps[steps.length - 1];

		expect(firstStep.line).toBe(1);
		expect(firstStep.array.map((element) => element.value)).toEqual([3, 1, 2]);
		expect(firstStep.sorted).toEqual([]);

		expect(lastStep.line).toBe(7);
		expect(lastStep.array.map((element) => element.value)).toEqual([1, 2, 3]);
		expect(lastStep.sorted).toEqual([0, 1, 2]);
	});

	test("emits swap steps while partitioning an out-of-order input", () => {
		const steps = quickSort.computeSteps([3, 1, 2]);

		expect(steps.some((step) => step.swapped && step.swapped.length === 2)).toBe(true);
		expect(steps.some((step) => step.annotations?.[23]?.includes("pivotIndex"))).toBe(true);
	});
});
