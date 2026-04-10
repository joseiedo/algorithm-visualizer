import type { AlgorithmDefinition, BaseState } from "@/algorithms/types";
import { describe, expect, test } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useAlgorithmRunner } from "@/engine/useAlgorithmRunner";

function createAlgorithm(
	id: string,
	lines: number[],
): AlgorithmDefinition<BaseState> {
	return {
		id,
		name: id,
		description: `${id} test algorithm`,
		category: "sorting",
		renderer: "sorting",
		sourceCode: "",
		defaultInput: () => null,
		computeSteps: () => lines.map((line) => ({ line })),
	};
}

describe("useAlgorithmRunner", () => {
	test("resets to initial state when algorithm changes", () => {
		const algorithmA = createAlgorithm("A", [1, 2, 3]);
		const algorithmB = createAlgorithm("B", [4, 5, 6]);

		const { result, rerender } = renderHook(({ algorithm }) =>
			useAlgorithmRunner(algorithm), { initialProps: { algorithm: algorithmA } },
		);

		act(() => {
			result.current.step();
		});

		expect(result.current.currentState.line).toBe(2);

		rerender({ algorithm: algorithmB });

		expect(result.current.currentState.line).toBe(4);
		expect(result.current.isDone).toBe(false);
		expect(result.current.canStepBack).toBe(false);
	});

	test("steps back to the previous state", () => {
		const algorithm = createAlgorithm("A", [1, 2, 3]);
		const { result } = renderHook(() => useAlgorithmRunner(algorithm));

		act(() => {
			result.current.step();
			result.current.step();
			result.current.stepBack();
		});

		expect(result.current.currentState.line).toBe(2);
		expect(result.current.isDone).toBe(false);
		expect(result.current.canStepBack).toBe(true);
	});
});
