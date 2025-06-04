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
import { useTranslations } from "next-intl";

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
  const t = useTranslations("faq");
  const tabsData: TabData[] = [
    {
      id: "trust-safety",
      label: t("trust.title"),
      faqs: [
        {
          id: "trust-1",
          question: t("trust.questions.firstQuestion"),
          answer: t("trust.answers.firstAnswer"),
        },
        {
          id: "trust-2",
          question: t("trust.questions.secondQuestion"),
          answer: t("trust.answers.secondAnswer"),
        },
        {
          id: "trust-3",
          question: t("trust.questions.thirdQuestion"),
          answer: t("trust.answers.thirdAnswer"),
        },
        {
          id: "trust-4",
          question: t("trust.questions.fourthQuestion"),
          answer: t("trust.answers.forthAnswer"),
        },
      ],
    },
    {
      id: "services",
      label: t("services.title"),
      faqs: [
        {
          id: "service-1",
          question: t("services.questions.firstQuestion"),
          answer: t("services.answers.firstAnswer"),
        },
        {
          id: "service-2",
          question: t("services.questions.secondQuestion"),
          answer: t("services.answers.secondAnswer"),
        },
        {
          id: "service-3",
          question: t("services.questions.thirdQuestion"),
          answer: t("services.answers.thirdAnswer"),
        },
        {
          id: "service-4",
          question: t("services.questions.fourthQuestion"),
          answer: t("services.answers.forthAnswer"),
        },
      ],
    },
    {
      id: "billing",
      label: t("billing.title"),
      faqs: [
        {
          id: "billing-1",
          question: t("billing.questions.firstQuestion"),
          answer: t("billing.answers.firstAnswer"),
        },
        {
          id: "billing-2",
          question: t("billing.questions.secondQuestion"),
          answer: t("billing.answers.secondAnswer"),
        },
        {
          id: "billing-3",
          question: t("billing.questions.thirdQuestion"),
          answer: t("billing.answers.thirdAnswer"),
        },
        {
          id: "billing-4",
          question: t("billing.questions.fourthQuestion"),
          answer: t("billing.answers.forthAnswer"),
        },
        {
          id: "billing-5",
          question: t("billing.questions.fifthQuestion"),
          answer: t("billing.answers.fifthAnswer"),
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
                {t("title")}
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
