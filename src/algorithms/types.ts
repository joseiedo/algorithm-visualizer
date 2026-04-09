export interface BaseState {
	line: number;
	explanation?: string;
	annotations?: Record<number, string>;
}

export interface SortingElement {
	id: number;
	value: number;
}

export interface SortingState extends BaseState {
	array: SortingElement[];
	comparing?: [number, number];
	swapped?: [number, number];
	sorted?: number[];
}

export interface AlgorithmDefinition<TState extends BaseState = BaseState> {
	id: string;
	name: string;
	category: "sorting" | "curves" | "pathfinding";
	sourceCode: string;
	defaultInput: () => unknown;
	computeSteps: (input: unknown) => TState[];
	renderer: "sorting" | "bezier" | "pathfinding";
}
