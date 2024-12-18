import Image from "next/image";
import { Input } from "./_components/ui/input";
import { Button } from "./_components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col h-full w-full items-center justify-center gap-4">
      <Image
        src="/logo.svg"
        alt="Orbi Store"
        width={0}
        height={0}
        className="w-[80%] h-auto object-contain"
      />
      <Input type="email" placeholder="Email" className="w-[80%]" />
      <Input type="password" placeholder="Password" className="w-[80%]" />
      <Button className="w-[80%] text-sm uppercase font-bold">Login</Button>
    </div>
  );
}
