import type { ScopedThreadRef } from "@t3tools/contracts";

import { isTileSurface, selectThreadRightPanelState, useRightPanelStore } from "~/rightPanelStore";

export interface TileLayout {
  readonly tiled: boolean;
  readonly toggle: () => void;
}

/** The thread's side-by-side switch, or null while there is nothing to tile and it is off. */
export function useTileLayout(threadRef: ScopedThreadRef): TileLayout | null {
  const tileCount = useRightPanelStore(
    (store) =>
      selectThreadRightPanelState(store.byThreadKey, threadRef).surfaces.filter(isTileSurface)
        .length,
  );
  const tiled = useRightPanelStore(
    (store) => selectThreadRightPanelState(store.byThreadKey, threadRef).tiled === true,
  );
  if (tileCount < 2 && !tiled) return null;
  return {
    tiled,
    toggle: () => useRightPanelStore.getState().setTiled(threadRef, !tiled),
  };
}
