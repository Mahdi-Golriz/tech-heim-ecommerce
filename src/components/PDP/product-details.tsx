import { FC } from "react";

interface ProductDetailsProps {
  details: Record<string, string> | undefined;
}

const ProductSpecs: FC<ProductDetailsProps> = ({ details }) => {
  return (
    <div className="my-3">
      <ul className="list-disc marker:text-gray-500 px-9">
        {Object.entries(details || {}).map(([key, value]) => (
          <li key={key} className="py-2">
            <span className="inline-block text-gray-500 w-1/2">{key}</span>
            <span className="w-1/2">{value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductSpecs;
