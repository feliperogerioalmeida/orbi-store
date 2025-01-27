import AboutSectionCard from "./aboutSectionCard";
import Image from "next/image";
import ORBI_CONSTANTS from "@/app/constants/constants";
import SectionTitle from "@/app/_components/sectionTitle";

const AboutSection = () => {
  const aboutSectionInfo = [
    {
      title: "Inovação e Qualidade",
      description:
        "Somos apaixonados por tecnologia e comprometidos em entregar o que há de melhor no universo Apple. Cada produto é selecionado com rigor para garantir a sua satisfação.",
      image: "/images/aboutSection/inovacaoEQualidade.png",
    },
    {
      title: "Design e Funcionalidade",
      description:
        "Acessórios que unem praticidade e elegância, projetados para elevar sua experiência com tecnologia sem abrir mão do estilo.",
      image: "/images/aboutSection/designEFuncionalidade.png",
    },
    {
      title: "Suporte e Assistência",
      description:
        "Conte com uma equipe altamente capacitada para suporte técnico e manutenção, assegurando o desempenho ideal dos seus dispositivos.",
      image: "/images/aboutSection/suporteEAssistencia.png",
    },
  ];
  const aboutSectionInfo2 = [
    {
      title: "Pagamento",
      description:
        "Facilitamos sua compra com opções como PIX, cartão de débito ou crédito em até 18 parcelas. Flexibilidade para você adquirir o melhor em tecnologia.",
      image: "/images/aboutSection/creditCard.png",
    },
    {
      title: "Entregas",
      description:
        "Entregamos em locais convenientes como os shoppings da Bahia, Salvador, Paralela e Barra, ou em uma cafeteria com Wi-Fi, proporcionando conforto e praticidade.",
      image: "/images/aboutSection/parcel.png",
    },
    {
      title: "Contato",
      description: `Atendimento direto e personalizado pelo WhatsApp (${ORBI_CONSTANTS.CONTACT.WHATSAPP}) ou Instagram (${ORBI_CONSTANTS.CONTACT.INSTAGRAM}). Estamos aqui para você, de forma rápida e eficiente.`,
      image: "/images/aboutSection/whatsapp.png",
    },
  ];
  return (
    <div
      id="about"
      className="flex flex-col flex-grow items-center h-full min-h-screen w-full bg-custom-bg-3 bg-cover bg-center bg-no-repeat gap-6 lg:gap-10"
    >
      <SectionTitle title="Por que escolher a Orbi Store?" />
      <div className="flex flex-col  items-center h-auto w-full gap-4 lg:grid lg:grid-cols-3 lg:gap-6 lg:px-4 lg:mt-32">
        {aboutSectionInfo.map((about) => (
          <AboutSectionCard key={about.title} {...about} />
        ))}
      </div>

      <div className="flex flex-col pt-3 w-full px-4 gap-6 text-center md:grid md:grid-cols-3 lg:mt-32">
        {aboutSectionInfo2.map((about) => (
          <div
            key={about.title}
            className="flex flex-col justify-center items-center gap-4 "
          >
            <Image
              src={about.image}
              width={100}
              height={100}
              alt={about.title}
              className="object-contain w-auto h-auto aspect-square lg:w-24 lg:h-24"
            />
            <p className="text-white font-regular text-sm">
              {about.description}
            </p>
          </div>
        ))}
      </div>
      <div className="w-full mt-auto h-1 bg-gradient-to-r from-transparent via-white to-transparent"></div>
    </div>
  );
};

export default AboutSection;
