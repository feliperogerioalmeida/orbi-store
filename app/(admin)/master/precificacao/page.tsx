import DataTable from "./components/dataTable";
import { db } from "@/app/_lib/prisma";

const PricingPage = async () => {
  const fetchIphones = async () => {
    const iphones = await db.iPhone.findMany({
      include: {
        colors: true,
        capacities: {
          include: {
            conditions: true,
          },
        },
      },
    });
    return iphones;
  };

  const iphones = await fetchIphones();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Precificação de iPhones</h1>
      <DataTable iphones={iphones} />
    </div>
  );
};

export default PricingPage;
