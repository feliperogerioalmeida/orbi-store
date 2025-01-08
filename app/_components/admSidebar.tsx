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
import { usePathname } from "next/navigation";
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
      href: "/dashboard",
      label: "Dashboard",
      icon: BarChart2,
    },
    {
      href: "/users",
      label: "Usuários",
      icon: Users,
    },
    {
      href: "/activity-log",
      label: "Log de Atividades",
      icon: FileText,
    },
    {
      href: "/upgrades",
      label: "Relatórios de Upgrades",
      icon: CircleFadingArrowUp,
    },
    {
      href: "/app-reviews",
      label: "Avaliações do App",
      icon: Star,
    },
  ];

  // const sidebarLinks =
  //   activeWorkspace === "MASTER" && userRole === "MASTER"
  //     ? masterLinks
  //     : admLinks;

  return (
    <Sidebar>
      <SidebarHeader>
        {userRole === "MASTER" ? (
          <SidebarMenu className="flex flex-col items-center">
            <SidebarMenuItem className="pt-6 w-[90%] ">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    variant="outline"
                    className="flex justify-between items-center h-12"
                  >
                    <div className="flex gap-3 items-center">
                      <Image
                        src="/icon-192x192.png"
                        alt="Orbi Store"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div className="flex flex-col">
                        <h2 className="text-sm font-bold">Orbi Store</h2>
                        <p className="text-xs text-gray-400 font-semibold">
                          {activeWorkspace === "MASTER"
                            ? "Master Dashboard"
                            : "Orbi Dashboard"}
                        </p>
                      </div>
                    </div>
                    <ChevronsUpDown className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                  <DropdownMenuItem
                    onClick={() => setActiveWorkspace("MASTER")}
                    className="flex items-center justify-between"
                  >
                    <span>Master Workspace</span>
                    {activeWorkspace === "MASTER" ? <Check /> : ""}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setActiveWorkspace("ADM")}
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
          {userRole === "MASTER" && activeWorkspace === "MASTER" ? (
            masterLinks.map((link) => (
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
            ))
          ) : (
            <div className="flex">
              <p>teste</p>
            </div>
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Button
          variant="ghost"
          onClick={() => signOut()}
          className="flex justify-start"
        >
          <LogOutIcon />
          Fazer Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdmSidebar;
