import { useEffect, useState } from "react";
import { createHighlighter, type Highlighter } from "shiki";
import {
	buildActiveLineDecorations,
	CODE_PANEL_LANGUAGE,
	CODE_PANEL_THEME,
	injectAnnotations,
} from "./code-panel-utils";

interface CodePanelProps {
	sourceCode: string;
	activeLine: number | null;
	annotations?: Record<number, string>;
}

export function CodePanel({ sourceCode, activeLine, annotations }: CodePanelProps) {
	const [highlighter, setHighlighter] = useState<Highlighter | null>(null);

	useEffect(() => {
		createHighlighter({
			themes: [CODE_PANEL_THEME],
			langs: [CODE_PANEL_LANGUAGE],
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
		lang: CODE_PANEL_LANGUAGE,
		theme: CODE_PANEL_THEME,
		decorations: buildActiveLineDecorations(annotatedSource, activeLine),
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
