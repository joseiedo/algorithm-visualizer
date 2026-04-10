import type { AlgorithmDefinition, BezierState, Point } from "../types";

const LINES = {
	SAMPLER_START: 1,
	CURVE_LIST: 2,
	SAMPLE_LOOP: 3,
	FUNCTION_CALL: 4,
	SAMPLER_RETURN: 5,
	FUNCTION_START: 8,
	FIRST_LERP: 9,
	SECOND_LERP: 10,
	CURVE_POINT: 11,
	RETURN_POINT: 12,
	FUNCTION_END: 13,
} as const;

const sourceCode = `List<Point> sampleQuadraticBezier(Point p0, Point p1, Point p2, float[] samples) {
    List<Point> curve = new ArrayList<>();
    for (float t : samples) {
        curve.add(quadraticBezier(p0, p1, p2, t));
    }
    return curve;
}

Point quadraticBezier(Point p0, Point p1, Point p2, float t) {
    Point q0 = lerp(p0, p1, t);
    Point q1 = lerp(p1, p2, t);
    Point b = lerp(q0, q1, t);
    return b;
}`;

interface BezierInput {
	controlPoints: [Point, Point, Point];
	samples: number[];
}

function clonePoint(point: Point): Point {
	return { ...point };
}

function snapPoints(points: Point[]) {
	return points.map(clonePoint);
}

function lerpPoint(start: Point, end: Point, t: number): Point {
	return {
		x: start.x + (end.x - start.x) * t,
		y: start.y + (end.y - start.y) * t,
	};
}

function formatPoint(point: Point) {
	return `(${Math.round(point.x)}, ${Math.round(point.y)})`;
}

function formatT(t: number) {
	return t.toFixed(2);
}

function createStep(
	controlPoints: [Point, Point, Point],
	curvePoints: Point[],
	step: Omit<BezierState, "controlPoints" | "curvePoints">,
): BezierState {
	return {
		controlPoints: [
			clonePoint(controlPoints[0]),
			clonePoint(controlPoints[1]),
			clonePoint(controlPoints[2]),
		],
		curvePoints: snapPoints(curvePoints),
		...step,
		firstLevelPoints: snapPoints(step.firstLevelPoints),
		pointOnCurve: step.pointOnCurve ? clonePoint(step.pointOnCurve) : undefined,
	};
}

