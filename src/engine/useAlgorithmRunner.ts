import { useState, useCallback } from "react";
import type { AlgorithmDefinition } from "@/algorithms/types";

function initGenerator(algorithm: AlgorithmDefinition) {
	const input = algorithm.defaultInput();
	const gen = algorithm.generator(input);
	const first = gen.next();
	return { gen, state: first.done ? null : first.value };
}

export function useAlgorithmRunner(algorithm: AlgorithmDefinition) {
	const [genState, setGenState] = useState(() => initGenerator(algorithm));
	const [algorithmId, setAlgorithmId] = useState(algorithm.id);
	const [isDone, setIsDone] = useState(false);

	if (algorithm.id !== algorithmId) {
		setAlgorithmId(algorithm.id);
		setGenState(initGenerator(algorithm));
		setIsDone(false);
	}

	const step = useCallback(() => {
		let hasMore = true;
		setGenState((prev) => {
			const result = prev.gen.next();
			if (result.done) {
				hasMore = false;
				return prev;
			}
			return { gen: prev.gen, state: result.value };
		});
		if (!hasMore) {
			setIsDone(true);
		}
		return hasMore;
	}, []);

	const reset = useCallback(() => {
		setGenState(initGenerator(algorithm));
		setIsDone(false);
	}, [algorithm]);

	return { currentState: genState.state, isDone, step, reset };
}
