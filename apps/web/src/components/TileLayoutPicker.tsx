import type { ScopedThreadRef } from "@t3tools/contracts";
import { LayoutGrid } from "lucide-react";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import { Popover, PopoverPopup, PopoverTrigger } from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { SIDE_BY_SIDE_MAX } from "~/rightPanelStore";
import { useTileLayout } from "./useTileLayout";

const SIZES = Array.from({ length: SIDE_BY_SIDE_MAX }, (_, index) => index + 1);
const sizeLabel = (columns: number, rows: number) => `${columns} wide × ${rows} down`;

/** Picks how many device and browser tabs show at once, as columns × rows. */
export function TileLayoutPicker(props: { readonly threadRef: ScopedThreadRef }) {
  const layout = useTileLayout(props.threadRef);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<{ columns: number; rows: number } | null>(null);
  if (!layout) return null;
  const shown = hover ?? layout.grid;
  const choose = (grid: { columns: number; rows: number } | null) => {
    layout.setGrid(grid);
    setOpen(false);
  };
  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        setHover(null);
      }}
    >
      <PopoverTrigger
        render={
          <Button
            aria-label="Side by side layout"
            title="Side by side layout"
            className="shrink-0"
            size="icon-xs"
            variant={layout.grid ? "secondary" : "ghost-muted"}
          />
        }
      >
        <LayoutGrid className="size-3.5" />
      </PopoverTrigger>
      <PopoverPopup align="end" padding="compact" aria-label="Side by side layout">
        <div className="grid grid-cols-4 gap-1" role="grid" onPointerLeave={() => setHover(null)}>
          {SIZES.map((rows) =>
            SIZES.map((columns) => {
              const lit = shown !== null && columns <= shown.columns && rows <= shown.rows;
              const current = layout.grid?.columns === columns && layout.grid.rows === rows;
              return (
                <button
                  key={`${columns}x${rows}`}
                  type="button"
                  aria-label={sizeLabel(columns, rows)}
                  aria-pressed={current}
                  className={cn(
                    "h-5 w-6 rounded-sm border border-border bg-background",
                    lit && "border-primary bg-primary/50",
                    current && "ring-2 ring-primary ring-inset",
                  )}
                  onPointerEnter={() => setHover({ columns, rows })}
                  onFocus={() => setHover({ columns, rows })}
                  onClick={() => choose({ columns, rows })}
                />
              );
            }),
          )}
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {shown ? sizeLabel(shown.columns, shown.rows) : "One at a time"}
        </p>
        <Button className="mt-1 w-full" size="xs" variant="ghost" onClick={() => choose(null)}>
          One at a time
        </Button>
      </PopoverPopup>
    </Popover>
  );
}
