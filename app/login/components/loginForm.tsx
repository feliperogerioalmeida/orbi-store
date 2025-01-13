"use client";

import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent } from "@/app/_components/ui/card";
import Logo from "@/app/_components/logo";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email("Email inválido").nonempty("O email é obrigatório"),
  password: z
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .nonempty("A senha é obrigatória"),
});

const LoginForm = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const validatedData = loginSchema.parse({ email, password });

      const result = await signIn("credentials", {
        redirect: false,
        email: validatedData.email,
        password: validatedData.password,
      });

      if (result?.error) {
        setErrorMessage("Credenciais inválidas.");
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrorMessage(error.errors.map((err) => err.message).join("\n"));
      }
    }
  };

  return (
    <Card className="flex flex-col items-center justify-center max-w-[400px] max-h-[400px] h-[80%] w-[90%]">
      <CardContent className="flex flex-col items-center gap-4">
        <Logo className="w-[80%]" />
        <form
          className="w-full flex flex-col items-center gap-4"
          onSubmit={handleSubmit}
        >
          <Input
            type="email"
            name="email"
            placeholder="Email"
            className="w-[80%]"
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            className="w-[80%]"
          />
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
          <Button
            type="submit"
            className="w-[80%] text-sm uppercase font-bold hover:bg-white hover:text-primary hover:border-primary hover:border-solid hover:border-[1px]"
          >
            Login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
