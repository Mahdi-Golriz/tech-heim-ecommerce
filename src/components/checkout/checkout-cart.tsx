import { getImageUrl } from "@/utils/getImageUrl";
import Image from "next/image";

interface CheckoutProps {
  quantity: number;
  color: string;
  src: string;
}

const CheckoutCart = ({ color, quantity, src }: CheckoutProps) => {
  return (
    <div className="p-2 rounded-lg bg-white text-gray-500">
      <Image
        src={getImageUrl(src)}
        alt={src}
        width={300}
        height={300}
        className="mx-auto object-scale-down object-center"
      />
      <p className="mb-2 px-1">x{quantity}</p>
      <div className="flex items-center gap-1">
        <span
          className="size-3 rounded-full border"
          style={{ backgroundColor: color }}
        />
        <span className="capitalize">{color}</span>
      </div>
    </div>
  );
};

export default CheckoutCart;
