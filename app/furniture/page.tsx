import { Suspense } from "react";
import { FilterableListing } from "@/components/FilterableListing";

export default function FurniturePage() {
  return (
    <Suspense fallback={<section className="section"><div className="container"><p className="lead">Loading furniture filters...</p></div></section>}>
      <FilterableListing />
    </Suspense>
  );
}
