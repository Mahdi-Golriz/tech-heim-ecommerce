import AuthWrapper from "@/components/auth/auth-wrapper";
import { ReactNode } from "react";

const AuthLayout = ({ children }: { readonly children: ReactNode }) => {
  return <AuthWrapper>{children}</AuthWrapper>;
};

export default AuthLayout;
