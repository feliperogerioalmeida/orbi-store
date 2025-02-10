"use client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/_lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "./_components/loginForm";

const LoginPage = async () => {
  const session = await getServerSession(authOptions);

  if (session && session.user) {
    redirect(`/${session.user.role.toLowerCase()}/dashboard`);
  }

  return (
    <div className="flex flex-col h-full w-full items-center justify-center gap-4">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
