import { PiSealCheck, PiStorefront, PiTruck } from "react-icons/pi";

const ProductServices = () => {
  return (
    <div className="flex justify-between text-primary py-3 border-b">
      <div className="flex items-center gap-1">
        <PiStorefront size={20} />
        <span className="text-xs font-medium text-gray-500">In Stock</span>
      </div>
      <div className="flex items-center gap-1">
        <PiSealCheck size={20} />
        <span className="text-xs font-medium text-gray-500">Guaranteed</span>
      </div>
      <div className="flex items-center gap-1">
        <PiTruck size={20} />
        <span className="text-xs font-medium text-gray-500">Free Delivery</span>
      </div>
    </div>
  );
};

export default ProductServices;
