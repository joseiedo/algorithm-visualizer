import { useEffect, useState } from "react";
import type { HighlighterCore } from "shiki/core";
import {
	buildActiveLineDecorations,
	CODE_PANEL_LANGUAGE,
	CODE_PANEL_THEME,
	injectAnnotations,
} from "./code-panel-utils";

let highlighterPromise: Promise<HighlighterCore> | null = null;

function getHighlighter() {
	if (!highlighterPromise) {
		highlighterPromise = Promise.all([
			import("shiki/core"),
			import("shiki/engine/javascript"),
			import("shiki/dist/langs/java.mjs"),
			import("shiki/dist/themes/vitesse-dark.mjs"),
		]).then(([
			{ createHighlighterCore },
			{ createJavaScriptRegexEngine },
			{ default: java },
			{ default: vitesseDark },
		]) => createHighlighterCore({
			themes: [vitesseDark],
			langs: [java],
			engine: createJavaScriptRegexEngine(),
		}));
	}

	return highlighterPromise;
}

interface CodePanelProps {
	sourceCode: string;
	activeLine: number | null;
	annotations?: Record<number, string>;
}

export function CodePanel({ sourceCode, activeLine, annotations }: CodePanelProps) {
	const [highlighter, setHighlighter] = useState<HighlighterCore | null>(null);

	useEffect(() => {
		getHighlighter().then(setHighlighter);
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
				className="code-snippet-scrollbar max-h-full max-w-full overflow-auto rounded-lg bg-[#121212] p-4 font-mono text-sm [&_.active-line]:bg-[hsl(var(--accent))] [&_.shiki]:!bg-transparent [&_pre]:!bg-transparent"
				dangerouslySetInnerHTML={{ __html: html }}
			/>
		</div>
	);
}
