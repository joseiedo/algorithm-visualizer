import { motion, LayoutGroup } from "framer-motion";
import type { SortingState } from "@/algorithms/types";

interface SortingRendererProps {
  state: SortingState;
}

export function SortingRenderer({ state }: SortingRendererProps) {
  const { array, comparing, swapped, sorted, explanation } = state;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-4">
      <LayoutGroup>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {array.map((el, i) => {
            let bg = "bg-[hsl(var(--card))]";
            let border = "border-[hsl(var(--border))]";
            let scale = 1;

            if (sorted?.includes(i)) {
              bg = "bg-emerald-500/20";
              border = "border-emerald-500/50";
            }
            if (comparing && (i === comparing[0] || i === comparing[1])) {
              bg = "bg-yellow-500/20";
              border = "border-yellow-500/50";
              scale = 1.1;
            }
            if (swapped && (i === swapped[0] || i === swapped[1])) {
              bg = "bg-red-500/20";
              border = "border-red-500/50";
              scale = 1.1;
            }

            return (
              <div key={el.id} className="flex flex-col items-center gap-1">
                <motion.div
                  layout
                  layoutId={`cell-${el.id}`}
                  animate={{ scale }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={`flex h-12 w-12 items-center justify-center rounded-lg border text-sm font-mono font-medium ${bg} ${border}`}
                >
                  {el.value}
                </motion.div>
                <span className="text-[10px] text-[hsl(var(--muted-foreground))]">{i}</span>
              </div>
            );
          })}
        </div>
      </LayoutGroup>
      <div className="h-16 flex items-start justify-center">
        {explanation && (
          <p className="max-w-xl text-center text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">{explanation}</p>
        )}
      </div>
    </div>
  );
}
