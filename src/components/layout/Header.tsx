import { Link, useNavigate } from "react-router-dom";
import { Rows3, Columns3 } from "lucide-react";
import { algorithms } from "@/algorithms/registry";
import { getAlgorithmRoute } from "@/app/routes";
import type { AlgorithmDefinition, BaseState } from "@/algorithms/types";

interface HeaderProps {
	current: AlgorithmDefinition<BaseState>;
	controls: React.ReactNode;
	layout: "horizontal" | "vertical";
	onToggleLayout: () => void;
}

export function Header({ current, controls, layout, onToggleLayout }: HeaderProps) {
	const navigate = useNavigate();

	return (
		<header className="flex items-center justify-between border-b border-[hsl(var(--border))] px-4 py-3">
			<div className="flex items-center gap-4">
				<Link to="/" className="text-sm font-semibold tracking-tight transition-colors hover:text-[hsl(var(--muted-foreground))]">
					algo.vis
				</Link>
				<select
					value={current.id}
					onChange={(e) => {
						const algo = algorithms.find((a) => a.id === e.target.value);
						if (algo) navigate(getAlgorithmRoute(algo.category, algo.id));
					}}
					className="rounded-md bg-[hsl(var(--accent))] px-3 py-1.5 text-sm text-[hsl(var(--foreground))] outline-none"
				>
					{algorithms.map((a) => (
						<option key={a.id} value={a.id}>
							{a.name}
						</option>
					))}
				</select>
			</div>
			<div className="flex items-center gap-3">
				{controls}
				<button
					onClick={onToggleLayout}
					className="rounded-md bg-[hsl(var(--accent))] p-2 transition-colors hover:bg-[hsl(var(--ring))]"
					title={layout === "vertical" ? "Switch to side-by-side" : "Switch to stacked"}
				>
					{layout === "vertical" ? <Columns3 size={16} /> : <Rows3 size={16} />}
				</button>
			</div>
		</header>
	);
}
