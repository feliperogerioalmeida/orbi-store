"use client";
import { User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Label } from "./ui/label";
import { Pencil } from "lucide-react";
import { Input } from "./ui/input";
import { saveImage } from "../_actions/saveImage";
import { getUser } from "../_actions/getUser";
import { useState } from "react";

const AvatarComponent = ({
  data,
  className,
  isEditable,
}: {
  data: User;
  className?: string;
  isEditable?: boolean;
}) => {
  const [user, setUser] = useState<User>(data);
  const hadnleImageUpdateClick = async (data: User, file: File) => {
    saveImage(data, file);
    const user = await getUser(data.email);
    if (!user) {
      return console.error("Usuário não encontrado");
    }
    setUser(user);
  };

  return (
    <Avatar className={className}>
      <AvatarFallback>
        {user.firstName?.[0].toUpperCase()}
        {user.lastName?.[0].toUpperCase()}
      </AvatarFallback>

      {user.image && <AvatarImage src={user.image} className="rounded-full" />}
      {isEditable && (
        <>
          <Label
            htmlFor="file-input"
            className="absolute right-0 bottom-0 bg-black rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
          >
            <Pencil size={16} color="#ffffff" strokeWidth={1.25} />
          </Label>
          <Input
            id="file-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                hadnleImageUpdateClick(user, file);
              }
            }}
          />
        </>
      )}
    </Avatar>
  );
};

export default AvatarComponent;