function computeSteps(input: unknown): BezierState[] {
	const { controlPoints, samples } = input as BezierInput;
	const [p0, p1, p2] = controlPoints;
	const steps: BezierState[] = [];
	const curvePoints: Point[] = [];

	steps.push(createStep(controlPoints, curvePoints, {
		line: LINES.SAMPLER_START,
		t: samples[0] ?? 0,
		firstLevelPoints: [],
		explanation: "A quadratic Bezier curve blends the start point, one control point, and the end point. We sample several t values and call the helper once per sample to trace the curve.",
	}));
	steps.push(createStep(controlPoints, curvePoints, {
		line: LINES.CURVE_LIST,
		t: samples[0] ?? 0,
		firstLevelPoints: [],
		explanation: "Start with an empty list of curve points. Each helper call appends one sampled point.",
	}));

	for (const t of samples) {
		const q0 = lerpPoint(p0, p1, t);
		const q1 = lerpPoint(p1, p2, t);
		const b = lerpPoint(q0, q1, t);
		const formattedT = formatT(t);

		steps.push(createStep(controlPoints, curvePoints, {
			line: LINES.SAMPLE_LOOP,
			t,
			firstLevelPoints: [],
			explanation: `Advance the sampling loop with t = ${formattedT}.`,
			annotations: {
				[LINES.SAMPLE_LOOP]: `t = ${formattedT}`,
			},
		}));
		steps.push(createStep(controlPoints, curvePoints, {
			line: LINES.FUNCTION_CALL,
			t,
			firstLevelPoints: [],
			explanation: `Call quadraticBezier(p0, p1, p2, ${formattedT}) to compute the sampled point for this step.`,
			annotations: {
				[LINES.FUNCTION_CALL]: `curve.add(quadraticBezier(..., ${formattedT}))`,
			},
		}));
		steps.push(createStep(controlPoints, curvePoints, {
			line: LINES.FUNCTION_START,
			t,
			firstLevelPoints: [],
			explanation: `Enter quadraticBezier for t = ${formattedT}.`,
		}));

		steps.push(createStep(controlPoints, curvePoints, {
			line: LINES.FIRST_LERP,
			t,
			firstLevelPoints: [q0],
			explanation: `For t = ${formattedT}, interpolate from p0 to p1 to get q0 = ${formatPoint(q0)}.`,
			annotations: {
				[LINES.FIRST_LERP]: `q0 = lerp(${formatPoint(p0)}, ${formatPoint(p1)}, ${formattedT})`,
			},
		}));
		steps.push(createStep(controlPoints, curvePoints, {
			line: LINES.SECOND_LERP,
			t,
			firstLevelPoints: [q0, q1],
			explanation: `Interpolate from p1 to p2 to get q1 = ${formatPoint(q1)}. q0 and q1 define the segment for the second interpolation.`,
			annotations: {
				[LINES.SECOND_LERP]: `q1 = lerp(${formatPoint(p1)}, ${formatPoint(p2)}, ${formattedT})`,
			},
		}));
		steps.push(createStep(controlPoints, curvePoints, {
			line: LINES.CURVE_POINT,
			t,
			firstLevelPoints: [q0, q1],
			pointOnCurve: b,
			explanation: `Interpolate between q0 and q1 at the same t to get b = ${formatPoint(b)}. This point lies on the Bezier curve.`,
			annotations: {
				[LINES.CURVE_POINT]: `b = lerp(${formatPoint(q0)}, ${formatPoint(q1)}, ${formattedT})`,
			},
		}));

		curvePoints.push(b);

		steps.push(createStep(controlPoints, curvePoints, {
			line: LINES.RETURN_POINT,
			t,
			firstLevelPoints: [q0, q1],
			pointOnCurve: b,
			explanation: `Return the curve point for t = ${formattedT}. Repeating this for many t values traces the full Bezier curve.`,
			annotations: {
				[LINES.RETURN_POINT]: `return ${formatPoint(b)}`,
			},
		}));
		steps.push(createStep(controlPoints, curvePoints, {
			line: LINES.FUNCTION_CALL,
			t,
			firstLevelPoints: [q0, q1],
			pointOnCurve: b,
			explanation: `The helper returned ${formatPoint(b)}, so the caller appends it to the curve samples.`,
			annotations: {
				[LINES.FUNCTION_CALL]: `curve.add(${formatPoint(b)})`,
			},
		}));
	}

	steps.push(createStep(controlPoints, curvePoints, {
		line: LINES.SAMPLER_RETURN,
		t: samples[samples.length - 1] ?? 1,
		firstLevelPoints: [],
		pointOnCurve: curvePoints[curvePoints.length - 1],
		explanation: "All sample points have been evaluated. Return the collected list of samples that trace the quadratic Bezier arc.",
	}));

	return steps;
}

function defaultInput(): BezierInput {
	return {
		controlPoints: [
			{ x: 70, y: 240 },
			{ x: 260, y: 60 },
			{ x: 450, y: 240 },
		],
		samples: [0, 0.25, 0.5, 0.75, 1],
	};
}

export const quadraticBezier: AlgorithmDefinition<BezierState> = {
	id: "quadratic-bezier",
	name: "Quadratic Bezier Curve",
	description: "Quadratic Bezier curves are built by linearly interpolating between three control points. This example shows De Casteljau's algorithm step by step.",
	category: "curves",
	sourceCode,
	defaultInput,
	computeSteps,
	renderer: "bezier",
};
