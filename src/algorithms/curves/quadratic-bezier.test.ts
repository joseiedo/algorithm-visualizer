import { describe, expect, test } from "vitest";
import { quadraticBezier } from "./quadratic-bezier";

describe("quadraticBezier.computeSteps", () => {
	test("starts with the control points and ends with the traced sample curve", () => {
		const steps = quadraticBezier.computeSteps({
			controlPoints: [
				{ x: 0, y: 100 },
				{ x: 50, y: 0 },
				{ x: 100, y: 100 },
			],
			samples: [0, 0.5, 1],
		});
		const firstStep = steps[0];
		const lastStep = steps[steps.length - 1];

		expect(firstStep.line).toBe(1);
		expect(firstStep.controlPoints[0]).toEqual({ x: 0, y: 100 });
		expect(firstStep.curvePoints).toEqual([]);

		expect(lastStep.line).toBe(5);
		expect(lastStep.curvePoints).toEqual([
			{ x: 0, y: 100 },
			{ x: 50, y: 50 },
			{ x: 100, y: 100 },
		]);
	});

	test("emits interpolated first-level points and a curve point for each sample", () => {
		const steps = quadraticBezier.computeSteps({
			controlPoints: [
				{ x: 0, y: 100 },
				{ x: 50, y: 0 },
				{ x: 100, y: 100 },
			],
			samples: [0.5],
		});

		expect(steps.some((step) => step.line === 9 && step.firstLevelPoints.length === 1)).toBe(true);
		expect(steps.some((step) => step.line === 10 && step.firstLevelPoints.length === 2)).toBe(true);
		expect(steps.some((step) => step.line === 11 && step.pointOnCurve?.x === 50 && step.pointOnCurve?.y === 50)).toBe(true);
		expect(steps.some((step) => step.line === 4 && step.annotations?.[4]?.includes("curve.add"))).toBe(true);
	});
});
