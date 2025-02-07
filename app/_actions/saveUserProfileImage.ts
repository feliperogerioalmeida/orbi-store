"use server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { db } from "@/app/_lib/prisma";
import { User } from "@prisma/client";

export const saveUserProfileImage = async (
  user: User,
  file: File,
): Promise<string> => {
  const client = new S3Client();
  const buffer = (await file.arrayBuffer()) as unknown as Buffer;
  const key = `profile_pic/${user.id}.${file.type.split("/")[1]}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    ACL: "public-read",
    Key: key,
    Body: buffer,
  });
  await client.send(command);

  const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
  await db.user.update({
    where: { id: user.id },
    data: { image: imageUrl },
  });

  return imageUrl;
};
