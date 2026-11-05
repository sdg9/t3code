import type { ScopedThreadRef } from "@t3tools/contracts";

import { MenuRadioGroup, MenuRadioItem, MenuRadioItemIndicator } from "~/components/ui/menu";
import {
  isTileSurface,
  selectThreadRightPanelState,
  TILE_COLUMN_OPTIONS,
  type TileColumns,
  useRightPanelStore,
} from "~/rightPanelStore";

export interface TileLayout {
  readonly columns: TileColumns | null;
  readonly onChange: (columns: TileColumns | null) => void;
}

/** The thread's side-by-side choice, or null while there is nothing to tile and tiling is off. */
export function useTileLayout(threadRef: ScopedThreadRef): TileLayout | null {
  const tileCount = useRightPanelStore(
    (store) =>
      selectThreadRightPanelState(store.byThreadKey, threadRef).surfaces.filter(isTileSurface)
        .length,
  );
  const columns = useRightPanelStore(
    (store) => selectThreadRightPanelState(store.byThreadKey, threadRef).tileColumns ?? null,
  );
  if (tileCount < 2 && columns === null) return null;
  return {
    columns,
    onChange: (next) => useRightPanelStore.getState().setTileColumns(threadRef, next),
  };
}

export function TileLayoutRadioGroup(props: { readonly layout: TileLayout }) {
  return (
    <MenuRadioGroup
      value={props.layout.columns === null ? "off" : String(props.layout.columns)}
      onValueChange={(value) =>
        props.layout.onChange(
          TILE_COLUMN_OPTIONS.find((columns) => String(columns) === value) ?? null,
        )
      }
    >
      <TileLayoutOption value="off" label="One at a time" />
      {TILE_COLUMN_OPTIONS.map((columns) => (
        <TileLayoutOption
          key={columns}
          value={String(columns)}
          label={`Side by side, ${columns} columns`}
        />
      ))}
    </MenuRadioGroup>
  );
}

function TileLayoutOption(props: { readonly value: string; readonly label: string }) {
  return (
    <MenuRadioItem value={props.value}>
      <span className="flex items-center gap-2">
        <span className="flex-1">{props.label}</span>
        <MenuRadioItemIndicator />
      </span>
    </MenuRadioItem>
  );
}
