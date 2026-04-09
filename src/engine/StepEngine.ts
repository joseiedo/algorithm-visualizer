export class StepEngine<T> {
	private steps: T[];
	private index: number;

	constructor(steps: T[]) {
		this.steps = steps;
		this.index = 0;
	}

	get current(): T {
		return this.steps[this.index];
	}

	get currentIndex(): number {
		return this.index;
	}

	get totalSteps(): number {
		return this.steps.length;
	}

	stepForward(): boolean {
		if (this.index >= this.steps.length - 1) return false;
		this.index++;
		return true;
	}

	stepBack(): boolean {
		if (this.index <= 0) return false;
		this.index--;
		return true;
	}

	goTo(index: number): void {
		this.index = Math.max(0, Math.min(index, this.steps.length - 1));
	}

	reset(): void {
		this.index = 0;
	}

	get isDone(): boolean {
		return this.index >= this.steps.length - 1;
	}

	get canStepBack(): boolean {
		return this.index > 0;
	}
}
