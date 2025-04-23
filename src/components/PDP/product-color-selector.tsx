import Button from "../ui/button";

const ProductColorSelector = ({ colors }: { colors: string[] }) => {
  return (
    <div className="py-4 border-b">
      <h4>Select Color :</h4>
      <div className="flex gap-3 py-3">
        {colors.map((item) => (
          <Button
            variant="outline"
            className="text-gray-700 border-gray-200 px-2"
            key={item}
          >
            <span
              className="size-5 rounded-full border"
              style={{ backgroundColor: item }}
            ></span>
            {item}
          </Button>
        ))}
      </div>
    </div>
  );
};
export default ProductColorSelector;
