import type { AlgorithmDefinition, SortingElement, SortingState } from "../types";

const LINES = {
	FUNCTION_START: 1,
	OUTER_LOOP: 2,
	INNER_LOOP: 3,
	COMPARISON: 4,
	TEMP_ASSIGNMENT: 5,
	LEFT_ASSIGNMENT: 6,
	RIGHT_ASSIGNMENT: 7,
	SWAP_BLOCK_END: 8,
	INNER_LOOP_END: 9,
	OUTER_LOOP_END: 10,
	FUNCTION_END: 11,
} as const;

const sourceCode = `void bubbleSort(int[] arr) {
    for (int i = 0; i < arr.length; i++) {
        for (int j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`;

// sourceCode lines:
// 1:  void bubbleSort(int[] arr) {
// 2:      for (int i = 0; i < arr.length; i++) {
// 3:          for (int j = 0; j < arr.length - i - 1; j++) {
// 4:              if (arr[j] > arr[j + 1]) {
// 5:                  int temp = arr[j];
// 6:                  arr[j] = arr[j + 1];
// 7:                  arr[j + 1] = temp;
// 8:              }
// 9:          }
// 10:     }
// 11: }

function snap(arr: SortingElement[]) {
	return arr.map((el) => ({ ...el }));
}

function createStep(
	arr: SortingElement[],
	sorted: number[],
	step: Omit<SortingState, "array" | "sorted"> & { sorted?: number[] },
): SortingState {
	return {
		array: snap(arr),
		sorted: step.sorted ?? [...sorted],
		...step,
	};
}

function createComparisonAnnotation(left: number, right: number, isGreater: boolean) {
	return `${left} > ${right} → ${isGreater ? "true" : "false"}`;
}

function createComparisonExplanation(left: number, right: number, leftIndex: number, rightIndex: number) {
	return `arr[${leftIndex}] = ${left} is greater than arr[${rightIndex}] = ${right}. They're out of order — we need to swap.`;
}

function createNoSwapExplanation(left: number, right: number, leftIndex: number, rightIndex: number) {
	return `arr[${leftIndex}] = ${left} <= arr[${rightIndex}] = ${right}. Already in order — no swap needed.`;
}

function appendSwapSteps(
	steps: SortingState[],
	arr: SortingElement[],
	sorted: number[],
	leftIndex: number,
	rightIndex: number,
	tempVal: number,
) {
	steps.push(createStep(arr, sorted, {
		line: LINES.TEMP_ASSIGNMENT,
		comparing: [leftIndex, rightIndex],
		explanation: `Store arr[${leftIndex}] = ${tempVal} in temp variable.`,
		annotations: { [LINES.TEMP_ASSIGNMENT]: `temp = ${tempVal}` },
	}));
	[arr[leftIndex], arr[rightIndex]] = [arr[rightIndex], arr[leftIndex]];
	steps.push(createStep(arr, sorted, {
		line: LINES.LEFT_ASSIGNMENT,
		swapped: [leftIndex, rightIndex],
		explanation: `Set arr[${leftIndex}] = arr[${rightIndex}] = ${arr[leftIndex].value}.`,
	}));
	steps.push(createStep(arr, sorted, {
		line: LINES.RIGHT_ASSIGNMENT,
		swapped: [leftIndex, rightIndex],
		explanation: `Set arr[${rightIndex}] = temp = ${arr[rightIndex].value}. Swap complete!`,
	}));
	steps.push(createStep(arr, sorted, { line: LINES.SWAP_BLOCK_END }));
}

function computeSteps(input: unknown): SortingState[] {
	const steps: SortingState[] = [];
	const raw = input as number[];
	const arr: SortingElement[] = raw.map((value, i) => ({ id: i, value }));
	const sorted: number[] = [];

	steps.push(createStep(arr, sorted, { line: LINES.FUNCTION_START, sorted: [], explanation: `Bubble sort receives an unsorted array of ${arr.length} elements. The idea: repeatedly walk through the array, compare neighbors, and swap if they're out of order. The largest unsorted value "bubbles up" to the end each pass.` }));

	for (let i = 0; i < arr.length; i++) {
		const remaining = arr.length - i;
		steps.push(createStep(arr, sorted, { line: LINES.OUTER_LOOP, explanation: `Starting pass ${i + 1}. We have ${remaining} unsorted elements to check. After this pass, the largest among them will land at index ${arr.length - 1 - i}.` }));

		for (let j = 0; j < arr.length - i - 1; j++) {
			steps.push(createStep(arr, sorted, { line: LINES.INNER_LOOP, comparing: [j, j + 1], explanation: `Inner loop: j = ${j}. We'll compare arr[${j}] and arr[${j + 1}].` }));

			const leftValue = arr[j].value;
			const rightValue = arr[j + 1].value;
			const isGreater = leftValue > rightValue;

			if (isGreater) {
				steps.push(createStep(arr, sorted, {
					line: LINES.COMPARISON,
					comparing: [j, j + 1],
					explanation: createComparisonExplanation(leftValue, rightValue, j, j + 1),
					annotations: { [LINES.COMPARISON]: createComparisonAnnotation(leftValue, rightValue, true) },
				}));
				appendSwapSteps(steps, arr, sorted, j, j + 1, leftValue);
			} else {
				steps.push(createStep(arr, sorted, {
					line: LINES.COMPARISON,
					comparing: [j, j + 1],
					explanation: createNoSwapExplanation(leftValue, rightValue, j, j + 1),
					annotations: { [LINES.COMPARISON]: createComparisonAnnotation(leftValue, rightValue, false) },
				}));
			}

			steps.push(createStep(arr, sorted, { line: LINES.INNER_LOOP_END, explanation: `Done comparing index ${j} and ${j + 1}. Moving to the next pair.` }));
		}

		sorted.push(arr.length - 1 - i);
		steps.push(createStep(arr, sorted, { line: LINES.OUTER_LOOP_END, explanation: `Pass ${i + 1} complete. ${arr[arr.length - 1 - i].value} bubbled to index ${arr.length - 1 - i} and is now in its final sorted position. ${sorted.length} of ${arr.length} elements are sorted.` }));
	}

	steps.push(createStep(arr, sorted, { line: LINES.FUNCTION_END, sorted: arr.map((_, i) => i), explanation: `All passes complete. Every element is in its correct position. The array is fully sorted!` }));

	return steps;
}

function defaultInput() {
	return Array.from({ length: 15 }, () => Math.floor(Math.random() * 99) + 1);
}

export const bubbleSort: AlgorithmDefinition<SortingState> = {
	id: "bubble-sort",
	name: "Bubble Sort",
	category: "sorting",
	sourceCode,
	defaultInput,
	computeSteps,
	renderer: "sorting",
};
