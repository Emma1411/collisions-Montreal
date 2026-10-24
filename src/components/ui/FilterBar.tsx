import FilterControls from './FilterControls';
import FilterSummary from './FilterSummary';

export default function FilterBar() {
  return (
    <div className="border-b border-line bg-white lg:sticky lg:top-(--header-h) lg:z-30">
      <div className="page-container space-y-3 py-3">
        <FilterControls />
        <FilterSummary />
      </div>
    </div>
  );
}