import { useEffect, useState } from "react";
import { createHighlighter, type Highlighter } from "shiki";

interface CodePanelProps {
	sourceCode: string;
	activeLine: number | null;
	annotations?: Record<number, string>;
}

function injectAnnotations(source: string, annotations: Record<number, string>): string {
	const lines = source.split("\n");
	for (const [lineNum, text] of Object.entries(annotations)) {
		const idx = Number(lineNum) - 1;
		if (idx >= 0 && idx < lines.length) {
			lines[idx] = `${lines[idx]}  // ${text}`;
		}
	}
	return lines.join("\n");
}

export function CodePanel({ sourceCode, activeLine, annotations }: CodePanelProps) {
	const [highlighter, setHighlighter] = useState<Highlighter | null>(null);

	useEffect(() => {
		createHighlighter({
			themes: ["vitesse-dark"],
			langs: ["java"],
		}).then(setHighlighter);
	}, []);

	if (!highlighter) {
		return (
			<div className="flex h-full items-center justify-center text-[hsl(var(--muted-foreground))]">
				Loading...
			</div>
		);
	}

	const annotatedSource = annotations
		? injectAnnotations(sourceCode, annotations)
		: sourceCode;

	const html = highlighter.codeToHtml(annotatedSource, {
		lang: "java",
		theme: "vitesse-dark",
		decorations: activeLine
			? [
				{
					start: { line: activeLine - 1, character: 0 },
					end: {
						line: activeLine - 1,
						character: annotatedSource.split("\n")[activeLine - 1]?.length ?? 0,
					},
					properties: { class: "active-line" },
				},
			]
			: [],
	});

	return (
		<div className="flex h-full items-center justify-center">
			<div
				className="overflow-auto rounded-lg bg-[#121212] p-4 font-mono text-sm [&_.active-line]:bg-[hsl(var(--accent))] [&_.shiki]:!bg-transparent [&_pre]:!bg-transparent"
				dangerouslySetInnerHTML={{ __html: html }}
			/>
		</div>
	);
}
