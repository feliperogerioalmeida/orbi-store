"use server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { db } from "@/app/_lib/prisma";
import { redirect } from "next/navigation";
import { ExtendedUser } from "../(admin)/adm/settings/_components/profileTab";

export const saveImage = async (data: ExtendedUser, file: File) => {
  const client = new S3Client();

  const buffer = (await file.arrayBuffer()) as unknown as Buffer;

  const key = `profile_pic/${data.id}.${file.type.split("/")[1]}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    ACL: "public-read",
    Key: key,
    Body: buffer,
  });

  await client.send(command);

  await db.user.update({
    where: { id: data.id },
    data: {
      image: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`,
    },
  });

  redirect("/adm/settings");
};
