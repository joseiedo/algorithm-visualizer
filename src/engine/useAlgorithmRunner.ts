import { useState, useCallback, useMemo } from "react";
import type { AlgorithmDefinition, BaseState } from "@/algorithms/types";

function computeSteps<TState extends BaseState>(algorithm: AlgorithmDefinition<TState>) {
	const input = algorithm.defaultInput();
	return algorithm.computeSteps(input);
}

export function useAlgorithmRunner<TState extends BaseState>(algorithm: AlgorithmDefinition<TState>) {
	const steps = useMemo(() => computeSteps(algorithm), [algorithm]);
	const [runnerState, setRunnerState] = useState(() => ({
		algorithmId: algorithm.id,
		currentIndex: 0,
	}));
	const currentIndex = runnerState.algorithmId === algorithm.id
		? runnerState.currentIndex
		: 0;
	const currentState = steps[currentIndex];
	const isDone = currentIndex >= steps.length - 1;
	const canStepBack = currentIndex > 0;

	const step = useCallback(() => {
		if (currentIndex >= steps.length - 1) {
			return false;
		}

		setRunnerState((previousState) => {
			const previousIndex = previousState.algorithmId === algorithm.id
				? previousState.currentIndex
				: 0;

			return {
				algorithmId: algorithm.id,
				currentIndex: previousIndex + 1,
			};
		});
		return true;
	}, [algorithm.id, currentIndex, steps.length]);

	const stepBack = useCallback(() => {
		setRunnerState((previousState) => {
			const previousIndex = previousState.algorithmId === algorithm.id
				? previousState.currentIndex
				: 0;

			return {
				algorithmId: algorithm.id,
				currentIndex: Math.max(0, previousIndex - 1),
			};
		});
	}, [algorithm.id]);

	const reset = useCallback(() => {
		setRunnerState({
			algorithmId: algorithm.id,
			currentIndex: 0,
		});
	}, [algorithm.id]);

	return {
		currentState,
		isDone,
		canStepBack,
		step,
		stepBack,
		reset,
	};
}
