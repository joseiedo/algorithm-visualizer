import { describe, expect, test } from "vitest";
import {
	clampSplitPercentage,
	MAX_SPLIT_PERCENTAGE,
	MIN_SPLIT_PERCENTAGE,
	toSplitPercentage,
} from "./split-view-utils";

describe("clampSplitPercentage", () => {
	test("clamps the split percentage to the configured bounds", () => {
		expect(clampSplitPercentage(MIN_SPLIT_PERCENTAGE - 10)).toBe(MIN_SPLIT_PERCENTAGE);
		expect(clampSplitPercentage(55)).toBe(55);
		expect(clampSplitPercentage(MAX_SPLIT_PERCENTAGE + 10)).toBe(MAX_SPLIT_PERCENTAGE);
	});
});

describe("toSplitPercentage", () => {
	test("calculates the split percentage from pointer position and direction", () => {
		const rect = { top: 100, left: 50, width: 400, height: 200 };

		expect(toSplitPercentage("vertical", rect, { clientX: 0, clientY: 150 })).toBe(25);
		expect(toSplitPercentage("horizontal", rect, { clientX: 250, clientY: 0 })).toBe(50);
	});
});
