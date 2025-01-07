import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/_lib/auth";
import { redirect } from "next/navigation";
import { Input } from "../../_components/ui/input";
import { Button } from "../../_components/ui/button";
import { Card, CardContent } from "../../_components/ui/card";
import Logo from "@/app/_components/logo";
import { signIn } from "next-auth/react";
import { z } from "zod";

// Esquema de validação com Zod
const loginSchema = z.object({
  email: z.string().email("Email inválido").nonempty("O email é obrigatório"),
  password: z
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .nonempty("A senha é obrigatória"),
});

const LoginPage = async () => {
  // Obtém a sessão no lado do servidor
  const session = await getServerSession(authOptions);

  // Se o usuário já estiver autenticado, redireciona para o dashboard
  if (session && session.user) {
    redirect("/dashboard");
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
        alert("Credenciais inválidas."); // Exibe erro de autenticação
      } else {
        redirect("/dashboard"); // Redireciona ao dashboard
      }
    } catch (error) {
      // Exibe os erros de validação
      if (error instanceof z.ZodError) {
        alert(error.errors.map((err) => err.message).join("\n"));
      }
    }
  };

  return (
    <div className="flex flex-col h-full w-full items-center justify-center gap-4">
      <Card className="flex flex-col items-center justify-center max-w-[400px] max-h-[400px] h-[80%] w-[90%]">
        <CardContent className="flex flex-col items-center gap-2">
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
            <Button
              type="submit"
              className="w-[80%] text-sm uppercase font-bold hover:bg-white hover:text-primary hover:border-primary hover:border-solid hover:border-[1px]"
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
