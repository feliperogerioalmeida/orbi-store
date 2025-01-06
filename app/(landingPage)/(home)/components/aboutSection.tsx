import { Card, CardDescription, CardHeader } from "@/app/_components/ui/card";
import AboutSectionCard from "./aboutSectionCard";
import Image from "next/image";

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
  const aboutSectionInfo2 = [
    {
      title: "Pagamento",
      description:
        "Aceitamos Dinheiro, PIX, cartão de débito e cartão de crédito em até 18 parcelas",
      image: "/creditCard.png",
    },
    {
      title: "Entregas",
      description:
        "Realizamos entregas nos Shoppings da Bahia, Salvador, Paralela ou Barra, ou em alguma cafeteria com Wi-Fi que seja melhor para o nosso cliente.",
      image: "/parcel.png",
    },
    {
      title: "Contato",
      description:
        "Nosso atendimento é realizado exclusivamente via WhatsApp (+55 71 99973-2369) ou pelo Instagram (@store.orbi), garantindo um contato direto e eficiente",
      image: "/whatsapp.png",
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

      <div className="flex flex-col pt-3 w-[90%] gap-8 text-center">
        {aboutSectionInfo2.map((about) => (
          <div
            key={about.title}
            className="flex flex-col justify-center items-center gap-4"
          >
            <Image
              src={about.image}
              width={100}
              height={100}
              alt={about.title}
            />
            <p className="text-white font-regular text-xs">
              {about.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutSection;
