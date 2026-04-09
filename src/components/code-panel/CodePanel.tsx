import { useEffect, useState } from "react";
import { createHighlighter, type Highlighter } from "shiki";

interface CodePanelProps {
	sourceCode: string;
	activeLine: number | null;
}

export function CodePanel({ sourceCode, activeLine }: CodePanelProps) {
	const [highlighter, setHighlighter] = useState<Highlighter | null>(null);

	useEffect(() => {
		createHighlighter({
			themes: ["vitesse-dark"],
			langs: ["javascript"],
		}).then(setHighlighter);
	}, []);

	if (!highlighter) {
		return (
			<div className="flex h-full items-center justify-center
  text-[hsl(var(--muted-foreground))]">
				Loading...
			</div>
		);
	}

	const html = highlighter.codeToHtml(sourceCode, {
		lang: "javascript",
		theme: "vitesse-dark",
		decorations: activeLine
			? [
				{
					start: { line: activeLine - 1, character: 0 },
					end: {
						line: activeLine - 1, character: sourceCode.split("\n")[activeLine -
							1]?.length ?? 0
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
