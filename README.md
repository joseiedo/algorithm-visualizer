# Algorithm Visualizer

`algorithm-visualizer` is a small React + TypeScript app for exploring algorithms step by step.

The project renders an algorithm visualization side by side with its source code, then lets you move forward and backward through precomputed states. Each step can include an explanation, active code line highlighting, and inline annotations to make the algorithm easier to follow.

## Current examples

- Bubble Sort
- Quick Sort
- Quadratic Bezier Curve

## Tech stack

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Framer Motion
- Vitest
- Shiki

## Getting started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

Run the test suite once:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## How it works

Each algorithm exposes a definition with:

- metadata such as name, category, and description
- source code shown in the code panel
- a `defaultInput()` function
- a `computeSteps()` function that returns every visualization state ahead of time
- a renderer type used by the visualization panel

The app precomputes all states for a selected algorithm, then the playback engine simply moves through the list of steps. This keeps stepping, rewinding, and autoplay logic simple and predictable.

## Project structure

- `src/algorithms/`: algorithm definitions and registry
- `src/components/`: page layout, controls, code panel, and visualization renderers
- `src/engine/`: step runner and playback logic
- `src/app/`: routes and app-level wiring

## Adding a new algorithm

1. Create a new algorithm definition in `src/algorithms/`.
2. Return a full list of visualization states from `computeSteps()`.
3. Add or reuse a renderer in `src/components/viz-panel/`.
4. Register the algorithm in `src/algorithms/registry.ts`.

