import HomeSection from "./components/homeSection";
import ProductsSection from "./components/productsSection";

const Home = () => {
  return (
    <div className="flex flex-col h-full">
      <HomeSection />
      <ProductsSection />
    </div>
  );
};

export default Home;
