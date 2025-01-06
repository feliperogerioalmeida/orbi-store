import ProductSectionCard from "./productSectionCard";

const ProductsSection = () => {
  const productsinfo = [
    {
      title: "iPhones Novos",
      description: "Aparelhos lacrados com 1 ano de garantia da Apple",
      image: "/iphonesNovos.png",
    },
    {
      title: "iPhones Seminovos",
      description:
        "aparelhos em excelentes condições, bateria acima de 80%, todas as peças originais e um preço mais acessível e com garantia de 3 meses",
      image: "/iphonesSeminovos.png",
    },
    {
      title: "Acesssórios",
      description:
        "Tudo que você precisa para o seu iPhone, iPad, Apple Watch. Produtos Originais e linha Premium",
      image: "/acessorios.png",
    },
    {
      title: "Caixas de Som e Alexa",
      description: "Aparelhos lacrados com 1 ano de garantia da Apple",
      image: "/jblAlexa.png",
    },
    {
      title: "Produtos Apple e muito mais",
      description:
        "Apple Vision, Macbook, Apple Watch, Airpods, todos os produtos apple e muita mais.",
      image: "/produtosApple.png",
    },
  ];

  return (
    <div className="flex flex-col items-center h-full min-h-screen w-full bg-[url('/productBg.png')] bg-cover bg-center bg-no-repeat pt-24 gap-4 pb-4">
      <div className="flex">
        <h2 className=" text-white text-5xl text-center">
          Conheça nossos produtos
        </h2>
      </div>

      <div className="flex flex-col h-full min-h-screen justify-center items-center w-full gap-4">
        {productsinfo.map((product) => (
          <ProductSectionCard key={product.title} {...product} />
        ))}
      </div>
    </div>
  );
};

export default ProductsSection;
