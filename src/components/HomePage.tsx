import { Link } from "react-router-dom";
import { algorithms } from "@/algorithms/registry";
import { getAlgorithmRoute } from "@/app/routes";

export function HomePage() {
	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top,hsl(var(--ring))_0%,transparent_22%),linear-gradient(180deg,hsl(var(--background))_0%,hsl(0_0%_5%)_100%)]">
			<div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-12">
				<header className="max-w-3xl">
					<p className="text-xs font-semibold uppercase tracking-[0.3em] text-[hsl(var(--muted-foreground))]">
						Algorithm Visualizer
					</p>
					<h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
						Pick an algorithm and inspect it step by step.
					</h1>
					<p className="mt-4 max-w-2xl text-base leading-7 text-[hsl(var(--muted-foreground))]">
						Each visualization includes a short explanation, animated state changes, and synchronized source code so you can follow the algorithm line by line.
					</p>
				</header>

				<section className="mt-12">
					<h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">
						Algorithms
					</h2>
					<div className="mt-4 grid gap-4 sm:grid-cols-2">
						{algorithms.map((algorithm) => (
							<Link
								key={algorithm.id}
								to={getAlgorithmRoute(algorithm.category, algorithm.id)}
								className="group rounded-2xl border bg-[hsl(var(--card))] p-6 transition-colors hover:border-[hsl(var(--ring))] hover:bg-[hsl(var(--accent))]"
							>
								<div>
									<p className="text-xs font-semibold uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">
										{algorithm.category}
									</p>
									<h3 className="mt-3 text-2xl font-semibold tracking-tight">
										{algorithm.name}
									</h3>
								</div>
								<p className="mt-4 text-sm leading-6 text-[hsl(var(--muted-foreground))]">
									{algorithm.description}
								</p>
							</Link>
						))}
					</div>
				</section>
			</div>
		</div>
	);
}
