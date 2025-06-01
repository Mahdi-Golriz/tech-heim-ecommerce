import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import faqImage from "@/assets/faq/hero-image.jpg";
import Image from "next/image";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface TabData {
  id: string;
  label: string;
  faqs: FAQItem[];
}

const FAQSection: React.FC = () => {
  const tabsData: TabData[] = [
    {
      id: "trust-safety",
      label: "Trust & Safety",
      faqs: [
        {
          id: "trust-1",
          question: "Is Tech Helm a secure platform for online shopping?",
          answer:
            "Yes, Tech Helm uses industry-standard SSL encryption and secure payment gateways to protect your personal and financial information. We also comply with PCI DSS standards for payment processing security.",
        },
        {
          id: "trust-2",
          question: "How do you protect my personal data?",
          answer:
            "We follow strict privacy policies and never share your personal information with third parties without your consent. All data is encrypted and stored on secure servers with regular security audits.",
        },
        {
          id: "trust-3",
          question:
            "What should I do if I suspect fraudulent activity on my account?",
          answer:
            "If you notice any suspicious activity, immediately change your password and contact our security team through the support page. We monitor all accounts for unusual activity and will assist you promptly.",
        },
        {
          id: "trust-4",
          question: "Are the product reviews on Tech Helm authentic?",
          answer:
            "Yes, we have strict policies to ensure review authenticity. Only verified buyers can leave reviews, and we use advanced algorithms to detect and remove fake reviews to maintain trust in our community.",
        },
      ],
    },
    {
      id: "services",
      label: "Services",
      faqs: [
        {
          id: "service-1",
          question: "What services does Tech Helm offer?",
          answer:
            "Tech Helm offers a comprehensive range of services including product sales, technical support, installation services, extended warranties, and access to our tech magazine with expert reviews and tutorials.",
        },
        {
          id: "service-2",
          question: "Do you provide technical support after purchase?",
          answer:
            "Yes, we offer comprehensive technical support for all products purchased through Tech Helm. Our support team is available via phone, email, and live chat to help with setup, troubleshooting, and maintenance.",
        },
        {
          id: "service-3",
          question:
            "Can I get installation services for my purchased products?",
          answer:
            "Absolutely! We offer professional installation services for eligible products. Our certified technicians can set up your equipment at your location. Installation fees vary by product and location.",
        },
        {
          id: "service-4",
          question: "How can I engage with the magazine content on Tech Helm?",
          answer:
            "You can actively engage with the magazine content by leaving comments and participating in the question-and-answer section. Feel free to share your thoughts, ask questions, and interact with fellow tech enthusiasts in the community.",
        },
      ],
    },
    {
      id: "billing",
      label: "Billing",
      faqs: [
        {
          id: "billing-1",
          question:
            "Can I purchase products from Tech Helm using installment payments?",
          answer:
            "Yes, Tech Helm offers the option to purchase products using both cash and installment payments. This allows you to choose the payment method that suits your needs and budget. We partner with several financing companies to provide flexible payment options.",
        },
        {
          id: "billing-2",
          question: "What payment methods do you accept?",
          answer:
            "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, bank transfers, and financing options. For high-value purchases, we also accept wire transfers and cryptocurrency payments.",
        },
        {
          id: "billing-3",
          question: "When will I be charged for my order?",
          answer:
            "For in-stock items, payment is processed immediately upon order confirmation. For pre-orders or back-ordered items, payment is processed when the item ships. Installment payments follow the agreed schedule.",
        },
        {
          id: "billing-4",
          question: "Can I get a refund if I'm not satisfied with my purchase?",
          answer:
            "Yes, we offer a 30-day return policy for most products in original condition. Refunds are processed within 5-7 business days after we receive the returned item. Some restrictions may apply for certain product categories.",
        },
        {
          id: "billing-5",
          question:
            "How can I get assistance with my purchase or any other inquiries?",
          answer:
            "If you need assistance with your purchase or have any questions, our dedicated customer support team is here to help. You can reach out to us through the contact page on our website, and we'll be happy to assist you promptly.",
        },
      ],
    },
  ];

  return (
    <div className="py-8 lg:py-12">
      <div className="grid grid-cols-1 gap-8">
        <div className="mb-8">
          <div className="relative h-[530px] rounded-lg">
            <Image
              src={faqImage}
              alt="faq"
              fill
              className="object-cover rounded-lg"
            />
            <div className="absolute top-2 right-2 bg-white/90 rounded-lg p-4 md:p-5 shadow-lg">
              <h1 className="text-base md:text-2xl lg:text-4xl font-bold text-gray-900">
                Frequently Asked Questions
              </h1>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <Tabs defaultValue="trust-safety" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              {tabsData.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="text-sm md:text-base font-medium"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {tabsData.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="mt-0">
                <div className="space-y-4">
                  <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
                    {tab.label}
                  </h2>

                  <Accordion type="single" collapsible className="w-full">
                    {tab.faqs.map((faq) => (
                      <AccordionItem
                        key={faq.id}
                        value={faq.id}
                        className="border-b border-gray-200 last:border-b-0"
                      >
                        <AccordionTrigger className="text-left hover:no-underline py-4 px-0">
                          <span className="text-primary font-medium text-sm md:text-base leading-relaxed pr-4">
                            {faq.question}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                          <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                            {faq.answer}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
