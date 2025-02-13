import CustomSidebarTrigger from "@/app/_components/customSidebarTrigger";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/_components/ui/tabs";
import ChartOfAccountsTable from "./_components/chartOfAccountsTable";

const ParametrizationPage = async () => {
  return (
    <div className="flex flex-col justify-start p-4 gap-4 w-full h-full overscroll-none">
      <CustomSidebarTrigger content="Parametrização" />
      <div className="w-full flex flex-col justify-start gap-3 items-start">
        <Tabs defaultValue="chartOfAccounts" className=" w-full">
          <TabsList className="w-full justify-evenly gap-8">
            <TabsTrigger
              value="chartOfAccounts"
              className="w-min-[100px] w-full"
            >
              Plano de contas
            </TabsTrigger>
          </TabsList>
          <TabsContent value="chartOfAccounts">
            <ChartOfAccountsTable />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ParametrizationPage;
