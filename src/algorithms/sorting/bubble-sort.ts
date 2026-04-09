import type { AlgorithmDefinition, SortingElement, SortingState } from "../types";

const sourceCode = `function bubbleSort(arr) {
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
    return arr;
  }`;

// sourceCode lines:
// 1: function bubbleSort(arr) {
// 2:     for (let i = 0; i < arr.length; i++) {
// 3:       for (let j = 0; j < arr.length - i - 1; j++) {
// 4:         if (arr[j] > arr[j + 1]) {
// 5:           [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
// 6:         }
// 7:       }
// 8:     }
// 9:     return arr;
// 10:  }

function snap(arr: SortingElement[]) {
	return arr.map((el) => ({ ...el }));
}

function* generator(input: unknown): Generator<SortingState, void, unknown> {
	const raw = input as number[];
	const arr: SortingElement[] = raw.map((value, i) => ({ id: i, value }));
	const sorted: number[] = [];

	yield { array: snap(arr), line: 1, sorted: [], explanation: `Bubble sort receives an unsorted array of ${arr.length} elements. The idea: repeatedly walk through the array, compare neighbors, and swap if they're out of order. The largest unsorted value "bubbles up" to the end each pass.` };

	for (let i = 0; i < arr.length; i++) {
		const remaining = arr.length - i;
		yield { array: snap(arr), line: 2, sorted: [...sorted], explanation: `Starting pass ${i + 1}. We have ${remaining} unsorted elements to check. After this pass, the largest among them will land at index ${arr.length - 1 - i}.` };

		for (let j = 0; j < arr.length - i - 1; j++) {
			yield { array: snap(arr), line: 3, comparing: [j, j + 1], sorted: [...sorted], explanation: `Inner loop: j = ${j}. We'll compare arr[${j}] and arr[${j + 1}].` };

			if (arr[j].value > arr[j + 1].value) {
				yield { array: snap(arr), line: 4, comparing: [j, j + 1], sorted: [...sorted], explanation: `arr[${j}] = ${arr[j].value} is greater than arr[${j + 1}] = ${arr[j + 1].value}. They're out of order — we need to swap.` };
				[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
				yield { array: snap(arr), line: 5, swapped: [j, j + 1], sorted: [...sorted], explanation: `Swapped! ${arr[j].value} moved to index ${j}, ${arr[j + 1].value} moved to index ${j + 1}. The larger value keeps bubbling right.` };
				yield { array: snap(arr), line: 6, sorted: [...sorted], explanation: `Swap complete.` };
			} else {
				yield { array: snap(arr), line: 4, comparing: [j, j + 1], sorted: [...sorted], explanation: `arr[${j}] = ${arr[j].value} <= arr[${j + 1}] = ${arr[j + 1].value}. Already in order — no swap needed.` };
			}

			yield { array: snap(arr), line: 7, sorted: [...sorted], explanation: `Done comparing index ${j} and ${j + 1}. Moving to the next pair.` };
		}

		sorted.push(arr.length - 1 - i);
		yield { array: snap(arr), line: 8, sorted: [...sorted], explanation: `Pass ${i + 1} complete. ${arr[arr.length - 1 - i].value} bubbled to index ${arr.length - 1 - i} and is now in its final sorted position. ${sorted.length} of ${arr.length} elements are sorted.` };
	}

	yield { array: snap(arr), line: 9, sorted: arr.map((_, i) => i), explanation: `All passes complete. Every element is in its correct position. The array is fully sorted!` };
	yield { array: snap(arr), line: 10, sorted: arr.map((_, i) => i) };
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
	generator,
	renderer: "sorting",
};
