import type { Point } from "@/algorithms/types";

const DEFAULT_CURVE_POINT_LABEL_OFFSET_Y = -18;
const DEFAULT_CURVE_POINT_LABEL_MIN_Y = 14;
const DEFAULT_CURVE_POINT_LABEL_ALTERNATE_OFFSET_Y = 24;
const DEFAULT_CURVE_POINT_LABEL_SIDE_OFFSET_X = 24;
const DEFAULT_CURVE_POINT_LABEL_SIDE_OFFSET_Y = 5;
const DEFAULT_LABEL_WIDTH = 12;
const DEFAULT_LABEL_HEIGHT = 14;

export const TRACED_CURVE_VISIBLE_INITIAL_ANIMATION = {
	pathLength: 1,
	opacity: 1,
} as const;

export function toPolylinePoints(points: Point[]) {
	return points.map((point) => `${point.x},${point.y}`).join(" ");
}

export function getLabelY(pointY: number, offset: number, minY: number) {
	return Math.max(pointY + offset, minY);
}

interface CurvePointLabelAnimationOptions {
	labelOffsetY?: number;
	alternateLabelOffsetY?: number;
	sideLabelOffsetX?: number;
	sideLabelOffsetY?: number;
	minLabelY?: number;
	labelWidth?: number;
	labelHeight?: number;
	occupiedLabelBoxes?: LabelBox[];
}

interface LabelBox {
	x: number;
	y: number;
	width: number;
	height: number;
}

interface NonOverlappingLabelBoxOptions {
	preferredLabelBox: LabelBox;
	alternateLabelBox: LabelBox;
	occupiedLabelBoxes: LabelBox[];
}

interface LabelBoxesForPointsOptions {
	labelOffsetY: number;
	labelWidth: number;
	labelHeight: number;
}

export function getCurvePointLabelAnimation(
	point: Point,
	{
		labelOffsetY = DEFAULT_CURVE_POINT_LABEL_OFFSET_Y,
		alternateLabelOffsetY = DEFAULT_CURVE_POINT_LABEL_ALTERNATE_OFFSET_Y,
		sideLabelOffsetX = DEFAULT_CURVE_POINT_LABEL_SIDE_OFFSET_X,
		sideLabelOffsetY = DEFAULT_CURVE_POINT_LABEL_SIDE_OFFSET_Y,
		minLabelY = DEFAULT_CURVE_POINT_LABEL_MIN_Y,
		labelWidth = DEFAULT_LABEL_WIDTH,
		labelHeight = DEFAULT_LABEL_HEIGHT,
		occupiedLabelBoxes = [],
	}: CurvePointLabelAnimationOptions = {},
) {
	const preferredY = getLabelY(point.y, labelOffsetY, minLabelY);
	const alternateY = point.y + alternateLabelOffsetY;
	const candidateLabelBoxes = [
		createLabelBox(point.x, preferredY, labelWidth, labelHeight),
		createLabelBox(point.x, alternateY, labelWidth, labelHeight),
		createLabelBox(point.x + sideLabelOffsetX, point.y + sideLabelOffsetY, labelWidth, labelHeight),
		createLabelBox(point.x - sideLabelOffsetX, point.y + sideLabelOffsetY, labelWidth, labelHeight),
	];
	const selectedLabelBox = getFirstNonOverlappingLabelBox({
		candidateLabelBoxes,
		occupiedLabelBoxes,
	});

	return {
		x: selectedLabelBox.x + selectedLabelBox.width / 2,
		y: selectedLabelBox.y + selectedLabelBox.height,
		opacity: 1,
	};
}

function createLabelBox(anchorX: number, anchorY: number, width: number, height: number) {
	return {
		x: anchorX - width / 2,
		y: anchorY - height,
		width,
		height,
	};
}

function labelBoxesOverlap(first: LabelBox, second: LabelBox) {
	return (
		first.x < second.x + second.width &&
		first.x + first.width > second.x &&
		first.y < second.y + second.height &&
		first.y + first.height > second.y
	);
}

export function getNonOverlappingLabelBox({
	preferredLabelBox,
	alternateLabelBox,
	occupiedLabelBoxes,
}: NonOverlappingLabelBoxOptions) {
	return occupiedLabelBoxes.some((occupiedLabelBox) =>
		labelBoxesOverlap(preferredLabelBox, occupiedLabelBox),
	)
		? alternateLabelBox
		: preferredLabelBox;
}

export function getFirstNonOverlappingLabelBox({
	candidateLabelBoxes,
	occupiedLabelBoxes,
}: {
	candidateLabelBoxes: LabelBox[];
	occupiedLabelBoxes: LabelBox[];
}) {
	return (
		candidateLabelBoxes.find(
			(candidateLabelBox) =>
				!occupiedLabelBoxes.some((occupiedLabelBox) =>
					labelBoxesOverlap(candidateLabelBox, occupiedLabelBox),
				),
		) ?? candidateLabelBoxes[0]
	);
}

export function getLabelBoxesForPoints(
	points: Point[],
	{ labelOffsetY, labelWidth, labelHeight }: LabelBoxesForPointsOptions,
) {
	return points.map((point) => ({
		x: point.x - labelWidth / 2,
		y: point.y + labelOffsetY - labelHeight,
		width: labelWidth,
		height: labelHeight,
	}));
}

export function getPointMarkerBoxesForPoints(points: Point[], radius: number) {
	return points.map((point) => ({
		x: point.x - radius,
		y: point.y - radius,
		width: radius * 2,
		height: radius * 2,
	}));
}
