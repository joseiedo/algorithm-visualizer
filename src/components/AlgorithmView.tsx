import { useState, useCallback } from "react";
import { useParams, Navigate } from "react-router-dom";
import { DEFAULT_ALGORITHM_ROUTE } from "@/app/routes";
import { useAlgorithmRunner } from "@/engine/useAlgorithmRunner";
import { usePlayback } from "@/engine/usePlayback";
import {
	resolveAlgorithmView,
	toggleLayoutDirection,
	type LayoutDirection,
} from "./algorithm-view-utils";
import { Header } from "./layout/Header";
import { SplitView } from "./layout/SplitView";
import { VizPanel } from "./viz-panel/VizPanel";
import { CodePanel } from "./code-panel/CodePanel";
import { PlaybackControls } from "./controls/PlaybackControls";

export function AlgorithmView() {
	const { id } = useParams();
	const { algorithm, shouldRedirect } = resolveAlgorithmView(id);
	const { currentState, isDone, canStepBack, step, stepBack, reset } = useAlgorithmRunner(algorithm);
	const playback = usePlayback({ step, reset });
	const [layout, setLayout] = useState<LayoutDirection>("vertical");

	const toggleLayout = useCallback(() => {
		setLayout((previousLayout) => toggleLayoutDirection(previousLayout));
	}, []);

	if (shouldRedirect) {
		return <Navigate to={DEFAULT_ALGORITHM_ROUTE} replace />;
	}

	return (
		<div className="flex h-screen flex-col">
			<Header
				current={algorithm}
				controls={
					<PlaybackControls
						isPlaying={playback.isPlaying}
						isDone={isDone}
						canStepBack={canStepBack}
						speed={playback.speed}
						onTogglePlay={playback.togglePlay}
						onStep={step}
						onStepBack={stepBack}
						onReset={playback.reset}
						onSpeedChange={playback.setSpeed}
					/>
				}
				layout={layout}
				onToggleLayout={toggleLayout}
			/>
			<div className="flex-1 overflow-hidden">
				<SplitView
					direction={layout}
					first={
						<VizPanel
							state={currentState}
							renderer={algorithm.renderer}
						/>
					}
					second={
						<CodePanel
							sourceCode={algorithm.sourceCode}
							activeLine={currentState?.line ?? null}
							annotations={currentState?.annotations}
						/>
					}
				/>
			</div>
		</div>
	);
}
