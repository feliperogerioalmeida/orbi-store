import ProductSectionCard from "./productSectionCard";

const ProductsSection = () => {
  const productsInfo = [
    {
      title: "iPhones Novos",
      description:
        "Modelos lacrados, com 1 ano de garantia da Apple. Qualidade garantida para quem busca o melhor em tecnologia.",
      image: "/iphonesNovos.png",
    },
    {
      title: "iPhones Seminovos",
      description:
        "Dispositivos rigorosamente avaliados, com bateria acima de 80%, peças 100% originais e garantia de 3 meses. Perfeitos para quem busca qualidade a um preço acessível.",
      image: "/iphonesSeminovos.png",
    },
    {
      title: "Acessórios",
      description:
        "Carregadores, capas, películas e muito mais. Produtos originais e premium para complementar seu iPhone, iPad ou Apple Watch.",
      image: "/acessorios.png",
    },
    {
      title: "Caixas de Som e Alexa",
      description:
        "Explore som de alta qualidade com as caixas JBL e torne sua casa mais inteligente com dispositivos Alexa. Produtos lacrados e com garantia de 1 ano.",
      image: "/jblAlexa.png",
    },
    {
      title: "Produtos Apple e Muito Mais",
      description:
        "De MacBooks a Apple Watch, passando por AirPods e o revolucionário Apple Vision. Encontre tudo da Apple e muito mais aqui.",
      image: "/produtosApple.png",
    },
  ];

  return (
    <div className="flex flex-col items-center h-full min-h-screen w-full bg-[url('/starsBg.png')] bg-cover bg-center bg-no-repeat">
      <div className="flex pt-36 ">
        <h2 className=" text-white text-5xl text-center">
          Conheça nossos produtos
        </h2>
      </div>

      <div className="flex flex-col h-full min-h-screen justify-start items-center w-full gap-8 pt-4 ">
        {productsInfo.map((product) => (
          <ProductSectionCard key={product.title} {...product} />
        ))}
      </div>

      {/* Linha divisória no final */}
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent"></div>
    </div>
  );
};

export default ProductsSection;
