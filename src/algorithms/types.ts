export interface BaseState {
	line: number;
	explanation?: string;
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
	generator: (input: unknown) => Generator<TState, void, unknown>;
	renderer: "sorting" | "bezier" | "pathfinding";
}
