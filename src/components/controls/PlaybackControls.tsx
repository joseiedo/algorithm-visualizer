import { Play, Pause, SkipForward, RotateCcw } from "lucide-react";

interface PlaybackControlsProps {
	isPlaying: boolean;
	isDone: boolean;
	speed: number;
	onTogglePlay: () => void;
	onStep: () => void;
	onReset: () => void;
	onSpeedChange: (speed: number) => void;
}

export function PlaybackControls({
	isPlaying,
	isDone,
	speed,
	onTogglePlay,
	onStep,
	onReset,
	onSpeedChange,
}: PlaybackControlsProps) {
	return (
		<div className="flex items-center gap-3">
			<button
				onClick={onTogglePlay}
				disabled={isDone}
				className="rounded-md bg-[hsl(var(--accent))] p-2 transition-colors
  hover:bg-[hsl(var(--ring))] disabled:opacity-40"
			>
				{isPlaying ? <Pause size={16} /> : <Play size={16} />}
			</button>

			<button
				onClick={onStep}
				disabled={isPlaying || isDone}
				className="rounded-md bg-[hsl(var(--accent))] p-2 transition-colors
  hover:bg-[hsl(var(--ring))] disabled:opacity-40"
			>
				<SkipForward size={16} />
			</button>

			<button
				onClick={onReset}
				className="rounded-md bg-[hsl(var(--accent))] p-2 transition-colors
  hover:bg-[hsl(var(--ring))]"
			>
				<RotateCcw size={16} />
			</button>

			<div className="flex items-center gap-2 ml-2">
				<span className="text-xs text-[hsl(var(--muted-foreground))]">Speed</span>
				<input
					type="range"
					min={0}
					max={100}
					value={speed}
					onChange={(e) => onSpeedChange(Number(e.target.value))}
					className="w-24 accent-[hsl(var(--foreground))]"
				/>
			</div>
		</div>
	);
}
