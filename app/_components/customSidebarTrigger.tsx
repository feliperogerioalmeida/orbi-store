import { Separator } from "@radix-ui/react-separator";
import { SidebarTrigger } from "./ui/sidebar";

interface CustomSidebarTriggerProps {
  content: string;
}

const CustomSidebarTrigger = ({ content }: CustomSidebarTriggerProps) => {
  return (
    <div className="flex items-center gap-1">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <h1 className="text-2xl font-bold ">{content}</h1>
    </div>
  );
};

export default CustomSidebarTrigger;
