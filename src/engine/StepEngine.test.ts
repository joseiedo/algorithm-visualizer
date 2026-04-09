import { describe, it, expect } from "vitest";
import { StepEngine } from "./StepEngine";

describe("StepEngine", () => {
	const steps = [
		{ line: 1, value: "a" },
		{ line: 2, value: "b" },
		{ line: 3, value: "c" },
	];

	it("initializes with first step as current", () => {
		const engine = new StepEngine(steps);
		expect(engine.current).toEqual({ line: 1, value: "a" });
		expect(engine.currentIndex).toBe(0);
		expect(engine.totalSteps).toBe(3);
	});

	it("stepForward advances and returns true", () => {
		const engine = new StepEngine(steps);
		const result = engine.stepForward();
		expect(result).toBe(true);
		expect(engine.current).toEqual({ line: 2, value: "b" });
		expect(engine.currentIndex).toBe(1);
	});

	it("stepForward returns false at the end", () => {
		const engine = new StepEngine(steps);
		engine.stepForward();
		engine.stepForward();
		const result = engine.stepForward();
		expect(result).toBe(false);
		expect(engine.currentIndex).toBe(2);
	});

	it("stepBack reverses and returns true", () => {
		const engine = new StepEngine(steps);
		engine.stepForward();
		engine.stepForward();
		const result = engine.stepBack();
		expect(result).toBe(true);
		expect(engine.current).toEqual({ line: 2, value: "b" });
		expect(engine.currentIndex).toBe(1);
	});

	it("stepBack returns false at the start", () => {
		const engine = new StepEngine(steps);
		const result = engine.stepBack();
		expect(result).toBe(false);
		expect(engine.currentIndex).toBe(0);
	});

	it("goTo jumps to a valid index", () => {
		const engine = new StepEngine(steps);
		engine.goTo(2);
		expect(engine.current).toEqual({ line: 3, value: "c" });
		expect(engine.currentIndex).toBe(2);
	});

	it("goTo clamps to bounds", () => {
		const engine = new StepEngine(steps);
		engine.goTo(99);
		expect(engine.currentIndex).toBe(2);
		engine.goTo(-5);
		expect(engine.currentIndex).toBe(0);
	});

	it("reset returns to step 0", () => {
		const engine = new StepEngine(steps);
		engine.stepForward();
		engine.stepForward();
		engine.reset();
		expect(engine.current).toEqual({ line: 1, value: "a" });
		expect(engine.currentIndex).toBe(0);
	});

	it("isDone is true only at last step", () => {
		const engine = new StepEngine(steps);
		expect(engine.isDone).toBe(false);
		engine.goTo(2);
		expect(engine.isDone).toBe(true);
		engine.stepBack();
		expect(engine.isDone).toBe(false);
	});

	it("canStepBack is false at start, true otherwise", () => {
		const engine = new StepEngine(steps);
		expect(engine.canStepBack).toBe(false);
		engine.stepForward();
		expect(engine.canStepBack).toBe(true);
		engine.reset();
		expect(engine.canStepBack).toBe(false);
	});
});
