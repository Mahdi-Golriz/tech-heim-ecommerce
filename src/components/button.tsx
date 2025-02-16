import { ReactNode } from "react";

type Variant = "primary" | "secondary";

interface Props {
  children: ReactNode;
  variant?: Variant;
  onClick: () => void;
  href: string;
  className?: string;
  iconOnly?: ReactNode;
}

const Button = ({ children }: Props) => {
  return <button>{children}</button>;
};

export default Button;
