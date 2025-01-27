import { Card } from "@/app/_components/ui/card";
import Image from "next/image";

interface ProductsSectionProps {
  title: string;
  description: string;
  image: string;
}

const ProductSectionCard = ({
  title,
  description,
  image,
}: ProductsSectionProps) => {
  return (
    <Card
      className={`w-[80%] md:justify-self-center lg:justify-self-center md:w-[21.875rem] md:h-[18.75rem] lg:w-[95%] lg:max-h-[28rem] lg:h-[21rem] h-[15.625rem] min-h[15.625rem] flex flex-col items-center justify-center bg-products-cards-bg border-0 shadow-md ${title === "Produtos Apple e Muito Mais" ? "md:col-span-2 lg:col-span-2 md:w-[93%] lg:w-[98%]" : ""}`}
    >
      <div className="flex flex-col h-full items-center justify-center gap-1 pt-3">
        <Image
          src={image}
          alt={title}
          width={120}
          height={50}
          className="max-h-[50%] w-auto rounded-md md:h-[35%] lg:h-[40%]"
        />

        <div className="flex flex-col items-center text-center text-white p-2">
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-xs font-light">{description}</p>
        </div>
      </div>
    </Card>
  );
};

export default ProductSectionCard;
