"use client";
import {
  Check,
  ChevronsUpDown,
  BarChart2,
  Star,
  CircleFadingArrowUp,
  FileText,
  Users,
  LogOutIcon,
  PackageSearchIcon,
  DollarSign,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { redirect, usePathname } from "next/navigation";
import Link from "next/link";

const AdmSidebar = () => {
  const { data: session } = useSession();
  const [activeWorkspace, setActiveWorkspace] = useState<
    "MASTER" | "ADM" | "CLIENT"
  >("MASTER");

  const userRole = session?.user?.role;

  const path = usePathname();

  const masterLinks = [
    {
      href: "/master/dashboard",
      label: "Dashboard",
      icon: BarChart2,
    },
    {
      href: "/master/users",
      label: "Usuários",
      icon: Users,
    },
    {
      href: "/master/activity-log",
      label: "Log de Atividades",
      icon: FileText,
    },
    {
      href: "/master/precificacao",
      label: "Precificação",
      icon: DollarSign,
    },
    {
      href: "/master/relatorio-simulacoes",
      label: "Relatórios de Simulações",
      icon: CircleFadingArrowUp,
    },
    {
      href: "/master/app-reviews",
      label: "Avaliações do App",
      icon: Star,
    },
  ];

  const admLinks = [
    {
      href: "/adm/dashboard",
      label: "Dashboard",
      icon: BarChart2,
    },
    {
      href: "/adm/products",
      label: "Produtos",
      icon: PackageSearchIcon,
    },
  ];

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="w-full">
        {userRole === "MASTER" ? (
          <SidebarMenu className="flex flex-col w-full items-center">
            <SidebarMenuItem className="pt-6 w-[95%]">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    variant="outline"
                    className="flex items-center justify-start h-12 pl-1"
                  >
                    <div className="flex aspect-square h-full w-auto">
                      <Image
                        src="/icon-192x192.png"
                        alt="Orbi Store"
                        width={40}
                        height={40}
                        className=" rounded-full h-full w-full"
                      />
                    </div>

                    <div className="flex flex-col">
                      <h2 className="text-sm font-bold">Orbi Store</h2>
                      <p className="text-xs text-gray-400 font-semibold">
                        {activeWorkspace === "MASTER"
                          ? "Master Dashboard"
                          : "Orbi Dashboard"}
                      </p>
                    </div>

                    <ChevronsUpDown className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                  <DropdownMenuItem
                    onClick={() => {
                      setActiveWorkspace("MASTER");
                      redirect("/master/dashboard");
                    }}
                    className="flex items-center justify-between"
                  >
                    <span>Master Workspace</span>
                    {activeWorkspace === "MASTER" ? <Check /> : ""}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setActiveWorkspace("ADM");
                      redirect("/adm/dashboard");
                    }}
                    className="flex items-center justify-between"
                  >
                    <span>Orbi Workspace</span>
                    {activeWorkspace === "ADM" ? <Check /> : ""}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : (
          <div>CRIAR ADM E CLIENT SIDEBAR</div>
        )}
      </SidebarHeader>
      <SidebarContent className="pt-6">
        <SidebarMenu className="flex flex-col items-center justify-center w-full">
          {userRole === "MASTER" && activeWorkspace === "MASTER"
            ? masterLinks.map((link) => (
                <SidebarMenuItem
                  key={link.label}
                  className="w-full flex items-center justify-center "
                >
                  <SidebarMenuButton
                    asChild
                    variant="default"
                    className={`flex justify-start items-center h-10 w-[90%] ${path.includes(link.href) && "bg-primary text-white"}`}
                  >
                    <Link href={link.href}>
                      <link.icon />
                      {link.label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            : admLinks.map((link) => (
                <SidebarMenuItem
                  key={link.label}
                  className="w-full flex items-center justify-center"
                >
                  <SidebarMenuButton
                    asChild
                    variant="default"
                    className={`flex justify-start items-center h-10 w-[90%] ${path.includes(link.href) && "bg-primary text-white"}`}
                  >
                    <Link href={link.href}>
                      <link.icon />
                      {link.label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className="flex flex-col items-center justify-center w-full">
          <SidebarMenuItem className="w-full flex items-center justify-center">
            <SidebarMenuButton asChild className="w-[90%]">
              <Button
                variant="ghost"
                onClick={() => signOut()}
                className="flex justify-start mb-2"
              >
                <LogOutIcon />
                Fazer Logout
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdmSidebar;
