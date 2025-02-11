import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Company } from "@prisma/client";
import { db } from "../_lib/prisma";

export const saveDigitalCertificate = async (
  company: Company,
  file: File,
): Promise<string> => {
  const client = new S3Client();
  const buffer = (await file.arrayBuffer()) as unknown as Buffer;
  const key = `digitalCertificate/${company.id}.${file.type.split("/")[1]}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    ACL: "public-read",
    Key: key,
    Body: buffer,
  });
  await client.send(command);

  const digitalCertificateUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;

  await db.company.update({
    where: { id: company.id },
    data: { digitalCertificate: digitalCertificateUrl },
  });

  return digitalCertificateUrl;
};
