export const CODE_PANEL_LANGUAGE = "java";
export const CODE_PANEL_THEME = "vitesse-dark";

export function injectAnnotations(source: string, annotations: Record<number, string>): string {
	const lines = source.split("\n");

	for (const [lineNum, text] of Object.entries(annotations)) {
		const idx = Number(lineNum) - 1;

		if (idx >= 0 && idx < lines.length) {
			lines[idx] = `${lines[idx]}  // ${text}`;
		}
	}

	return lines.join("\n");
}

export function buildActiveLineDecorations(source: string, activeLine: number | null) {
	if (!activeLine) {
		return [];
	}

	const lines = source.split("\n");

	return [
		{
			start: { line: activeLine - 1, character: 0 },
			end: {
				line: activeLine - 1,
				character: lines[activeLine - 1]?.length ?? 0,
			},
			properties: { class: "active-line" },
		},
	];
}
