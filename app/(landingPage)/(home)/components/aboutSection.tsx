import AboutSectionCard from "./aboutSectionCard";
import Image from "next/image";
import ORBI_CONSTANTS from "@/app/constants/constants";

const AboutSection = () => {
  const aboutSectionInfo = [
    {
      title: "Inovação e Qualidade",
      description:
        "Somos apaixonados por tecnologia e comprometidos em entregar o que há de melhor no universo Apple. Cada produto é selecionado com rigor para garantir a sua satisfação.",
      image: "/inovacaoEQualidade.png",
    },
    {
      title: "Design e Funcionalidade",
      description:
        "Acessórios que unem praticidade e elegância, projetados para elevar sua experiência com tecnologia sem abrir mão do estilo.",
      image: "/designEFuncionalidade.png",
    },
    {
      title: "Suporte e Assistência",
      description:
        "Conte com uma equipe altamente capacitada para suporte técnico e manutenção, assegurando o desempenho ideal dos seus dispositivos.",
      image: "/suporteEAssistencia.png",
    },
  ];
  const aboutSectionInfo2 = [
    {
      title: "Pagamento",
      description:
        "Facilitamos sua compra com opções como PIX, cartão de débito ou crédito em até 18 parcelas. Flexibilidade para você adquirir o melhor em tecnologia.",
      image: "/creditCard.png",
    },
    {
      title: "Entregas",
      description:
        "Entregamos em locais convenientes como os shoppings da Bahia, Salvador, Paralela e Barra, ou em uma cafeteria com Wi-Fi, proporcionando conforto e praticidade.",
      image: "/parcel.png",
    },
    {
      title: "Contato",
      description: `Atendimento direto e personalizado pelo WhatsApp (${ORBI_CONSTANTS.CONTACT.WHATSAPP}) ou Instagram (${ORBI_CONSTANTS.CONTACT.INSTAGRAM}). Estamos aqui para você, de forma rápida e eficiente.`,
      image: "/whatsapp.png",
    },
  ];
  return (
    <div className="flex flex-col items-center h-full min-h-screen w-full bg-custom-bg-3 bg-cover bg-center bg-no-repeat pt-28 gap-4 pb-4">
      <div className="flex">
        <h2 className=" text-white text-5xl text-center">Sobre a Orbi Store</h2>
      </div>

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
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent"></div>
    </div>
  );
};

export default AboutSection;
