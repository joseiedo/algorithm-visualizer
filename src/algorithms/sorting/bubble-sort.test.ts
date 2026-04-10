import { describe, expect, test } from "vitest";
import { bubbleSort } from "./bubble-sort";

describe("bubbleSort.computeSteps", () => {
	test("starts from the unsorted input and ends with a fully sorted final step", () => {
		const steps = bubbleSort.computeSteps([3, 1, 2]);
		const firstStep = steps[0];
		const lastStep = steps[steps.length - 1];

		expect(firstStep.line).toBe(1);
		expect(firstStep.array.map((element) => element.value)).toEqual([3, 1, 2]);
		expect(firstStep.sorted).toEqual([]);

		expect(lastStep.line).toBe(11);
		expect(lastStep.array.map((element) => element.value)).toEqual([1, 2, 3]);
		expect(lastStep.sorted).toEqual([0, 1, 2]);
	});
});
