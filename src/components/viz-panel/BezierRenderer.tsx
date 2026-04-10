import type { BezierState, Point } from "@/algorithms/types";

interface BezierRendererProps {
	state: BezierState;
}

const VIEW_BOX_WIDTH = 520;
const VIEW_BOX_HEIGHT = 320;

function formatPoint(point: Point) {
	return `${Math.round(point.x)}, ${Math.round(point.y)}`;
}

function toPolylinePoints(points: Point[]) {
	return points.map((point) => `${point.x},${point.y}`).join(" ");
}

export function BezierRenderer({ state }: BezierRendererProps) {
	const { controlPoints, firstLevelPoints, pointOnCurve, curvePoints, explanation, t } = state;
	const [p0, p1, p2] = controlPoints;

	return (
		<div className="flex h-full flex-col items-center justify-center gap-6 p-4">
			<div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-[hsl(var(--border))] bg-[linear-gradient(180deg,hsl(var(--card))_0%,hsl(0_0%_7%)_100%)] p-4">
				<svg viewBox={`0 0 ${VIEW_BOX_WIDTH} ${VIEW_BOX_HEIGHT}`} className="h-auto w-full">
					<path
						d={`M ${p0.x} ${p0.y} L ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`}
						fill="none"
						stroke="hsl(var(--muted-foreground))"
						strokeDasharray="8 8"
						strokeWidth="2"
						opacity="0.5"
					/>
					{curvePoints.length >= 2 && (
						<polyline
							points={toPolylinePoints(curvePoints)}
							fill="none"
							stroke="#34d399"
							strokeWidth="4"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					)}
					{firstLevelPoints.length === 2 && (
						<line
							x1={firstLevelPoints[0].x}
							y1={firstLevelPoints[0].y}
							x2={firstLevelPoints[1].x}
							y2={firstLevelPoints[1].y}
							stroke="#fbbf24"
							strokeWidth="3"
							strokeDasharray="6 6"
						/>
					)}

					{controlPoints.map((point, index) => (
						<g key={`control-${index}`}>
							<circle
								cx={point.x}
								cy={point.y}
								r="8"
								fill={index === 1 ? "#f59e0b" : "#60a5fa"}
							/>
							<text
								x={point.x}
								y={point.y - 16}
								textAnchor="middle"
								fill="white"
								fontSize="12"
								fontWeight="600"
							>
								{`p${index}`}
							</text>
						</g>
					))}

					{firstLevelPoints.map((point, index) => (
						<g key={`first-level-${index}`}>
							<circle
								cx={point.x}
								cy={point.y}
								r="7"
								fill="#fbbf24"
								stroke="rgba(15, 23, 42, 0.85)"
								strokeWidth="2"
							/>
							<text
								x={point.x}
								y={point.y + 24}
								textAnchor="middle"
								fill="#fde68a"
								fontSize="12"
							>
								{`q${index}`}
							</text>
						</g>
					))}

					{pointOnCurve && (
						<g>
							<circle
								cx={pointOnCurve.x}
								cy={pointOnCurve.y}
								r="9"
								fill="#34d399"
								stroke="rgba(6, 78, 59, 0.9)"
								strokeWidth="3"
							/>
							<text
								x={pointOnCurve.x}
								y={pointOnCurve.y - 18}
								textAnchor="middle"
								fill="#a7f3d0"
								fontSize="12"
								fontWeight="600"
							>
								b
							</text>
						</g>
					)}
				</svg>
			</div>

			<div className="grid w-full max-w-3xl gap-3 sm:grid-cols-3">
				<div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">
						Parameter
					</p>
					<p className="mt-2 text-2xl font-semibold">{t.toFixed(2)}</p>
				</div>
				<div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">
						Current Point
					</p>
					<p className="mt-2 text-sm font-mono text-[hsl(var(--foreground))]">
						{pointOnCurve ? formatPoint(pointOnCurve) : "Not computed yet"}
					</p>
				</div>
				<div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">
						Traced Samples
					</p>
					<p className="mt-2 text-2xl font-semibold">{curvePoints.length}</p>
				</div>
			</div>

			<div className="h-16 flex items-start justify-center">
				{explanation && (
					<p className="max-w-2xl text-center text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
						{explanation}
					</p>
				)}
			</div>
		</div>
	);
}
