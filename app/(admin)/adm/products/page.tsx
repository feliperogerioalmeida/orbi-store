"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const ProductsPage = () => {
  const { data: session } = useSession();

  if (!session || !session.user) {
    redirect("/login");
  }

  if (session.user.role !== "MASTER" && session.user.role !== "ADM") {
    throw new Error("Unauthorized");
  }

  return (
    <div>
      <h1>Products Page</h1>
    </div>
  );
};

export default ProductsPage;
