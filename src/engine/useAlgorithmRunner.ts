import { useState, useCallback } from "react";
import type { AlgorithmDefinition } from "@/algorithms/types";
import { StepEngine } from "./StepEngine";

function createEngine(algorithm: AlgorithmDefinition) {
	const input = algorithm.defaultInput();
	const steps = algorithm.computeSteps(input);
	return new StepEngine(steps);
}

export function useAlgorithmRunner(algorithm: AlgorithmDefinition) {
	const [engine, setEngine] = useState(() => createEngine(algorithm));
	const [algorithmId, setAlgorithmId] = useState(algorithm.id);
	const [, forceRender] = useState(0);

	if (algorithm.id !== algorithmId) {
		setAlgorithmId(algorithm.id);
		setEngine(createEngine(algorithm));
	}

	const rerender = useCallback(() => forceRender((n) => n + 1), []);

	const step = useCallback(() => {
		const hasMore = engine.stepForward();
		rerender();
		return hasMore;
	}, [engine, rerender]);

	const stepBack = useCallback(() => {
		engine.stepBack();
		rerender();
	}, [engine, rerender]);

	const reset = useCallback(() => {
		engine.reset();
		rerender();
	}, [engine, rerender]);

	return {
		currentState: engine.current,
		isDone: engine.isDone,
		canStepBack: engine.canStepBack,
		step,
		stepBack,
		reset,
	};
}
