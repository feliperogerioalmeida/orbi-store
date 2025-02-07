"use client";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Label } from "./ui/label";
import { Pencil } from "lucide-react";
import { Input } from "./ui/input";
import { saveUserProfileImage } from "../_actions/saveUserProfileImage";
import { useUser } from "../_providers/user";

const AvatarComponent = ({
  className,
  isEditable,
}: {
  className?: string;
  isEditable?: boolean;
}) => {
  const { user, setUser } = useUser();

  if (!user) return null;

  const handleImageUpdateClick = async (file: File) => {
    try {
      const imageUrl = await saveUserProfileImage(user, file);

      setUser({ ...user, image: imageUrl });
    } catch (error) {
      console.error("Erro ao atualizar imagem:", error);
    }
  };

  return (
    <Avatar className={className}>
      <AvatarFallback>
        {user.firstName?.[0]?.toUpperCase()}
        {user.lastName?.[0]?.toUpperCase()}
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
              if (file) handleImageUpdateClick(file);
            }}
          />
        </>
      )}
    </Avatar>
  );
};

export default AvatarComponent;
