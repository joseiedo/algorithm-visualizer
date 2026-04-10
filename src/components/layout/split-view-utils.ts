export const DEFAULT_SPLIT_PERCENTAGE = 55;
export const MIN_SPLIT_PERCENTAGE = 20;
export const MAX_SPLIT_PERCENTAGE = 80;

export function clampSplitPercentage(split: number) {
	return Math.min(MAX_SPLIT_PERCENTAGE, Math.max(MIN_SPLIT_PERCENTAGE, split));
}

export function toSplitPercentage(
	direction: "horizontal" | "vertical",
	rect: Pick<DOMRect, "top" | "left" | "width" | "height">,
	position: Pick<MouseEvent, "clientX" | "clientY">,
) {
	if (direction === "vertical") {
		return ((position.clientY - rect.top) / rect.height) * 100;
	}

	return ((position.clientX - rect.left) / rect.width) * 100;
}
