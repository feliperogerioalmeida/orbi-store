import { Button } from "@/app/_components/ui/button";
import ORBI_CONSTANTS from "@/app/constants/constants";
import Image from "next/image";
import Link from "next/link";

const HomeSection = () => {
  return (
    <div
      id="home"
      className="items-center min-h-screen w-full bg-custom-bg-1 bg-cover bg-center md:flex md:flex-row"
    >
      <div className="h-[50%] w-[50%] min-w-screem hidden sm:hidden md:block lg:block">
        <Image
          src="/images/background/homePerson.png"
          alt="homePerson"
          width={700}
          height={800}
          className="absolute -left-32 bottom-0 lg:w-[50%] lg:left-0"
        />
      </div>
      <div className="flex flex-col justify-center items-center h-[50%] z-10">
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
      <div className="h-[50%] w-auto min-w-screem relative md:hidden lg:hidden">
        <Image
          src="/images/background/homePerson.png"
          alt="homePerson"
          width={700}
          height={800}
          className="absolute bottom-0 "
        />
      </div>
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent md:hidden lg:hidden"></div>
    </div>
  );
};

export default HomeSection;
