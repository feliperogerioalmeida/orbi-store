import { Card, CardDescription, CardHeader } from "@/app/_components/ui/card";
import AboutSectionCard from "./aboutSectionCard";

const AboutSection = () => {
  const aboutSectionInfo = [
    {
      title: "Inovação e Qualidade",
      description:
        "Nosso compromisso é oferecer o melhor em tecnologia Apple, com uma seleção premium de produtos que definem o mercado.",
      image: "/inovacaoEQualidade.png",
    },
    {
      title: "Design e Funcionalidade",
      description:
        "Acessórios elegantes e práticos que complementam perfeitamente sua escolha de tecnologia, assegurando funcionalidade e estilo.",
      image: "/designEFuncionalidade.png",
    },
    {
      title: "Suporte e Assistência",
      description:
        "Com uma equipe especializada, garantimos assistência técnica e suporte para manter seus dispositivos em perfeito estado.",
      image: "/suporteEAssistencia.png",
    },
  ];
  return (
    <div className="flex flex-col items-center h-full min-h-screen w-full bg-[url('/aboutBg.png')] bg-cover bg-center bg-no-repeat pt-28 gap-4 pb-4">
      <div className="flex">
        <h2 className=" text-white text-5xl text-center">Sobre a Orbi Store</h2>
      </div>

      <Card className="w-[90%] flex flex-col items-center justify-center bg-products-cards-bg border-0 shadow-md p-3">
        <CardHeader className="text-white font-bold text-xl">
          Missão, Visão e Valores
        </CardHeader>
        <CardDescription className="flex flex-col gap-2">
          <p className="text-xs text-white">
            <span className="font-semibold text-sm text-white">Missão: </span>
            Focar em entregar produtos de alta qualidade com um atendimento
            premium.
          </p>
          <p className=" text-xs text-white">
            <span className="font-semibold text-sm text-white">Visão: </span>
            Ser referência em produtos Apple no mercado digital de Salvador e
            Brasil.
          </p>
          <p className=" text-white text-xs">
            <span className="font-semibold text-sm text-white">Valores: </span>
            Transparência, qualidade, atendimento humano, e respeito ao cliente.
          </p>
        </CardDescription>
      </Card>

      {aboutSectionInfo.map((about) => (
        <AboutSectionCard key={about.title} {...about} />
      ))}
    </div>
  );
};

export default AboutSection;
