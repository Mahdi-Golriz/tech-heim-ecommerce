import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import PaymentForm from "@/components/payment";
import { redirect } from "@/i18n/routing";
import { getSessionUser } from "@/data/session";

export const metadata: Metadata = {
  title: "Tech Heim | Payment",
};

const PaymentPage = async ({ params }: PageProps<"/[locale]/payment">) => {
  const { locale } = await params;
  setRequestLocale(locale);

  // Orders need an account: send guests back to checkout, where they can sign in
  const user = await getSessionUser();
  if (!user) redirect({ href: "/checkout", locale });

  return (
    <div className="container">
      <PaymentForm />
    </div>
  );
};

export default PaymentPage;
