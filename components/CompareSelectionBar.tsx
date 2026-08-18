"use client";

import Link from "next/link";
import { ArrowRight, GitCompare } from "lucide-react";

export function CompareSelectionBar({ ids, onClear }: { ids: string[]; onClear: () => void }) {
  if (!ids.length) return null;

  return (
    <div className="sticky-actions stitch-compare-selection" role="status" aria-live="polite">
      <div className="stitch-compare-selection-inner">
        <span className="stitch-compare-selection-count">
          <i aria-hidden="true"><GitCompare size={16} /></i>
          <span><b>{ids.length}</b> of 3 selected for comparison</span>
        </span>
        <Link href={`/compare?ids=${ids.join(",")}`}>
          Compare {ids.length} {ids.length === 1 ? "item" : "items"} <ArrowRight size={16} />
        </Link>
        <button type="button" onClick={onClear}>Clear selection</button>
      </div>
    </div>
  );
}
