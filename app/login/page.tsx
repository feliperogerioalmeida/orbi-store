import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/_lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "./components/loginForm"; // Importa o Client Component

const LoginPage = async () => {
  // Obtém a sessão no lado do servidor
  const session = await getServerSession(authOptions);

  // Se o usuário já estiver autenticado, redireciona para o dashboard
  if (session && session.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col h-full w-full items-center justify-center gap-4">
      <LoginForm /> {/* Renderiza o Client Component */}
    </div>
  );
};

export default LoginPage;
