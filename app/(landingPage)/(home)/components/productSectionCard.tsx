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
    <Card className="w-[80%] h-[250px] min-h[250px] flex flex-col items-center justify-center bg-products-cards-bg border-0 shadow-md">
      <div className="flex flex-col h-full items-center justify-center gap-1 pt-3">
        <Image
          src={image}
          alt={title}
          width={120}
          height={50}
          className="max-h-[50%] w-auto rouunded-md"
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
