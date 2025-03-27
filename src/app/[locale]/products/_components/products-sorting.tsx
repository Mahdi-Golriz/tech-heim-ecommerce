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
    <div className="mb-3">
      <div>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px] border-none shadow-custom">
            <SelectValue placeholder="Default Sort" />
          </SelectTrigger>

          <SelectContent className="bg-white">
            <SelectItem value="default">Default Sort</SelectItem>
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
