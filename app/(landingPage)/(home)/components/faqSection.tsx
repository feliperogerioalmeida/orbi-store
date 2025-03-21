import SectionTitle from "@/app/_components/sectionTitle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/_components/ui/accordion";
import { Button } from "@/app/_components/ui/button";
import ORBI_CONSTANTS from "@/app/constants/constants";
import Link from "next/link";

const FAQ = () => {
  const faq = [
    {
      index: "1",
      question: "A Orbi aceita meu celular como parte do pagamento?",
      answer: (
        <div>
          Sim! Aceitamos seu celular como parte do pagamento.{" "}
          <Link href="/simulacao-credito">
            <Button variant="link" className="p-0">
              Clique Aqui
            </Button>
          </Link>{" "}
          para fazer uma simulação do valor de crédito que podemos oferecer.
        </div>
      ),
    },
    {
      index: "2",
      question: "A Orbi compra aparelhos usados diretamente das pessoas?",
      answer: (
        <div>
          Sim, também compramos aparelhos usados. Para vender seu dispositivo,{" "}
          <Link href="/simulacao-credito">
            <Button variant="link" className="p-0">
              Clique Aqui
            </Button>
          </Link>{" "}
          e faça uma simulação do valor.
        </div>
      ),
    },
    {
      index: "3",
      question: "Quais são as formas de pagamento aceitas?",
      answer:
        "Aceitamos PIX, cartão de débito e crédito, com parcelamento em até 18 vezes. As taxas de parcelamento são repassadas ao cliente.",
    },
    {
      index: "4",
      question: "A Orbi oferece produtos à pronta entrega?",
      answer:
        "Sim, temos diversos iPhones, acessórios e outros produtos Apple à pronta entrega. Consulte nossa equipe para disponibilidade.",
    },
    {
      index: "5",
      question: "E se o produto não estiver à pronta entrega?",
      answer:
        "Para produtos em estoque no Brasil, pedimos um prazo de até 3 dias úteis. Para importações, o prazo é de 8 a 20 dias úteis, dependendo do produto e da logística.",
    },
    {
      index: "6",
      question: "Os produtos são originais?",
      answer:
        "Todos os produtos vendidos pela Orbi Store são 100% originais e passam por rigorosos processos de verificação de qualidade.",
    },
    {
      index: "7",
      question: "Os iPhones seminovos têm garantia?",
      answer:
        "Sim, os iPhones seminovos possuem garantia de 3 meses. Garantimos aparelhos em excelentes condições, com bateria acima de 80% e peças originais.",
    },
    {
      index: "8",
      question: "A Orbi vende caixas de som e dispositivos inteligentes?",
      answer:
        "Sim! Temos caixas de som JBL e dispositivos Alexa disponíveis à pronta entrega. Caso o produto desejado não esteja em estoque, também podemos importá-lo, com prazo de entrega de 8 a 20 dias úteis.",
    },
    {
      index: "9",
      question: "A Orbi vende acessórios para produtos Apple?",
      answer:
        "Sim, oferecemos carregadores, capas, películas, cabos e muito mais, todos de qualidade premium e originais.",
    },
    {
      index: "10",
      question: "A Orbi realiza pedidos de produtos sob encomenda?",
      answer:
        "Sim! Caso não encontre o produto desejado em estoque, podemos importá-lo. O prazo de entrega para produtos importados varia de 8 a 20 dias úteis.",
    },
    {
      index: "11",
      question: "A Orbi oferece serviços de assistência técnica?",
      answer:
        "Sim, temos uma assistência técnica especializada para smartphones e tablets.",
    },
    {
      index: "12",
      question: "A Orbi ajuda a configurar o aparelho após a compra?",
      answer:
        "Sim! Nossa equipe auxilia na configuração completa do aparelho, garantindo que você tenha a melhor experiência com seu novo dispositivo.",
    },
    {
      index: "13",
      question:
        "Preciso transferir os dados de um aparelho antigo. A Orbi ajuda com isso?",
      answer:
        "Sim! Se você estiver fazendo um upgrade, ajudamos em todo o processo de transferência de dados entre os dispositivos de forma segura e prática.",
    },
    {
      index: "14",
      question: "A Orbi realiza entregas em Salvador?",
      answer:
        "Sim, entregamos nos shoppings da Bahia, Salvador, Paralela ou Barra. Também podemos combinar em cafeterias com Wi-Fi para maior conveniência.",
    },
    {
      index: "15",
      question: "A Orbi realiza entregas fora de Salvador?",
      answer:
        "Sim, enviamos para todo o Brasil. O custo do frete é por conta do cliente, e o pagamento é feito via PIX.",
    },
    {
      index: "16",
      question: "Quanto tempo leva para eu receber o produto?",
      answer:
        "Produtos à pronta entrega em Salvador podem ser retirados no mesmo dia. Para envios nacionais, o prazo varia conforme o tipo de frete escolhido.",
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
    <div
      id="faq"
      className="flex flex-col flex-gorw items-center h-full w-full bg-custom-bg-2 bg-cover bg-center bg-no-repeat"
    >
      <SectionTitle title="Perguntas Frequentes" />

      <div className="flex flex-col w-[90%] max-w-screen-lg h-auto gap-4 md:w-[80%] lg:w-[70%]">
        <Accordion
          type="single"
          collapsible
          className="w-full text-white py-2 flex flex-col gap-4"
        >
          {faq.map((faqItem) => (
            <AccordionItem key={faqItem.index} value={faqItem.index}>
              <AccordionTrigger>
                <h3 className="font-extrabold text-sm md:text-lg lg:text-lg">
                  {faqItem.question}
                </h3>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-xs md:text-sm lg:text-sm">
                  {faqItem.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="w-full mt-auto h-1 bg-gradient-to-r from-transparent via-white to-transparent"></div>
    </div>
  );
};

export default FAQ;
