import { describe, expect, test } from "vitest";
import {
	getCurvePointLabelAnimation,
	getLabelY,
	getLabelBoxesForPoints,
	getNonOverlappingLabelBox,
	getPointMarkerBoxesForPoints,
} from "./bezier-renderer-utils";

describe("getLabelY", () => {
	test("keeps the curve point label inside the top of the view box", () => {
		const pointY = 10;
		const labelOffsetY = -18;
		const minLabelY = 14;

		expect(getLabelY(pointY, labelOffsetY, minLabelY)).toBe(minLabelY);
	});

	test("keeps the curve point label at the top boundary when it lands exactly there", () => {
		const labelOffsetY = -18;
		const minLabelY = 14;
		const pointY = minLabelY - labelOffsetY;

		expect(getLabelY(pointY, labelOffsetY, minLabelY)).toBe(minLabelY);
	});

	test("keeps the curve point label above the point instead of clamping when it fits inside the view box", () => {
		const pointY = 80;
		const labelOffsetY = -18;
		const minLabelY = 14;
		const expectedLabelY = pointY + labelOffsetY;

		expect(getLabelY(pointY, labelOffsetY, minLabelY)).toBe(expectedLabelY);
	});
});

describe("getCurvePointLabelAnimation", () => {
	test("positions the curve point label inside the top of the view box", () => {
		const pointNearTop = { x: 50, y: 10 };
		const labelOffsetY = -12;
		const minLabelY = 20;
		const options = { labelOffsetY, minLabelY };

		expect(getCurvePointLabelAnimation(pointNearTop, options)).toEqual({
			x: pointNearTop.x,
			y: minLabelY,
			opacity: 1,
		});
	});

	test("uses the alternate curve point label position when the preferred label box overlaps an occupied label box", () => {
		const point = { x: 100, y: 100 };
		const labelOffsetY = -18;
		const alternateLabelOffsetY = 24;
		const minLabelY = 14;
		const labelWidth = 12;
		const labelHeight = 14;
		const occupiedLabelBoxes = [{ x: 94, y: 68, width: 12, height: 14 }];

		expect(
			getCurvePointLabelAnimation(point, {
				labelOffsetY,
				alternateLabelOffsetY,
				minLabelY,
				labelWidth,
				labelHeight,
				occupiedLabelBoxes,
			}),
		).toEqual({
			x: point.x,
			y: point.y + alternateLabelOffsetY,
			opacity: 1,
		});
	});

	test("uses a side label position when both vertical label boxes overlap occupied label boxes", () => {
		const point = { x: 100, y: 100 };
		const labelOffsetY = -18;
		const alternateLabelOffsetY = 24;
		const sideLabelOffsetX = 24;
		const sideLabelOffsetY = 5;
		const minLabelY = 14;
		const labelWidth = 12;
		const labelHeight = 14;
		const occupiedLabelBoxes = [
			{ x: 94, y: 68, width: 12, height: 14 },
			{ x: 94, y: 110, width: 12, height: 14 },
		];

		expect(
			getCurvePointLabelAnimation(point, {
				labelOffsetY,
				alternateLabelOffsetY,
				sideLabelOffsetX,
				sideLabelOffsetY,
				minLabelY,
				labelWidth,
				labelHeight,
				occupiedLabelBoxes,
			}),
		).toEqual({
			x: point.x + sideLabelOffsetX,
			y: point.y + sideLabelOffsetY,
			opacity: 1,
		});
	});
});

describe("getNonOverlappingLabelBox", () => {
	test("uses the preferred label box when it does not overlap an occupied label box", () => {
		const preferredLabelBox = { x: 100, y: 82, width: 12, height: 14 };
		const alternateLabelBox = { x: 100, y: 124, width: 12, height: 14 };
		const occupiedLabelBoxes = [{ x: 140, y: 78, width: 12, height: 14 }];

		expect(
			getNonOverlappingLabelBox({
				preferredLabelBox,
				alternateLabelBox,
				occupiedLabelBoxes,
			}),
		).toEqual(preferredLabelBox);
	});

	test("uses an alternate label box when the preferred label box overlaps an occupied label box", () => {
		const preferredLabelBox = { x: 100, y: 82, width: 12, height: 14 };
		const alternateLabelBox = { x: 100, y: 124, width: 12, height: 14 };
		const occupiedLabelBoxes = [{ x: 96, y: 78, width: 12, height: 14 }];

		expect(
			getNonOverlappingLabelBox({
				preferredLabelBox,
				alternateLabelBox,
				occupiedLabelBoxes,
			}),
		).toEqual(alternateLabelBox);
	});
});

describe("getLabelBoxesForPoints", () => {
	test("builds centered label boxes from point label positions", () => {
		expect(
			getLabelBoxesForPoints([{ x: 100, y: 100 }], {
				labelOffsetY: 24,
				labelWidth: 12,
				labelHeight: 14,
			}),
		).toEqual([{ x: 94, y: 110, width: 12, height: 14 }]);
	});
});

describe("getPointMarkerBoxesForPoints", () => {
	test("builds boxes around point markers", () => {
		expect(getPointMarkerBoxesForPoints([{ x: 100, y: 100 }], 9)).toEqual([
			{ x: 91, y: 91, width: 18, height: 18 },
		]);
	});
});
