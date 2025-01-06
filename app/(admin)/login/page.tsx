import { Input } from "../../_components/ui/input";
import { Button } from "../../_components/ui/button";
import { Card, CardContent } from "../../_components/ui/card";
import Logo from "@/app/_components/logo";

export default function LoginPage() {
  return (
    <div className="flex flex-col h-full w-full items-center justify-center gap-4">
      <Card className="flex flex-col items-center justify-center max-w-[400px] max-h-[400px] h-[80%] w-[90%]">
        <CardContent className="flex flex-col items-center gap-4">
          <Logo className="w-[80%]" />
          <Input type="email" placeholder="Email" className="w-[80%]" />
          <Input type="password" placeholder="Password" className="w-[80%]" />
          <Button className="w-[80%] text-sm uppercase font-bold hover:bg-white hover:text-primary hover:border-primary hover:border-solid hover:border-[1px]">
            Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
