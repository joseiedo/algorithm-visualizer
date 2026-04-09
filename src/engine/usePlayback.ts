import { useState, useCallback, useRef, useEffect } from "react";

interface PlaybackTarget {
	step: () => boolean;
	reset: () => void;
}

const MIN_DELAY_MS = 10;
const MAX_DELAY_MS = 500;
const SPEED_STEPS = 100;

function speedToDelay(speed: number): number {
	const t = (SPEED_STEPS - speed) / SPEED_STEPS;
	return MIN_DELAY_MS + t * (MAX_DELAY_MS - MIN_DELAY_MS);
}

/**
 * Custom hook to manage playback of an algorithm visualization.
 * @param target An object that has `step` and `reset` methods to control the algorithm execution.
 * @returns An object containing playback state and control functions.
 */
export function usePlayback(target: PlaybackTarget) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [speed, setSpeed] = useState(33);
	const intervalRef = useRef<number | null>(null);

	const stop = useCallback(() => {
		if (intervalRef.current !== null) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
		setIsPlaying(false);
	}, []);

	const play = useCallback(() => {
		setIsPlaying(true);
	}, []);

	const togglePlay = useCallback(() => {
		setIsPlaying((prev) => !prev);
	}, []);

	const reset = useCallback(() => {
		stop();
		target.reset();
	}, [stop, target]);

	useEffect(() => {
		if (!isPlaying) {
			if (intervalRef.current !== null) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
			return;
		}

		const delay = speedToDelay(speed);
		intervalRef.current = window.setInterval(() => {
			const hasMore = target.step();
			if (!hasMore) {
				stop();
			}
		}, delay);

		return () => {
			if (intervalRef.current !== null) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, [isPlaying, speed, target, stop]);

	return { isPlaying, speed, setSpeed, play, stop, togglePlay, reset };
}
