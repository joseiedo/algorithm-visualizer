import { useParams, Navigate } from "react-router-dom";
import { getAlgorithm, algorithms } from "@/algorithms/registry";
import { useAlgorithmRunner } from "@/engine/useAlgorithmRunner";
import { usePlayback } from "@/engine/usePlayback";
import { Header } from "./layout/Header";
import { SplitView } from "./layout/SplitView";
import { VizPanel } from "./viz-panel/VizPanel";
import { CodePanel } from "./code-panel/CodePanel";
import { PlaybackControls } from "./controls/PlaybackControls";

export function AlgorithmView() {
	const { id } = useParams();
	const algorithm = getAlgorithm(id ?? "") ?? algorithms[0];
	const { currentState, isDone, step, reset } = useAlgorithmRunner(algorithm);
	const playback = usePlayback({ step, reset });

	if (id && !getAlgorithm(id)) {
		return <Navigate to="/sorting/bubble-sort" replace />;
	}

	return (
		<div className="flex h-screen flex-col">
			<Header
				current={algorithm}
				controls={
					<PlaybackControls
						isPlaying={playback.isPlaying}
						isDone={isDone}
						speed={playback.speed}
						onTogglePlay={playback.togglePlay}
						onStep={step}
						onReset={playback.reset}
						onSpeedChange={playback.setSpeed}
					/>
				}
			/>
			<div className="flex-1 overflow-hidden">
				<SplitView
					top={
						<VizPanel
							state={currentState}
							renderer={algorithm.renderer}
						/>
					}
					bottom={
						<CodePanel
							sourceCode={algorithm.sourceCode}
							activeLine={currentState?.line ?? null}
						/>
					}
				/>
			</div>
		</div>
	);
}
