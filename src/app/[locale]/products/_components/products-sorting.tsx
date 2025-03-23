import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProductSortingProps = {
  sortBy: string;
  onSortChange: (field: string) => void;
};

const ProductsSorting = ({ sortBy, onSortChange }: ProductSortingProps) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>

          <SelectContent className="bg-white">
            <SelectItem value="price:asc">Price: ascending</SelectItem>
            <SelectItem value="price:desc">Price: descending </SelectItem>
            <SelectItem value="createdAt:desc">New Arrivals</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ProductsSorting;
