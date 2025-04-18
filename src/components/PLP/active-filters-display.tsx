import { FilterValues } from ".";

interface ActiveFiltersDisplayProps {
  filters: FilterValues;
}

const ActiveFiltersDisplay = ({ filters }: ActiveFiltersDisplayProps) => (
  <div className="flex flex-wrap items-center gap-2 my-3">
    <span className="text-sm text-gray-500">Active filters:</span>
    {filters.categories.length > 0 && (
      <span className="px-2 py-2 text-xs bg-gray-100 rounded-full">
        Categories: {filters.categories.length} selected
      </span>
    )}
    {(filters.priceRange[0] > 0 || filters.priceRange[1] < 2000) && (
      <span className="px-2 py-2 text-xs bg-gray-100 rounded-full">
        Price: {filters.priceRange[0]} - {filters.priceRange[1]}
      </span>
    )}
    {filters.hasDiscount && (
      <span className="px-2 py-2 text-xs bg-gray-100 rounded-full">
        Discount only
      </span>
    )}
  </div>
);

export default ActiveFiltersDisplay;
