import { PiShoppingBagOpenLight } from "react-icons/pi";

const PaymentHeader = () => {
  return (
    <div className="flex flex-col items-center justify-center text-primary mt-10">
      <h2 className="text-2xl font-medium mb-6">Tech Heim</h2>
      <div className="rounded-full border-2 border-primary p-2 size-fit">
        <PiShoppingBagOpenLight size={32} />
      </div>
      <p>Payment</p>
    </div>
  );
};

export default PaymentHeader;
