import { PiBasketLight } from "react-icons/pi";
import Button from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown";
import Image from "next/image";
import image from "@/assets/hero.png";

const data = [
  {
    title: "MacBook Pro M2 MNEJ3 2022 LLA 13",
    color: "Black",
    quantity: 1,
    price: 433,
  },
  {
    title: "MacBook Pro M2 MNEJ3 2022 LLA 13.3 inch",
    color: "Black",
    quantity: 1,
    price: 433,
  },
];

const ShoppingCartButton = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <Button variant="icon" size="icon">
            <PiBasketLight />
          </Button>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="rounded-t-none"
        sideOffset={30}
        align="end"
      >
        <DropdownMenuGroup>
          {data.map((item) => (
            <DropdownMenuItem key={item.title}>
              <div className="flex">
                <div className="relative w-44 h-36">
                  <Image
                    src={image}
                    alt=""
                    fill
                    className="absolute object-scale-down p-2"
                  />
                </div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.color}</p>
                  <p>x {item.quantity}</p>
                  <p>$ {item.price}</p>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShoppingCartButton;
