export interface BaseState {
	line: number;
	explanation?: string;
	annotations?: Record<number, string>;
}

export interface SortingElement {
	id: number;
	value: number;
}

export interface Point {
	x: number;
	y: number;
}

export interface SortingState extends BaseState {
	array: SortingElement[];
	comparing?: [number, number];
	swapped?: [number, number];
	sorted?: number[];
}

export interface BezierState extends BaseState {
	controlPoints: [Point, Point, Point];
	firstLevelPoints: Point[];
	pointOnCurve?: Point;
	curvePoints: Point[];
	t: number;
}

export type VisualizationState = SortingState | BezierState;

export type AlgorithmCategory = "sorting" | "curves" | "pathfinding";

export type AlgorithmRenderer = "sorting" | "bezier" | "pathfinding";

export interface AlgorithmDefinition<TState extends BaseState = BaseState> {
	id: string;
	name: string;
	description: string;
	category: AlgorithmCategory;
	sourceCode: string;
	defaultInput: () => unknown;
	computeSteps: (input: unknown) => TState[];
	renderer: AlgorithmRenderer;
}
