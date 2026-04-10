import type { AlgorithmDefinition, SortingElement, SortingState } from "../types";

const LINES = {
	QUICK_SORT_START: 1,
	IF_RANGE_EXISTS: 2,
	PARTITION_CALL: 3,
	RECURSE_LEFT: 4,
	RECURSE_RIGHT: 5,
	QUICK_SORT_END: 7,
	PARTITION_START: 9,
	PIVOT_ASSIGNMENT: 10,
	I_ASSIGNMENT: 11,
	FOR_LOOP: 12,
	COMPARISON: 13,
	I_INCREMENT: 14,
	TEMP_ASSIGNMENT: 15,
	LEFT_ASSIGNMENT: 16,
	RIGHT_ASSIGNMENT: 17,
	PIVOT_TEMP_ASSIGNMENT: 20,
	PIVOT_LEFT_ASSIGNMENT: 21,
	PIVOT_RIGHT_ASSIGNMENT: 22,
	RETURN_PIVOT_INDEX: 23,
	PARTITION_END: 24,
} as const;

const DEFAULT_INPUT_LENGTH = 15;
const DEFAULT_MAX_VALUE = 99;

const sourceCode = `void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pivotIndex = partition(arr, low, high);
        quickSort(arr, low, pivotIndex - 1);
        quickSort(arr, pivotIndex + 1, high);
    }
}

int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return i + 1;
}`;

function snap(arr: SortingElement[]) {
	return arr.map((element) => ({ ...element }));
}

function getSortedIndexes(sorted: Set<number>) {
	return [...sorted].sort((left, right) => left - right);
}

function createStep(
	arr: SortingElement[],
	sorted: Set<number>,
	step: Omit<SortingState, "array" | "sorted"> & { sorted?: number[] },
): SortingState {
	return {
		array: snap(arr),
		sorted: step.sorted ?? getSortedIndexes(sorted),
		...step,
	};
}

function swap(arr: SortingElement[], leftIndex: number, rightIndex: number) {
	[arr[leftIndex], arr[rightIndex]] = [arr[rightIndex], arr[leftIndex]];
}

function appendSwapSteps(
	steps: SortingState[],
	arr: SortingElement[],
	sorted: Set<number>,
	leftIndex: number,
	rightIndex: number,
	tempValue: number,
	explanationPrefix: string,
) {
	steps.push(createStep(arr, sorted, {
		line: LINES.TEMP_ASSIGNMENT,
		comparing: [leftIndex, rightIndex],
		explanation: `${explanationPrefix} Store arr[${leftIndex}] = ${tempValue} in a temp variable.`,
		annotations: { [LINES.TEMP_ASSIGNMENT]: `temp = ${tempValue}` },
	}));
	swap(arr, leftIndex, rightIndex);
	steps.push(createStep(arr, sorted, {
		line: LINES.LEFT_ASSIGNMENT,
		swapped: [leftIndex, rightIndex],
		explanation: `Set arr[${leftIndex}] = arr[${rightIndex}] = ${arr[leftIndex].value}.`,
	}));
	steps.push(createStep(arr, sorted, {
		line: LINES.RIGHT_ASSIGNMENT,
		swapped: [leftIndex, rightIndex],
		explanation: `Set arr[${rightIndex}] = temp = ${arr[rightIndex].value}. Swap complete.`,
	}));
}

function appendPivotSwapSteps(
	steps: SortingState[],
	arr: SortingElement[],
	sorted: Set<number>,
	pivotIndex: number,
	high: number,
) {
	const tempValue = arr[pivotIndex].value;
	steps.push(createStep(arr, sorted, {
		line: LINES.PIVOT_TEMP_ASSIGNMENT,
		comparing: [pivotIndex, high],
		explanation: `Move the pivot into its final position by storing arr[${pivotIndex}] = ${tempValue} in temp.`,
		annotations: { [LINES.PIVOT_TEMP_ASSIGNMENT]: `temp = ${tempValue}` },
	}));
	swap(arr, pivotIndex, high);
	steps.push(createStep(arr, sorted, {
		line: LINES.PIVOT_LEFT_ASSIGNMENT,
		swapped: [pivotIndex, high],
		explanation: `Set arr[${pivotIndex}] = arr[${high}] = ${arr[pivotIndex].value}.`,
	}));
	steps.push(createStep(arr, sorted, {
		line: LINES.PIVOT_RIGHT_ASSIGNMENT,
		swapped: [pivotIndex, high],
		explanation: `Set arr[${high}] = temp = ${arr[high].value}. The pivot is now fixed.`,
	}));
}

