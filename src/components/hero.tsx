import Image from "next/image";
import heroImage from "@/assets/Hero.png";
import Button from "./ui/button";

const Hero = () => {
  return (
    <section className="container my-6">
      <div className="flex relative justify-end text-primary-700">
        <div className="absolute left-0 flex flex-col h-full">
          <h2 className="text-2xl font-medium mb-6 lg:text-6xl sm:text-4xl">
            Tech Heim
          </h2>
          <p className="text-xs font-medium lg:text-4xl sm:text-xl">
            &quot;Join the{" "}
            <span className="text-secondary">digital revolution</span>&quot;
          </p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-auto w-fit sm:text-xl sm:w-full sm:h-12 lg:w-2/3"
          >
            Explore More
          </Button>
        </div>
        <Image
          src={heroImage}
          alt="tech heim"
          className="md:max-w-xl sm:max-w-96 max-w-52"
        />
      </div>
    </section>
  );
};

export default Hero;
