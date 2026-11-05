import type { ScopedThreadRef, SideBySideLayout } from "@t3tools/contracts";

import { isTileSurface, selectThreadRightPanelState, useRightPanelStore } from "~/rightPanelStore";

export interface TileLayout {
  readonly grid: SideBySideLayout | null;
  readonly setGrid: (grid: SideBySideLayout | null) => void;
}

/** The thread's side-by-side grid, or null while there is nothing to tile and it is off. */
export function useTileLayout(threadRef: ScopedThreadRef): TileLayout | null {
  const hasTile = useRightPanelStore((store) =>
    selectThreadRightPanelState(store.byThreadKey, threadRef).surfaces.some(isTileSurface),
  );
  const grid = useRightPanelStore(
    (store) => selectThreadRightPanelState(store.byThreadKey, threadRef).grid ?? null,
  );
  if (!hasTile && grid === null) return null;
  return {
    grid,
    setGrid: (next) => useRightPanelStore.getState().setGrid(threadRef, next),
  };
}
