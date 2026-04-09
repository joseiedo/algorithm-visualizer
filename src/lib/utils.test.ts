import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
	it("merges class names correctly", () => {
		expect(cn("btn", "btn-primary")).toBe("btn btn-primary");
	});

})
