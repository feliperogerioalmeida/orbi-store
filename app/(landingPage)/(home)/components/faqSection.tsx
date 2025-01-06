import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/_components/ui/accordion";
import ORBI_CONSTANTS from "@/app/constants";

const FAQ = () => {
  const faq = [
    {
      index: "1",
      question: "A Orbi aceita meu celular como parte do pagamento?",
      answer:
        "Sim! Aceitamos seu celular como parte do pagamento. Clique [aqui](#) para fazer uma simulação do valor de crédito que podemos oferecer.",
    },
    {
      index: "2",
      question: "A Orbi compra aparelhos usados diretamente das pessoas?",
      answer:
        "Sim, também compramos aparelhos usados. Para vender seu dispositivo, clique [aqui](#) e faça uma simulação do valor.",
    },
    {
      index: "3",
      question: "Quais são as formas de pagamento aceitas?",
      answer:
        "Aceitamos PIX, cartão de débito e crédito, com parcelamento em até 18 vezes. As taxas de parcelamento são repassadas ao cliente.",
    },
    {
      index: "14",
      question: "A Orbi realiza entregas em Salvador?",
      answer: `Sim, entregamos nos shoppings da Bahia, Salvador, Paralela ou Barra. Também podemos combinar em cafeterias com Wi-Fi para maior conveniência.`,
    },
    {
      index: "17",
      question: "Como faço para entrar em contato com a Orbi?",
      answer: `Nosso atendimento é feito exclusivamente via WhatsApp pelo número (${ORBI_CONSTANTS.CONTACT.WHATSAPP}) ou pelo Instagram (${ORBI_CONSTANTS.CONTACT.INSTAGRAM}).`,
    },
    {
      index: "18",
      question: "A Orbi atende por telefone ou e-mail?",
      answer:
        "Não. Optamos por atendimento exclusivo via WhatsApp e Instagram para maior agilidade e eficiência.",
    },
  ];

  return (
    <div className="flex flex-col items-center min-h-screen h-full w-full bg-[url('/aboutBg.png')] bg-cover bg-center bg-no-repeat gap-4 ">
      <div className=" pt-28 flex flex-col w-[90%] gap-2">
        <h2 className=" text-white text-5xl text-center">FAQ</h2>
        <p className="text-xs text-white text-center">
          Frequented Asked Questions
        </p>
        <Accordion
          type="single"
          collapsible
          className="w-full text-white py-2 gap-4 flex flex-col h-auto"
        >
          {faq.map((faqItem) => (
            <AccordionItem key={faqItem.index} value={faqItem.index}>
              <AccordionTrigger>
                <h3 className="font-extrabold text-sm">{faqItem.question}</h3>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-xs">{faqItem.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;
