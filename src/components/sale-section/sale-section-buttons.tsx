import { RefObject } from "react";
import Button from "../ui/button";
import { PiCaretRight } from "react-icons/pi";
import { PiCaretLeft } from "react-icons/pi";
import SwiperInstance from "swiper";

interface SwiperButtonProps {
  swiperRef: RefObject<SwiperInstance | null>;
}

export const NextButton = ({ swiperRef }: SwiperButtonProps) => {
  return (
    <Button
      variant="icon"
      onClick={() => swiperRef.current?.slideNext()}
      className="p-0 rounded-full bg-white size-8 [&_svg]:size-4"
    >
      <PiCaretLeft color="darkBlue" strokeWidth={20} />
    </Button>
  );
};

export const PrevButton = ({ swiperRef }: SwiperButtonProps) => {
  return (
    <Button
      variant="icon"
      onClick={() => swiperRef.current?.slidePrev()}
      className="p-0 rounded-full bg-white size-8 [&_svg]:size-4"
    >
      <PiCaretRight color="darkBlue" strokeWidth={20} />
    </Button>
  );
};
