import { Calculator, HouseIcon, MenuIcon, Smartphone } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import Logo from "@/app/_components/logo";
import Link from "next/link";
import Image from "next/image";

const LandingPageNav = () => {
  return (
    <div className="fixed top-0 left-0 z-50 w-full flex flex-row items-center justify-center bg-black/50 backdrop-blur-md pt-2">
      <div className="absolute top-4 left-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size={"icon"}
              variant="ghost"
              className="hover:bg-transparent hover:border-black hover:border-[1px] border-white border-[1px]"
            >
              <MenuIcon color="white" />
            </Button>
          </SheetTrigger>
          <SheetContent side={"left"} className="w-[20rem]">
            <SheetHeader>
              <SheetTitle className="text-left text-lg font-semibold">
                Menu
              </SheetTitle>
            </SheetHeader>

            <div className="mt-4 flex flex-col gap-2">
              <SheetClose asChild>
                <Link href="/">
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
                <Link href="/">
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
                <Link href="/">
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
                <Link href="/">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
                    <Calculator size={16} />
                    Simulação de Upgrade
                  </Button>
                </Link>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <Logo className="w-[30%]" />
    </div>
  );
};

export default LandingPageNav;
