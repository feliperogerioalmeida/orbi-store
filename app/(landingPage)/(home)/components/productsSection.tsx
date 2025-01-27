import SectionTitle from "@/app/_components/sectionTitle";
import ProductSectionCard from "./productSectionCard";

const ProductsSection = () => {
  const productsInfo = [
    {
      title: "iPhones Novos",
      description:
        "Modelos lacrados, com 1 ano de garantia da Apple. Qualidade garantida para quem busca o melhor em tecnologia.",
      image: "/images/productsSection/iphonesNovos.png",
    },
    {
      title: "iPhones Seminovos",
      description:
        "Dispositivos rigorosamente avaliados, com bateria acima de 80%, peças 100% originais e garantia de 3 meses. Perfeitos para quem busca qualidade a um preço acessível.",
      image: "/images/productsSection/iphonesSeminovos.png",
    },
    {
      title: "Acessórios",
      description:
        "Carregadores, capas, películas e muito mais. Produtos originais e premium para complementar seu iPhone, iPad ou Apple Watch.",
      image: "/images/productsSection/acessorios.png",
    },
    {
      title: "Caixas de Som e Alexa",
      description:
        "Explore som de alta qualidade com as caixas JBL e torne sua casa mais inteligente com dispositivos Alexa. Produtos lacrados e com garantia de 1 ano.",
      image: "/images/productsSection/jblAlexa.png",
    },
    {
      title: "Produtos Apple e Muito Mais",
      description:
        "De MacBooks a Apple Watch, passando por AirPods e o revolucionário Apple Vision. Encontre tudo da Apple e muito mais aqui.",
      image: "/images/productsSection/produtosApple.png",
    },
  ];

  return (
    <div
      id="products"
      className="flex flex-col h-full items-center justify-evenly min-h-screen w-full bg-custom-bg-2 bg-cover bg-center bg-no-repeat"
    >
      <SectionTitle title="Nossos Produtos" />

      <div className="flex flex-col h-full justify-start items-center w-full gap-6 pt-10 md:grid-cols-2 md:grid md:gap-1 md:p-0 lg:grid-cols-3 lg:grid lg:gap-6 lg:p-1 lg:h-auto">
        {productsInfo.map((product) => (
          <ProductSectionCard key={product.title} {...product} />
        ))}
      </div>

      <div className=" justify-self-end relative bottom-0 mt-1 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent"></div>
    </div>
  );
};

export default ProductsSection;
