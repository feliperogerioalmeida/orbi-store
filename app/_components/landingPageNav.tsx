"use client";
import {
  Calculator,
  CircleHelp,
  HouseIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  Monitor,
  Smartphone,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import Logo from "@/app/_components/logo";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { Separator } from "./ui/separator";
import AvatarComponent from "./avatarComponent";

const LandingPageNav = () => {
  const { data, status } = useSession();

  const handleLogOutClick = async () => {
    await signOut();
  };

  return (
    <div className="fixed top-0 left-0 z-50 w-full flex flex-row items-center justify-center bg-black/50 backdrop-blur-md py-2 ">
      <div className="absolute top-[25%] left-[1rem] lg:left-[1.25rem] md:left-[1.25rem]">
        <Sheet>
          <SheetTrigger asChild>
            <Button size={"icon"} variant="secondary">
              <MenuIcon color="black" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side={"left"}
            className="w-[20rem] h-full flex flex-col"
          >
            <SheetHeader>
              <SheetTitle className="text-left text-lg font-semibold">
                Menu
              </SheetTitle>
            </SheetHeader>

            {status == "authenticated" && data?.user && (
              <div className="flex flex-col">
                <div className="flex items-center gap-2 py-4">
                  <AvatarComponent isEditable={false} />

                  <div className="flex flex-col">
                    <p className="font-medium">
                      {" "}
                      {data.user.firstName} <span> {data.user.lastName}</span>
                    </p>
                    <p className="text-xs opacity-75">{data.user.email}</p>
                  </div>
                </div>
                <Separator />
              </div>
            )}
            <div className="flex flex-col h-full justify-between">
              <div className="flex flex-col gap-2">
                <SheetClose asChild>
                  <Link href="/#home">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                    >
                      <HouseIcon size={16} />
                      Home
                    </Button>
                  </Link>
                </SheetClose>

                <SheetClose asChild>
                  <Link href="/#products">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                    >
                      <Smartphone size={16} />
                      Produtos
                    </Button>
                  </Link>
                </SheetClose>

                <SheetClose asChild>
                  <Link href="/#about">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                    >
                      <Image
                        src="/logoIconBlack.svg"
                        alt="Orbi Store"
                        width={16}
                        height={16}
                        className="h-auto object-contain"
                      />
                      Orbi Store
                    </Button>
                  </Link>
                </SheetClose>

                <SheetClose asChild>
                  <Link href="/#faq">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                    >
                      <CircleHelp size={16} />
                      Perguntas Frequentes
                    </Button>
                  </Link>
                </SheetClose>

                <SheetClose asChild>
                  <Link href="/simulacao-credito">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                    >
                      <Calculator size={16} />
                      Simulação de Crédito
                    </Button>
                  </Link>
                </SheetClose>
              </div>

              <SheetFooter className="flex flex-col w-full sm:justify-start ">
                <div className="flex flex-col h-full justify-between w-full">
                  <div className="flex flex-col gap-2">
                    {status == "unauthenticated" && (
                      <SheetClose asChild>
                        <Link href="/login">
                          <Button
                            variant="outline"
                            className="w-full justify-start gap-2"
                          >
                            <LogInIcon size={16} />
                            Fazer Login
                          </Button>
                        </Link>
                      </SheetClose>
                    )}

                    {status == "authenticated" && (
                      <div className="flex flex-col gap-1">
                        {(data.user.role === "MASTER" ||
                          data.user.role === "ADMIN" ||
                          data.user.role === "EMPLOYEE") && (
                          <Button
                            asChild
                            variant="ghost"
                            className="w-full justify-start gap-2"
                          >
                            <Link
                              href={`/${data.user.role === "EMPLOYEE" || data.user.role === "ADMIN" ? "adm" : data.user.role.toLowerCase()}/dashboard`}
                            >
                              <Monitor size={16} />
                              Painel Administrativo
                            </Link>
                          </Button>
                        )}

                        <Button
                          onClick={handleLogOutClick}
                          variant="ghost"
                          className="w-full justify-start gap-2"
                        >
                          <LogOutIcon size={16} />
                          Fazer Logout
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetFooter>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <Logo className="w-[30%] lg:w-[10%] md:w-[20%]" />
    </div>
  );
};

export default LandingPageNav;
