"use client";

import { Button } from "@/app/_components/ui/button";
import { signOut } from "next-auth/react";

const LogoutButtom = () => {
  const handleLogOutClick = async () => {
    await signOut();
  };

  return (
    <Button onClick={handleLogOutClick} className="mt-4">
      Logout
    </Button>
  );
};

export default LogoutButtom;
