import Image from "next/image";
import visaImage from "@/assets/footer/visa.svg";
import paypalImage from "@/assets/footer/paypal.svg";
import masterCordImage from "@/assets/footer/master-card.svg";
import americanExpressImage from "@/assets/footer/american-express.svg";
import { FC } from "react";

interface PaymentMethodsProps {
  className?: string;
}

const PaymentMethods: FC<PaymentMethodsProps> = ({ className }) => {
  return (
    <div className={className}>
      <Image src={visaImage} alt="visa" />
      <Image src={paypalImage} alt="paypal" />
      <Image src={americanExpressImage} alt="american express" />
      <Image src={masterCordImage} alt="master card" />
    </div>
  );
};

export default PaymentMethods;
