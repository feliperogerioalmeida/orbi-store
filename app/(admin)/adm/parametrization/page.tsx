import CustomSidebarTrigger from "@/app/_components/customSidebarTrigger";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/_components/ui/tabs";
import ChartOfAccountsTable from "./_components/chartOfAccountsTable";
import BankTable from "./_components/bankTable";

const ParametrizationPage = async () => {
  return (
    <div className="flex flex-col justify-start p-4 gap-4 w-full h-full overscroll-none ">
      <CustomSidebarTrigger content="Parametrização" />
      <div className="w-full flex flex-col justify-start gap-3 items-start ">
        <Tabs
          defaultValue="chartOfAccounts"
          className=" w-full flex flex-col items-center justify-center md:block"
        >
          <TabsList className="w-full md:justify-evenly gap-4 md:flex grid-rows-2 ">
            <TabsTrigger
              value="chartOfAccounts"
              className="w-min-[100px] w-full"
            >
              Plano de contas
            </TabsTrigger>
            <TabsTrigger value="banks" className="w-min-[100px] w-full">
              Bancos
            </TabsTrigger>
            <TabsTrigger
              value="productCategories"
              className="w-min-[100px] w-full"
            >
              Categoria
            </TabsTrigger>

            <TabsTrigger
              value="products"
              className="w-min-[100px] w-full md:flex hidden"
            >
              Produtos
            </TabsTrigger>
            <TabsTrigger
              value="expenses"
              className="w-min-[100px] w-full md:flex hidden"
            >
              Despesas
            </TabsTrigger>
          </TabsList>
          <TabsList className="md:hidden flex justify-center items-center w-[70%] rounded-t-none ">
            <TabsTrigger value="products" className="w-min-[100px] w-full">
              Produtos
            </TabsTrigger>
            <TabsTrigger value="expenses" className="w-min-[100px] w-full">
              Despesas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chartOfAccounts" className="w-full">
            <ChartOfAccountsTable />
          </TabsContent>
          <TabsContent value="banks" className="w-full">
            <BankTable />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ParametrizationPage;
