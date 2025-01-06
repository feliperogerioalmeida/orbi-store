import AboutSection from "./components/aboutSection";
import FAQ from "./components/faqSection";
import HomeSection from "./components/homeSection";
import ProductsSection from "./components/productsSection";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen h-full w-full">
      <HomeSection />
      <ProductsSection />
      <AboutSection />
      <FAQ />
    </div>
  );
};

export default Home;
