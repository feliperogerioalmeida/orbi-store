import Image from "next/image";
import { cn } from "../_lib/utils";

interface logoProps {
  className?: string;
}

const Logo = ({ className }: logoProps) => {
  return (
    <Image
      src="/logo.svg"
      alt="Orbi Store"
      width={0}
      height={0}
      className={cn("h-auto object-contain", className)}
    />
  );
};

export default Logo;
