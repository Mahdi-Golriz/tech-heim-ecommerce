import Image from "next/image";
import { Check } from "lucide-react";
import image from "@/assets/about-us/banner.png";

interface FeatureItem {
  text: string;
}

const AboutTechHelm = () => {
  const features: FeatureItem[] = [
    { text: "Diverse digital gadgets for purchase in cash or installments" },
    {
      text: "A blog with reviews and articles about the latest technology and gadgets",
    },
    { text: "User comments and Q&A section for community interaction" },
    { text: "Represents a tech-savvy 'home' with all necessary technology" },
    { text: "Easy-to-use interface for a great user experience" },
    { text: "Consistent and visually appealing design" },
    { text: "A hub for tech enthusiasts to connect and share insights" },
    { text: "Helps users make informed purchase decisions" },
  ];

  return (
    <div className="py-8 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={image}
            alt="Tech Helm team"
            fill
            className="absolute object-cover"
            priority
          />
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-gray-700 text-sm md:text-base leading-relaxed">
              Tech Helm is an innovative online store that offers a diverse
              selection of digital gadgets, available for purchase in both cash
              and installment options. Embodying the motto &quot;Join the
              digital revolution today&quot; the website not only provides a
              seamless shopping experience but also features a captivating blog
              section filled with insightful reviews, articles, and videos about
              cutting-edge technology and digital gadgets. Users can actively
              engage with the content through comments and a question-answer
              section, fostering a dynamic community of tech enthusiasts.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900">
              Tech Helm Meaning
            </h3>
            <p className="text-gray-700 text-sm md:text-base leading-relaxed">
              The name &quot;Tech Helm&quot; cleverly combines two languages
              (English & German), signifying a home of technology that provides
              all the essential tech products and services, making it a one-stop
              destination for tech-savvy individuals seeking the latest and most
              exciting gadgets.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900">
              Some of Tech Helm&apos;s impressive features:
            </h3>
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    {feature.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutTechHelm;
