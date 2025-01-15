import { SidebarTrigger } from "@/app/_components/ui/sidebar";
import DataTable from "./components/dataTable";
import { db } from "@/app/_lib/prisma";
import { Separator } from "@/app/_components/ui/separator";

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
    <div className="flex flex-col justify-center p-4 gap-3 ">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-2xl font-bold ">Precificação de iPhones</h1>
      </div>
      <DataTable iphones={iphones} />
    </div>
  );
};

export default PricingPage;