function computeSteps(input: unknown): SortingState[] {
	const steps: SortingState[] = [];
	const raw = input as number[];
	const arr: SortingElement[] = raw.map((value, index) => ({ id: index, value }));
	const sorted = new Set<number>();

	steps.push(createStep(arr, sorted, {
		line: LINES.QUICK_SORT_START,
		sorted: [],
		explanation: `Quick sort starts with ${arr.length} unsorted elements. It picks a pivot, partitions the array around it, then recursively sorts the left and right partitions.`,
	}));

	function partition(low: number, high: number) {
		const pivot = arr[high].value;
		steps.push(createStep(arr, sorted, {
			line: LINES.PARTITION_START,
			explanation: `Partition the range [${low}, ${high}]. Everything smaller than or equal to pivot ${pivot} will move left of it.`,
		}));
		steps.push(createStep(arr, sorted, {
			line: LINES.PIVOT_ASSIGNMENT,
			comparing: [high, high],
			explanation: `Choose arr[${high}] = ${pivot} as the pivot.`,
			annotations: { [LINES.PIVOT_ASSIGNMENT]: `pivot = ${pivot}` },
		}));

		let i = low - 1;
		steps.push(createStep(arr, sorted, {
			line: LINES.I_ASSIGNMENT,
			explanation: `Initialize i = ${i}. It tracks the end of the <= pivot partition.`,
			annotations: { [LINES.I_ASSIGNMENT]: `i = ${i}` },
		}));

		for (let j = low; j < high; j++) {
			steps.push(createStep(arr, sorted, {
				line: LINES.FOR_LOOP,
				comparing: [j, high],
				explanation: `Check arr[${j}] against the pivot ${pivot}.`,
			}));

			const value = arr[j].value;
			const shouldMoveLeft = value <= pivot;
			steps.push(createStep(arr, sorted, {
				line: LINES.COMPARISON,
				comparing: [j, high],
				explanation: shouldMoveLeft
					? `arr[${j}] = ${value} is <= pivot ${pivot}, so it belongs in the left partition.`
					: `arr[${j}] = ${value} is > pivot ${pivot}, so it stays in the right partition for now.`,
				annotations: { [LINES.COMPARISON]: `${value} <= ${pivot} → ${shouldMoveLeft ? "true" : "false"}` },
			}));

			if (!shouldMoveLeft) {
				continue;
			}

			i++;
			steps.push(createStep(arr, sorted, {
				line: LINES.I_INCREMENT,
				comparing: [i, j],
				explanation: `Increment i to ${i}. This is the next slot in the left partition.`,
				annotations: { [LINES.I_INCREMENT]: `i = ${i}` },
			}));

			if (i === j) {
				steps.push(createStep(arr, sorted, {
					line: LINES.RIGHT_ASSIGNMENT,
					comparing: [i, j],
					explanation: `i and j are both ${j}, so the value is already in the correct side of the partition. No visible swap is needed.`,
				}));
				continue;
			}

			appendSwapSteps(
				steps,
				arr,
				sorted,
				i,
				j,
				arr[i].value,
				`arr[${j}] should move left of the pivot.`,
			);
		}

		const pivotIndex = i + 1;

		if (pivotIndex !== high) {
			appendPivotSwapSteps(steps, arr, sorted, pivotIndex, high);
		} else {
			steps.push(createStep(arr, sorted, {
				line: LINES.PIVOT_RIGHT_ASSIGNMENT,
				comparing: [pivotIndex, high],
				explanation: `The pivot is already at index ${pivotIndex}, so no final swap is needed.`,
			}));
		}

		sorted.add(pivotIndex);
		steps.push(createStep(arr, sorted, {
			line: LINES.RETURN_PIVOT_INDEX,
			explanation: `Partition complete. Pivot ${arr[pivotIndex].value} is fixed at index ${pivotIndex}.`,
			annotations: { [LINES.RETURN_PIVOT_INDEX]: `pivotIndex = ${pivotIndex}` },
		}));
		steps.push(createStep(arr, sorted, {
			line: LINES.PARTITION_END,
			explanation: `Return pivotIndex = ${pivotIndex} to the caller.`,
		}));

		return pivotIndex;
	}

	function quickSort(low: number, high: number) {
		steps.push(createStep(arr, sorted, {
			line: LINES.IF_RANGE_EXISTS,
			explanation: `Quick sort is considering the range [${low}, ${high}].`,
		}));

		if (low > high) {
			steps.push(createStep(arr, sorted, {
				line: LINES.QUICK_SORT_END,
				explanation: `The range [${low}, ${high}] is empty, so there is nothing to sort.`,
			}));
			return;
		}

		if (low === high) {
			sorted.add(low);
			steps.push(createStep(arr, sorted, {
				line: LINES.QUICK_SORT_END,
				explanation: `The range [${low}, ${high}] has one element, so index ${low} is already sorted.`,
			}));
			return;
		}

		const pivotIndex = partition(low, high);
		steps.push(createStep(arr, sorted, {
			line: LINES.PARTITION_CALL,
			explanation: `Partition returned pivotIndex = ${pivotIndex}. Everything left of it is <= pivot, and everything right of it is > pivot.`,
			annotations: { [LINES.PARTITION_CALL]: `pivotIndex = ${pivotIndex}` },
		}));

		steps.push(createStep(arr, sorted, {
			line: LINES.RECURSE_LEFT,
			explanation: `Recursively sort the left partition [${low}, ${pivotIndex - 1}].`,
		}));
		quickSort(low, pivotIndex - 1);

		steps.push(createStep(arr, sorted, {
			line: LINES.RECURSE_RIGHT,
			explanation: `Recursively sort the right partition [${pivotIndex + 1}, ${high}].`,
		}));
		quickSort(pivotIndex + 1, high);
	}

	quickSort(0, arr.length - 1);

	steps.push(createStep(arr, sorted, {
		line: LINES.QUICK_SORT_END,
		sorted: arr.map((_, index) => index),
		explanation: `Quick sort is complete. Every element is in its final sorted position.`,
	}));

	return steps;
}

function defaultInput() {
	return Array.from(
		{ length: DEFAULT_INPUT_LENGTH },
		() => Math.floor(Math.random() * DEFAULT_MAX_VALUE) + 1,
	);
}

export const quickSort: AlgorithmDefinition<SortingState> = {
	id: "quick-sort",
	name: "Quick Sort",
	category: "sorting",
	sourceCode,
	defaultInput,
	computeSteps,
	renderer: "sorting",
};
