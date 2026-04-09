import { useNavigate } from "react-router-dom";
import { algorithms } from "@/algorithms/registry";
import type { AlgorithmDefinition, BaseState } from "@/algorithms/types";

interface HeaderProps {
	current: AlgorithmDefinition<BaseState>;
	controls: React.ReactNode;
}

export function Header({ current, controls }: HeaderProps) {
	const navigate = useNavigate();

	return (
		<header className="flex items-center justify-between border-b
  border-[hsl(var(--border))] px-4 py-3">
			<div className="flex items-center gap-4">
				<h1 className="text-sm font-semibold tracking-tight">algo.vis</h1>
				<select
					value={current.id}
					onChange={(e) => {
						const algo = algorithms.find((a) => a.id === e.target.value);
						if (algo) navigate(`/${algo.category}/${algo.id}`);
					}}
					className="rounded-md bg-[hsl(var(--accent))] px-3 py-1.5 text-sm
  text-[hsl(var(--foreground))] outline-none"
				>
					{algorithms.map((a) => (
						<option key={a.id} value={a.id}>
							{a.name}
						</option>
					))}
				</select>
			</div>
			{controls}
		</header>
	);
}
