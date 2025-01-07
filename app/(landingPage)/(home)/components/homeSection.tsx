import { Button } from "@/app/_components/ui/button";
import ORBI_CONSTANTS from "@/app/constants/constants";
import Image from "next/image";
import Link from "next/link";

const HomeSection = () => {
  return (
    <div className="items-center min-h-screen w-full bg-[url('/homeBg.jpg')] bg-cover bg-center">
      <div className="flex flex-col justify-center items-center h-[50%] ">
        <h1 className=" relative text-5xl font-extrabold text-center text-white text-shadow">
          <span className="absolute top-0 left-0 text-black -z-10 blur-sm">
            Conectando você ao futuro!
          </span>
          Conectando você ao futuro!
        </h1>
        <p className=" relative text-xl text-center text-white text-shadow mt-2">
          Qualidade e confiança em tecnologia premium.
        </p>
        <span className="absolute top-0 left-0 text-black -z-10 blur-sm">
          Qualidade e confiança em tecnologia premium.
        </span>

        <Button
          asChild
          size="lg"
          variant="secondary"
          className="mt-4 hover:bg-primary hover:text-white group flex items-center space-x-2"
        >
          <Link href={ORBI_CONSTANTS.LINKS.WHATSAPP_URL}>
            <Image
              src="/whatsAppIconBlack.svg"
              alt="whatsAppIcon"
              width={20}
              height={20}
              className="group-hover:hidden"
            />
            <Image
              src="/whatsAppIconWhite.svg"
              alt="whatsAppIconHover"
              width={20}
              height={20}
              className="hidden group-hover:block"
            />
            <p className="font-bold text-lg">Falar com um especialista</p>
          </Link>
        </Button>
      </div>
      <div className="h-[50%] w-auto min-w-screem relative">
        <Image
          src="/homePerson.png"
          alt="homePerson"
          layout="fill"
          objectFit="cover"
          className="absolute bottom-0"
        />
      </div>
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent"></div>
    </div>
  );
};

export default HomeSection;
