"use client";

import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent } from "@/app/_components/ui/card";
import Logo from "@/app/_components/logo";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { useState } from "react";

// Esquema de validação com Zod
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
    setErrorMessage(null); // Reseta mensagens de erro

    const formData = new FormData(e.currentTarget);

    // Dados do formulário
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      // Valida os dados do formulário com Zod
      const validatedData = loginSchema.parse({ email, password });

      // Faz a autenticação com o NextAuth
      const result = await signIn("credentials", {
        redirect: false,
        email: validatedData.email,
        password: validatedData.password,
      });

      if (result?.error) {
        setErrorMessage("Credenciais inválidas."); // Define erro de autenticação
      } else {
        window.location.href = "/dashboard"; // Redireciona ao dashboard
      }
    } catch (error) {
      // Exibe os erros de validação
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
