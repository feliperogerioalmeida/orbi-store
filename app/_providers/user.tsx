"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Address, User } from "@prisma/client";
import { getUser } from "../_actions/getUser";
import { useSession } from "next-auth/react";

interface ExtendedUser extends User {
  address?: Address | null;
}

interface UserContextType {
  user: ExtendedUser | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (session?.user?.email) {
      getUser(session.user.email).then(setUser);
    }
  }, [session]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser deve ser usado dentro de UserProvider");
  }
  return context;
};
