import { Separator } from "@/app/_components/ui/separator";
import { SidebarTrigger } from "@/app/_components/ui/sidebar";

const LogsPage = () => {
  return (
    <div className="flex flex-col justify-center p-4 gap-3 ">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-2xl font-bold ">Logs de Atividades</h1>
      </div>
    </div>
  );
};

export default LogsPage;
