import { describe, expect, test } from "vitest";
import { buildActiveLineDecorations, injectAnnotations } from "./code-panel-utils";

describe("injectAnnotations", () => {
	test("appends annotations to valid lines and ignores out-of-range line numbers", () => {
		const source = ["first();", "second();", "third();"].join("\n");

		const result = injectAnnotations(source, {
			2: "watch this line",
			99: "ignored",
		});

		expect(result).toBe([
			"first();",
			"second();  // watch this line",
			"third();",
		].join("\n"));
	});

	test("builds a decoration for the active line using the annotated source", () => {
		const source = ["first();", "second();", "third();"].join("\n");

		expect(buildActiveLineDecorations(source, 2)).toEqual([
			{
				start: { line: 1, character: 0 },
				end: { line: 1, character: "second();".length },
				properties: { class: "active-line" },
			},
		]);
	});
});
