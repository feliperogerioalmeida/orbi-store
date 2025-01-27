import { Card } from "@/app/_components/ui/card";

interface AboutSectionProps {
  title: string;
  description: string;
  image: string;
}

const AboutSectionCard = ({ title, description, image }: AboutSectionProps) => {
  return (
    <Card
      className=" w-[90%] h-[280px] max-h-[390px] flex flex-col items-center justify-end bg-fill bg-center bg-no-repeat border-0 shadow-md rounded-md lg:bg-cover md:bg-cover md:min-w-[70%] md:h-[19rem] "
      style={{
        backgroundImage: `url(${image})`,
      }}
    >
      <div className="flex flex-col items-center justify-center text-center w-full h-[50%] bg-products-cards-bg border-0 shadow-md rounded-b-lg">
        <h1 className="text-white font-bold text-2xl">{title}</h1>
        <p className="font-regular text-white text-xs p-2">{description}</p>
      </div>
    </Card>
  );
};

export default AboutSectionCard;
